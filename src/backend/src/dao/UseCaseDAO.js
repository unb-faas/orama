const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_usecase as a'
const defaultFields = [
    'a.id',
    'a.name',
    'a.acronym',
    'a.active',
    'a.provisionable',
    'a.urls',
    'a.provision_started_at',
    'a.provision_finished_at',
    'a.unprovision_started_at',
    'a.unprovision_finished_at', 
    'a.id_provider',  
    'p.acronym as provider_acronym'
]

const getById = async (id) => {
    /* Querying */
    let query = conn(table)
                    .join('tb_provider as p', 'a.id_provider', '=', 'p.id')

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
                    .join('tb_provider as p', 'a.id_provider', '=', 'p.id')
    
    /* Filtering */
    if(queryParams.provider_active) {
        query = query.andWhere("p.active", "=", queryParams.provider_active)                        
    }
    
    if(queryParams.active) {
        query = query.andWhere(
                        "a.active", "=", queryParams.active)                        
    }

    if(queryParams.filterName) {
        query = query.andWhereRaw("LOWER(a.name) LIKE ?", [`%${queryParams.filterName}%`])                        
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
        const orderBy = (queryParams.orderBy === "provider") ? "provider_acronym" : queryParams.orderBy
        query = query.orderBy(orderBy, queryParams.order);
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