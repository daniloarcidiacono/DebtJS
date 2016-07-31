<?php
	include('utils/stringutils.php'); // FIXME: This works only because this file is included from the root!
	include('pastebinclientexception.php');

	class PastebinClient {

		// Pastebin's shitty API always returns 200 as http code, even if the operation has failed.
		// So we must check for the response to start with "Bad API request"
		const API_ERROR_HEADER = "Bad API request";

		// The api_user_key is generated upon login
		private $api_user_key;

		// The credentials object
		private $credentials;

		public function __construct($credentials) {
			$this->credentials = $credentials;
			$this->api_user_key = NULL;
		}

 		/**
 		 * Tries to login to PasteBin in order to obtain the api user key.
 		 *
 		 * @throws PasteBinLoginFailedException if operation fails
 		 */
		public function login() {
			// Don't login again if we already had
			if (!is_null($this->api_user_key)) {
				return;				
			}

			$api_dev_key 		= $this->credentials->getApiDeveloperKey();
			$api_user_name 		= $this->credentials->getApiUsername();
			$api_user_password 	= $this->credentials->getApiPassword();
			$api_user_name 		= urlencode($api_user_name);
			$api_user_password 	= urlencode($api_user_password);
			$url				= 'http://pastebin.com/api/api_login.php';
			$ch					= curl_init($url);

			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_dev_key='.$api_dev_key.'&api_user_name='.$api_user_name.'&api_user_password='.$api_user_password.'');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_NOBODY, 0);

			$response = curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);

			// Check for success
			if ($httpcode != 200 || StringUtils::startsWith($response, self::API_ERROR_HEADER)) {
				throw new PasteBinLoginFailedException($response);
			}

			// Success
			$this->api_user_key = $response;
		}

		/**		
 		 * Logs out from PasteBin
 		 */
		public function logout() {
			$this->api_user_key = NULL;
		}

		/**
		 * Creates a new (private, json) paste having the given name and contents.
		 *
		 * @throws PasteBinNotLoggedInException if the login() method has not been called before.
		 * @throws PasteBinClientException if the creation of the paste fails for some other reason.
		 * @return the paste key of the created paste (ex. http://pastebin.com/UIFdu235s -> UIFdu235s)
		 */
		public function newPaste($name, $contents) {
			// Check that we have logged in
			if (is_null($this->api_user_key)) {
				throw new PasteBinNotLoggedInException();
			}

			$api_dev_key 			= $this->credentials->getApiDeveloperKey(); // your api_developer_key
			$api_paste_code 		= $contents; // your paste text
			$api_paste_private 		= '2'; // 0=public 1=unlisted 2=private
			$api_paste_name			= $name; // name or title of your paste
			$api_paste_expire_date 	= 'N'; //10M = 10 minutes
			$api_paste_format 		= 'json';
			$api_user_key 			= $this->api_user_key; // if an invalid api_user_key or no key is used, the paste will be create as a guest
			$api_paste_name			= urlencode($api_paste_name);
			$api_paste_code			= urlencode($api_paste_code);

			$url = 'http://pastebin.com/api/api_post.php';
			$ch	= curl_init($url);

			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_option=paste&api_user_key='.$api_user_key.'&api_paste_private='.$api_paste_private.'&api_paste_name='.$api_paste_name.'&api_paste_expire_date='.$api_paste_expire_date.'&api_paste_format='.$api_paste_format.'&api_dev_key='.$api_dev_key.'&api_paste_code='.$api_paste_code.'');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_NOBODY, 0);

			$response = curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);			
			curl_close($ch);

			// Check for success
			if ($httpcode != 200 || StringUtils::startsWith($response, self::API_ERROR_HEADER)) {
				throw new PasteBinClientException($response);
			}

			// Success, return the paste key
			// Strip the url (http://stackoverflow.com/questions/13041282/pastebin-api-paste-data/16245075#16245075)
			return str_replace("http://pastebin.com/", "", $response);

		}

		/**
		 * Gets the raw content of the specified paste
		 * Example: http://pastebin.com/UIFdu235s,  $pasteKey = UIFdu235s
		 *
		 * @throws PasteBinNotLoggedInException if the login() method has not been called before.
		 * @throws PasteBinClientException if the creation of the paste fails for some other reason.
		 * @return the raw content of the paste
		 */
		public function getRawPaste($pasteKey) {
			// Check that we have logged in
			if (is_null($this->api_user_key)) {
				throw new PasteBinNotLoggedInException();
			}

			$api_dev_key 		= $this->credentials->getApiDeveloperKey();
			$api_user_key 		= $this->api_user_key;
			$api_paste_key 		= $pasteKey;
			$url = 'http://pastebin.com/api/api_raw.php';
			$ch = curl_init($url);

			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_option=show_paste&api_user_key='.$api_user_key.'&api_dev_key='.$api_dev_key.'&api_paste_key='.$api_paste_key);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_NOBODY, 0);

			$response  		= curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);			
			curl_close($ch);

			// Check for success
			if ($httpcode != 200 || StringUtils::startsWith($response, self::API_ERROR_HEADER)) {
				throw new PasteBinClientException($response);
			}

			// Success, return the raw data
			return $response;
		}

		/**
		 * Lists the current pastes.
		 *
		 * @throws PasteBinNotLoggedInException if the login() method has not been called before.
		 * @throws PasteBinClientException if the creation of the paste fails for some other reason.
		 * @return An array of paste keys (objects containing name and key)
		 */
		public function listPasteKeys() {
			// Check that we have logged in
			if (is_null($this->api_user_key)) {
				throw new PasteBinNotLoggedInException();
			}

			$api_dev_key 		= $this->credentials->getApiDeveloperKey();
			$api_user_key 		= $this->api_user_key;
			$api_results_limit 	= '100';
			$url = 'http://pastebin.com/api/api_post.php';
			$ch = curl_init($url);

			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_option=list&api_user_key='.$api_user_key.'&api_dev_key='.$api_dev_key.'&api_results_limit='.$api_results_limit.'');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_NOBODY, 0);

			$response  		= curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);			
			curl_close($ch);

			// Check for success
			if ($httpcode != 200 || StringUtils::startsWith($response, self::API_ERROR_HEADER)) {
				throw new PasteBinClientException($response);
			}


			// Success (the returned XML (?!?) is not even well formed)			
			$response = "<pastes>" . $response . "</pastes>";

			// We need to parse the XML and extract the paste_keys
			$keys = array();

			// Parse
			$xml = simplexml_load_string($response);
			foreach ($xml as $value) {
				$entry = new stdClass;
				$entry->name = (string)$value->paste_title;
				$entry->key = (string)$value->paste_key;
				array_push($keys, $entry);
			}

			// Return the keys only
			return $keys;
		}

		/**
		 * Deletes the specified paste
		 * Example: http://pastebin.com/UIFdu235s,  $pasteKey = UIFdu235s
		 *
		 * @throws PasteBinNotLoggedInException if the login() method has not been called before.
		 * @throws PasteBinClientException if the removal of the paste fails for some other reason.
		 */
		public function deletePaste($pasteKey) {
			// Check that we have logged in
			if (is_null($this->api_user_key)) {
				throw new PasteBinNotLoggedInException();
			}

			$api_dev_key 		= $this->credentials->getApiDeveloperKey();
			$api_user_key 		= $this->api_user_key;
			$api_paste_key 		= $pasteKey;
			$url = 'http://pastebin.com/api/api_post.php';
			$ch = curl_init($url);

			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, 'api_option=delete&api_user_key='.$api_user_key.'&api_dev_key='.$api_dev_key.'&api_paste_key='.$api_paste_key.'');
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_NOBODY, 0);

			$response  		= curl_exec($ch);
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);			
			curl_close($ch);

			// Check for success
			if ($httpcode != 200 || StringUtils::startsWith($response, self::API_ERROR_HEADER)) {
				throw new PasteBinClientException($response);
			}
		}		
	}
?>