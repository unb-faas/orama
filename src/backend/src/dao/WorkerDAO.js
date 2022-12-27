const conn = require('../database/connection')
const paginationUtils = require('../utils/pagination')

const table='tb_worker as a'
const defaultFields = [
    'a.id',
    'a.name',
    'a.uuid',
    'a.role',
    'a.active',
    'a.created_at',
    'a.last_up_at',
].concat(conn.raw("CASE WHEN now()-last_up_at > '00:00:08' THEN 0 ELSE 1 END AS health"))


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

const getByUUID = async (id) => {
    /* Querying */
    let query = conn(table)

    /* Filtering */
    query = query
            .select(defaultFields)
            .andWhere('a.uuid', '=', id);
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
    if(queryParams.filterName) {
        query = query.andWhereRaw("LOWER(a.name) LIKE ?", [`%${queryParams.filterName.toLowerCase()}%`])                        
    }
    
    if(queryParams.filterActive) {
        query = query.andWhereRaw("a.active = ?", [queryParams.filterActive])                        
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
    params.created_at = new Date().toISOString()
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
exports.getByUUID = getByUUID
exports.getPage = getPage
exports.create = create
exports.update = update
exports.remove = remove