<?php
	class RESTUtils {	

		/**
		 * Check that an endpoint has been invoked with the specified http verb.
		 *
		 * @param  string  $httpVerb
		 * @return boolean TRUE if the request has been absorbed, false otherwise.
		 */
		public static function checkHttpVerb($httpVerb)  {
			// Options (http://stackoverflow.com/questions/11926908/how-to-respond-to-an-http-options-request)
			if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
				http_response_code(200);
				header("Allow: " . $httpVerb);
				header("Access-Control-Allow-Methods: " . $httpVerb);
				header("Access-Control-Allow-Headers: Content-Type");
				return true;
			}

			// Check the http verb
			if ($_SERVER['REQUEST_METHOD'] != $httpVerb) {
				// http://stackoverflow.com/questions/28086582/return-code-for-wrong-http-method-in-rest-api
				http_response_code(405);
				echo "This endpoint accepts only " . $httpVerb . " requests";
				return true;
			}

			return false;
		}
	}
?>