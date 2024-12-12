import axios from "axios"

const urls = {
  backend: process.env.REACT_APP_BACKEND_URL,
  orchestrator: process.env.REACT_APP_ORCHESTRATOR_URL,
  benchmarker: process.env.REACT_APP_BENCHMARKER_URL,
  halsteader: process.env.REACT_APP_HALSTEADER_URL,
  predictor: process.env.REACT_APP_PREDICTOR_URL,
}

const backend = axios.create({
  baseURL: urls.backend
});

const orchestrator = axios.create({
  baseURL: urls.orchestrator
});

const benchmarker = axios.create({
  baseURL: urls.benchmarker
});

const halsteader = axios.create({
  baseURL: urls.halsteader
});

const predictor = axios.create({
  baseURL: urls.predictor
});

const list = async (object, api = 'backend', params) => {
  const axiosOptions = {
    method: 'GET',
    url: object,
    params
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

const post = async (object, dt , api="backend") => {
  
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
    case "orchestrator":
      return orchestrator(axiosOptions).catch(err=>{
        console.log(err)
      })
    case "benchmarker":
      return benchmarker(axiosOptions).catch(err=>{
        console.log(err)
      })
    case "halsteader":
      return halsteader(axiosOptions).catch(err=>{
        console.log(err)
      })
    case "predictor":
      return predictor(axiosOptions).catch(err=>{
        console.log(err)
      })
    default:
      break;
  }
  
}

const put = async (object, dt , api="backend") => {
  
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

const remove = async (object,api="backend") => {
  
  const axiosOptions = {
    method: 'DELETE',
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
  urls,
  list,
  get,
  post,
  put,
  remove
};
