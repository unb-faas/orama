
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_worker', table => {
            table.increments('id').primary()
            table.string('uuid',256).notNull()
            table.string('name',500).notNull()
            table.smallint('role').default(0)
            table.smallint('active').default(0)
            table.timestamp('created_at')
            table.timestamp('last_up_at')
        })

        .raw(`CREATE UNIQUE INDEX "unique_uuid_on_worker" ON "tb_worker" ("uuid") WHERE "uuid" IS NOT NULL`)

};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_worker')
};
