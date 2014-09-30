/**
 * Kinetic Data console list widget
 * 
 * For more information on jQuery widgets:
 * http://jqueryui.com/widget/
 * 
 * Builds a simple unordered ul li list using JSON data.
 * The UI for the can be modifed using various callbacks.
 * 
 * Required libraries:
 * jQuery and Underscore.
 */
(function($, _) {
    // Create the bundle namespace
    BUNDLE = BUNDLE || {};
    // Create the libraries namespace
    BUNDLE.libraries = BUNDLE.libraries || {};
    // Create the widgets namespace
    BUNDLE.libraries.widgets = BUNDLE.libraries.widgets || {};
    // Create function that will return an instance of the widget
    BUNDLE.libraries.widgets.ConsoleList = function(selector, options) {
        return $(selector).consoleList(options);
    };
    
    /**
     * Define the jQuery widget that will be made available under the
     * widgets namespace above.
     */
    $.widget('custom.consoleList', {
        // Default widget opitons
        options: {
            escapeHtml: true, // Will escape any html in the data supplied
            entryOptionSelected: 5, // Determines how many results to show on load
            entryOptions: [5, 10, 50, 100], // Determines the available display options for results
            page: 1, // Default page to start on
            total: 0, // Total results
            paginationPageRange: 5, // How many pagination page links are avilable (excluding first, last and next and previous)
            resultsPerPage: 0, // How many results to show per page
            entries: true, // Displays the entry options (select menus for determing how many results we want to show)
            serverSidePagination: true, // Determines if pagination will be handled client or server side
            emptyPreviousResults: true, // Determines if the console widget will remove previous result data 
            // while the is building new result data to display
            paginationControlsTop: true, // Determines where the entry options should go (top or bottom of the UI)
            displayOnPageLoad: true, // Determines if the results should be shown on page load or left hidden
            /**
             * This callback can be used to intialize UI events before the buildResultsSet is called.
             * For example, this can be useful for changing UI state while the client waits for
             * buildResultsSet to finish.
             * 
             * @returns {undefined}
             */
            initializeCallback: function() {},
            /**
             * This function is used to get/set the data for the console and add it to the console ui
             * using the widet's buildResultSet.
             * 
             * @example
             * var data = new Array();
             * var record = new Object({'name':'Johnny Doe', 'email':'johnny@doe.com'});
             * data.push(record);
             * data.push(record);
             * var dataCount = data.length;
             * this.buildResultSet(data, dataCount);
             * @param {Number} limit
             * @param {Number} index
             * @param {String} sortOrder, ASC or DESC
             * @param {String} sortOrderField
             * @returns {undefined}
             */
            dataSource: function(limit, index, sortOrder, sortOrderField) {},
            /**
             * This callback is called while the widget iterates through each record
             * 
             * @param {Object} li, list element object
             * @param {Object} record of key name pairs
             * @param {Number} record index
             * @param {Object} displayFields option object
             * @returns {undefined}
             */
            rowCallback: function(li, record, index, displayFields) {},
            /**
             * This callback is called while the widget iterates through each field inside the record
             * 
             * @param {Object} li, list element object
             * @param {String|Number|Object|Array} value
             * @param {String} fieldname
             * @param {String} label is the display fields label name used in side the UI
             * @returns {undefined}
             */
            fieldCallback: function(li, value, fieldname, label) {},
            /**
             * This callback is called after the widget has finished rendering the list
             */
            completeCallback: function() {}
        },
        /**
         * Create fires as soon as the widget is initialized on a DOM element.
         * 
         * @returns {undefined}
         */
        _create: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            // This is the first request, make a server call
            widget.firstRequest = true;
            // For client side pagination value manipulation
            widget.checkOnce = true;
            // Hide
            widget.element.hide();
            // Build HTML
            widget.select = $('<select>').addClass('limit');
            $.each(widget.options.entryOptions, function(index, value) {
                if(value === widget.options.entryOptionSelected) {
                    widget.select.append($('<option>').val(value).text(value).attr('selected','selected'));
                } else if(index === 0) {
                    widget.select.append($('<option>').val(value).text(value).attr('selected','selected'));
                } else {
                    widget.select.append($('<option>').val(value).text(value));
                }
            });
            widget.refresh = $('<a>').addClass('refresh').attr('href', 'javascript:void(0)').text('Refresh');
            widget.ul = $('<ul>').addClass('list-unstyled console');
            widget.information = $('<div>').addClass('information');
            widget.pagination = $('<nav>').addClass('pagination');
            widget.header = $('<div>').addClass('header');
            widget.consoleList = $('<div>').addClass('console-list');
           // Append header elements
            widget.header.append(widget.refresh);
            if(widget.options.paginationControlsTop) {
                widget.header.append(widget.pagination)
            }
            widget.header.append(widget.information);
            // Append header and header elements
            widget.consoleList.append(widget.header);
            if(widget.options.entries) {
                var limitWrap = $('<div>').addClass('limit-wrap');
                limitWrap.prepend($('<span>').append('Show'))
                    .append(widget.select)
                    .append($('<span>').append('entries'));
                widget.header.append(limitWrap);
            }
            // Append ul and footer
            widget.footer = $('<div>').addClass('footer');
            if(!widget.options.paginationControlsTop) {
                widget.footer.append(widget.pagination)
            }
            widget.consoleList.append(widget.ul)
                .append(widget.footer);
            // Add html to selector
            widget.element.html(widget.consoleList);
            // Start create events
            widget._createEvents();
            // Make request for data
            widget._makeRequest(1, widget.select.val());
            // Call initalize
            this.options.initializeCallback.call(this);
        },
        /**
         * Creates all the available events required for using the widget
         * For example, click events for the pagination controls,
         * and entry option select.
         * 
         * @returns {undefined}
         */
        _createEvents: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            // Click event for pagination
            widget.pagination.on('click', 'ul.links li a', function(event) {
                // Prevent default action.
                event.preventDefault();
                // Get Page
                page = $(this).data('page');
                // Set current page number for other events to use
                widget.element.data('page', page);
                // Execute the request and return results
                widget._makeRequest(page, widget.select.val());
            });

            // Click event for refresh
            widget.refresh.on('click', function(event) {
                // Prevent default action.
                event.preventDefault();
                // Make a server call again
                widget.firstRequest = true;
                // Execute the request and return results
                widget._makeRequest(1, widget.select.val());
            });

            // Click event for refresh
            widget.select.on('change', function(event) {
                // Prevent default action.
                event.preventDefault();
                // Execute the request and return results
                widget._makeRequest(1, widget.select.val());
            });
        },
        /**
         * @param {Number} page
         * @param {Number} resultsPerPage
         * @returns {undefined}
         */
        _makeRequest: function(page, resultsPerPage) {
            // Set current object context to use inside jquery objects
            var widget = this;
            // Pagination
            widget.options.resultsPerPage = resultsPerPage;
            if(widget.options.pagination) {
                widget.options.page = page;
            }
            // Set pagination information
            if(widget.options.serverSidePagination) {
                index = widget._getIndex();
            } else {
                resultsPerPage = 0;
                index = 0;
            }
            // If this is the first request for data source function
            // Used for client side pagination after the data is built the first time
            if(widget.firstRequest) {
                // Call data source function
                widget.options.dataSource.call(
                    widget, 
                    resultsPerPage, 
                    index, 
                    widget.options.sortOrder, 
                    widget.options.sortOrderField
                );
            } // Only build the resilts (data currently exists).
            else {
                widget.buildResultSet(widget.records, widget.recordCount);
            }
            // Disable subsequent server requests from performing if pagination isn't suppose to run server side
            if(!widget.options.serverSidePagination) { widget.firstRequest = false; }
        },
        /**
         * Used to build the results set of data into the UI
         * This includes the entry options and pagination links as well
         * 
         * @param {Array} records, an array of record objects
         * @param {Number} recordCount, total length of array
         * @returns {undefined}
         */
        buildResultSet: function(records, recordCount) {
            // Set current object context to use inside jquery objects
            var widget = this;
            widget.records = records;
            widget.recordCount = recordCount;
            // Empty/clear previous results from list
            if(widget.options.emptyPreviousResults) { widget.ul.empty(); }
            // Empty information to set new information
            widget.information.empty();
            // List that gets built
            function buildList(index, record) {
                // Create row
                var li = $('<li>');
                $.each(widget.options.displayFields, function(fieldname, label) {
                    // Field callback
                    widget.options.fieldCallback.call(widget, li, record[fieldname], fieldname, label);
                });
                // Striping
                ((index % 2 === 0) ? li.addClass('kd-odd') : li.addClass('kd-even'));
                // Row callback
                widget.options.rowCallback.call(widget, li, record, index, widget.options.displayFields);
                // Append to ul
                widget.ul.append(li);
            }
            // Build client or server side pagination
            if(widget.options.serverSidePagination) {
                $.each(widget.records, function(index, record) {
                    // Check escape html option for values
                    record = widget._htmlEscape(record);
                    buildList(index, record);
                });
            } else {
                $.each(widget.records, function(index, record) {
                    // Only run this escape once for client side
                    if(widget.checkOnce) {
                        // Check escape html option for values
                        record = widget._htmlEscape(record);
                        // disable this 
                        widget.checkOnce = false;
                    }
                    if(index >= widget._getIndex() && index <= (widget._getIndex() + (widget.options.resultsPerPage  - 1))) {
                        buildList(index, record);
                    }
                });
            } 
            // Build pagination links
            widget.options.total = widget.recordCount;
            if(widget.options.pagination) {
                widget.pagination.html(widget._buildHtmlPaginatationList());
            }
            // Append information
            if(widget.options.info) {
                widget.information.append('Showing&nbsp;')
                    .append(widget._getIndex() + 1)
                    .append('&nbsp;to&nbsp;')
                    .append(widget._getIndex() + widget.ul.find('li').length)
                    .append('&nbsp;of&nbsp;')
                    .append(widget.options.total)
                    .append('&nbsp;entries');
            }

            // Show console
            if(this.options.displayOnPageLoad) { this.element.show(); }
            // Run complete callback
            widget._complete();
        },
        /**
         * When the escapeHtml option is set to true,
         * this recursive function escapes any html from 
         * the record including nested data
         * 
         * @param {Object} record
         * @returns {Object}
         */
        _htmlEscape: function(record) {
            // Set current object context to use inside jquery objects
            var widget = this;
            // Check escape html option for values
            if(widget.options.escapeHtml) {
                $.each(record, function(key, value) {
                    // Check the value for object or array
                    if(value instanceof Object === false && value instanceof Array === false) {
                        if(value !== null && value !== '') {
                            record[key] = _.escape(value);
                        }
                    } else {
                        // Recursion
                        record[key] = widget._htmlEscape(value);
                    }
                });
            }
            return record;
        },
        /**
         * Calls the complete callback option
         * 
         * @returns {undefined}
         */
        _complete: function() {
            this.options.completeCallback.call(this);
        },
        _getIndex: function() {
            return (this.options.page - 1) * this.options.resultsPerPage;
        },
        _getTotalPages: function() {
            return Math.ceil(this.options.total / this.options.resultsPerPage);
        },
        /**
         * Builds an object of pagination data which can be used for
         * building things like pagination links.
         * 
         * @returns {Object}
         */
        _buildPaginatationData: function() { 
            var startPage = 1;
            var currentPage = this.options.page;
            var endPage = this._getTotalPages();
            // Assume total pages is less than range
            var currentPageRange = _.range(1, endPage);
            // If total pages is greater than range, calculate page range based on current page
            if(endPage > this.options.paginationPageRange) {
                // Determine start range
                var startRange = currentPage - Math.floor(this.options.paginationPageRange / 2);
                // Determine end range
                var endRange = currentPage + Math.floor(this.options.paginationPageRange / 2);
                if(startRange <= 0) {
                    endRange += Math.abs(startRange) + 1;
                    startRange = startPage;
                }
                if(endRange > endPage) {
                    startRange -= endRange - endPage;
                    endRange = endPage;
                }
                // Assume range option is odd
                var offset = 0;
                // Determine if range is even or odd for building the correct range of page numbers shown
                if (this.options.paginationPageRange % 2 === 0) { offset = 1; }
                if(endPage !== endRange) {
                    endRange = endRange - offset;
                } else {
                    startRange = startRange + offset;
                }
                // Ensure start range is still 1 or greater
                if(startRange <= 0) { startRange = startPage; }
                currentPageRange = _.range(startRange, endRange);
            }
            // Initialize object
            var pages = new Object();
            var pageNumbers = new Array();
            if(currentPageRange.length > 1) {
                // Setup prev
                if(currentPage !== startPage) {
                    pages['prev'] = new Object({
                        'page':(currentPage - 1),
                        'label':'Prev'
                    });
                }
                // Setup link showing first page if not inside page range
                if($.inArray(startPage, currentPageRange) === -1) {
                    pages['firstPage'] = new Object({
                        'page':startPage,
                        'label':startPage + '...'
                    });
                }
                // Create page numbers
                $.each(currentPageRange, function(index, value) {
                    pageNumbers[index] = new Object({
                        'page':value,
                        'label':value
                    });
                });
                pages['pageRange'] = pageNumbers;
                // Setup link showing last page if not inside page range
                if($.inArray(endPage, currentPageRange) === -1) {
                    pages['lastPage'] = new Object({
                        'page':endPage,
                        'label':'... ' + endPage
                    });
                }
                // Setup next
                if(currentPage !== endPage) {
                    pages['next'] = new Object({
                        'page':currentPage + 1,
                        'label':'Next'
                    });
                }
            } else {
                pages = new Array();
            }
            return new Object({'pages':pages});
        },
        /**
         * Builds a Html ul li pagination link list
         * 
         * @returns {Object}
         */
        _buildHtmlPaginatationList: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            var paginationData = this._buildPaginatationData();
            var paginationList = $('<ul>').addClass('list-unstyled links');
            $.each(paginationData.pages, function(index, value) {
                if(index === 'pageRange') {
                    $.each(value, function(index, value) {
                        var li = $('<li>')
                                .append(
                                    $('<a>').attr('href', 'javascript(void)')
                                    .data('page', value.page)
                                    .text(value.label)
                                )
                        // Create Active class based selected page
                        if(value.page === widget.options.page) { li.addClass('active'); }
                        paginationList.append(li);
                    });
                } else {
                    paginationList.append(
                        $('<li>')
                        .append(
                            $('<a>').attr('href', 'javascript(void)')
                            .data('page', value.page)
                            .text(value.label)
                        )
                    );
                }
            });
            return paginationList;
        },
        /**
         * jQuery widget destroy function
         * 
         * @returns {undefined}
         */
        _destroy: function() {
            this.consoleList.remove();
        }
    });
})(jQuery, _);