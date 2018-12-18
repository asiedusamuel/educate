<?php
class Utils{
	const SESS_CIPHER = 'aes-128-cbc';
    private static $skey = "324\/Text\/Encryptionv01"; // change this
	static public function sanitize($var){
		$str =& $var;
		$search = array("\\",  "\x00", "\n",  "\r",  "'",  '"', "\x1a");
		$replace = array("\\\\","\\0","\\n", "\\r", "\'", '\"', "\\Z");    
		return str_replace($search, $replace, $str);
	}
	/**
	*	Encode
	*	---------------
	*	Encode a decoded content.
	*/
	public static function encode($value){ 
        if(!$value){return false;}
        // Get the MD5 hash salt as a key.
        $key = self::$skey;
        // For an easy iv, MD5 the salt again.
        $iv = self::_getIv();
        // Encrypt the session ID.
        $ciphertext = openssl_encrypt($value, self::SESS_CIPHER, $key, $options=OPENSSL_RAW_DATA, $iv);
        // Base 64 encode the encrypted session ID.
        $encryptedSessionId = base64_encode($ciphertext);
        // Return it.
        return $encryptedSessionId;
    }
    private function _getIv() {
        $ivlen = openssl_cipher_iv_length(self::SESS_CIPHER);
        return substr(md5(self::$skey), 0, $ivlen);
	}
	/**
	* Decode
	* -------------
	* Decode a encoded content
	*/
    public static function decode($value){
        $key = self::$skey;
        // Get the iv.
        $iv = self::_getIv();
        // Decode the encrypted session ID from base 64.
        $decoded = base64_decode($value, TRUE);
        // Decrypt the string.
        $decryptedSessionId = openssl_decrypt($decoded, self::SESS_CIPHER, $key, $options=OPENSSL_RAW_DATA, $iv);
        // Trim the whitespace from the end.
        $session_id = rtrim($decryptedSessionId, '\0');
        // Return it.
        return $session_id;
    }
    
}