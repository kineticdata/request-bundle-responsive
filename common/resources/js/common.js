(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
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
        
        // This should remove address bar in cell phones
        if (navigator.userAgent.indexOf('iPhone') !== -1 || navigator.userAgent.indexOf('Android') !== -1) {
            addEventListener('load', function() {
                setTimeout(BUNDLE.common.hideUrlBar, 0);
            }, false);
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
    
    /** 
     * Define message handler for package JavaScript UI
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
     *      'href': url,
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
     * 
     * @deprecated underscoreJS has the method now.
     * @param {Integer} start
     * @param {Integer} end
     * @returns {Array}
     */
    common.range = function(start, end) {
        var array = new Array();
        for(var i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    };
    
    /**
     * Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
     * From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
     * @returns {Number}
     */
    common.getInternetExplorerVersion = function() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName === 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null) {
                rv = parseFloat( RegExp.$1 );
            }
        }
        return rv;
    };
    
    /**
     * Live jQuery hover function used to display specific behavior when a user hovers over dhildren selector.
     * The parent slector of the children are quired for the even to be live.
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
                   mouseEnter(this);
               }
           },
           mouseleave: function() {
               if(mouseLeave !== null) {
                   mouseLeave(this);
               }
           }
       }, childSelector);
    };
    
    /*
     * 
     * @param {Object} obj
     * IE ONLY - used with the styles "preRequiredLabel
     * Example: *.preRequiredLabel { zoom: expression(BUNDLE.common.setIE7PreRequired(this)); }
     * @returns {undefined}
     */
    common.setIE7PreRequired = function(object) {
        if($(object).hasClass('preRequiredLabel')) {
            if(object.innerHTML.indexOf("*") === -1) {
                $(object).append("*");
            }
        }
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
        var gravatarHtml = '<img src="https://secure.gravatar.com/avatar/' + md5 + '" />';
        $(displaySelector).html(gravatarHtml);
    };
    
})(jQuery, _);