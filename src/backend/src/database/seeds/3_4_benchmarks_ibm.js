exports.seed = async function (knex, Promise) {
    let now = new Date().toISOString();
    await knex("tb_benchmark")
        .then(function () {
            // Inserts seed entries
            return knex("tb_benchmark").insert([

                // Calculators
                {
                    id: 600,
                    name: "IBM ICE Calc US-East",
                    description: "Testing simple IBM Code Engine calculator",
                    id_usecase: 400,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    parameters: { a: 200, b: 500, operation: "multiplication" },
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 601,
                    name: "IBM ICE Calc US-South",
                    description: "Testing simple IBM Code Engine calculator",
                    id_usecase: 401,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    parameters: { a: 200, b: 500, operation: "multiplication" },
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 602,
                    name: "IBM ICE Calc Europe",
                    description: "Testing simple IBM Code Engine calculator",
                    id_usecase: 402,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    parameters: { a: 200, b: 500, operation: "multiplication" },
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 603,
                    name: "IBM ICE Calc Asia",
                    description: "Testing simple IBM Code Engine calculator",
                    id_usecase: 403,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    parameters: { a: 200, b: 500, operation: "multiplication" },
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 604,
                    name: "IBM ICE Calc Australia",
                    description: "Testing simple IBM Code Engine calculator",
                    id_usecase: 404,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    parameters: { a: 200, b: 500, operation: "multiplication" },
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                // Databases - Cloudant
                {
                    id: 610,
                    name: "IBM ICE for Database (Cloudant) US-East",
                    description: "Testing IBM Code Engine as backend for a Cloudant database",
                    id_usecase: 410,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 611,
                    name: "IBM ICE for Database (Cloudant) US-South",
                    description: "Testing IBM Code Engine as backend for a Cloudant database",
                    id_usecase: 411,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 612,
                    name: "IBM ICE for Database (Cloudant) Europe",
                    description: "Testing IBM Code Engine as backend for a Cloudant database",
                    id_usecase: 412,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 613,
                    name: "IBM ICE for Database (Cloudant) Asia",
                    description: "Testing IBM Code Engine as backend for a Cloudant database",
                    id_usecase: 413,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 614,
                    name: "IBM ICE for Database (Cloudant) Australia",
                    description: "Testing IBM Code Engine as backend for a Cloudant database",
                    id_usecase: 414,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                // Object Storage - COS
                {
                    id: 620,
                    name: "IBM ICE for Object Storage (COS) US-East",
                    description: "Testing IBM Code Engine as backend for JSON data in a COS bucket",
                    id_usecase: 420,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 621,
                    name: "IBM ICE for Object Storage (COS) US-South",
                    description: "Testing IBM Code Engine as backend for JSON data in a COS bucket",
                    id_usecase: 421,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 622,
                    name: "IBM ICE for Object Storage (COS) Europe",
                    description: "Testing IBM Code Engine as backend for JSON data in a COS bucket",
                    id_usecase: 422,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 623,
                    name: "IBM ICE for Object Storage (COS) Asia",
                    description: "Testing IBM Code Engine as backend for JSON data in a COS bucket",
                    id_usecase: 423,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                },

                {
                    id: 624,
                    name: "IBM ICE for Object Storage (COS) Australia",
                    description: "Testing IBM Code Engine as backend for JSON data in a COS bucket",
                    id_usecase: 424,
                    repetitions: 10,
                    concurrences: { "list": ['1', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048'] },
                    activation_url: "get",
                    warm_up: 1,
                    seconds_between_concurrences: 0,
                    seconds_between_concurrences_majored_by_concurrence: 0,
                    timeout: 120
                }

            ]);
        });
};