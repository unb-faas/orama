const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_benchmark as a'
const defaultFields = [
    'a.id',
    'a.name',
    'a.description',
    'a.concurrences',
    'a.repetitions',
    'a.id_usecase',
    'a.parameters',
    'a.activation_url',
    'a.warm_up',
    'a.seconds_between_concurrences',
    'a.seconds_between_concurrences_majored_by_concurrence',
    'a.seconds_between_repetitions',
    'a.timeout',
    'u.id_provider',
    'p.acronym as provider_acronym',
    'u.acronym as usecase_acronym',
].concat(conn.raw("(select count(*) from tb_benchmark_execution as b where id_benchmark = a.id and b.finished = 0) as execution_running "))

const getById = async (id) => {
    /* Querying */
    let query = conn(table)
                    .join('tb_usecase as u', 'a.id_usecase', '=', 'u.id')
                    .join('tb_provider as p', 'u.id_provider', '=', 'p.id')
    /* Filtering */
    query = query
            .select(defaultFields)
            .andWhere('a.id', '=', id);
    let result = await query;
    if(result.length <= 0)
        return {};
    return result[0];
}

const getPage = async (queryParams) => {
    let pagination = paginationUtils.extractPagination(queryParams);  
    let result = {
        total: 0,
        count: 0,
        data: []
    };

    /* Querying */
    let query = conn(table)
                    .join('tb_usecase as u', 'a.id_usecase', '=', 'u.id')
                    .join('tb_provider as p', 'u.id_provider', '=', 'p.id')
    
    /* Filtering */
    if(queryParams.usecase_active) {
        query = query.andWhere("u.active", "=", queryParams.usecase_active)                   
    }

    if(queryParams.filterName) {
        query = query.andWhereRaw("(LOWER(a.name) LIKE ? or LOWER(u.name) LIKE ? or LOWER(u.acronym) LIKE ? or LOWER(p.name) LIKE ? or LOWER(p.acronym) LIKE ? )", [`%${queryParams.filterName.toLowerCase()}%`, `%${queryParams.filterName.toLowerCase()}%`, `%${queryParams.filterName.toLowerCase()}%`, `%${queryParams.filterName.toLowerCase()}%`, `%${queryParams.filterName.toLowerCase()}%`])                        
    }
   
    if(queryParams.provider_active) {
        query = query.andWhere("p.active", "=", queryParams.provider_active)                        
    }
   
    /* Counting */
    let total = await query.clone().count();
    if(!total) {
        total = 0;
    } else {
        total = parseInt(total[0].count)
    }

    /* Ordering */
    if(queryParams.orderBy && queryParams.order) {
        let orderBy = (queryParams.orderBy === "provider") ? "provider_acronym" : queryParams.orderBy
        orderBy = (queryParams.orderBy === "usecase") ? "usecase_acronym" : orderBy
        query = query.orderBy(queryParams.orderBy, queryParams.order);
    }
    pagination.sort.forEach(function (value) {
        query = query.orderBy(value.column, value.order);
    });     
    // It always must have a default ordering after all others, 
    // otherwise the listed elements may have unpredictable orders
    query = query.orderBy('a.id', 'asc');

    /* Pagination */
    query = query
                .select(defaultFields)
                .offset(pagination.page * pagination.size)
                .limit(pagination.size);
                 
    /* Executing */
    let data = await query.catch(err =>{return {error:err}});
    result.data = data;
    result.count = data.length;    
    result.total = total;

    return result;
}

const create = (params) => {
    return conn(table)
        .returning('id')
        .insert(params)
}

const update = (id,params) => {
    return conn(table)
        .where('id',"=",id)
        .update(params)
}

const remove = (id) => {
    return conn(table)
        .where('id',"=",id)
        .del()
}

exports.getById = getById
exports.getPage = getPage
exports.create = create
exports.update = update
exports.remove = remove