# icealigner: alinhamento de sequências genéticas no IBM Code Engine

Caso de uso feito para a tarefa da **Professora Aleteia Araujo**: levar para a IBM Cloud o benchmark de biologia que o Orama já tem em AWS, GCP e Azure (`lambdaaligner`, `gcfaligner`, `azfaligner`).

> **Volume reduzido nestas primeiras rodadas.** As sequências, as repetições e a concorrência estão menores que nos benchmarks originais (veja a tabela abaixo). O objetivo agora é validar o caso de uso na IBM. A carga completa fica para uma rodada seguinte.

## O que a função faz

1. Recebe por `PUT` dois trechos de DNA do gene **spike do SARS-CoV-2**, das amostras `OK084631.1` e `OK084572.1` (as mesmas dos benchmarks de AWS e GCP).
2. Alinha as duas sequências com o algoritmo de **Hirschberg** (alinhamento global, versão de Needleman-Wunsch com memória linear). A implementação é a mesma dos outros provedores.
3. Grava um JSON no **IBM Cloud Object Storage (COS)** duas vezes: no início e no fim. O JSON final traz as sequências alinhadas, o score, `started_at`, `finished_at` e `duration`.

O caminho no bucket segue o padrão dos outros alinhadores:
`<service>/repetition_<n>/concurrence_<n>/hirschberg-<execid>_<timestamp>.json`.

A comparação de DNA é só a carga de trabalho. A pergunta do benchmark é como uma tarefa científica que consome CPU se comporta em FaaS (IBM Code Engine Functions) em relação aos outros provedores.

## Volume reduzido em relação ao original

| | Original (`lambdaaligner`/`gcfaligner`) | `icealigner` (esta rodada) |
|---|---|---|
| Tamanho das sequências | 4.114 e 4.123 bases | primeiras **1.000** bases de cada |
| Configurações | 6 memórias (512 MB a 3 GB) | 1 configuração: **1 vCPU / 4 GB** |
| Concorrência | 1, 20, 40, 60, 80, 100 | **1, 5, 10** |
| Repetições | 10 | **3** |
| Invocações por benchmark | 3.010 | **48** |

Por que 1.000 bases: localmente (Apple M4 Max, mesma implementação), o alinhamento completo leva cerca de 4,9 s, 1.000 bases levam cerca de 0,3 s e 500 bases cerca de 0,07 s. Com 500 bases o tempo medido seria quase todo rede e cold start. Com 1.000 bases ainda há processamento real, e o trecho inclui uma mutação pontual (posição 229) e uma inserção de 9 bases (posição ~420) para o alinhador resolver.

Para voltar ao volume original, basta trocar `s1`/`s2`, `repetitions` e `concurrences` do benchmark `630` em `src/backend/src/database/seeds/3_4_benchmarks_ibm.js`. O Code Engine Functions limita cada execução a **120 s**. Com 1 vCPU, as sequências completas devem caber, mas isso precisa ser confirmado com uma execução isolada antes da carga.

## Estrutura

```
icealigner/
  blueprints/ibm/
    provider.tf, faas-basic.tf, cos.tf   # copiados do ice2cos (resource group, projeto Code Engine, COS + bucket + credencial)
    variables.tf                          # region, cpu (padrão "1"), memory (padrão 4 GB)
    faas-put.tf                           # ibm_code_engine_function, runtime python-3.11, código inline
    outputs.tf                            # ibm_put_url (nome esperado pelo orchestrator/scripts/getUrls.sh)
  faas/ibm/put/main.py                    # função em arquivo único: Hirschberg + upload para o COS
```

Diferenças em relação às versões de AWS e GCP:

- **Arquivo único.** A função inline do Code Engine aceita apenas um arquivo. Por isso o Hirschberg (que veio de `lambdaaligner/faas/aws/put/alignment/alignment.py`, só com as classes usadas) está embutido no `main.py`.
- **Sem dependências.** O upload para o COS é feito por HTTP (`urllib`) com token IAM, como o `ice2cos` faz em Node. O token é reaproveitado enquanto a instância está quente.
- **Bucket.** A função grava no bucket criado pelo Terraform (injetado no lugar de `XXX_BUCKET_XXX`) e ignora o parâmetro `bucket` do benchmark.
- **Corpo da requisição.** A função lê o JSON tanto dos parâmetros quanto de `__ce_body` (em base64), como o `extractJsonBody` do `ice2cos`.

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
# {"result": "done", "duration": "...", "score": ...}
```

## Validado até aqui

- `terraform validate` do blueprint: OK.
- A função foi executada localmente com o COS simulado, com o corpo vindo direto e via `__ce_body`. O alinhamento preserva as duas sequências, e um campo faltando retorna 400.
- **Ainda não provisionado na IBM Cloud.** A primeira execução real é o próximo passo.
