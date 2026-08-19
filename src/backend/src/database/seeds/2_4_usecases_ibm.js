exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        // Calculators (ICE Calculator)

        {
          id: 400,
          name: "ICE Calculator US-East",
          acronym: "icecalc",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-east"
          }
        },
        {
          id: 401,
          name: "ICE Calculator US-South",
          acronym: "icecalc",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-south"
          }
        },
        {
          id: 402,
          name: "ICE Calculator Europe",
          acronym: "icecalc",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "eu-gb"
          }
        },
        {
          id: 403,
          name: "ICE Calculator Asia",
          acronym: "icecalc",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "jp-tok"
          }
        },
        {
          id: 404,
          name: "ICE Calculator Australia",
          acronym: "icecalc",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "au-syd"
          }
        },

        // Databases 

        {
          id: 410,
          name: "ICE for Database (Cloudant) US-East",
          acronym: "ice2cloudant",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-east"
          }
        },
        {
          id: 411,
          name: "ICE for Database (Cloudant) US-South",
          acronym: "ice2cloudant",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-south"
          }
        },
        {
          id: 412,
          name: "ICE for Database (Cloudant) Europe",
          acronym: "ice2cloudant",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "eu-gb"
          }
        },
        {
          id: 413,
          name: "ICE for Database (Cloudant) Asia",
          acronym: "ice2cloudant",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "jp-tok"
          }
        },
        {
          id: 414,
          name: "ICE for Database (Cloudant) Australia",
          acronym: "ice2cloudant",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "au-syd"
          }
        },

        // Object Storage 

        {
          id: 420,
          name: "ICE for Object storage (COS) US-East",
          acronym: "ice2cos",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-east"
          }
        },
        {
          id: 421,
          name: "ICE for Object storage (COS) US-South",
          acronym: "ice2cos",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "us-south"
          }
        },
        {
          id: 422,
          name: "ICE for Object storage (COS) Europe",
          acronym: "ice2cos",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "eu-gb"
          }
        },
        {
          id: 423,
          name: "ICE for Object storage (COS) Asia",
          acronym: "ice2cos",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "jp-tok"
          }
        },
        {
          id: 424,
          name: "ICE for Object storage (COS) Australia",
          acronym: "ice2cos",
          active: 1,
          id_provider: 4,
          provisionable: 1,
          parameters: {
            region: "au-syd"
          }
        },
       
      ]);
    });
  
};
