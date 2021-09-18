import axios from "axios"

const backend = axios.create({
  baseURL: "http://localhost:3001/backend/api/v1",
});

const orchestrator = axios.create({
  baseURL: "http://localhost:3200/",
});

const benchmarker = axios.create({
  baseURL: "http://localhost:3100/",
});

const list = async (object,api="backend") => {
  
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
  
}

const get = async (object,api="backend") => {
  
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
  
}

export const api = {
  list,
  get
};
