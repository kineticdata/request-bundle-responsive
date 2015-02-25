(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        
        /*------------------------------------------------------------------------------------------
         * SMALL DEVICE NAVIGATION
         *----------------------------------------------------------------------------------------*/
        
        // Define content area that will need to shift
        // right for the slide in navigation.
        var contentSlide = $('div.content-slide');
        // Set to first time
        var firstToggleClick = true; 
        // Define scroll top positions
        var previousScrollTop = $(window).scrollTop();
        var currentScrollTop = '-' + $(window).scrollTop() + 'px';
        // Set click event for slide in navigation, which is used for devices with small screens (tablets and cell phones)
        $('button.fa-bars').on('click', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            // Turn off any previous one events to prevent stacking
            contentSlide.off('click');
            $(window).off('resize');
            // First click of the button?
            if(firstToggleClick) {
                firstToggleClick = false;
                // Update scroll top information
                previousScrollTop = $(window).scrollTop();
                currentScrollTop = '-' + $(window).scrollTop() + 'px';
                BUNDLE.common.startMobileNavigation(contentSlide, $(this).data('target'), currentScrollTop);
                // Create one reset display event for resize
                $(window).one('resize', function() {
                    // If the current active element is a text input, we can assume the soft keyboard is visible
                   if($(document.activeElement).attr('type') !== 'search') {
                        firstToggleClick = true;
                        BUNDLE.common.resetDisplay(contentSlide, contentSlide.data('target'), previousScrollTop);
                   }
                }); 
                // Create one reset display event on content slide
                contentSlide.one('click', function(event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    firstToggleClick = true;
                    BUNDLE.common.resetDisplay(this, $(this).data('target'), previousScrollTop); 
                });
            } else {
                firstToggleClick = true;
                BUNDLE.common.resetDisplay(contentSlide, $(this).data('target'), previousScrollTop);     
            }
        });    
        // Removes address bar in android and iphone devices
        if (BUNDLE.client.isIphone !== undefined && BUNDLE.client.isIphone ||
            BUNDLE.client.isAndroid !== undefined && BUNDLE.client.isAndroid) {
            addEventListener('load', function() {
                setTimeout(BUNDLE.common.hideUrlBar, 0);
            }, false);
        }
        
        /*------------------------------------------------------------------------------------------
         * PACKAGE SEARCH CONFIGURATION
         *   This code uses the current package's searchConfig to contextualize the search
         *   in the header based on the current package.
         *----------------------------------------------------------------------------------------*/
        
        // Create jquery object of portal search forms
        var portalSearch = $('form.portal-search');
        // Determine if package search available
        if(BUNDLE.config.package &&
            BUNDLE.config.package.searchConfig &&
            BUNDLE.config.package.searchConfig) {
            var searchConfig = BUNDLE.config.package.searchConfig;
            // Define action
            var action = BUNDLE.config['displayPageUrl'];
            // Set action
            portalSearch.attr({'action': action});
            // Set placeholder
            if(searchConfig['placeholder']) {
                portalSearch.find('input#search').attr({'placeholder': BUNDLE.localize(searchConfig['placeholder'])});
            }
            // Define params if not defined
            var params = searchConfig.params || {};
            // Check size
            if(_.size(params) > 0) {
                if(params['view'].length > 0) {
                    // Define hidden input
                    var viewInput = $('<input>').attr({
                        'type': 'hidden',
                        'name': 'view',
                        'value': params['view'][0]
                    });
                    // Add input to form
                    portalSearch.prepend(viewInput);
                }
            }
            // Check size
            if(_.size(params) > 0) {
                if(params['name'].length > 0) {
                    // Define hidden input
                    var nameInput = $('<input>').attr({
                        'type': 'hidden',
                        'name': 'name',
                        'value': BUNDLE.config['slug'] + params['name'][0]
                    });
                    // Add input to form
                    portalSearch.prepend(nameInput);
                }
            }
        }
    });

    /*----------------------------------------------------------------------------------------------
     * COMMON INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the common namespace
    BUNDLE.common = BUNDLE.common || {};
    // Create a scoped alias to simplify references to BUNDLE.common
    var common = BUNDLE.common;
    
    /*----------------------------------------------------------------------------------------------
     * COMMON FUNCTIONS
     *--------------------------------------------------------------------------------------------*/
    
    /**
     * Define loader handler JavaScript UI
     * 
     * @param {Object} options
     * @param {String} options.loaderImageUrl
     * @param {String} options.text
     * @param {String} options.cssClass
     * @returns {HTML}
     */
    common.loaderHandler = function(options) {
        // Define options
        options = options || {};
        options.cssClass = options.cssClass || '';
        options.text = options.text || 'Loading Results.';
        options.loaderImageUrl = options.loaderImageUrl || BUNDLE.config.loaderImageUrl;
        // Define loader
        var loader = $('<div>').addClass('loader ' + options.cssClass).append(
                $('<img>').prop({'alt': options.text, 'src': options.loaderImageUrl})
            ).append(
                $('<div>').addClass('text').text(options.text)
            );
        return loader.get(0).outerHTML;
    };
    
    /** 
     * Define message handler JavaScript UI
     * 
     * @param {String} messageType
     * @param {String} messageContent
     * @returns {String} message
     **/
    common.messageHandler = function(messageType, messageContent) {
        var message = $('<div>').addClass('message alert alert-' + messageType).append(
                $('<a>').addClass('close').attr({'data-dismiss':'alert'}).text('x')
        ).append(messageContent);
        return message.get(0).outerHTML;
    };

    /**
     * Builds the uri for exporting data to csv
     *
     * @example
     * // Define export data row
     * var exportDataRow = {'column1':'value1','column2':'value2','column3':'value3'};
     * // Add rows to export data
     * var exportData = [exportDataRow, exportDataRow, exportDataRow];
     * // Define column headers, the keys in the export data row above must match with the column header names
     * var columnHeaders = ['column1','column2','column3'];
     * // Call export function
     * uri = common.exportCsv(exportData,columnHeaders, true);
     * // Build anchor tag to csv export
     * var anchor = $('<a>').attr({
     *      'download': 'export.csv',
     *      'href': uri,
     *      'target': '_blank'
     *  }).text('download csv');
     * @param {Array} exportData one dimensional array of objects to be exported.
     * @param {Object} exportColumns one dimensional array of strings.
     * Each string is the name of a property of the objects contained in the array that are to be exported.
     * @param {Boolean} includeHeaders boolean indicating if the first row of the CSV should be the column names.
     * @returns {String} uri with data to export
     */
    common.exportCsv = function(exportData, exportColumns, includeHeaders) {
        includeHeaders = typeof includeHeaders !== 'undefined' ? includeHeaders : true;
        var csvData = [];
        if(exportData.length > 0 && exportColumns.length > 0) {
            // Determine if include headers is true
            if(includeHeaders) {
                csvData = [_.chain(exportData[0]).pick(exportColumns).keys().value().join(', ')];
            }
            _(exportData).each(function(element, index, list){
                csvData.push(_.chain(element).pick(exportColumns).values().value().join(', '));
            });
        }
        var output = csvData.join('\n');
        var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(output);
        return uri;
    };
     
    /**
     * Hides the url bar inside mobile devices
     * 
     * @returns {undefined}
     */
    common.hideUrlBar = function() {
        if (window.location.hash.indexOf('#') === -1) {
            window.scrollTo(0, 1);
        }
    };

    /**
     * @returns {Object} url parameters
     */
    common.getUrlParameters = function() {
        var searchString = window.location.search.substring(1)
            , params = searchString.split("&")
            , hash = {}
            ;

        for (var i = 0; i < params.length; i++) {
          var val = params[i].split("=");
          hash[unescape(val[0])] = unescape(val[1]);
        }
        return hash;
    };
    
    /**
     * @param {String} contentWrap selector
     * @param {String} menuWrap selector
     * @param {Integer} top
     * @returns {undefined}
     */
    common.startMobileNavigation = function(contentWrap, menuWrap, top) {
        // Disable click events on content wrap
        $(contentWrap).find('div.pointer-events').css({'pointer-events':'none'});
        $(contentWrap).find('header.main, header.sub').css({'left': '240px'});
        $(contentWrap).css({'position':'fixed', 'min-width':'480px', 'top': top, 'bottom':'0', 'right':'0', 'left':'240px'});
        $(menuWrap).show();
        // Set the scroll top again for navigation slide. This will not affect content wrap since it's position is now fixed.
        // @TODO might want to adjust based on which li is active $(window).scrollTop($(menuWrap).find('ul li.active').offset().top - 60);
        $(window).scrollTop(0);
    };
    
    /**
     * @param {String} contentWrap selector
     * @param {String} menuWrap selector
     * @param {Number} top
     * @returns {undefined}
     */
    common.resetDisplay = function(contentWrap, menuWrap, top) {
       $(contentWrap).find('header.main, header.sub').css({'left': '0'});
       $(contentWrap).css({'position':'static', 'left':'0', 'width':'auto', 'min-width':'0'});
       // Enable click events on content wrap
       $(contentWrap).find('div.pointer-events').css({'pointer-events':'auto'});
       $(menuWrap).hide();
       // Return scroll top to original state
       $(window).scrollTop(top);
    };
    
    /**
     * Live jQuery hover function.
     * The parent selector should contain the child DOM element (childSelector).
     * The parent selector allows the hover event to be live.
     * 
     * @param {String} parentSelector
     * @param {String} childSelector
     * @param {Function} mouseEnter
     * @param {Function} mouseLeave
     * @returns {undefined}
     */
    common.hover = function(parentSelector, childSelector, mouseEnter, mouseLeave) {
       $(parentSelector).on({
           mouseenter: function() {
               if(mouseEnter !== null) {
                   mouseEnter.call(this);
               }
           },
           mouseleave: function() {
               if(mouseLeave !== null) {
                   mouseLeave.call(this);
               }
           }
       }, childSelector);
    };
    
    /**
     * 
     * @param {String} email
     * @param {String} displaySelector
     * @returns {undefined}
     */
    common.gravatar = function(email, displaySelector) {
        var lowercaseEmail = email.toLocaleLowerCase();
        var md5 = $.md5(lowercaseEmail);
        var gravatarHtml = $('<img>').attr({'src':'https://secure.gravatar.com/avatar/' + md5 + '/','alt':'Profile Image'});
        $(displaySelector).append(gravatarHtml);
    };

    /**
     * 
     * @param {String} url
     * @param {String} displaySelector
     * @returns {undefined}
     */
    common.avatar = function(url, displaySelector) {
        var avatarHtml = $('<img>').attr({'src':url,'alt':'Profile Image'});
        $(displaySelector).append(avatarHtml);
    };

    /**
     * Used to prevent window scrolling without css
     * Using CSS can cause the window to adjust when the bar vanishes or reappears causing bad 
     * UI experience in some browsers.
     * If you want to scroll the element you're over and prevent the window to scroll,
     * you can pass a jQuery selector of the elemnt you want to allow to scroll
     * 
     * @param {String} excludingSelector, the DOM elment you want to 
     * @returns {undefined}
     */
    common.preventWindowScroll = function(excludingSelector) {
        if(excludingSelector) {
            $(excludingSelector).on('DOMMouseScroll mousewheel', function(ev) {
                var $this = $(this),
                    scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = $this.height(),
                    delta = (ev.type == 'DOMMouseScroll' ?
                        ev.originalEvent.detail * -40 :
                        ev.originalEvent.wheelDelta),
                    up = delta > 0;

                var prevent = function() {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ev.returnValue = false;
                    return false;
                }

                if (!up && -delta > scrollHeight - height - scrollTop) {
                    // Scrolling down, but this will take us past the bottom.
                    $this.scrollTop(scrollHeight);

                    return prevent();
                } else if (up && delta > scrollTop) {
                    // Scrolling up, but this will take us past the top.
                    $this.scrollTop(0);
                    return prevent();
                }
            });
        } else {
           // Prevent all scrolling
           $('html').on('DOMMouseScroll mousewheel', function(event) {
                // Prevent window scroll
                event.preventDefault();
            }); 
        }
    };
    
    /**
     * Disables any events bound to DOMMouseScroll or mousewheel on the html.
     * This is often used in conjunction with common.preventWindowScroll above for pop up
     * menus.
     * 
     * @returns {undefined}
     */
    common.enableWindowScroll = function() {
        $('html').off('DOMMouseScroll mousewheel');
    };
    
    /**
     * Enables hide/show functionality on a menu item
     * 
     * @param {Object} opitions
     * @param {String|Object} opitions.parentSelector the DOM element that wraps the trigger and menu
     * @param {String|Object} opitions.triggerSelector the DOM element that triggers the menus
     * @example
     *      <a class="main-menu-trigger">Navigate</a>
     * @param {String|Object} opitions.menuSelector the menus DOM element
     * @example
     *      <nav class="main-menu">Anchor elements...</nav>
     * @param {Function} opitions.initializeCallback fires when enable head mensu is called
     * @param {Function} opitions.triggerOpenCallback fires when the menus is triggered
     * @param {Function} opitions.triggerCloseCallback fires when the menus is closed
     * @returns {undefined}
     */
    common.enableHeadMenus = function(options) {
        // Click event for showing menu
        $(options.parentSelector).on('click touchstart touch', options.triggerSelector, function(event) {
            event.preventDefault();
            if(options.triggerOpenCallback !== undefined) { options.triggerOpenCallback.call(this); }
            // Turn off any previous one events to prevent stacking
            $(window).off('resize');
            var target = $(this).data('target');
            var objContext = this;
            if($(target).attr('aria-hidden') === 'true') {
                $(target).attr('aria-hidden', false);
                $(target).fadeIn(100);
                $(objContext).append($('<div>').addClass('carrot hide').fadeIn(100));
                // Scroll to top of menus
                $(options.menuSelector).scrollTop(0);
                // Create one reset display event for resize
                $(window).one('resize', function() {
                    $(target).attr('aria-hidden', true);
                    $(target).hide();
                    $(objContext).find('div.carrot').remove();
                    // Call menus close callback
                    if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
                });
                one.call(objContext, target);
            } else {
                $(target).attr('aria-hidden', true);
                $(target).hide();
                $(objContext).find('div.carrot').remove();
                // Call menus close callback
                if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
            }
        });
        // Define mouse enter for hover event
        function mouseEnter() {
            common.preventWindowScroll(options.menuSelector);
        }
        // Define mouse leave for hover event
        function mouseLeave() {
            common.enableWindowScroll();
        }
        // Hover event for main menus to control window scrolling
        common.hover(options.parentSelector, options.menuSelector, mouseEnter, mouseLeave);
        // Use to control when to hide the opened menus
        function one(target) {
            // Turn off any previous one events to prevent stacking
            $(document).off('click touchstart touch');
            // Delay the creation of the one event below because any previous click events registering
            // function one cascade to fire the event below after it's created.
            setTimeout(function() {
                // Create one reset display event on content slide
                $(document).one('click touchstart touch', function(event) {
                    event.stopImmediatePropagation();
                    if($(event.target).parents(options.menuSelector).first().get(0) != $(target).get(0)
                        && $(event.target).first().get(0) != $(target).get(0)) {
                        $(target).attr('aria-hidden', true);
                        $(target).hide();
                        $(this).find('div.carrot').remove();
                        // Call menus close callback
                        if(options.triggerCloseCallback !== undefined) { options.triggerCloseCallback.call(this); }
                    } else {
                        // Recursion
                        one(target);
                    }
                });
            }, 1);
        }
        // Kick off initialize callback
        if(options.initializeCallback !== undefined) { options.initializeCallback.call(this); }
    };

    /**
     * Sends the client back one page
     * 
     * @returns {undefined}
     */
    common.goBack = function() {
        window.history.back();
    };
    
    /**
     * Can be used to set a callback function which is called before the browser window
     * state is going to change (IE, back, redirect, reload, forward and etc).
     * 
     * @param {Function} callback
     * @returns {undefined}
     */
    common.beforeWindowUnload = function(callback) {
        // Define default callback if callback undefinied
        callback = callback || function() {
            return "You have attempted to leave this page. " +
                "If you have made any changes to the fields without clicking the Save button, " + 
                "your changes will be lost.  Are you sure you want to exit this page?";
        };
        // Set callback
        window.onbeforeunload = callback;
    };
    
    /**
     * Define function for sorting options.
     * This function will determine if there is a
     * selected option by attribute and empty value.
     * This selected option will be excluded from the sorting
     * and pushed to the top of the options list.
     * If the selected option has a value, 
     * it is sorted with the rest of the option items.
     * This function can sort multiple selects in one call.
     *
     * @param {String|jQueryObject} selector
     * @example: 
     *  BUNDLE.common.sortOptions('select');
     * @example:
     *  var jquerySelectObject = $('select');
     *  BUNDLE.common.sortOptions(jquerySelectObject);
     */
    common.sortOptions = function(selector) {
        // Define jquery object
        var jqueryObject = $(selector);
        jqueryObject.each(function(index, value) {
            var jquerySelectOption = $(value);
            // Define selected option
            var selectedOption = jquerySelectOption.find('option:selected');
            // Define options
            var options = new Array();
            // Define value attribute
            // Jquery will default to option text value if the attribute doesn't exist
            // when using .val
            var valueAttribute = selectedOption.attr('value');
            // Determine if the selected element is a top level option element
            // Based on if the value is empty
            if(selectedOption.length > 0 &&
                (valueAttribute === undefined || valueAttribute === '')) {
                // We don't know the selected option order
                // So we grab all it's siblings
                options = selectedOption.siblings();
            } else {
                // Grab all the options
                options = jquerySelectOption.find('option');
            }
            // Sort options
            options.sort(function(a, b) {
                return a.text > b.text ? 1 : -1;
            });
            // Empty current select
            jquerySelectOption.empty();
            // Append top level selected element if it exists
            if(selectedOption.length > 0 &&
                (valueAttribute === undefined || valueAttribute === '')) {
                    jquerySelectOption.append(selectedOption);
                    // Must force remove selected attribute for ie8
                    // Jquery option object continues to take the option
                    // from the top and make it selected if there isn't a selected object
                    options.removeAttr('selected');
            }
            // Append the sorted options back to the list
            jquerySelectOption.append(options);
        });
    };
    
    /**
     * Replaces carriage returns with line breaks
     * 
     * @param {Object} jQueryObject
     * @returns {undefined}
     */
    common.formatCarriageReturnToHtml = function(jQueryObject) {
        var stringFormat = jQueryObject.text();
        var stringFormatted = stringFormat.replace(/(\r\n|\n|\r)/gm, '<br />');
        jQueryObject.html(stringFormatted);
        // Remove duplicates
        jQueryObject.html(jQueryObject.html().replace(/(<br>\s*){2,2}/gi,'<br>'));
    };

})(jQuery, _);