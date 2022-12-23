exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([
        
        {     
          id: 29,
          name: "Azure Standard_D4s_v3 (16gb 4vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          },
        },
        {     
          id: 30,
          name: "Azure Standard_D8s_v3 (32gb 8vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D8s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 31,
          name: "Azure Standard_D16s_v4 (64gb 16vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D16s_v4",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 32,
          name: "Azure Standard_D32s_v4 (128gb 32vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D32s_v4",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 33,
          name: "AZF with sequence aligner",
          acronym: "azfaligner",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{},
        },
        
        {     
          id: 34,
          name: "AZF as backend to CosmosDB",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:3,
          provisionable: 1
        },
        {     
          id: 35,
          name: "AZF as backend to BlobStorage",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider: 3,
          provisionable: 1
        },
        {     
          id: 36,
          name: "AZF Calculator US-east",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "East US"
          }
        },
        
        {     
          id: 41,
          name: "Azure Standard_D4s_v3 with sequence aligner for node2faas",
          acronym: "n2fazralignernofaas",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        {     
          id: 42,
          name: "Azure Standard_D4s_v3 with sequence aligner converted by node2faas",
          acronym: "n2fazralignerfaas",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            instancetype: "Standard_D4s_v3",
            location: "westus",
            image_publisher: "debian",
            image_offer: "debian-10",
            image_sku: "10-gen2",
            image_version: "latest"
          }
        },
        
        {     
          id: 47,
          name: "AZF Calculator US-west",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "West US"
          }
        },
        
        {     
          id: 51,
          name: "AZF Calculator Frankfurt",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "Germany West Central"
          }
        },
        
        {     
          id: 55,
          name: "AZF Calculator Hong Kong",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "East Asia"
          }
        },
        
        {     
          id: 59,
          name: "AZF Calculator Australia",
          acronym: "azfcalc",
          active: 1,
          id_provider: 3,
          provisionable: 1,
          parameters:{
            region: "Australia Southeast"
          }
        },
      ]);
    });
  };
