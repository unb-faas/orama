
const axios = require("axios")
  
const backend = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

const orchestrator = axios.create({
    baseURL: process.env.REACT_APP_ORCHESTRATOR_URL,
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
          console.error(err)
        })
      case "orchestrator":
        return orchestrator(axiosOptions).catch(err=>{
          console.error(err)
        })
      default:
        break;
    }
    
  }
  
};