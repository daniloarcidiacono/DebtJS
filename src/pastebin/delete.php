<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-type: text/plain");

	// read.php?id=fsiad23
	try {
		include('credentials.php');
		include('client/pastebinclient.php');
		include('utils/restutils.php');
		
		// Check the http verb
		if (RESTUtils::checkHttpVerb('DELETE')) {
			return;
		}

		// Check that the id is set
		if (!isset($_GET["id"])) {
			http_response_code(400);
			echo "Missing id query parameter";
			return;
		}

		$id = $_GET['id'];

		$client = new PasteBinClient(new Credentials());
		$client->login();
		$rawPaste = $client->deletePaste($id);

		// Success, send back the paste url
		http_response_code(200);
		echo $rawPaste;
	} catch (Exception $e) {
		http_response_code(500);
		echo $e->getMessage();
	}
?>