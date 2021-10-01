
const axios = require("axios")
  
const backend = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

const benchmarker = axios.create({
    baseURL: process.env.REACT_APP_BENCHMARKER_URL,
});

module.exports = {
  async get (object,api="backend") {

    const axiosOptions = {
      method: 'GET',
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
      case "benchmarker":
        return benchmarker(axiosOptions).catch(err=>{
          console.log(err)
        })
      default:
        break;
    }
    
  },
  async put (object, dt , api="backend") {

    const axiosOptions = {
      method: 'PUT',
      data: dt,
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
      case "benchmarker":
        return benchmarker(axiosOptions).catch(err=>{
          console.log(err)
        })
      default:
        break;
    }
    
  }
  
};