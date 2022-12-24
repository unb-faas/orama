exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        //  Calculators
        {     
          id: 200,
          name: "AZF Calc US-East",
          acronym: "azfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastus"
          }
        },

        {     
          id: 201,
          name: "AZF Calc US-West",
          acronym: "azfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "westus"
          }
        },
        
        {     
          id: 202,
          name: "AZF Calc Europe",
          acronym: "azfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "francecentral"
          }
        },
        
        {     
          id: 203,
          name: "AZF Calc Asia",
          acronym: "azfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastasia"
          }
        },
        
        {     
          id: 204,
          name: "AZF Calc Australia",
          acronym: "azfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "australiasoutheast"
          }
        },

        //  Databases

        {     
          id: 210,
          name: "AZF for Database (CosmosDB) US-East ",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastus"
          }
        },

        {     
          id: 211,
          name: "AZF for Database (CosmosDB) US-West ",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "westus"
          }
        },

        {     
          id: 212,
          name: "AZF for Database (CosmosDB) Europe ",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "francecentral"
          }
        },

        {     
          id: 213,
          name: "AZF for Database (CosmosDB) Asia ",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastasia"
          }
        },

        {     
          id: 214,
          name: "AZF for Database (CosmosDB) Australia ",
          acronym: "azf2cosmosdb",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "australiasoutheast"
          }
        },

        //  Object Storages

        {     
          id: 220,
          name: "AZF for Object Storage (BlobStorage) US-East",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastus"
          }
        },

        {     
          id: 221,
          name: "AZF for Object Storage (BlobStorage) US-West",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "westus"
          }
        },
        {     
          id: 222,
          name: "AZF for Object Storage (BlobStorage) Europe",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "francecentral"
          }
        },
        {     
          id: 223,
          name: "AZF for Object Storage (BlobStorage) Asia",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "eastasia"
          }
        },
        {     
          id: 224,
          name: "AZF for Object Storage (BlobStorage) Australia",
          acronym: "azf2blobstorage",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{
            region: "australiasoutheast"
          }
        },


        // Sequence Aligner (VM) for AFMC framework
        
        {     
          id: 293,
          name: "Azure Standard_D4s_v3 (16gb 4vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:2,
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
          id: 294,
          name: "Azure Standard_D8s_v3 (32gb 8vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:2,
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
          id: 295,
          name: "Azure Standard_D16s_v4 (64gb 16vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:2,
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
          id: 296,
          name: "Azure Standard_D32s_v4 (128gb 32vcpu) with sequence aligner",
          acronym: "azurealigner",
          active: 1,
          id_provider:2,
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

        // Sequence Aligner (FaaS) for AFMC framework

        {     
          id: 297,
          name: "AZF with sequence aligner",
          acronym: "azfaligner",
          active: 1,
          id_provider:2,
          provisionable: 1,
          parameters:{},
        },
        
        // Sequence Aligner (VM) for Node2FaaS framework    
        
        {     
          id: 298,
          name: "Azure Standard_D4s_v3 with sequence aligner for node2faas",
          acronym: "n2fazralignernofaas",
          active: 1,
          id_provider:2,
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
        
        // Sequence Aligner (FaaS) for Node2FaaS framework    

        {     
          id: 299,
          name: "Azure Standard_D4s_v3 with sequence aligner converted by node2faas",
          acronym: "n2fazralignerfaas",
          active: 1,
          id_provider:2,
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
      ]);
    });
  };
