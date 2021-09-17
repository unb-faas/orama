import api from "./api"

const apiGet = async (object, id) => {
    const axiosOptions = {
        method: 'GET',
        url: `${object}/${id}`
      };
    return api(axiosOptions).catch(err=>{
        console.log(err)
    })
}

export default apiGet