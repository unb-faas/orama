exports.up = function(knex) {
    return knex.schema
        .createTable('tb_benchmark_execution_partial_result', table => {
            table.increments('id').primary()
            table.integer('concurrence').notNull()
            table.string('repetition').notNull()
            table.integer('requests').notNull()
            table.string('worker_uuid',256)
            table.timestamp('created_at').notNull()
            table.json('results')
            table.integer('id_benchmark_execution').references('id').inTable('tb_benchmark_execution').notNull()
        })
        .raw(`CREATE INDEX "idx_id_benchmark_execution" ON "tb_benchmark_execution_partial_result" ("id_benchmark_execution") WHERE "id_benchmark_execution" IS NOT NULL`)

};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_benchmark_execution_partial_result')
    };