'use strict';

module.exports.curl = function (program, fn) {

  var http = require('http');
  var https = require('https');

  if (/s/i.test(program.location.protocol)) {
    program.location.port = program.location.port || (/s/.test(program.location.protocol) ? 443 : 80);
    http = https;
  }

  var reqOpts = {
    hostname: program.location.hostname
  , port: program.location.port
  , path: program.location.path || '/'
  , method: program.request || 'GET'
  , rejectUnauthorized: !program.insecure
  , headers: { }
  };

  program.header.forEach(function (header) {
    var parts = header.split(':');
    var key = parts.shift();
    var val = parts.join(':');

    reqOpts.headers[key] = val;
  });

  var req = http.request(reqOpts, function (resp) {
    var chunks = [];

    resp.on('data', function (chunk) {
      chunks.push(chunk);
    });

    resp.on('end', function () {
      fn(null, Buffer.concat(chunks).toString('binary'));
    });
  });
  req.on('error', function (err) {
    fn(err);
  });
  req.end();

};
