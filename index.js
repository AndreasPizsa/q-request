var https = require('https');
var http = require('http');
var Q = require('q');

/**
 * Simple promise wrapper for http.request and https.request
 *
 * @private
 * @param  {String} method GET or POST
 * @param  {Object} options
 * @return {Promise}
 */
function makeRequest(method, options) {

  var deferred = Q.defer();
  var protocol = options.secure === true ? https : http;
  var chunks = [];
  var request;

  // GET or POST
  options.method = method;

  // create the request object (this does not make the request)
  request = protocol.request(options, function(response) {

    // this project is only concerned with utf8
    response.setEncoding('utf8');

    // collect the data as it comes in then resolve promise once we have it all
    response.on('data', chunks.push.bind(chunks)).on('end', function() {
      deferred.resolve(chunks.join(''));
    });

  });

  // set POST body
  if (options.body) {
    request.write(options.body);
  }

  request.on('error', function(error) {
    deferred.reject(error);
  });

  // make the request
  request.end();

  return deferred.promise;
}

module.exports = {

  /**
   * Promise wrapper for http://nodejs.org/api/http.html and http://nodejs.org/api/https.html.
   * All original options are supported, plus these additional ones.
   * Encoding is set to "utf8".
   *
   * @param  {Object} options.body
   * @param  {Boolean} [options.secure=false]
   * @return {Promise}
   */
  post: makeRequest.bind(null, 'POST'),

  /**
   * Promise wrapper for http.request and https.request
   * All original options are supported, plus these additional ones.
   * Encoding is set to "utf8".
   *
   * @param  {Boolean} [options.secure=false]
   * @return {Promise}
   */
  get: makeRequest.bind(null, 'GET')

};
