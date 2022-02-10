const fs = require('fs');
module.exports = (app) => {

  const getLog = async (req, res) => {
    try {
        const {id, usecase, type} = req.params
        if (id, usecase, type){
            fs.readFile(`/logs/${id}/${usecase}/${type}.log`, function read(err, data) {
                if (err) {
                    res.status(500).json(`error: ${err}`)
                }
                res.json({content:data.toString("ascii").replace(/\u001b\[.*?m/g, '')})
            });
        } else {
            return res.status(400).json({"info":"Missing parameters"})
        }
    } catch (error) {
        return res.status(500).json(`error: ${error}`)
    }
  };

  return {
    getLog
  };
};
