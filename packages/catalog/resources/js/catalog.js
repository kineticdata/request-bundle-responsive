$(document).ready(function() {
    var searchResult = '#search-result';
    var resultsFor = '#results-for';
    var msg = new Message();
    // Click event for search
    $('#catalogSearchForm').on('submit', function(event) {
        // Prevent default action.
        event.preventDefault();
        // Execute the ajax request.
        BUNDLE.ajax({
            cache: false,
            type: 'post',
            data: $(this).serialize(),
            url: $(this).attr('action'),
            beforeSend: function(jqXHR, settings) {
                before(jqXHR, settings)
            },
            success: function(data, textStatus, jqXHR) {
                success(data, textStatus, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                error(jqXHR, textStatus, errorThrown);
            }
        });
    });
    
    /**
     * Action functions for catalog search
     */
    function before(jqXHR, settings) {
        $(resultsFor).hide();
        // Retrieve the search value from the search input for validation
        var searchValue = $('input[name="query"]').val();
        // Blank validation
        if(!searchValue) {
            // Fail abort request
            jqXHR.abort();
            // Focus on input
            $('input[name="query"]').focus();
            // Message
            $(searchResult).html(msg.setMessage('Enter a search term in the field above').getBasicMessage()).show();
        } else {
            $('#content-box').hide();
            $('#loader').show();
        }
    }
    function success(data, textStatus, jqXHR) {
        var pattern = /id="search-success"/i;
        if(data.match(pattern)) {
            var searchValue = $('input[name="query"]').val();
            $(resultsFor).html(msg.setMessage("Results found for '"+searchValue+"'.").getRawMessage()).show();
        }
        $(searchResult).html(data).show();
        $('#loader').hide();
        $('#content-box').show();
    }
    function error(jqXHR, textStatus, errorThrown) {
        $(searchResult).html(msg.setMessage('There was an error. Try again.').getBasicMessage());
        $('#loader').hide();
        $('#content-box').show();
    }
});