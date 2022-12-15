const fs = require("fs");
module.exports = {
  exists(id,provider,concurrence,repetition) {
    return new Promise((resolve, reject) => {
      const path = `/results/${id}/${provider}/${concurrence}/${repetition}`
      if (fs.existsSync(path)) {
        resolve(true)
       } else {
         resolve(false)
       }
    })
  },
};