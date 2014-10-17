(function($) {
    /*----------------------------------------------------------------------------------------------
     * AJAX LOGIN INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    
   /**
    * This function essentially wraps the jQuery.ajax() function as to provide
    * support for an ajax login.  It works by adding a special callback handler
    * (defined below) that is called when the ajax call returns a 401 status code.
    * After adding the callback handler it simply calls the jQuery.ajax() function
    * with the options it was passed.
    * 
    * @param {Object} jQuery ajax options
    * @returns {undefined}
    */
    BUNDLE.ajax = function(options) {
        // Ensure status code exists
        options['statusCode'] = options['statusCode'] || {};
        // Determine if the 401 callback is undefined
        if(options['statusCode'][401] === undefined) {
            // Define default 401 callback
            options['statusCode'][401] = function() {
                // Determine if an SSO url is defined
                if(BUNDLE.config.ssoIframeUrl) {
                    // Define iframe
                    var iframe = $('<iframe>').addClass('SSO hide').attr('src', BUNDLE.config.ssoIframeUrl);
                    // Append hidden iframe
                    $('body').append(iframe);
                    // Attempt to authenticate user through SSO with iframe
                    $(iframe).load(function() {
                        try {
                            // Attempt to parse for a JSON response
                            $.parseJSON(iframe.contents().find('body').text());
                            // No parse exception caught
                            // Run previous ajax request again
                            BUNDLE.ajax(options);
                            // Remove iframe
                            iframe.remove();
                        } catch(e) {
                            // Fallback to client login form
                            BUNDLE.ajaxLogin(options);
                            // Remove iframe
                            iframe.remove();
                        }
                    });
                }
                // Fallback to client login form
                else {
                    BUNDLE.ajaxLogin(options);
                }
           };
       }
       // Make request
       $.ajax(options);
   };

    /**
     * This function is meant to be a callback handler for an ajax call that returns
     * a 401 status code.  It creates and displays a login dialog.  When the user
     * fills out the login form it sends a post to the kinetic authentication
     * servlet.  If the authentication is successful it will attempt the original
     * call, if not it will display the login dialog again.
     * 
     * @param {Object} jQuery ajax options
     * @returns {undefined}
     */
    BUNDLE.ajaxLogin = function(options) {
        // Define login form
        var loginForm = $('<form>').attr('action', 'KSAuthenticationServlet');
        // Define username input attributes
        var userNameAttributes = {
            'name': 'UserName',
            'type': 'text',
            'autocomplete': 'off',
            'placeholder': 'Username'
        };
        // Append user name input
        loginForm.append($('<input>').attr(userNameAttributes).addClass('form-control'));
        // Define password input attributes
        var passwordAttributes = {
            'name': 'Password',
            'type': 'password',
            'autocomplete': 'off',
            'placeholder': 'Password'
        };
        // Append password input
        loginForm.append($('<input>').attr(passwordAttributes).addClass('form-control'));
        // Start dialog with login form
        loginForm.dialog({
            dialogClass: 'no-close',
            title: 'Please Login To Continue',
            width: 342,
            modal: true,
            closeOnEscape: false,
            open: function(event, ui) {
                // Hide close button
                $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
            },
            buttons : {
                'Log In': function() {
                    loginForm.dialog('close');
                    loginForm.remove();
                    $.ajax({
                        type: 'post',
                        url: loginForm.attr('action'),
                        data: loginForm.serialize(),
                        success: function() { BUNDLE.ajax(options); },
                        error: function() { BUNDLE.ajaxLogin(options); }
                    });
                }
            }
        });
    };

})(jQuery);