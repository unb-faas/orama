
exports.up = function(knex) {
    return knex.schema
        .createTable('tb_provider', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.string('acronym',10).notNull()
            table.smallint('active').default(0)
        })

        .createTable('tb_usecase', table => {
            table.increments('id').primary()
            table.string('name',255).notNull()
            table.string('acronym',10).notNull()
            table.smallint('active').default(0)
        })
        
        .createTable('tb_benchmark', table => {
            table.increments('id').primary()
            table.json('concurrences')
            table.integer('repetitions').notNull()
            table.smallint('provision_status').default(0).notNull()
            table.string('provision_url',500)
            table.integer('id_provider').references('id').inTable('tb_provider').notNull()
            table.integer('id_usecase').references('id').inTable('tb_usecase').notNull()
        })

        .createTable('tb_benchmark_execution', table => {
            table.increments('id').primary()
            table.timestamp('date').notNull()
            table.json('results')
            table.integer('id_benchmark').references('id').inTable('tb_benchmark').notNull()
        })

        .createTable('tb_concurrent_execution', table => {
            table.increments('id').primary()
            table.integer('concurrence').notNull()
            table.json('results')
            table.integer('id_benchmark_execution').references('id').inTable('tb_benchmark_execution').notNull()
        })

        .createTable('tb_individual_execution', table => {
            table.increments('id').primary()
            table.json('results')
            table.integer('id_concurrent_execution').references('id').inTable('tb_concurrent_execution').notNull()
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tb_individual_execution')
        .dropTable('tb_concurrent_execution')
        .dropTable('tb_benchmark_execution')
        .dropTable('tb_benchmark')
        .dropTable('tb_usecase')
        .dropTable('tb_provider')
};
