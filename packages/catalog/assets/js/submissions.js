(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Store original title in memory
        var originalTitle = document.title;
        // Define Hashchange event for each submissions bucket
        $(window).on('hashchange', function()  {
            // Update submissions status
            submissions.status = decodeURI(document.location.hash.substr(1));
            // Try to destroy console
            // This allows the console to be initialized again
            try { $('div.results').consoleList('destroy'); } catch(exception) { /* Do nothing */ }
            // Start console
            submissions.initialize({
                'status': submissions.status,
                'entryOptionSelected': 10 // Define how many entries should display on load
            });
            // Clear all active links
            $('header.sub div.container ul li').removeClass('active');
            // Set active link
            $('header a[data-group-name="' + submissions.status + '"]').parents('li').addClass('active');
            // Set title based on active link
            document.title = originalTitle + $.trim($('header.sub div.container ul li.active').text());
        });

        // Define submission group name hash
        submissions.status = decodeURI(document.location.hash.substr(1));
        // Get query string parameters into an object
        var urlParameters = BUNDLE.common.getUrlParameters();
        // Determine if type is a real type
        if(urlParameters.type !== 'requests' && urlParameters.type !== 'approvals') {
            urlParameters.type = 'requests';
        }
        // Determine if the status is a real status
        var statusCheck = true;
        $.each(submissions.consoleParams, function(index) { 
            if(submissions.status === index) {
                statusCheck = false;
                return false;
            }
        });
        if(statusCheck) {
            if(urlParameters.type === 'requests') {
                submissions.status = 'Open Request'.localize();
            } else {
                 submissions.status = 'Pending Approval'.localize();
            }
            // Update hash
            document.location.hash = encodeURI(submissions.status);
        } else {
            // Trigger hashchange event defined above
            $(window).trigger('hashchange');
        }
    });
    
    /*----------------------------------------------------------------------------------------------
     * SUBMISSIONS INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create the submissions namespace
    BUNDLE.package.submissions = BUNDLE.package.submissions || {};
    // Create a scoped alias to simplify references
    var submissions = BUNDLE.package.submissions;
})(jQuery, _);