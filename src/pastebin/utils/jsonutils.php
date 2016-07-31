<?php
	class JSONUtils {	

		/**
		 * Returns TRUE if the given string is a valid JSON object
		 *
		 * @param  string  $string
		 * @return bool
		 */
		public static function isValidJSON($string)  {
			return !is_null(json_decode($string));
		}
	}
?>