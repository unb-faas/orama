
const axios = require("axios")
  
const orchestrator = axios.create({
    baseURL: process.env.REACT_APP_ORCHESTRATOR_URL,
});

const benchmarker = axios.create({
    baseURL: process.env.REACT_APP_BENCHMARKER_URL,
});

module.exports = {
  async get (object,api="benchmarker") {

    const axiosOptions = {
      method: 'GET',
      url: object
    };
    
    switch (api) {
      case "orchestrator":
        return orchestrator(axiosOptions).catch(err=>{
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