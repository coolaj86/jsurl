#!/usr/bin/env node
(function () {
'use strict';

var program = require('commander');
var fs = require('fs');
var url = require('url');
var pkg = require('../package.json');
var num;

function collectHeaders(val, memo) {
  memo.push(val);
  return memo;
}

program
  .version(pkg.version)
  //.command('jsurl <url>')
  .arguments('<url>')
  .action(function (url) {
    program.url = url;
  })
  .option('-4 --ipv4', 'Resolve name to IPv4 address')
  .option('-6 --ipv6', 'Resolve name to IPv6 address')
  .option('-k --insecure', 'Allow connections to SSL sites without certs (H)')
  .option('-X --request <METHOD>', 'Specify request method to use (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, etc)')
  .option('-H --header <LINE>', 'Pass custom header LINE to server (H)', collectHeaders, [ ])
  .option('-o --output <FILE>', 'Write to FILE instead of stdout')
  .option('-O --remote-name', 'Write output to a file named as the remote file')
  .option('-v --verbose', 'Make the operation more talkative')
  .parse(process.argv)
  ;

program.request = program.request || 'GET';

function out(str) {
  var fs = require('fs');

  if (program.output) {
    console.log("output saved to '" + program.output + "'");
    fs.writeFileSync(program.output, str, 'binary');
  }
  else {
    console.log(str);
  }
}

program.location = url.parse(program.url);
if (!program.location.protocol) {
  program.url = 'https://' + program.url;
  program.location = url.parse(program.url);
}

if (program.remoteName) {
  if (program.output) {
    // TODO choose one or the other
  }
  program.output = program.location.pathname.replace(/.*\//, '');
  if (!program.output) {
    console.error("curl: Remote file name has no length!");
    console.error("curl: try 'curl --help' or 'curl --manual' for more information");
    process.exit(1);
  }
}

if (program.output) {
  // foo.txt, foo.txt.1, foo.txt.2, etc
  while (fs.existsSync(program.output)) {
    num = parseInt(program.output.replace(/.*?(\.\d+)?$/, '$1').substr(1), 10) || 0;
    num += 1;
    program.output = program.output.replace(/(\.\d+)?$/, '.' + num);
  }
}

require('../lib/jsurl.js').curl(program, function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  if (data) {
    out(data);
  }
});

}());
