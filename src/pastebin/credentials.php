<?php
	class Credentials {
		const API_DEVELOPER_KEY = "";
		const API_USERNAME = "";
		const API_PASSWORD = "";

		public function __construct() {			
		}
		
		public static function getApiDeveloperKey() {
			return self::API_DEVELOPER_KEY;
		}

		public static function getApiUsername() {
			return self::API_USERNAME;
		}

		public static function getApiPassword() {
			return self::API_PASSWORD;
		}
	}
?>