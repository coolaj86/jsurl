jsURL
=====

A cURL clone written in node.js

```bash
npm install -g jsurl
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

  -k --insecure        Allow connections to SSL sites without certs (H)
  -X --request METHOD  Specify request method to use (GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, etc)
  -H --header LINE     Pass custom header LINE to server (H)
  -o --output FILE     Write to FILE instead of stdout
  -O --remote-name     Write output to a file named as the remote file
```

Why?
----

`curl` on OS X doesn't send `servername` via `sni` when `-k` (`--insecure`) is used
so I started copying over functionality that I use.
