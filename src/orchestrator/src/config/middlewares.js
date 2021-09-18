const serviceName = "backend"
const dirLogFiles = process.env.LOGDIR || "/tmp/logs"
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");

const rfs = require("rotating-file-stream");
const logStream = rfs.createStream(`${dirLogFiles}/${serviceName}.log`, {
  size: "50M", // rotate every 50 MegaBytes written
  interval: "1d", // rotate daily
  compress: "gzip", // compress rotated files
});

const limiter = rateLimit({
  windowMs: 1 * 5 * 1000, // 1 minute
  max: 10000, // 1000 requests,
});

module.exports = (app) => {
  // log all in "combined" format (like Apache) - in file
  app.use(morgan('combined', { 
    stream: logStream 
  }))
  // log only 4xx and 5xx responses in "dev" format - in file
  app.use(morgan('dev', {
    stream: logStream,
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  // log all in "combined" format (like Apache) - on console 
  app.use(morgan('combined'))
  // log only 4xx and 5xx responses in "dev" format - on console
  app.use(morgan('dev',{
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(limiter);
  app.use(
    "/public",
    express.static(
      path.resolve(__dirname, "..", "..", "assets", "images", "uploads")
    )
  );
};
