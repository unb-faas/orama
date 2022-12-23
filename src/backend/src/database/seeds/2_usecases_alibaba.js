exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([
        
        {     
          id: 43,
          name: "AFC Calculator US-east",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "us-east-1"
          }
        },
        {     
          id: 44,
          name: "AFC as backend to OSS",
          acronym: "ali2oss",
          active: 1,
          id_provider:4,
          provisionable: 1
        },
        
        {     
          id: 48,
          name: "AFC Calculator US-west",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "us-west-1"
          }
        },
        
        {     
          id: 52,
          name: "AFC Calculator frankfurt",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "eu-central-1"
          }
        },
        
        {     
          id: 56,
          name: "AFC Calculator Hong Kong",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "cn-hongkong"
          }
        },
        {     
          id: 60,
          name: "AFC Calculator Australia",
          acronym: "alicalc",
          active: 1,
          id_provider:4,
          provisionable: 1,
          parameters:{
            region: "ap-southeast-2"
          }
        },
        {
          id: 61,
          name: "AFC as backend to TableStore",
          acronym: "ali2tablestore",
          active: 1,
          id_provider:4,
          provisionable: 1
        }
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_usecase_id_seq RESTART WITH 999;')
};
