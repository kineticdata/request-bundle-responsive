(function($) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        package.dropDown();
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
    
    /**
     * Initializes the dropdown menus
     * @returns {undefined}
     */
    package.dropDown = function() {
        $("li.dropdown-toggle").hover(
            function() { 
                $(this).find('.dropdown-menu.dropdown-menus').slideToggle(400);
                $(this).find('.dropdown-toggle').addClass('background-gradient-primary');
            },
            function() { 
                $(this).find('.dropdown-menu.dropdown-menus').hide(); 
                $(this).find('.dropdown-toggle').removeClass('background-gradient-primary');
            }
        );
    };
    
    /**
     * Initializes the flyout menus
     * @returns {undefined}
     */
    package.flyout = function() {
        var firstHover = true;
        $('ul.dropdown-menu.dropdown-menus').on({
            mouseenter: function() {
                if (firstHover) {
                    firstHover = false;
                    // Animate flyout
                    $('.flyout').animate({ width: '640px' });
                } else {
                    // Show flyout
                    $('nav ul.dropdown-menu.dropdown-menus').show();
                    $('.flyout').width('640px');
                }
                $('.subcats-wrap').show();
                $('.subcats').empty().html($(this).find('ul.subcategories').html()).show();
                $('.subcats').append($(this).find('.category-image').html());
                $('.flyout-table').removeClass('exposed-skin');
            }
        }, 'li.category');

        $('nav ul.nav li.dropdown').on({
            mouseenter: function() {
                // Show flyout table with root cats
                $('nav ul.dropdown-menu.dropdown-menus').show();
                $(this).addClass('nav-hover');
                $(this).find('i.nav-sprite').css({'background-position':'-127px -22px'});
            },
            mouseleave: function() {
                // Reset first hover to true so animation will work again
                firstHover = true; 
                // Reset flyout
                $('.flyout').width('250px' );
                $('.subcats-wrap').hide();
                $('.flyout-table').addClass('exposed-skin');
                // Reset drop down and dropdown flyout table
                $('nav ul.nav li.dropdown').removeClass('nav-hover');
                $('i.nav-sprite').css({'background-position':'-127px -12px'});
                $('nav ul.dropdown-menu.dropdown-menus').hide();
                $('.subcats-wrap').hide();
                $('.flyout-table').addClass('exposed-skin');
            }
        });
    };
});