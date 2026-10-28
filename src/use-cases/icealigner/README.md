# icealigner: alinhamento de sequências genéticas no IBM Code Engine Functions

Caso de uso feito para a tarefa da **Professora Aleteia Araujo**: levar para a IBM Cloud o benchmark de biologia que o Orama já tem em AWS, GCP e Azure (`lambdaaligner`, `gcfaligner`, `azfaligner`).

> **Não usamos AWS Lambda.** Este caso roda inteiramente no FaaS da IBM, o **IBM Cloud Code Engine Functions**, e grava os resultados no **IBM Cloud Object Storage (COS)**. A Lambda só aparece aqui como referência: é de onde vêm o algoritmo e as sequências do caso original.

> **Volume reduzido nestas primeiras rodadas.** As sequências são as mesmas do benchmark original, mas há menos repetições e menos concorrência (veja a tabela abaixo). O objetivo agora é validar o caso de uso na IBM. A carga completa fica para uma rodada seguinte.

## O que a função faz

1. Recebe por `PUT` dois trechos de DNA do gene **spike do SARS-CoV-2**, das amostras `OK084631.1` e `OK084572.1`, com 4.114 e 4.123 bases. São as mesmas sequências dos benchmarks de AWS e GCP.
2. Alinha as duas sequências com o algoritmo de **Hirschberg** (alinhamento global, versão de Needleman-Wunsch com memória linear).
3. Grava um JSON no **COS** duas vezes: no início e no fim. O JSON final traz as sequências alinhadas, o score, `started_at`, `finished_at` e `duration`, em segundos.

O caminho no bucket segue o padrão dos outros alinhadores:
`<service>/repetition_<n>/concurrence_<n>/hirschberg-<execid>_<timestamp>.json`.

A comparação de DNA é só a carga de trabalho. A pergunta do benchmark é como uma tarefa científica que consome CPU se comporta no FaaS da IBM em relação aos outros provedores.

## Volume reduzido em relação ao original

| | Original (`lambdaaligner`/`gcfaligner`) | `icealigner` (esta rodada) |
|---|---|---|
| Plataforma | AWS Lambda / Google Cloud Functions | **IBM Code Engine Functions** |
| Sequências | 4.114 e 4.123 bases | **as mesmas** |
| Configurações | 6 memórias (512 MB a 3 GB) | 1 configuração: **1 vCPU / 4 GB** |
| Concorrência | 1, 20, 40, 60, 80, 100 | **1, 5, 10** |
| Repetições | 10 | **3** |
| Invocações por benchmark | 3.010 | **48** |

Para voltar ao volume original, troque `repetitions` e `concurrences` do benchmark `630` em `src/backend/src/database/seeds/3_4_benchmarks_ibm.js`.

## Por que Node.js e não Python

Os alinhadores de AWS e GCP são escritos em Python. Na conta IBM usada (`ibmcloud ce fn runtimes`, em outubro de 2026), o único runtime gerenciado disponível para funções é **`nodejs-24`**. Por isso o Hirschberg foi portado para JavaScript a partir de `lambdaaligner/faas/aws/put/alignment/alignment.py`, mantendo os mesmos pesos (match `+5`, substituição `-100`, gap `-3`).

A versão Node produz **exatamente o mesmo alinhamento e o mesmo score** que a versão Python, verificado com 500 bases, 1.000 bases e as sequências completas (score `20361`). A diferença está no desempenho: localmente (Apple M4 Max), a sequência completa leva cerca de 4,9 s em Python e cerca de 0,13 s em Node. **Ao comparar com Lambda e GCF, lembre que a linguagem também mudou**, não só o provedor.

## Estrutura

```
icealigner/
  blueprints/ibm/
    provider.tf, faas-basic.tf, cos.tf   # copiados do ice2cos (resource group, projeto Code Engine, COS + bucket + credencial)
    variables.tf                          # region, cpu (padrão "1"), memory (padrão 4 GB)
    faas-put.tf                           # ibm_code_engine_function, runtime nodejs-24, código inline
    outputs.tf                            # ibm_put_url (nome esperado pelo orchestrator/scripts/getUrls.sh)
  faas/ibm/put/index.js                   # função em arquivo único: Hirschberg + upload para o COS
```

Observações de implementação:

- **Arquivo único.** A função inline do Code Engine aceita só um arquivo, por isso o algoritmo está embutido no `index.js`.
- **Sem dependências.** O upload para o COS é feito por `fetch` com token IAM, como no `ice2cos`. O token é reaproveitado enquanto a instância está quente.
- **Bucket.** A função grava no bucket criado pelo Terraform (injetado no lugar de `XXX_BUCKET_XXX`) e ignora o parâmetro `bucket` do benchmark.
- **Corpo da requisição.** A função lê o JSON de `body`, de `__ce_body` (em base64) ou dos parâmetros, como o `extractJsonBody` do `ice2cos`.

## Cadastro no banco (seeds)

- Caso de uso `430`, "ICE (1 vCPU / 4GB) with sequence aligner US-South", em `2_4_usecases_ibm.js`.
- Benchmark `630`, "IBM ICE 1vCPU align (reduced)", em `3_4_benchmarks_ibm.js`.

## Como rodar

1. Em `src/`, copie `.env-example` para `.env` e preencha `IBMCLOUD_API_KEY`. É esse o nome lido pelo `docker-compose.yaml`; o README principal cita `IBM_CLOUD_API_KEY`, mas ele não é usado.
2. Suba o ambiente e cadastre os seeds:
   ```bash
   cd src
   docker compose up -d
   docker compose exec backend knex seed:run
   ```
   Se o banco já tem dados, o `seed:run` pode conflitar com os ids existentes. Nesse caso, insira só o caso de uso `430` e o benchmark `630`.
3. Abra http://localhost:3000, vá ao caso de uso **"ICE (1 vCPU / 4GB) with sequence aligner US-South"** e provisione. O Terraform cria o resource group, o projeto Code Engine, o COS e a função.
4. Execute o benchmark **"IBM ICE 1vCPU align (reduced)"**.
5. Os resultados aparecem no Orama (tempo de resposta do JMeter) e no bucket do COS (`duration` e `score` de cada alinhamento).
6. Ao terminar, desprovisione o caso de uso para não deixar recursos na conta.

Teste rápido da função depois do provisionamento, sem passar pelo Orama:

```bash
curl -X PUT "$IBM_PUT_URL" -H 'Content-Type: application/json' \
  -d '{"s1":"ACGTTGCA","s2":"ACGTTTGCA","t1":"a","t2":"b","service":"ice-1vcpu","concurrence":"1","repetition":"1","execid":"teste"}'
# {"result":"done","duration":...,"score":...}
```

## Validado até aqui

- `terraform validate` do blueprint: OK.
- O alinhamento em Node é idêntico ao da versão Python original nos três tamanhos testados.
- A função foi executada localmente com IAM e COS simulados, com o corpo vindo direto, como string e via `__ce_body`. Campo faltando e JSON inválido retornam 400.
- **Ainda não provisionado na IBM Cloud.** A primeira execução real é o próximo passo.
