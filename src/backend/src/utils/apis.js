
const axios = require("axios")
  
const orchestrator = axios.create({
    baseURL: "http://orchestrator:3200/",
});

const benchmarker = axios.create({
    baseURL: "http://benchmarker:3100/",
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