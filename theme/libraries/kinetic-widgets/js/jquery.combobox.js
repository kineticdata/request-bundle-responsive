/**
 * Kinetic Data combobox widget
 * 
 * For more information on jQuery widgets:
 * http://jqueryui.com/widget/
 * 
 * The UI for the can be modifed using various callbacks.
 * The combobox can be used for autocomplete behavior while 
 * typing and can also turn a selection options menu into a combobox.
 * 
 * Required libraries:
 * jQuery and Underscore.
 */
(function($, _) {
    // Create the bundle namespace
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create the widgets namespace
    BUNDLE.package.widgets = BUNDLE.package.widgets || {};
    // Create function that will return an instance of the widget
    BUNDLE.package.widgets.Combobox = function(selector, options) {
        return $(selector).combobox(options);
    };
    
    /**
     * Define the jQuery widget that will be made available under the
     * widgets namespace above.
     */
    $.widget('custom.combobox', {
        // Default opitons
        options: {
            // HTML5 Place holder to show inside the combobox input
            placeholder: '',
            // Adds disable attribute to input
            disableSearch: false,
            // Replace the dom element for autocomplete with a div element
            deactivateSearch: false,
            // Img source path to icon
            buttonIcon: null,
            // Button text if no image specified or used in the css
            buttonText: null,
            // Disable or enable button
            disableButton: false,
            // Include or exclude button from ui
            includeButton: true,
            // Minimum length
            minLength: 0,
            // Delay before search is made
            delay: 0,
            // Determines if the page submits on enter
            submitOnEnter: false,
            // If set to true the first item will automatically be focused when the menu is shown
            autoFocus: true,
            // Define default input value
            defaultInputValue: '',
            // Determines whether or not to use a custom render handler
            useRenderHandler: false,
            /**
             * Sets and returns the data for autocomplete
             * 
             * @param {Object} request, what the client supplies in the request including the term
             * @param {Object} response, the results meant to be returned to the UI in the render handler
             * Usually this is an array of objects.
             * @returns {Object} response
             */
            sourceHandler: function(request, response) {},
            /**
             * Renders how the data will look in the ul li autocomplete list
             * 
             * @param {Object} ul
             * @param {Object} item
             * @returns {undefined}
             */
            renderHandler: function(ul, item) {},
            /**
             * Triggered when focus is moved to an item (not selecting)
             * 
             * @param {Event} event
             * @param {Object} ui
             * @returns {undefined}
             */
            focusHandler: function(event, ui) {},
            /**
             * Triggered once an item is selected from the autocomplete list
             * 
             * @param {Event} event
             * @param {Object} ui
             * @returns {undefined}
             */
            selectHandler: function(event, ui) {},
            /**
             * Triggered when the menu is hidden
             * 
             * @param {Event} event
             * @param {Object} ui
             * @returns {undefined}
             */
            closeHandler: function(event, ui) {},
            /**
             * This function is called after the widget has finished rendering the list
             */
            complete: function() {}
        },
        _create: function() {
            var widget = this;
            // Hide select option box
            widget.element.hide();
            // Check if search is deactivated
            if(widget.options.deactivateSearch) {
                widget.input = $('<div>');
            } else {
                // Create input for search
                widget.input = $('<input>').attr('type', 'text');
                // Setup placeholder
                if(widget.options.placeholder !== undefined) {
                    widget.input.attr('placeholder', widget.options.placeholder);
                }
                // Setup default input value
                if(widget.options.defaultInputValue !== undefined) {
                    widget.input.val(widget.options.defaultInputValue);
                }
                // Check if search is deactivated
                if(widget.options.deactivateSearch) {
                    widget.input.attr('disabled', true);
                }
            }
            // Inititalize private functions
            widget._createAutocomplete();
            widget._createShowAllButton();
            widget._createResponseContainer();
            widget._createEvents();
            widget._complete();
        },
        /**
         * Binds the jQuery autocomplete behavior to the input
         * 
         * @returns {undefined}
         */
        _createAutocomplete: function() {
            var widget = this;
            // Setup autocomplete
            widget.input
            .insertAfter(widget.element)
            .addClass('custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left')
            .autocomplete({
                appendTo: widget.element.parent(),
                autoFocus: widget.options.autoFocus,
                delay: widget.options.delay,
                minLength: widget.options.minLength,
                source: $.proxy(widget, '_source'),
                search: function(event, ui) {
                    // Prevent shift from showing the options
                    if (event.keyCode === 16) { event.preventDefault(); }
                },
                select: function(event, ui) {
                    // Prevent 'tab' from selecting
                    if (event.keyCode === 9) { return false; }
                    return widget.options.selectHandler.call(_.extend({}, this, widget), event, ui);
                },
                close: function(event, ui) {
                    return widget.options.closeHandler.call(_.extend({}, this, widget), event, ui);
                },
                focus: function(event, ui) {
                    return widget.options.focusHandler.call(_.extend({}, this, widget), event, ui);
                }
            });
            // Determine if render hander should be used
            if(widget.options.useRenderHandler) {
                widget.input.data('ui-autocomplete')._renderItem = function(ul, item) {
                    // Call the render handler option function
                    return widget.options.renderHandler.call(this, ul, item);
                };
            }         
        },
        /**
         * Creates the combobox button for showing all searchable options
         * 
         * @returns {undefined}
         */
        _createShowAllButton: function() {
            var widget = this;
            // Determine if the button that triggers the options is required
            if(widget.options.includeButton) {
                // Define button
                widget.button = $('<button>').attr('tabIndex', -1).addClass('options');
                // Determine if custom icon specified
                if(widget.options.buttonIcon !== null) {
                    widget.button.append(
                        $('<img>').attr('src', widget.options.buttonIcon)
                    ).button({text: false});
                } 
                // Determine if text specified
                else if(widget.options.buttonText !== null) {
                    widget.button.text(widget.options.buttonText).button({text: true});
                }
                // jQuery UI
                else {
                    widget.button.button({
                        icons: {
                            primary: 'ui-icon-triangle-1-s'
                        },
                        text: false
                    })
                    .addClass('custom-combobox-toggle ui-corner-right');
                }
                // Is the button disabled?
                if(widget.options.disableButton) {
                    widget.button.attr('disabled', true);
                }
                // Add button to dom
                widget.button.insertAfter(widget.input);
            }
        },
        /**
         * Creates a message container for displaying messages
         * 
         * @returns {undefined}
         */
        _createResponseContainer: function() {
            var widget = this;
            // Create response container
            widget.response = $('<div>').addClass('response hide');
            widget.response.insertAfter(widget.button);
        },
        _createEvents: function() {
            var widget = this;
            if(!widget.options.submitOnEnter) {
                // Prevent submission whenever a user hits enter on an input
                widget.input.on('keypress', function(event) {
                    if(event.keyCode === 13) { event.preventDefault(); }
                });
            }
            if(widget.options.includeButton) {
                // On click event for display autocomplete list
                wasOpen = false;
                widget.button.on('click keypress', function(event) {
                    event.preventDefault();
                    widget.input.focus();
                    // Close if already visible
                    if (wasOpen) { return; }
                    // Pass empty string as value to search for, displaying all results
                    widget.input.autocomplete('search', '');
                });
            }
        },
        /**
         * Called after combobox initialization
         * 
         * @returns {undefined}
         */
        _complete: function() {
            this.options.complete.call(this);
        },
        /**
         * 
         * @param {Object} request
         * @param {Object} response
         * @returns {Object} response
         */
        _source: function(request, response) {
            this.options.sourceHandler.call(this, request, response);
        },
        /**
         * jQuery widget destroy function
         * 
         * @returns {undefined}
         */
        _destroy: function() {
            this.input.remove();
            this.button.remove();
            this.element.show();
        }
    });
})(jQuery, _);