
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_provider', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.string('acronym',20).notNull()
            table.smallint('active').default(0)
        })

        .raw(`CREATE UNIQUE INDEX "unique_acronym_on_provider" ON "tb_provider" ("acronym") WHERE "acronym" IS NOT NULL`)

        .createTable('tb_usecase', table => {
            table.increments('id').primary()
            table.string('name',500).notNull()
            table.string('acronym',20).notNull()
            table.smallint('active').default(0)
            table.smallint('provisionable').default(0)
            table.json('parameters')
            table.json('urls')
            table.timestamp('provision_started_at')
            table.timestamp('provision_finished_at')
            table.timestamp('unprovision_started_at')
            table.timestamp('unprovision_finished_at')
            table.integer('id_provider').references('id').inTable('tb_provider').notNull()
        })
        
        .createTable('tb_benchmark', table => {
            table.increments('id').primary()
            table.string('name',200).notNull()
            table.string('description',600)
            table.json('concurrences')
            table.integer('repetitions').notNull()
            table.json('parameters')
            table.string('activation_url',30)
            table.smallint('warm_up').default(0).notNull()
            table.integer('seconds_between_concurrences').default(0).notNull()
            table.smallint('seconds_between_concurrences_majored_by_concurrence').default(0).notNull()
            table.integer('seconds_between_repetitions').default(0).notNull()
            table.integer('timeout').default(0).notNull()
            table.integer('id_usecase').references('id').inTable('tb_usecase').notNull()
        })

        .createTable('tb_benchmark_execution', table => {
            table.increments('id').primary()
            table.timestamp('date').notNull()
            table.timestamp('started_at')
            table.timestamp('finished_at')
            table.integer('finished').default(0)            
            table.json('results')
            table.integer('id_benchmark').references('id').inTable('tb_benchmark').notNull()
        })

        .raw(`CREATE INDEX "idx_id_benchmark" ON "tb_benchmark_execution" ("id_benchmark") WHERE "id_benchmark" IS NOT NULL`)

        .createTable('tb_factorial_design', table => {
            table.increments('id').primary()
            table.string('name',60).notNull()
            table.timestamp('date').notNull()
            table.json('benchmarks')
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
