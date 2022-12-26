exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_benchmark")
    .then(function () {
      // Inserts seed entries
      return knex("tb_benchmark").insert([

        //  Calculators
        {     
          id: 300,
          name: "AFC Calc US-East",
          description: "Testing simple Alibaba Function Compute calculator",
          id_usecase: 300,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"},
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },
        
        
        {     
          id: 301,
          name: "AFC Calc US-West",
          description: "Testing simple Alibaba Function Compute calculator",
          id_usecase: 301,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"},
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },
        
        {     
          id: 302,
          name: "AFC Calc Europe",
          description: "Testing simple Alibaba Function Compute calculator",
          id_usecase: 302,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"},
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },
        
        {     
          id: 303,
          name: "AFC Calc Asia",
          description: "Testing simple Alibaba Function Compute calculator",
          id_usecase: 303,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"},
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },
        
        {     
          id: 304,
          name: "AFC Calc Australia",
          description: "Testing simple Alibaba Function Compute calculator",
          id_usecase: 304,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          parameters: {a:200,b:500,operation:"multiplication"},
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        //  Databases

        {     
          id: 310,
          name: "AFC for Database (TableStore) US-East",
          description: "Testing Alibaba Function Compute as a backend for a TableStore database",
          id_usecase: 310,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 311,
          name: "AFC for Database (TableStore) US-West",
          description: "Testing Alibaba Function Compute as a backend for a TableStore database",
          id_usecase: 311,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 312,
          name: "AFC for Database (TableStore) Europe",
          description: "Testing Alibaba Function Compute as a backend for a TableStore database",
          id_usecase: 312,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 313,
          name: "AFC for Database (TableStore) Asia",
          description: "Testing Alibaba Function Compute as a backend for a TableStore database",
          id_usecase: 313,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 314,
          name: "AFC for Database (TableStore) Australia",
          description: "Testing Alibaba Function Compute as a backend for a TableStore database",
          id_usecase: 314,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        //  Object Storages

        {     
          id: 320,
          name: "AFC for Object Storage (OSS) US-East",
          description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
          id_usecase: 320,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 321,
          name: "AFC for Object Storage (OSS) US-West",
          description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
          id_usecase: 321,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 322,
          name: "AFC for Object Storage (OSS) Europe",
          description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
          id_usecase: 322,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 323,
          name: "AFC for Object Storage (OSS) Asia",
          description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
          id_usecase: 323,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },

        {     
          id: 324,
          name: "AFC for Object Storage (OSS) Australia",
          description: "Testing Alibaba Function Compute as backend for JSON data in a OSS bucket",
          id_usecase: 324,
          repetitions: 10,
          concurrences: {"list":['1','2','4','8','16','32','64','128','256','512','1024','2048','4096']},
          activation_url: "get",
          warm_up: 1,
          seconds_between_concurrences: 0,
          seconds_between_concurrences_majored_by_concurrence: 0,
          timeout: 120
        },
        
      ]);
    });


};
