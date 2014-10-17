(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Define params
        var params = BUNDLE.common.getUrlParameters();
        // Determine if q exists
        if(params['q']) {
            // Update oage title
            $('title').append("for '" + $.trim(params['q']) + "'");
        }
    });
})(jQuery, _);