exports.up = function (knex) {
  return knex.schema.table("tb_provider", function (table) {
    table.jsonb("costs").defaultTo(null);
  });s
};

exports.down = function (knex) {
    return knex.schema.table("tb_provider", function (table) {
        table.dropColumn("costs");
    });
};
