
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_provider', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.string('acronym',10).notNull()
            table.smallint('active').default(0)
        })

        .raw(`CREATE UNIQUE INDEX "unique_acronym_on_provider" ON "tb_provider" ("acronym") WHERE "acronym" IS NOT NULL`)

        .createTable('tb_usecase', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.string('acronym',10).notNull()
            table.smallint('active').default(0)
        })
        
        .raw(`CREATE UNIQUE INDEX "unique_acronym_on_usecase" ON "tb_usecase" ("acronym") WHERE "acronym" IS NOT NULL`)

        .createTable('tb_benchmark', table => {
            table.increments('id').primary()
            table.string('name',30).notNull()
            table.string('description',255)
            table.json('concurrences')
            table.integer('repetitions').notNull()
            table.integer('id_provider').references('id').inTable('tb_provider').notNull()
            table.integer('id_usecase').references('id').inTable('tb_usecase').notNull()
        })

        .createTable('tb_benchmark_execution', table => {
            table.increments('id').primary()
            table.timestamp('date').notNull()
            table.json('results')
            table.integer('id_benchmark').references('id').inTable('tb_benchmark').notNull()
        })

        .raw(`CREATE INDEX "idx_id_benchmark" ON "tb_benchmark_execution" ("id_benchmark") WHERE "id_benchmark" IS NOT NULL`)

        .createTable('tb_factorial_design', table => {
            table.increments('id').primary()
            table.string('name',20).notNull()
            table.timestamp('date').notNull()
            table.json('benchmarks')
            table.json('plan')
            table.json('results')
        })

};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_factors_project')
        .dropTable('tb_benchmark_execution')
        .dropTable('tb_benchmark')
        .dropTable('tb_usecase')
        .dropTable('tb_provider')
};
