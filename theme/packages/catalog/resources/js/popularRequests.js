(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Adds an active style to the popular requests
        $('ul li.popular-requests').addClass('active').append($('<div>').addClass('arrow-left'));
    });
})(jQuery, _);