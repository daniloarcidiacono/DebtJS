<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/plain");

	// list.php
	try {
		include('credentials.php');
		include('client/pastebinclient.php');
		include('utils/restutils.php');
		
		// Check the http verb
		if (RESTUtils::checkHttpVerb('GET')) {
			return;
		}

		$client = new PasteBinClient(new Credentials());
		$client->login();
		$pasteKeys = $client->listPasteKeys();

		// Success, send back the paste keys
		http_response_code(200);
		echo json_encode($pasteKeys);
	} catch (Exception $e) {
		http_response_code(500);
		echo $e->getMessage();
	}
?>