const package_app = require('../../package.json')
const logdir = process.env.LOGDIR || "/var/log"
const moment = require('moment')
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = Object.create(null); 
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

module.exports = (app) => {

  const info = async (req, res) => {
    const info = {
      version : package_app.version,
      build: package_app.builddate,
      networks: results
    }
    return res.json(info)
  };

  const backendLog = async (req, res) => {
    const service = (req.query.service)?req.query.service:'backend' 
    const size = (req.query.size)?req.query.size:500  
    var fs = require('fs');
    const today = moment().format('YYYYMMD');
    var data = '';
    var readStream = fs.createReadStream(`${logdir}/${service}/${today}.log`, 'utf8');
    readStream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
      data = data.split("\n").reverse()
      let content = data.filter(filterLogsCheckers)
      return res.json({content:content.slice(0,size)})
    });
  };

  function filterLogsCheckers(obj) {
    if (obj.includes('info/backendLog') || obj.includes('info/frontendLog') || obj.includes('info/crawlerLog')) {
      return false;
    } else {
      return true;
    }
  }

  const frontendLog = async (req, res) => {
    const service = 'frontend'  
    var fs = require('fs');
    var data = '';
    var readStream = fs.createReadStream(`${logdir}/${service}.log`, 'utf8');
    readStream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
      return res.json({content:data})
    });
  };

  const crawlerLog = async (req, res) => {
    const service = 'frontend'  
    var fs = require('fs');
    var data = '';
    var readStream = fs.createReadStream(`${logdir}/${service}.log`, 'utf8');
    readStream.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
      return res.json({content:data})
    });
  };

  return {
    info,
    backendLog,
    frontendLog,
    crawlerLog,
  };
};
