jsURL
=====

A cURL clone written in node.js

```bash
npm install -g jsurl-cli
```

```bash
jsurl https://www.google.com/foo.txt
```

Supported Options
-----------------

```
Usage: jsurl [options...] <url>

Options: (H) means HTTP/HTTPS only, (F) means FTP only

  -h, --help           output usage information
  -V, --version        output the version number

  -4 --ipv4            Resolve name to IPv4 address
  -6 --ipv6            Resolve name to IPv6 address
  -k --insecure        Allow connections to SSL sites without certs (H)
  -X --request METHOD  Specify request method to use (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, etc)
  -H --header LINE     Pass custom header LINE to server (H)
  -o --output FILE     Write to FILE instead of stdout
  -O --remote-name     Write output to a file named as the remote file
  -v --verbose         Make the operation more talkative
```

What about all the other options?
------------------

Add one, pull request it, and I'll merge it in!

Otherwise I'll just add them here and there as I begin to use jsURL in place of cURL and find that I need them.

Why?
----

`curl` on OS X doesn't send `servername` via `sni` when `-k` (`--insecure`) is used
so I started copying over functionality that I use.
