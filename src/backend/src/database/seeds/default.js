exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_individual_execution").del();
  await knex("tb_concurrent_execution").del();
  await knex("tb_benchmark_execution").del();
  await knex("tb_benchmark").del();
  await knex("tb_usecase").del();
  await knex("tb_provider").del();

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
          name: "FaaS acting as Backend to DBaaS",
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
          id_provider: 1,
          id_usecase: 1,
          repetitions: 2,
          concurrences: {"list":[1,10,50]}
        },
        {     
          id: 2,
          id_provider: 2,
          id_usecase: 1,
          repetitions: 2,
          concurrences: {"list":[1,10,50]}
        },
        {     
          id: 3,
          id_provider: 1,
          id_usecase: 2,
          repetitions: 5,
          concurrences: {"list":[10,20,40,80]}
        },
        {     
          id: 4,
          id_provider: 2,
          id_usecase: 2,
          repetitions: 5,
          concurrences: {"list":[10,20,40,80]}
        },
      ]);
    });

  await knex.schema.raw('ALTER SEQUENCE tb_benchmark_id_seq RESTART WITH 5;')

};
