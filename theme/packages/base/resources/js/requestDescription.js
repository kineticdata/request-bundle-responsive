(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        if($('[label="Description Right"]').exists()) {
            $('[label="Description Right"]').append($('a.create-request').show('fade', 1000));
        } else {
            $('a.create-request').show('fade', 1000);
        }
    });
})(jQuery, _);