'use strict';
const mssql = require('mssql');

let CONFIGS = {};
let servers = process.env.CONNECTIONS.split(',') || [];

// build up configs for server connections on server start
servers.forEach( function(server) {
  const config = JSON.parse(process.env[server] || '');
  CONFIGS[config.name] = config.config;
  return CONFIGS[config.name].requestTimeout = 60000;
});

const root = process.cwd();

// query the db
// need a server, database, template (sproc name), parameters
const query = function(req, res) {
  console.log("hitting query route");
  const template = 'SELECT @@SERVERNAME AS SERVERNAME;SELECT @@VERSION AS VERSION;SELECT sqlserver_start_time FROM sys.dm_os_sys_info;'
  // req.body.template;
  const data = req.body.data;
  const config = CONFIGS[req.body.data.server];

  if (!config) {
    return res.send(500, "Connection for " + req.body.data.server + " not found.");
  }

  mssql.connect(config).then(pool => {
    return pool.request()
    //.input('input_parameter', sql.Int, value)
    .query(template)
    }).then(result => {
      if (result.recordsets) {
        result = result.recordsets;
      }
      res.status(200).send(result);
    });

  // const connection =
  // new mssql.Connection(config, function(err) {
  //   if (err) {
  //     res.send(500, "mssql error " + err);
  //     return console.error("mssql error " + err);
  //   }
  //   const rq = new mssql.Request(connection);
  //   rq.multiple = true;
  //   return rq.query(template, function(err, recordset) {
  //     if (err) {
  //       res.send(500, "mssql error " + err);
  //       return console.error("mssql error " + err);
  //       connection.close();
  //     }
  //     res.send(recordset);
  //     return connection.close();
  //   });
  // });
};

// proc = function(req, res) {
//   return console.log("not Implemented");
// };

module.exports.query = query;
