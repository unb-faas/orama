import api from "./api"

const apiList = async (object) => {
    const axiosOptions = {
        method: 'GET',
        url: object
      };
    return api(axiosOptions).catch(err=>{
        console.log(err)
    })
}

export default apiList