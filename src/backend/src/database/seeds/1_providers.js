exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_worker").del()
  await knex("tb_factorial_design").del()
  await knex("tb_benchmark_execution_partial_result").del()
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
          active: 1
        },
        {     
          id: 4,
          name: "Alibaba Cloud",
          acronym: "Alibaba",
          active: 1
        }
      ]);
    });
  
  await knex.schema.raw('ALTER SEQUENCE tb_provider_id_seq RESTART WITH 999;')
};
