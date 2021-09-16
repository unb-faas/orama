
const ORDER_ASC = 'asc'
const ORDER_DESC = 'desc'

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_ORDER = ORDER_DESC;
const MAX_PAGE_SIZE = 2000;

module.exports = {
  extractSortParam(sortStr) {
      let splitted = sortStr.split(',')
      if(splitted.length == 1 && splitted[0]) {
          return {
              column: splitted[0],
              order: DEFAULT_ORDER
          };
      } else if(splitted.length == 2 && splitted[0]) {
          return {
              column: splitted[0],
              order: (splitted[1] == ORDER_ASC) ? 
                          ORDER_ASC : DEFAULT_ORDER
          }
      }
      return null;
  },
  
  extractPagination(queryParams) {
      let pagination = {
          size: DEFAULT_PAGE_SIZE,
          page: 0,
          sort: []
      }

      if(!queryParams) {
          return pagination;
      }

      let size = parseInt(queryParams.size);
      if(Number.isInteger(size)){
        if(size > MAX_PAGE_SIZE)
            pagination.size = MAX_PAGE_SIZE
        else if(size > 0)
            pagination.size = size
      }

      let page = parseInt(queryParams.page);
      if(Number.isInteger(page) && page > 0) {
          pagination.page = page;
      }

      if(queryParams.sort) {        
          if (typeof queryParams.sort === 'string' 
                  || queryParams.sort instanceof String) {
              let sort = this.extractSortParam(queryParams.sort);
              if(sort) {
                  pagination.sort.push(sort);
              }
          } else if(Array.isArray(queryParams.sort)) {
              base=this;
              queryParams.sort.forEach(function (value) {
                  let sort = base.extractSortParam(value);
                  if(sort) {
                      pagination.sort.push(sort);
                  }
              }); 
          }
      }
      return pagination;
  }
};