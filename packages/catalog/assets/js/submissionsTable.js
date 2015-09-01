(function($, _) {
    /*----------------------------------------------------------------------------------------------
     * SUBMISSIONS INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create the submissions namespace
    BUNDLE.package.submissions = BUNDLE.package.submissions || {};
    // Create a scoped alias to simplify references
    var submissions = BUNDLE.package.submissions;

    /**
     * Default row callback
     * 
     * @param {Object} tr element object
     * @param {Object} value is record of key name pairs
     * @param {Number} index is current record index
     * @returns {undefined}
     */
    submissions.defaultRowCallback = function(tr, value, index) {
        // Data used for links and buttons
        tr.data('Originating Id', value['Originating Id']);
        tr.data('Originating Request Id', value['Originating Request Id']);
        tr.data('Id', value['Id']);
    };

    /**
     * Default column callback
     * 
     * @param {Object} td element object
     * @param {String|Number|Object|Array} value
     * @param {String} fieldname
     * @param {String} label is the display fields label name used in side the UI
     * @returns {undefined}
     */
    submissions.defaultColumnCallback = function(td, value, fieldname, label) {        
        // qtip options
        var qtipOptions = {
            content: {
                attr: 'data-timestamp'
            },
            style: {
                corner: 'bottom middle',
                classes: 'qtip-tipsy qtip-shadow'
            },
            position: {
                my: 'center right',
                at: 'center left'
            }
        };
        
        // Note::jQuery data doesn't work on td
        if(fieldname === 'Sent' || fieldname === 'Submitted' || fieldname === 'Closed' || fieldname === 'Modified') {
            td.attr('data-timestamp', ((value !== null) ? moment(value, 'MM/DD/YYYY H:mm:ss').format('YYYY-MM-DD hh:mm:ss a') : ""))
            .qtip(qtipOptions)
            .text(
                moment(value, 'MM/DD/YYYY H:mm:ss').fromNow()
            );
        }
        if(fieldname === 'Originating Request Id') { td.html($('<a>').addClass('review').attr('href', 'javascript:void()').append(value)); }
    };

    /**
     * Default Complete callback
     */
    submissions.defaultCompleteCallback = function() {   
        // Create Review and activity details links
        this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if($(window).width() < 536) {
                // Determine if buttons were created before
                if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                    $(this).next('tr.footable-row-detail')
                        .find('div.footable-row-detail-inner')
                        .append(
                            $('<div>').addClass('footable-row-detail-row').append(
                                $('<button>').addClass('requests view-activity-details btn-xs btn-gray')
                                    .attr('data-submission-id', $(this).data('Originating Id'))
                                    .append('View Details'.localize())
                            ).append(
                                $('<button>').addClass('requests review btn-xs btn-gray')
                                    .attr('data-submission-id', $(this).data('Originating Id'))
                                    .append('View Form'.localize())
                            )
                        );
                }
            } else {
                window.open(BUNDLE.config.catalogUrl + '&view=submissionActivity&id=' + $(this).data('Originating Id'));
            }
        });

        // Unobstrusive live on click event for view activity details
        this.consoleTable.on('click touchstart', 'button.view-activity-details', function(event) {
            // Prevent default action.
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location = BUNDLE.config.catalogUrl + '&view=submissionActivity&id=' + $(this).data('submission-id');
        });

        // Unobstrusive live on click event for review request
        this.consoleTable.on('click touchstart', 'button.review', function(event) {
            // Prevent default action.
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location = BUNDLE.applicationPath + 'ReviewRequest?excludeByName=Review%20Page&csrv=' + 
                $(this).data('submission-id') + '&reviewPage=' + BUNDLE.config.reviewJsp;
        });

        // jQuery unobstrusive live on click event for review request
        this.consoleTable.on('click', 'table tbody tr td a.review', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.open(BUNDLE.applicationPath + 'ReviewRequest?excludeByName=Review%20Page&csrv=' +
                $(this).parents('tr').data('Originating Id') + '&reviewPage=' + BUNDLE.config.reviewJsp);
        });
    };

    /**
     * Complete callback for parked requests
     */
    submissions.requestsParkedCompleteCallback = function() {
        // Unobstrusive live on click event for complete form
        this.consoleTable.on('click touchstart', 'button.complete-form', function(event) {
            // Prevent default action.
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id') + '&return=yes';
        });

        // Create complete form link
        this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if($(window).width() < 536) {
                // Determine if buttons were created before
                if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                    $(this).next('tr.footable-row-detail')
                        .find('div.footable-row-detail-inner')
                        .append(
                            $('<div>').addClass('footable-row-detail-row').append(
                                $('<button>').addClass('requests complete-form btn-xs btn-gray')
                                    .attr('href', 'javascript:void()')
                                    .attr('data-submission-id', $(this).data('Originating Id'))
                                    .append('Complete Form'.localize())
                            )
                        );
                }
            } else {
                window.open(BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id') + '&return=yes');
            }
        });
    };

    /**
     * Complete callback for pending requests
     */
    submissions.approvalsPendingCompleteCallback = function() {
        // Unobstrusive live on click event for complete form
        this.consoleTable.on('click touchstart', 'button.complete-approval', function(event) {
            // Prevent default action.
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id');
        });

        // Create complete approval link
        this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if($(window).width() < 536) {
                // Determine if buttons were created before
                if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                    $(this).next('tr.footable-row-detail')
                        .find('div.footable-row-detail-inner')
                        .append(
                            $('<div>').addClass('footable-row-detail-row').append(
                                $('<button>').addClass('requests complete-approval btn-xs btn-gray')
                                    .attr('href', 'javascript:void()')
                                    .attr('data-submission-id', $(this).data('Originating Id'))
                                    .append('Complete Approval'.localize())
                            )
                        );
                }
            } else {
                window.open(BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id'));
            }
        });
    };
    
    // Define the common console options and callbacks
    submissions.consoleParams = {
        // Define table specific properties
        'Open Request': {
            displayFields: {
                'Originating Request Id': 'Request ID',
                'Submitted': {
                    columnLabel: 'Submitted',
                    sortable: true
                },
                'Originating Name': {
                    columnLabel: 'Service Item',
                    sortable: true
                },
                'Display Status': {
                    columnLabel: 'Status',
                    sortable: true
                }
            },
            sortField: 'Submitted',
            rowCallback: submissions.defaultRowCallback,
            columnCallback: submissions.defaultColumnCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Closed Request': {
            displayFields: {
                'Originating Request Id': {
                    columnLabel: 'Request ID',
                    sortable: true
                },
                'Closed': {
                    columnLabel: 'Closed',
                    sortable: true
                },
                'Originating Name': {
                    columnLabel: 'Service Item',
                    sortable: true
                },
                'Display Status': {
                    columnLabel: 'Status',
                    sortable: true
                }
            },
            sortField: 'Closed',
            rowCallback: submissions.defaultRowCallback,
            columnCallback: submissions.defaultColumnCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Draft Request': {
            displayFields: {
                'Originating Request Id': {
                    columnLabel: 'Request ID',
                    sortable: true
                },
                'Modified': {
                    columnLabel: 'Modified',
                    sortable: true
                },
                'Originating Name': {
                    columnLabel: 'Service Item',
                    sortable: true
                },
                'Display Status': {
                    columnLabel: 'Status',
                    sortable: true
                }
            },
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            columnCallback: submissions.defaultColumnCallback,
            completeCallback: submissions.requestsParkedCompleteCallback
        },
        'Pending Approval': {
            displayFields: {
                'Originating Request Id': {
                    columnLabel: 'Request ID',
                    sortable: true
                },
                'Sent': {
                    columnLabel: 'Sent',
                    sortable: true
                },
                'Originating Name': {
                    columnLabel: 'Service Item',
                    sortable: true
                },
                'Display Status': {
                    columnLabel: 'Status',
                    sortable: true
                }
            },
            sortField: 'Sent',
            rowCallback: submissions.defaultRowCallback,
            columnCallback: submissions.defaultColumnCallback,
            completeCallback: submissions.approvalsPendingCompleteCallback
        },
        'Completed Approval': {
            displayFields: {
                'Originating Request Id': {
                    columnLabel: 'Request ID',
                    sortable: true
                },
                'Submitted': {
                    columnLabel: 'Submitted',
                    sortable: true
                },
                'Originating Name': {
                    columnLabel: 'Service Item',
                    sortable: true
                },
                'Display Status': {
                    columnLabel: 'Status',
                    sortable: true
                }
            },
            sortField: 'Submitted',
            rowCallback: submissions.defaultRowCallback,
            columnCallback: submissions.defaultColumnCallback,
            completeCallback: submissions.defaultCompleteCallback
        }
    };
    
    /**
     * @param {Object} options
     * @param {Number} options.entryOptionSelected is how many results to show.
     * @param {String} options.status is the submission status group 
     * (Open Request, Closed Request, Pending Approval).
     * @returns {undefined}
     */
    submissions.initialize = function(options) {
        // Define options
        options = options || {};
        // Define status
        options.status = options.status || 'Open Request';
        // Get console specific properties
        var params = submissions.consoleParams[options.status];
        // Define loader
        var loader = $('div#loader');
        var responseMessage = $('div.results-message');
        // Define console options
        var consoleOptions = {
            displayFields: params.displayFields,
            paginationPageRange: 3,
            pagination: true,
            entryOptionSelected: options.entryOptionSelected,
            entryOptions: [5, 10, 20, 50, 100],
            entries: true,
            info: true,
            sortOrder: 'DESC',
            serverSidePagination: true,
            sortOrderField: params.sortField,
            dataSource: function(limit, index, sortOrder, sortOrderField) {
                var widget = this;
                // Execute the ajax request.
                BUNDLE.ajax({
                    dataType: 'json',
                    cache: false,
                    type: 'get',
                    url: BUNDLE.config.catalogUrl + '&callback=submissions&qualification=' + options.status + '&offset=' + index + '&limit=' + limit + '&orderField=' + sortOrderField + '&order=' + sortOrder,
                    beforeSend: function(jqXHR, settings) {
                        widget.element.hide();
                        responseMessage.empty();
                        loader.show();
                    },
                    success: function(data, textStatus, jqXHR) {
                        loader.hide();
                        if(data.count > 0) {
                            widget.buildResultSet(data.data, data.count);
                            $('h3').hide();
                            widget.consoleTable.show();
                        } else {
                            $('section.container nav.submissions-navigation').show();
                            responseMessage.html('<h4>There Are No ' + options.status + 's</h4>').show();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        loader.hide();
                        responseMessage.html(errorThrown).show();
                    }
                });
            },
            rowCallback: function(tr, value, index) { params.rowCallback.call(this, tr, value, index); },
            columnCallback: function(td, value, fieldname, label) { params.columnCallback.call(this, td, value, fieldname, label); },
            completeCallback: function() { 
                // Foo tables ui
                this.table.find('thead tr th:nth-child(3)').attr('data-hide', 'phone');
                this.table.find('thead tr th:nth-child(4)').attr('data-hide', 'phone');
                this.table.footable();
                this.table.trigger('footable_initialize');
                params.completeCallback.call(this);
            }
        };
        // Start console
        BUNDLE.libraries.widgets.ConsoleTable('div.results', consoleOptions);
    };
    
    submissions.destroy = function(){
        try { $('div.results').consoleTable('destroy'); } catch(exception) { /* Do nothing */ }
    };

})(jQuery, _);