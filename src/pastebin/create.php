<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/plain");
	
	try {
		include('credentials.php');
		include('client/pastebinclient.php');
		include('utils/jsonutils.php');
		include('utils/restutils.php');

		// Check the http verb
		if (RESTUtils::checkHttpVerb('POST')) {
			return;
		}

		// http://stackoverflow.com/questions/3002165/echo-an-post-in-php
		// Read the JSON part
		$entityBody = file_get_contents('php://input');
		
		// Validate the body
		if (!JSONUtils::isValidJSON($entityBody)) {
			http_response_code(400);
			echo "The request body is not a valid JSON object";
			return;
		}

		// The request must have the following format:
    	//
		// { 
		//	 "title": "Paste title",
		//	 "content:" { ... content object ... } 
		// }
		$decoded = json_decode($entityBody);    
	    if (is_null($decoded) || !property_exists($decoded, 'title') || !property_exists($decoded, 'content')) {
 			http_response_code(400);
			echo "The request json body has not the proper format";
			return;
		}	
        
        // Create the paste
		$client = new PasteBinClient(new Credentials());
		$client->login();
		$url = $client->newPaste($decoded->title, json_encode($decoded->content));

		// Success, send back the paste url
		http_response_code(200);
		echo $url;
	} catch (Exception $e) {
		http_response_code(500);
		echo $e->getMessage();
	}
?>