q-request
=========

Simple promise wrapper for http.request and https.request.

## Installation

    $ npm install -d q-request

## Usage

    var qRequest = require('q-request');

    qRequest.get({
      hostname: 'raw.github.com',
      path: '/JamieMason/q-request/master/package.json',
      secure: true
    }).then(function(body) {
      console.log(body);
    });
