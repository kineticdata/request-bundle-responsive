(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Set some states
        $('ul li.catalog').addClass('active').append($('<div>').addClass('arrow-left'));
        $('ul.categories').append($('ul.root-category-data').html());

        // Selectors that are used quite a bit
        var breadcrumbs = 'nav.catalog ul.breadcrumbs';
        var templates = 'nav.catalog ul.templates';
        var templateDetails = 'nav.catalog div.template-details';
        var categories = 'nav.catalog ul.categories';

        // Click event for menus
        $(categories).on('click', 'li', function(event) {
            event.preventDefault();
            // Get current clicked category id and name
            var categoryId =  $(this).data('id');
            var categoryName =  $(this).data('name');
            // Find category's children and get the html
            var currentSubcategories = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.subcategory-data').html();
            // Display the category's children if not undefined
            currentSubcategories !== undefined ? $(categories).html(currentSubcategories) : $(categories).empty();
            // Find category's templates and get the html
            var currentTemplates = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.template-data').html();
            // Display the category's templates into div
            currentTemplates !== undefined ? $(templates).html(currentTemplates) : $(templates).empty();
            // Create new bread crumb with the category's information
            $(breadcrumbs).append(
                $('<li>').attr('data-id', $(this).data('id'))
                    .attr('data-name', $(this).data('name'))
                    .append(BUNDLE.localize($(this).data('name')))
                    .append(
                        $('<i>').addClass('fa fa-chevron-circle-left')
                    )
            ).show();
        });
        // Click event for template details
        $(templates).on('click', 'li', function(event) {
            event.preventDefault();
            // Clean up
            $(templates).empty();
            $(categories).empty();
            // Show details
            $(templateDetails).html($(this).find('div.template-details-data').html());
            // Create new bread crumb with the template's information
            $(breadcrumbs).append(
                $('<li>').attr('data-id', $(this).data('id'))
                    .attr('data-name', $(this).data('name'))
                    .append(BUNDLE.localize($(this).data('name')))
                    .append(
                        $('<i>').addClass('fa fa-chevron-circle-left')
                    )
            ).show();
        });

        // Click event for breadcrumbs
        $(breadcrumbs).on('click', 'li', function(event) {
            event.preventDefault();
            $(templateDetails).empty();
            // Get previous id
            var previousCategoryId = $(this).prev().data('id');
            // Check if root bread crumb is selected or prev undefined
            if(previousCategoryId === 'root' || previousCategoryId === undefined) {
                $(categories).html($('ul.root-category-data').html());
                $(templates).empty();
                if(previousCategoryId !== undefined) {
                    $(this).remove();
                }  
            } else {
                var currentSubcategories = $('ul.category-data li[data-id=' + previousCategoryId + ']').find('ul.subcategory-data').html();
                // Display the category's children if not undefined
                currentSubcategories !== undefined ? $(categories).html(currentSubcategories) : $(categories).empty();
                var currentTemplates = $('ul.category-data li[data-id=' + previousCategoryId + ']').find('ul.template-data').html();
                // Display the category's templates into div
                currentTemplates !== undefined ? $(templates).html(currentTemplates) : $(templates).empty();
                // Remove current breadcrumb
                $(this).remove();
            }
        });
        
        /*------------------------------------------------------------------------------------------
         * Tile UI
         *   Sets up links and labels for the tiles
         *----------------------------------------------------------------------------------------*/
        
        // Define tile link configuration
        var tileLinks = {
            'div.popular-requests': BUNDLE.config.package.links['popularRequests'], 
            'div.approvals': BUNDLE.config.package.links['approvals'],
            'div.requests': BUNDLE.config.package.links['requests']
        };
        // Loop through tile links and build data
        _.each(tileLinks, function(value, index) {
            // Setup splash page links
            var url = BUNDLE.config['displayPageUrlSlug'] + value['displayName'];
            // Define params if not defined
            var params = value.params || {};
            // Check size and append url params
            if(_.size(params) > 0) { url = url + '&' + $.param(params, true); }
            // Define title
            var tile = $(index);
            // Append url
            tile.find('a').attr('href', url);
            // Append label
            tile.find('div.label').text(BUNDLE.localize(value['label']));
            // Append description
            tile.find('div.helper-text').append(
                $('<div>').text(BUNDLE.localize(value['description']))
            );
            // Append icon
            tile.find('div.icon').append(value['icon']);
        });
    });

})(jQuery, _);