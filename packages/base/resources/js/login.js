jQuery(document).ready(function() {
	// Focus user name
    jQuery('input[name="UserName"]').focus();
    jQuery('#login-form').on('submit', function(event) {
        // This will display the loader.
        jQuery('#loader.hidden').show();
    });
});