exports.seed = async function (knex, Promise) {
  let now = new Date().toISOString();
  await knex("tb_usecase")
    .then(function () {
      // Inserts seed entries
      return knex("tb_usecase").insert([

        //  Calculators

        {     
          id: 400,
          name: "ICF Calculator",
          acronym: "icfcalc",
          active: 1,
          id_provider:4,
          provisionable: 1
        }
       
      ]);
    });
  
};
