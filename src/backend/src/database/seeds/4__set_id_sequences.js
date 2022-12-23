exports.seed = async function (knex, Promise) {
  await knex.schema.raw('ALTER SEQUENCE tb_provider_id_seq RESTART WITH 999;')
  await knex.schema.raw('ALTER SEQUENCE tb_usecase_id_seq RESTART WITH 999;')
  await knex.schema.raw('ALTER SEQUENCE tb_benchmark_id_seq RESTART WITH 999;')
};
