(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Displays category description from service item if it exists for the current category
        var descriptionId = $('div.category-description').data("description-id");
        getDescription(descriptionId);
        function getDescription(descriptionId) {
            // Set vars
            var descriptionContainer = 'div.category-description';
            var loader = 'div#loader';
            if(descriptionId) {
                BUNDLE.ajax({
                   cache: false,
                   type: "get",
                   url: BUNDLE.applicationPath + "DisplayPage?srv=" + encodeURIComponent(descriptionId),
                   beforeSend: function(jqXHR, settings) {
                        $(loader).show();
                   },
                   success: function(data, textStatus, jqXHR) {
                       $(loader).hide();
                       $(descriptionContainer).html(data).show();
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                       // A 401 response will be handled by the BUNDLE.ajax function
                       // so we will not handle that response here.
                       if (jqXHR.status !== 401) {
                           $(loader).hide();
                           $(descriptionContainer).html("Could not load description.")
                       }
                   }
                });
            } else {
                $(descriptionContainer).show();
            }
        }
    });
})(jQuery, _);