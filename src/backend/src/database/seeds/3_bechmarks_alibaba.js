exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_benchmark")
    .then(function () {
      // Inserts seed entries
      return knex("tb_benchmark").insert([
        
          {     
            id: 43,
            name: "AFC Calc US-east",
            description: "Testing simple Alibaba Function Compute calculator",
            id_usecase: 43,
            repetitions: 10,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            parameters: {a:200,b:500,operation:"multiplication"},
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          {     
            id: 44,
            name: "AFC for OSS",
            description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
            id_usecase: 44,
            repetitions: 30,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          
          {     
            id: 48,
            name: "AFC Calc US-west",
            description: "Testing simple Alibaba Function Compute calculator",
            id_usecase: 48,
            repetitions: 10,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            parameters: {a:200,b:500,operation:"multiplication"},
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          
          {     
            id: 52,
            name: "AFC Calc Frankfurt",
            description: "Testing simple Alibaba Function Compute calculator",
            id_usecase: 52,
            repetitions: 10,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            parameters: {a:200,b:500,operation:"multiplication"},
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          
          {     
            id: 56,
            name: "AFC Calc Hong Kong",
            description: "Testing simple Alibaba Function Compute calculator",
            id_usecase: 56,
            repetitions: 10,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            parameters: {a:200,b:500,operation:"multiplication"},
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          
          {     
            id: 60,
            name: "AFC Calc Australia",
            description: "Testing simple Alibaba Function Compute calculator",
            id_usecase: 60,
            repetitions: 10,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            parameters: {a:200,b:500,operation:"multiplication"},
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          },
          {     
            id: 61,
            name: "AFC for TableStore",
            description: "Testing Alibaba Function Compute as a backend for a TableStore database",
            id_usecase: 45,
            repetitions: 30,
            concurrences: {"list":['1','2','4','8','16','32','64','128','256','512']},
            activation_url: "get",
            warm_up: 1,
            seconds_between_concurrences: 0,
            seconds_between_concurrences_majored_by_concurrence: 0,
            timeout: 120
          }
      ]);
    });


};
