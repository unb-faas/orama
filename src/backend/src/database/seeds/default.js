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
          name: "AWS Lambda as backend to DynamoDB",
          acronym: "lambda2dynamoDB",
          active: 1,
          id_provider: 1
        },
        {     
          id: 2,
          name: "GCP Functions as backend to Firestore",
          acronym: "gfunctions2firestore",
          active: 1,
          id_provider:2
        },
        {     
          id: 3,
          name: "AWS Lambda as backend to S3",
          acronym: "lambda2s3",
          active: 1,
          id_provider: 1
        },
        {     
          id: 4,
          name: "GCP Functions as backend to Cloud Storage",
          acronym: "gfunctions2cstorage",
          active: 1,
          id_provider:2
        },
        {     
          id: 5,
          name: "AWS Lambda simple params calculations",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1
        },
        {     
          id: 6,
          name: "GCP simple params calculations",
          acronym: "gcpcalc",
          active: 1,
          id_provider:2
        },
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_usecase_id_seq RESTART WITH 7;')

  await knex("tb_benchmark")
    .then(function () {
      // Inserts seed entries
      return knex("tb_benchmark").insert([
        {     
          id: 1,
          name: "Lambda for DynamoDB",
          description: "Testing Lambda as backend for a DynamoDB database",
          id_usecase: 1,
          repetitions: 2,
          concurrences: {"list":['1','10']}
        },
        {     
          id: 2,
          name: "Functions for Firestore",
          description: "Testing Cloud Functions as a backend for a Firestore database",
          id_usecase: 2,
          repetitions: 2,
          concurrences: {"list":['1','10']}
        },
        {     
          id: 3,
          name: "Lambda for S3",
          description: "Testing Lambda as backend for JSON data in a S3 bucket",
          id_usecase: 3,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
        {     
          id: 4,
          name: "Function for Cloud Storage",
          description: "Testing Cloud Function as backend for JSON data in a Cloud Storage bucket",
          id_usecase: 4,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
        {     
          id: 5,
          name: "Lambda Calc",
          description: "Testing Lambda simple calculator",
          id_usecase: 5,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
        {     
          id: 6,
          name: "GCP Function Calc",
          description: "Testing Cloud Function simple calculator",
          id_usecase: 6,
          repetitions: 5,
          concurrences: {"list":['10','100']}
        },
      ]);
    });

  await knex.schema.raw('ALTER SEQUENCE tb_benchmark_id_seq RESTART WITH 7;')

};
