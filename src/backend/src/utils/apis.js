
const axios = require("axios")

const urls = {
  backend:process.env.REACT_APP_BACKEND_URL,
  orchestrator:process.env.REACT_APP_ORCHESTRATOR_URL,
  benchmarker:process.env.REACT_APP_BENCHMARKER_URL,
  halsteader:process.env.REACT_APP_HALSTEADER_URL
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

const halsteader = axios.create({
    baseURL: urls.halsteader,
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
          console.error(err)
        })
      case "orchestrator":
        return orchestrator(axiosOptions).catch(err=>{
          console.error(err)
        })
      case "benchmarker":
        return benchmarker(axiosOptions).catch(err=>{
          console.error(err)
        })
      default:
        break;
    }
    
  },

  async post (object, dt , api="benchmarker") {

    const axiosOptions = {
      method: 'POST',
      data: dt,
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.error(err)
        })
      case "orchestrator":
        return orchestrator(axiosOptions).catch(err=>{
          console.error(err)
        })
      case "benchmarker":
        return benchmarker(axiosOptions).catch(err=>{
          console.error(err)
        })
      case "halsteader":
        return halsteader(axiosOptions).catch(err=>{
          console.error(err)
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
      case "halsteader":
        return urls.halsteader
      default:
        break;
    }
  }
  
};