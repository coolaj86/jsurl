'use strict';

module.exports.curl = function (program, fn) {

  var dns = require('dns');
  var http = require('http');
  var https = require('https');
  var newUrl;
  var addr;

  program.location.port = program.location.port || (/s/.test(program.location.protocol) ? 443 : 80);
  if (/s/i.test(program.location.protocol)) {
    http = https;
  }

  newUrl = program.location.protocol + '//'
    + program.location.hostname
    + (-1 !== [443, 80].indexOf(program.location.port) ? '' : ':' + program.location.port)
    + (program.location.path || '/')
    ;

  if (program.verbose) {
    if (newUrl !== program.url) {
      console.log('* Rebuilt URL to: ' + newUrl);
    }
    //*   Trying 162.243.160.23...
    //* Connected to aj.daplie.me (162.243.160.23) port 80 (#0)
    //> GET / HTTP/1.1
    //> Host: aj.daplie.me
    //> User-Agent: curl/7.43.0
    //> Accept: */*
    //>
  }

  dns.resolve4(program.location.hostname, function (err, addr4) {
    dns.resolve6(program.location.hostname, function (err, addr6) {
      var addr = (addr4||addr6||[])[0];

      if (program.verbose) {
        if (!addr) {
          console.info('* Could not resolve host: ' + program.location.hostname);
        }
        else {
          // TODO if one fails, try the next
          console.info('*  Trying ' + addr + '...');
        }
      }
      var reqOpts = {
        hostname: addr // program.location.hostname
      , port: program.location.port
      , path: program.location.path || '/'
      , method: program.request || 'GET'
      , rejectUnauthorized: !program.insecure
      , headers: { Host: program.location.hostname }
      };

      program.header.forEach(function (header) {
        var parts = header.split(':');
        var key = parts.shift();
        var val = parts.join(':');

        reqOpts.headers[key] = val;
      });

      var req = http.request(reqOpts, function (resp) {
        var chunks = [];

        if (program.verbose) {
          console.info(
            '* Connected to '
          + program.location.hostname
          + ' (' + addr + ') port '
          + program.location.port
          + ' (#0)'
          );
          console.info(
            '> ' + (reqOpts.method || 'GET')
          + ' ' + program.location.path
          + ' HTTP/1.1' // How to be sure?
          );
          Object.keys(reqOpts.headers).forEach(function (key) {
            var val = reqOpts.headers[key];
            console.info('> ' + key + ': ' + val);
          });
          console.info('>');
          console.info('< HTTP/' + resp.httpVersion + ' ' + resp.statusCode + ' ' + resp.statusMessage);
          resp.rawHeaders.forEach(function (header, i) {
            console.info('< ' + header + ': ' + resp.rawHeaders.splice(i + 1, 1));
          });
          console.info('< ');
          //< HTTP/1.1 200 OK
          //< Connection: close
          //< Content-Type: text/html; charset=utf-8
          //< Date: Sat, 15 Oct 2016 04:34:38 GMT
          //< Content-Length: 222
          //<
        }

        resp.on('data', function (chunk) {
          chunks.push(chunk);
        });

        resp.on('end', function () {
          fn(null, Buffer.concat(chunks).toString('binary'));
          if (program.verbose) {
            console.info('* Closing connection 0');
          }
        });
      });
      req.on('error', function (err) {
        fn(err);
      });
      req.end();

    });
  });
};
