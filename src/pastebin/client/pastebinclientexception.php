<?php
    /**
     * Root exception thrown by PasteBinClient
     */
    class PasteBinClientException extends Exception
    {
        // Redefine the exception so message isn't optional
        public function __construct($message, $code = 0, Exception $previous = null) {
            // make sure everything is assigned properly
            parent::__construct($message, $code, $previous);
        }

        // custom string representation of object
        public function __toString() {
            return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
        }
    }

    /**
     * Exception thrown when the login process fails horribly
     */
    class PasteBinLoginFailedException extends PasteBinClientException {        
    }

    /**
     * Exception thrown when the user invokes a protected operation without having been logged
     */
    class PasteBinNotLoggedInException extends PasteBinClientException {
    }
?>