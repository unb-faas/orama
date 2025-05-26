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
          id: 0,
          name: "Amazon Web Services",
          acronym: "AWS",
          active: 1,
          costs: {
            'sa-east-1-first-6-billions': {
              hit: 0.0000002,
              gb_s: 0.0000166667,
              vcpu_s: 0
            },
            'sa-east-1-next-9-billions': {
              hit: 0.0000002,
              gb_s: 0.000015,
              vcpu_s: 0
            },
            'sa-east-1-over-15-billions': {
              hit: 0.0000002,
              gb_s: 0.0000133334,
              vcpu_s: 0
            },
          }
        },
        {     
          id: 1,
          name: "Google Cloud Plattform",
          acronym: "GCP",
          active: 1,
          costs: {
            'tier-1': {
                hit: 0.0000004,
                gb_s: 0.0000023283,
                vcpu_s:  0.00002400
            },
            'tier-2': {
                hit: 0.0000004,
                gb_s: 0.00000325962,
                vcpu_s: 0.00003360
            }
          }
        },
        {     
          id: 2,
          name: "Microsoft Azure",
          acronym: "Azure",
          active: 1,
          costs: {
            'all-regions': {
              hit: 0.0000002,
              gb_s: 0.000016,
              vcpu_s: 0
            },
            'all-regions-flex': {
              hit: 0.0000004,
              gb_s: 0.000037,
              vcpu_s: 0
            }
          }
        },
        {     
          id: 3,
          name: "Alibaba Cloud",
          acronym: "Alibaba",
          active: 1,
          costs: {
            'tier-1': {
              hit: 0.00000015,
              gb_s: 0.000003,
              vcpu_s: 0.00002,
            },
            'tier-2': {
              hit: 0.0000001275,
              gb_s: 0.00000255,
              vcpu_s: 0.000017,
            },
            'tier-3': {
              hit: 0.000000105,
              gb_s: 0.0000021,
              vcpu_s: 0.000014,
            }
          }
        },
        {     
          id: 4,
          name: "IBM Cloud",
          acronym: "IBM",
          active: 1
        }
      ]);
    });
  
};
