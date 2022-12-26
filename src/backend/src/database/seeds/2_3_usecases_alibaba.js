exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        //  Calculators

        {     
          id: 300,
          name: "AFC Calculator US-east",
          acronym: "alicalc",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },
        
        
        {     
          id: 301,
          name: "AFC Calculator US-west",
          acronym: "alicalc",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },
        
        {     
          id: 302,
          name: "AFC Calculator Europe",
          acronym: "alicalc",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },
        
        {     
          id: 303,
          name: "AFC Calculator Asia",
          acronym: "alicalc",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "cn-hongkong"
          }
        },
        {     
          id: 304,
          name: "AFC Calculator Australia",
          acronym: "alicalc",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },

        //  Databases

        {
          id: 310,
          name: "AFC for Database (TableStore) US-East",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },

        {
          id: 311,
          name: "AFC for Database (TableStore) US-West",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },
        {
          id: 312,
          name: "AFC for Database (TableStore) Europe",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },
        {
          id: 313,
          name: "AFC for Database (TableStore) Asia",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "cn-hongkong"
          }
        },
        {
          id: 314,
          name: "AFC for Database (TableStore) Australia",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },

        //  Object Storages

        {     
          id: 320,
          name: "AFC for Object storage (OSS) US-East",
          acronym: "ali2oss",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },

        {     
          id: 321,
          name: "AFC for Object storage (OSS) US-West",
          acronym: "ali2oss",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },

        {     
          id: 322,
          name: "AFC for Object storage (OSS) Europe",
          acronym: "ali2oss",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },

        {     
          id: 323,
          name: "AFC for Object storage (OSS) Asia",
          acronym: "ali2oss",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "cn-hongkong"
          }
        },

        {     
          id: 324,
          name: "AFC for Object storage (OSS) Australia",
          acronym: "ali2oss",
          active: 1,
          id_provider:3,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },
       
      ]);
    });
  
};
