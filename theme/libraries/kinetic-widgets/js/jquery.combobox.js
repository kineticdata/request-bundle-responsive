/**
 * jQuery Kinetic Data combobox widget factory
 */
(function($) {
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
    // Define widget
    $.widget('custom.combobox', {
        _create: function() {
            var widget = this;
            // Hide select option box
            widget.element.hide();
            // Create html
            if(widget.options.placeholder !== undefined) {
                widget.input = $('<input>').attr('placeholder', widget.options.placeholder);
            } else {
                widget.input = $('<input>');
            }
            widget.input.attr('type', 'text');
            // Inititalize private functions
            widget._createAutocomplete();
            widget._createShowAllButton();
            widget._createEvents();
            widget._complete();
        },
        _createAutocomplete: function() {
            var widget = this;
            var selected = widget.element.children(':selected'),
            value = selected.val() ? selected.text() : '';
            // Setup autocomplete
            widget.input
            .insertAfter(widget.element)
            .val(value)
            .addClass('custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left')
            .autocomplete({
                appendTo: widget.element.parent(),
                autoFocus: true,
                delay: 0,
                minLength: 0,
                source: $.proxy(widget, '_source'),
                search: function(event, ui) {
                    // Prevent shift from showing the options
                    if (event.keyCode === 16) { event.preventDefault(); }
                },
                select: function(event, ui) {
                    // Prevent 'tab' from selecting
                    if (event.keyCode === 9) { return false; }
                    if(ui.item.option !== undefined) {
                        // Must specify target for ie8 and lower
                        var extendedTarget;
                        return widget.options.selectHandler.call($.extend(extendedTarget, this, widget), event, ui);
                    }
                },
                close: function(event, ui) {
                    if(widget.options.closeHandler !== undefined) {
                        // Must specify target for ie8 and lower
                        var extendedTarget;
                        return widget.options.closeHandler.call($.extend(extendedTarget, this, widget), event, ui);
                    }
                }
            });
        },
        _createShowAllButton: function() {
            var widget = this;
            widget.button = $('<a>').attr('tabIndex', -1)
            .insertAfter(widget.input)
            .button({
                icons: {
                    primary: 'ui-icon-triangle-1-s'
                },
                text: false
            })
            .removeClass('ui-corner-all')
            .addClass('custom-combobox-toggle ui-corner-right');
        },
        _createEvents: function() {
            var widget = this;
            // Prevent submission whenever a user hits enter on an input
            widget.input.on('keypress', function(event) {
                if(event.keyCode === 13) { event.preventDefault(); }
            });

            // On click event for display autocomplete list
            wasOpen = false;
            widget.button.on('click keypress', function() {
                widget.input.focus();
                // Close if already visible
                if (wasOpen) { return; }
                // Pass empty string as value to search for, displaying all results
                widget.input.autocomplete('search', '');
            });
        },
        _complete: function() {
            if(this.options.complete !== undefined) { this.options.complete.call(this); }
        },
        _source: function(request, response) {
            if(this.options.sourceHandler !== undefined) { this.options.sourceHandler.call(this, request, response); }
        },
        _destroy: function() {
            this.input.remove();
            this.button.remove();
            this.element.show();
        }
    });
})(jQuery);