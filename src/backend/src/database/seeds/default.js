exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_factorial_design").del()
  await knex("tb_benchmark_execution").del()
  await knex("tb_benchmark").del()
  await knex("tb_usecase").del()
  await knex("tb_provider").del()

  await knex("tb_provider")
    .then(function () {
      // Inserts seed entries
      return knex("tb_provider").insert([
        {     
          id: 1,
          name: "Amazon Web Services",
          acronym: "AWS",
          active: 1
        },
        {     
          id: 2,
          name: "Google Cloud Plattform",
          acronym: "GCP",
          active: 1
        },
        {     
          id: 3,
          name: "Microsoft Azure",
          acronym: "Azure",
          active: 0
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_provider_id_seq RESTART WITH 4;')

  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([
        {     
          id: 1,
          name: "FaaS acting as Backend to DBaaS",
          acronym: "faas2db",
          active: 1
        },
        {     
          id: 2,
          name: "FaaS acting as Backend to Object Storage",
          acronym: "faas2os",
          active: 1
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_usecase_id_seq RESTART WITH 3;')

  await knex("tb_benchmark")
    .then(function () {
      // Inserts seed entries
      return knex("tb_benchmark").insert([
        {     
          id: 1,
          name: "Lambda for DynamoDB",
          description: "Testing Lambda as backend for a DynamoDB database",
          id_provider: 1,
          id_usecase: 1,
          repetitions: 2,
          concurrences: {"list":['1','10']}
        },
        {     
          id: 2,
          name: "Functions for Firestore",
          description: "Testing Cloud Functions as a backend for a Firestore database",
          id_provider: 2,
          id_usecase: 1,
          repetitions: 2,
          concurrences: {"list":['1','10']}
        },
        {     
          id: 3,
          name: "Lambda for S3",
          description: "Testing Lambda as backend for JSON data in a S3 bucket",
          id_provider: 1,
          id_usecase: 2,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
        {     
          id: 4,
          name: "Function for Cloud Storage",
          description: "Testing Cloud Function as backend for JSON data in a Cloud Storage bucket",
          id_provider: 2,
          id_usecase: 2,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
      ]);
    });

  await knex.schema.raw('ALTER SEQUENCE tb_benchmark_id_seq RESTART WITH 5;')

};
