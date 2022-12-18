const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_benchmark_execution_partial_result as a'
let defaultFields = [
    'a.id',
    'a.concurrence',
    'a.repetition',
    'a.requests',
    'a.worker_uuid',
    'a.created_at',
    'a.results',
    'a.id_benchmark_execution',
]

const getById = async (id) => {
    /* Querying */
    let query = conn(table)

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
    
    /* Filtering */
    if(queryParams.id_benchmark_execution) {
        query = query.andWhere("id_benchmark_execution","=",queryParams.id_benchmark_execution)
    }
    if(queryParams.concurrence) {
        query = query.andWhere("concurrence","=",queryParams.concurrence)
    }
    if(queryParams.repetition) {
        query = query.andWhere("repetition","=",queryParams.repetition)
    }

    /* Filtering */
    if(queryParams.removeResults===true) {
        const index = defaultFields.indexOf('a.results');
        if (index > -1) {
            defaultFields.splice(index, 1);
        }
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
        query = query.orderBy(queryParams.orderBy, queryParams.order);
    }
    pagination.sort.forEach(function (value) {
        query = query.orderBy(value.column, value.order);
    });     
    // It always must have a default ordering after all others, 
    // otherwise the listed elements may have unpredictable orders
    query = query.orderBy('a.id', 'desc');

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