exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([
        
        {     
          id: 2,
          name: "GCF Function as backend to Firestore",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:2,
          provisionable: 1
        },
       
        {     
          id: 4,
          name: "GCP Function as backend to Google Cloud Storage",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:2,
          provisionable: 1
        },
        
        {     
          id: 6,
          name: "GCF Calculator US-east",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "us-east4"
          }
        },
        
        {     
          id: 21,
          name: "GCP e2-standard-4 (16gb 4vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 22,
          name: "GCP e2-highcpu-8 (8gb 8vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-8",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 23,
          name: "GCP e2-highcpu-16 (16gb 16vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-16",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 24,
          name: "GCP e2-highcpu-32 (32gb 32vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-32",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 25,
          name: "GCF (512mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 512}
        },
        {     
          id: 26,
          name: "GCF (1024mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 1024}
        },
        
        {     
          id: 27,
          name: "GCF (2048mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 2048}
        },
        {     
          id: 28,
          name: "GCF (4096mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{memory: 4096}
        },
        {     
          id: 39,
          name: "GCP e2-standard-4 with sequence aligner for node2faas",
          acronym: "n2fgcalignernofaas",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 40,
          name: "GCP e2-standard-4 with sequence aligner converted by node2faas",
          acronym: "n2fgcalignerfaas",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 46,
          name: "GCF Calculator US-west",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "us-west2"
          }
        },
        {     
          id: 50,
          name: "GCF Calculator Frankfurt",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "europe-west3"
          }
        },
        {     
          id: 54,
          name: "GCF Calculator Hong Kong",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "asia-east2"
          }
        },
        {     
          id: 58,
          name: "GCF Calculator Australia",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "australia-southeast1"
          }
        },
      ]);
    });
  };
