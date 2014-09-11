(function($) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Slide navigation
        var contentSlide = $('div.content-slide');
        var firstToggleClick = true;
        var previousScrollTop = $(window).scrollTop();
        var currentScrollTop = '-' + $(window).scrollTop() + 'px';
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
                    // If the current active element is a text input, we can assume the soft keyboard is visible.
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
     * @return {String} message
     **/
    BUNDLE.common.messageHandler = function(messageType, messageContent) {
        var message = $('<div>').addClass('message alert alert-' + messageType).append(
                $('<a>').addClass('close').attr({'data-dismiss':'alert'}).text('x')
        ).append(messageContent);
        return message.get(0).outerHTML;
    };
     
    /**
     * Hides the url bar inside mobile devices
     */
    BUNDLE.common.hideUrlBar = function() {
        if (window.location.hash.indexOf('#') === -1) {
            window.scrollTo(0, 1);
        }
    };

    /**
     * @return {Object} url parameters
     */
    BUNDLE.common.getUrlParameters = function() {
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
     * @return void
     */
    BUNDLE.common.startMobileNavigation = function(contentWrap, menuWrap, top) {
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
     * @param {Integer} top
     * @return void
     */
    BUNDLE.common.resetDisplay = function(contentWrap, menuWrap, top) {
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
    BUNDLE.common.range = function(start, end) {
        var array = new Array();
        for(var i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    };
    
    /**
     * Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
     * From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
     * @returns {unresolved}
     */
    BUNDLE.common.getInternetExplorerVersion = function() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
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
     * @returns {void}
     */
    BUNDLE.common.hover = function(parentSelector, childSelector, mouseEnter, mouseLeave) {
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
    BUNDLE.common.setIE7PreRequired = function(obj) {
        if($(obj).hasClass('preRequiredLabel')) {
            if(obj.innerHTML.indexOf("*") == -1) {
                $(obj).append("*");
            }
        }
    };
    
    /**
     * 
     * @param {String} email
     * @param {String} displaySelector
     * @returns {void}
     */
    BUNDLE.common.gravatar = function(email, displaySelector) {
        var lowercaseEmail = email.toLocaleLowerCase();
        var md5 = $.md5(lowercaseEmail);
        var gravatarHtml = '<img src="https://secure.gravatar.com/avatar/'+md5+'" />';
        $(displaySelector).html(gravatarHtml);
    };
    
})(jQuery);