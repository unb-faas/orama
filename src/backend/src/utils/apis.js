
const axios = require("axios")

const urls = {
  backend:process.env.REACT_APP_BACKEND_URL,
  orchestrator:process.env.REACT_APP_ORCHESTRATOR_URL,
  benchmarker:process.env.REACT_APP_BENCHMARKER_URL
}

const backend = axios.create({
  baseURL: urls.backend,
});

const orchestrator = axios.create({
    baseURL: urls.orchestrator,
});

const benchmarker = axios.create({
    baseURL: urls.benchmarker,
});

module.exports = {
  async get (object,api="benchmarker") {

    const axiosOptions = {
      method: 'GET',
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
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
    
  },
  urls(api){
    switch (api) {
      case "backend":
        return urls.backend
      case "orchestrator":
        return urls.orchestrator
      case "benchmarker":
        return urls.benchmarker
      default:
        break;
    }
  }
  
};