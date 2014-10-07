define('submissionsList', ['jquery', 'package'], function($, package) {
    /*----------------------------------------------------------------------------------------------
     * DOM MANIPULATION AND EVENT REGISTRATION
     *   This section is executed on page load to register events and otherwise manipulate the DOM.
     *--------------------------------------------------------------------------------------------*/
    $(function() {
        // Click event for each submission's status group
        $('header.sub').on('click', 'ul li a', function(event) {
            event.preventDefault();
            // Get group status from current link
            var submissionGroupStatus = $(this).data('group-name');
            // Update hash
            document.location.hash = submissionGroupStatus;
            // Try to destroy console
            // This allows the console to be initialized again
            try { $('div.results').consoleList('destroy'); } catch(exception) { /* Do nothing */ }
            // Start console
            BUNDLE.package.submissions.initialize({
                'status':submissionGroupStatus,
                'type':submissions.type,
                'entryOptionSelected': submissions.entryOptionSelected
            });
            // Clear all active links
            $('header.sub div.container ul li').removeClass('active');
            // Set active link
            $('header.sub a[data-group-name="' + submissionGroupStatus + '"]').parents('li').addClass('active');
        });
    });
    
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
     * Row callback
     * Builds the li
     */
    submissions.defaultRowCallback = function(li, record, index, displayFields) {
        // Li styles
        li.addClass('border border-gray-light rounded')
          .append(
                $('<h4>').addClass('color-gray-darkest originating-name border-bottom border-gray-light')
                .text(record['Originating Name'])
                .append(
                    $('<span>').addClass('request-id pull-right')
                        .append(record['Originating Request Id'])
                    )
                );
        /* Start left column */
        // Left column Originating Request Id
        var leftColumn = $('<div>').addClass('col-sm-4 border-right border-gray-light')
            

        if(record['Requested For'] !== null) {
            leftColumn.append(
                $('<div>').addClass('requested-for-label color-gray')
                    .append(displayFields['Requested For'] + '&nbsp;')
            ).append(
                $('<div>').addClass('requested-for-value color-black')
                    .append(record['Requested For'])
            );
        }

        // Draft date
        if(record['Customer Survey Status'] === 'In Progress') {
            var submissionDateLabel = $('<div>').addClass('submitted-label color-gray')
                .append(displayFields['Modified']);
            var submissionDateValue = $('<div>').addClass('submitted-value color-black')
                .append(((record['Modified'] !== null) ? moment(record['Modified'], 'MM/DD/YYYY H:mm:ss').format('MMMM DD, YYYY') : ""));
        // Closed date including completed approvals
        } else if(record['Request Status'] === 'Closed') {
            var submissionDateLabel = $('<div>').addClass('submitted-label color-gray')
                .append(displayFields['Closed']);
            var submissionDateValue = $('<div>').addClass('submitted-value color-black')
                .append(((record['Closed'] !== null) ? moment(record['Closed'], 'MM/DD/YYYY H:mm:ss').format('MMMM DD, YYYY') : ""));
        // Pending approval date
        } else if(record['Display Status'] === 'Awaiting Approval') {
            var submissionDateLabel = $('<div>').addClass('submitted-label color-gray')
                .append(displayFields['Sent']);
            var submissionDateValue = $('<div>').addClass('submitted-value')
                .append(((record['Sent'] !== null) ? moment(record['Sent'], 'MM/DD/YYYY H:mm:ss').format('MMMM DD, YYYY') : ""));
        // Submitted date
        } else {
            var submissionDateLabel = $('<div>').addClass('submitted-label color-gray')
                .append(displayFields['Submitted']);
            var submissionDateValue = $('<div>').addClass('submitted-value')
                .append(((record['Submitted'] !== null) ? moment(record['Submitted'], 'MM/DD/YYYY H:mm:ss').format('MMMM DD, YYYY') : ""));
        }
        var viewRequestLink = $('<div>').addClass('view-request-details')
            .append(
                $('<a>')
                    .attr('href', encodeURI(BUNDLE.applicationPath + 'ReviewRequest?csrv=' + record['Originating Id'] + '&excludeByName=Review Page&reviewPage=' + BUNDLE.config.reviewJsp))
                    .attr('target', '_self')
                    .append('View Submitted Form')
            );

        // Cannot open auto created requests
        ((record['Service Item Type'] !== BUNDLE.config.autoCreatedRequestType && record['Customer Survey Status'] !== 'In Progress') ? leftColumn.append(viewRequestLink) : submissionDateValue.css({'margin':'0 0 20px 0'}));
        leftColumn.prepend(submissionDateLabel, submissionDateValue);
        li.append(leftColumn);
        /* End left column */

        /* Start right column */
        var rightColumn = $('<div>').addClass('col-sm-8');
        var wrap = $('<div>').addClass('pull-left clearfix');

        // Template name
        var contentWrap = $('<div>').addClass('content-wrap');
        
        // Service item image
        if(record['Service Item Image'] !== null) {
            var imagePath;
            if(record['Service Item Image'].startsWith('http://')) {
                imagePath = record['Service Item Image'];
            } else {
                imagePath = BUNDLE.config.serviceItemImagePath + record['Service Item Image'];
            }
            var image = $('<div>').addClass('image')
                .append(
                    $('<img>').attr('width', '40')
                        .attr('src', imagePath)
                        .attr('alt', record['Originating Name'])
                )
            contentWrap.prepend(image);
        }

        // Validation status/display status and content wrap
        rightColumn.append(
            wrap.append(
                $('<div>').addClass('display-status color-tertiary-compliment')
                .append(record['Display Status'])
            ).append(contentWrap)
        );

        /* Start inner right column */
        var innerRightColumn = $('<div>').addClass('pull-right');
        // Set instance id used viewing activity (deals with approvals and children requests)
        var instanceId = record['Originating Id'];
        // Complete button
        if(record['Customer Survey Status'] === 'In Progress') {
            innerRightColumn.append(
                $('<a>').addClass('complete-request templateButton')
                    .attr('href', encodeURI(BUNDLE.applicationPath + 'DisplayPage?csrv=' + instanceId + '&return=yes'))
                    .append('Complete Form')
            );
        }
        // View activity details button
        if(record['Customer Survey Status'] !== 'In Progress' && record['Submit Type'] !== 'Approval') {
            innerRightColumn.prepend('<br />')
                .prepend(
                    $('<a>').addClass('view-activity templateButton')
                        .attr('href', encodeURI(BUNDLE.config.submissionActivityUrl + '&id=' + instanceId))
                        .attr('target', '_self')
                        .append('View Activity Details')
                );
        }
        // Complete approval button
        if(record['Customer Survey Status'] === 'Sent' && record['Submit Type'] === 'Approval') {
            innerRightColumn.prepend('<br />')
                .prepend(
                    $('<a>').addClass('view-activity templateButton')
                        .attr('href', encodeURI(BUNDLE.applicationPath + 'DisplayPage?csrv=' + record['Id']))
                        .attr('target', '_self')
                        .append('Complete Approval')
                );
        }
        rightColumn.append(innerRightColumn);
        li.append(rightColumn);
        /* End inner right column */
        /* End right column */
    };

    /**
     * Field callback
     */
    submissions.defaultFieldCallback = function(li, value, fieldname, label) {};

    /**
     * Complete callback
     */
    submissions.defaultCompleteCallback = function() {
        // If window height larger than content slide, get more results
        if($(window).height() > $('div.content-slide').height()) {
            $('nav.pagination ul.links li.active').next().find('a').trigger('click')
        }
    };
    
    // Define submissions display fields
    submissions.displayFields = {
        'Closed': 'CLOSED ON',
        'Customer Survey Status': 'Customer Survey Status',
        'Display Status': 'Display Status',
        'Id': 'Id',
        'Modified': 'STARTED ON',
        'Originating Id': 'Originating Id',
        'Originating Name': 'Originating Name',
        'Originating Request Id': 'Originating Request Id',
        'Request Id': 'REQUEST ID#',
        'Request Status': 'Request Status',
        'Requested For': 'REQUESTED FOR',
        'Sent': 'SENT ON',
        'Service Item Image': 'Service Item Image',
        'Service Item Type': 'Service Item Type',
        'Submit Type': 'Submit Type',
        'Submitted': 'SUBMITTED ON',
        'Template Name': 'Template Name'
    };
    
    // Define the common console options and callbacks
    submissions.consoleParams = { 
        // Define table specific properties
        'Open Request': {
            displayFields: submissions.displayFields,
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            fieldCallback: submissions.defaultFieldCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Closed Request': {
            displayFields: submissions.displayFields,
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            fieldCallback: submissions.defaultFieldCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Draft Request': {
            displayFields: submissions.displayFields,
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            fieldCallback: submissions.defaultFieldCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Pending Approval': {
            displayFields: submissions.displayFields,
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            fieldCallback: submissions.defaultFieldCallback,
            completeCallback: submissions.defaultCompleteCallback
        },
        'Completed Approval': {
            displayFields: submissions.displayFields,
            sortField: 'Modified',
            rowCallback: submissions.defaultRowCallback,
            fieldCallback: submissions.defaultFieldCallback,
            completeCallback: submissions.defaultCompleteCallback
        }
    };
    
    /**
     * Initializes the Subimssions console.
     * 
     * @param {Object} options.
     * @param {Number} options.entryOptionSelected is how many results to show.
     * @param {String} options.type is either requests are approvals.
     * @param {String} options.status is the submission status group (Open, Closed, Pending).
     * @returns {undefined}
     */
    submissions.initialize = function(options) {
        // Define options
        options = options || {};
        // Define type, requests or approvals
        submissions.type = options.type || 'requests';
        // Define status (the status group the submissions belong under)
        submissions.status = options.status || 'Open Request';
        // Determine if the status is a real status
        var statusCheck = true;
        $.each(submissions.consoleParams, function(index) { 
            if(submissions.status === index) {
                statusCheck = false;
                return false;
            }
        });
        if(statusCheck) {
            submissions.status = (submissions.type === 'requests') ? 'Open Request': 'Pending Approval';
        }
        // Define entry options selected
        submissions.entryOptionSelected = options.entryOptionSelected || 5;
        // Active link class
        var activeNavSelector = $('ul li.requests');
        // Setup active nav selector based on type
        if(submissions.type === 'approvals') { activeNavSelector = $('ul li.approvals'); };
        // Add active link
        activeNavSelector.addClass('active').append($('<div>').addClass('arrow-left'));
        // Set active group link
        $('header.sub a[data-group-name="' + submissions.status + '"]').parents('li').addClass('active');
        // Position scroll for small devices on the header containing the submission group links
        var activeLinkPosition = $('header.sub div.container > ul li.active').position();
        if(activeLinkPosition !== undefined && activeLinkPosition.left !== undefined) { 
            $('header.sub div.container > ul').scrollLeft(activeLinkPosition.left); 
        }
        // Define the console specific properties
        var params = submissions.consoleParams[submissions.status];
        var loader = $('div#loader');
        var responseMessage = $('div.results-message');
        // Define console options
        var consoleOptions = {
            displayFields: params.displayFields,
            paginationPageRange: 5,
            pagination: true,
            entryOptionSelected: submissions.entryOptionSelected,
            entryOptions: [5, 10, 20, 50, 100],
            entries: false,
            info: false,
            emptyPreviousResults: false,
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
                    url: BUNDLE.config.submissionsUrl + '&callback=submissions&qualification=' + submissions.status + '&offset=' + index + '&limit=' + limit + '&orderField=' + sortOrderField + '&order=' + sortOrder,
                    beforeSend: function(jqXHR, settings) {
                        responseMessage.empty();
                        loader.show();
                    },
                    success: function(data, textStatus, jqXHR) {
                        loader.hide();
                        if(data.count > 0) {
                            widget.buildResultSet(data.data, data.count);
                            //$('h3').hide();
                            widget.consoleList.show();
                            // Allow scroll to fire again
                            killScroll = false;
                        } else {
                            $('section.container nav.submissions-navigation').show();
                            responseMessage.html('<h4>There Are No ' + submissions.status + 's</h4>').show();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        loader.hide();
                        responseMessage.html(errorThrown).show();
                    }
                });
            },
            rowCallback: function(li, record, index, displayFields) { params.rowCallback.call(this, li, record, index, displayFields); },
            fieldCallback: function(li, value, fieldname, label) { params.fieldCallback.call(this, li, value, fieldname, label); },
            completeCallback: function() { params.completeCallback.call(this); }
        };
        // Start console
        BUNDLE.libraries.widgets.ConsoleList('div.results', consoleOptions);
        // Keeps the scroll from firing until ajax completed
        var killScroll = false;
        // Paginate more results when user is close to bottom of page on scroll
        $(window).on('scroll', function(event) {    
            if(($(window).scrollTop() + window.innerHeight + 300) > $(document).height()) {
                if (killScroll === false) {
                    // Prevent event stacking
                    killScroll = true;
                    $('nav.pagination ul.links li.active').next().find('a').trigger('click');
                }
            }
        });
    };

});