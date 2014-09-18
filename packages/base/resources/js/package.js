(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // This fix will correct the extra spacing created after the section header
        // because of the section header css of top -20px
        $('div.sectionHeader').next().css('margin', '-15px 0 0 0');
    });
    
    /*----------------------------------------------------------------------------------------------
     * PACKAGE INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create a scoped alias to simplify references
    var package = BUNDLE.package;
    
    // Bundle js function for loading the review request iframe
    // This function is able to determine when the iframe url has finished loading
    package.loadIframe = function(iFrameSelector, loaderSelector) {
        // Confirm if the csrv is stored as a data attribute
        if(typeof $(iFrameSelector).data('originating-csrv') != 'undefined') {
            var csrv = $(iFrameSelector).data('originating-csrv');
        } else {
            var csrv = clientManager.customerSurveyId;
        }
        $(iFrameSelector).attr('src', BUNDLE['applicationPath']+'ReviewRequest?csrv='+csrv+'&reviewPage=/'+BUNDLE['relativePackagePath']+'reviewFrame&loadAllPages=false&excludeByName=Review%20Page&noCache='+(new Date().getTime()));
        $(iFrameSelector).load(function() {
            $(loaderSelector).hide();
            $('#instructions').show();
            $('input[type="button"]').show();
            $(iFrameSelector).css({'visibility':'visible'});
        });
    };
})(jQuery, _);