var googleAuth = require('google-oauth-jwt');
var request = require('request');
var debug = require('debug')('google-oauth-jwt');

// constants
var GOOGLE_OAUTH2_URL = 'https://accounts.google.com/o/oauth2/token';

var options = {
 email: 'zlsuser@exeter2-156315.iam.gserviceaccount.com',
  keyFile: 'zls.pem',
  scopes: ['zlsuser@exeter2-156315.iam.gserviceaccount.com']
};

googleAuth.encodeJWT(options, function (err, jwt) {

                if (err) 
			return console.log(err);

                return request.post(GOOGLE_OAUTH2_URL, {
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        form: {
                                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                                assertion: jwt
                        }
                }, function (err, res, body) {

                        if (err) {
                                return console.log(err);
                        } else {
                                debug('response from OAuth server: HTTP %d -> %j', res.statusCode, body);
                        }

                        try {
                                body = JSON.parse(body);
                        }
                        catch (e) {
                                return console.log(new Error('failed to parse response body: ' + body));
                        }

                        if (res.statusCode != 200) {
                                err = new Error(
                                        'failed to obtain an authentication token, request failed with HTTP code ' +
                                        res.statusCode + ': ' + body.error
                                );
                                err.statusCode = res.statusCode;
                                err.body = body;
                                return console.log(err);
                        }

			console.log(body);

                        return (null, body);

                });
	});
