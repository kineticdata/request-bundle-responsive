(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Define submission group name hash
        submissions.status = decodeURI(document.location.hash.substr(1));
        // Define how many entries maximum should display
        submissions.entryOptionSelected = 11;
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
                submissions.status = 'Open Request';
            } else {
                 submissions.status = 'Pending Approval';
            }
            // Update hash
            document.location.hash = encodeURI(submissions.status);
        }
        // Active link class
        var activeNavSelector = $('ul li.requests');
        if(urlParameters.type === 'approvals') { activeNavSelector = $('ul li.approvals'); };
        activeNavSelector.addClass('active').append($('<div>').addClass('arrow-left'));
        // Set active link
        $('header a[data-group-name="' + submissions.status + '"]').parents('li').addClass('active');
        // Position scroll for small devices
        var activeLinkPosition = $('header.sub div.container > ul li.active').position();
        if(activeLinkPosition !== undefined && activeLinkPosition.left !== undefined) { $('header.sub div.container > ul').scrollLeft(activeLinkPosition.left); }
        // Get console specific properties
        var params = submissions.consoleParams[submissions.status];
        // Start table
        submissions.initialize(params, submissions.status, submissions.entryOptionSelected);
        
        // Click event for each submissions bucket
        $('header.sub').on('click', 'ul li a', function(event) {
            event.preventDefault();
            var submissionGroupName = $(this).data('group-name');
            // Update hash
            document.location.hash = encodeURI(submissionGroupName);
            // Update status
            submissions.status = submissionGroupName;
            // Try to destroy console
            // This allows the console to be initialized again
            try { $('div.results').consoleList('destroy'); } catch(exception) { /* Do nothing */ }
            // Get console specific properties
            var params = submissions.consoleParams[submissions.status];
            // Start table
            submissions.initialize(params, submissions.status, submissions.entryOptionSelected);
            // Clear all active links
            $('header.sub div.container ul li').removeClass('active');
            // Set active link
            $('header a[data-group-name="' + submissions.status + '"]').parents('li').addClass('active');
        });
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