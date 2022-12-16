
const axios = require("axios")
  
const backend = axios.create({
    baseURL: process.env.BACKEND_URL,
});

const kafka = axios.create({
    baseURL: process.env.KAFKA_URL,
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
      case "kafka":
        return kafka(axiosOptions).catch(err=>{
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
      case "kafka":
        return kafka(axiosOptions).catch(err=>{
          console.log(err)
        })
      default:
        break;
    }
    
  },

  async post (object, dt , api="backend") {

    const axiosOptions = {
      method: 'POST',
      data: dt,
      url: object
    };
    
    switch (api) {
      case "backend":
        return backend(axiosOptions).catch(err=>{
          console.log(err)
        })
      case "kafka":
        return kafka(axiosOptions).catch(err=>{
          console.log(err)
        })
      default:
        break;
    }
    
  },
  
};