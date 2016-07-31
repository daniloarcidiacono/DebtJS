<?php
	class StringUtils {	
		
		/**
		 * Determine if a given string starts with a given substring.
		 * Ripped from: https://github.com/laravel/framework/blob/4.2/src/Illuminate/Support/Str.php
		 *
		 * @param  string  $haystack
		 * @param  string|array  $needles
		 * @return bool
		 */
		public static function startsWith($haystack, $needles) {
			foreach ((array) $needles as $needle) {
				if ($needle != '' && strpos($haystack, $needle) === 0) return true;
			}
			return false;
		}
	}
?>