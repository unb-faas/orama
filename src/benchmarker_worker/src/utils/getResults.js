const csv = require("csvtojson");
module.exports = {
  json(id,provider,concurrence,repetition) {
    return new Promise((resolve, reject) => {
        csv()
            .fromFile(`/results/${id}/${provider}/${concurrence}/${repetition}/result.csv`)
            .then(function(jsonArrayObj){
                resolve(jsonArrayObj); 
        })
    })
  },
};