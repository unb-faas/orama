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
          acronym: "lambda2dynamodb",
          active: 1,
          id_provider: 1,
          provisionable: 1
        },
        {     
          id: 2,
          name: "GCF Function as backend to Firestore",
          acronym: "gcf2firestore",
          active: 1,
          id_provider:2,
          provisionable: 1
        },
        {     
          id: 3,
          name: "AWS Lambda as backend to S3",
          acronym: "lambda2s3",
          active: 1,
          id_provider: 1,
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
          id: 5,
          name: "AWS Lambda simple params calculations",
          acronym: "lambdacalc",
          active: 1,
          id_provider:1,
          provisionable: 1
        },
        {     
          id: 6,
          name: "GCF simple params calculations",
          acronym: "gcfcalc",
          active: 1,
          id_provider:2,
          provisionable: 1
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
          concurrences: {"list":['1','10']},
          activation_url: "get"
        },
        {     
          id: 2,
          name: "GCF for Firestore",
          description: "Testing Google Cloud Function as a backend for a Firestore database",
          id_usecase: 2,
          repetitions: 2,
          concurrences: {"list":['1','10']},
          activation_url: "get"
        },
        {     
          id: 3,
          name: "Lambda for S3",
          description: "Testing Lambda as backend for JSON data in a S3 bucket",
          id_usecase: 3,
          repetitions: 5,
          concurrences: {"list":['10','100']},
          activation_url: "get"
        },
        {     
          id: 4,
          name: "GCF for Google Cloud Storage",
          description: "Testing Google Cloud Function as backend for JSON data in a Cloud Storage bucket",
          id_usecase: 4,
          repetitions: 5,
          concurrences: {"list":['10','100']},
          activation_url: "get"
        },
        {     
          id: 5,
          name: "Lambda Calc",
          description: "Testing simple AWS Lambda calculator",
          id_usecase: 5,
          repetitions: 5,
          concurrences: {"list":['10','100']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"}
        },
        {     
          id: 6,
          name: "GCF Calc",
          description: "Testing a simple Google Cloud Function calculator",
          id_usecase: 6,
          repetitions: 5,
          concurrences: {"list":['10','100']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"}
        },
      ]);
    });

  await knex.schema.raw('ALTER SEQUENCE tb_benchmark_id_seq RESTART WITH 7;')

};
