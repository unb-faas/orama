exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        //  Calculators

        {     
          id: 100,
          name: "GCF Calc US-East",
          acronym: "gcfcalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-east4"
          }
        },

        {     
          id: 101,
          name: "GCF Calc US-West",
          acronym: "gcfcalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-west2"
          }
        },
        {     
          id: 102,
          name: "GCF Calc Europe",
          acronym: "gcfcalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "europe-west3"
          }
        },
        {     
          id: 103,
          name: "GCF Calc Asia",
          acronym: "gcfcalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "asia-east2"
          }
        },
        {     
          id: 104,
          name: "GCF Calc Australia",
          acronym: "gcfcalc",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "australia-southeast1"
          }
        },

        //  Databases
        
        {     
          id: 110,
          name: "GCF for Database (Firestore) US-East",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-east4"
          }
        },

        {     
          id: 111,
          name: "GCF for Database (Firestore) US-West",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-west2"
          }
        },

        {     
          id: 112,
          name: "GCF for Database (Firestore) Europe",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "europe-west3"
          }
        },

        {     
          id: 113,
          name: "GCF for Database (Firestore) Asia",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "asia-east2"
          }
        },

        {     
          id: 114,
          name: "GCF for Database (Firestore) Australia",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "australia-southeast1"
          }
        },

        //  Object Storages
       
        {     
          id: 120,
          name: "GCF for Object Storage (Cloud Storage) US-East",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-east4"
          }
        },

        {     
          id: 121,
          name: "GCF for Object Storage (Cloud Storage) US-West",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "us-west2"
          }
        },

        {     
          id: 122,
          name: "GCF for Object Storage (Cloud Storage) Europe",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "europe-west3"
          }
        },

        {     
          id: 123,
          name: "GCF for Object Storage (Cloud Storage) Asia",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "asia-east2"
          }
        },

        {     
          id: 124,
          name: "GCF for Object Storage (Cloud Storage) Australia",
          acronym: "gcf2gcstorage",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            region: "australia-southeast1"
          }
        },
        
        // Sequence Aligner (VM) for AFMC framework    

        {     
          id: 190,
          name: "GCP e2-standard-4 (16gb 4vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 191,
          name: "GCP e2-highcpu-8 (8gb 8vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-8",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 192,
          name: "GCP e2-highcpu-16 (16gb 16vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-16",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        {     
          id: 193,
          name: "GCP e2-highcpu-32 (32gb 32vcpu) with sequence aligner",
          acronym: "gcaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-highcpu-32",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },

        // Sequence Aligner (FaaS) for AFMC framework

        {     
          id: 194,
          name: "GCF (512mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory: 512}
        },
        {     
          id: 195,
          name: "GCF (1024mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory: 1024}
        },
        
        {     
          id: 196,
          name: "GCF (2048mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory: 2048}
        },
        {     
          id: 197,
          name: "GCF (4096mb) with sequence aligner",
          acronym: "gcfaligner",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{memory: 4096}
        },

        // Sequence Aligner (VM) for Node2FaaS framework    

        {     
          id: 198,
          name: "GCP e2-standard-4 with sequence aligner for node2faas",
          acronym: "n2fgcalignernofaas",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },

        // Sequence Aligner (FaaS) for Node2FaaS framework    

        {     
          id: 199,
          name: "GCP e2-standard-4 with sequence aligner converted by node2faas",
          acronym: "n2fgcalignerfaas",
          active: 1,
          id_provider:1,
          provisionable: 1,
          parameters:{
            instancetype: "e2-standard-4",
            image: "debian-cloud/debian-10",
            zone: "us-central1-a"
          }
        },
        
      ]);
    });
  };
