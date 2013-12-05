$(function() {
    // Get query string parameters into an object
    var urlParameters = getUrlParameters();
    // Determine if type is a real type
    if(urlParameters.type !== 'requests' && urlParameters.type !== 'approvals') {
        urlParameters.type = 'requests';
    }
    // Determine if the status is a real status
    var statusCheck = true;
    $.each(tableParams, function(index) { 
        if(urlParameters.status === index) {
            statusCheck = false;
            return false;
        }
    });
    if(statusCheck) {
        if(urlParameters.type === 'requests') {
            urlParameters.status = 'Open Request';
        } else {
             urlParameters.status = 'Pending Approval';
        }
    }
    // Active link class
    var activeNavSelector = $('ul li.requests');
    if(urlParameters.type === 'approvals') { activeNavSelector = $('ul li.approvals') };
    activeNavSelector.addClass('active').append($('<div>').addClass('arrow-left'));
    // Set active link
    $('header.sub div.container ul li').each(function(index, value) {
        if(urlParameters.status == $(this).find('a').data('group-name')) {
            $(this).addClass('active');
        }
    });
    // Get table specific properties
    var table = tableParams[urlParameters.status];
    // How many entries to show on page load
    var entryOptionSelected = 5;
    // Start table
    initialize(table, urlParameters.status, entryOptionSelected);
});

/**
 * Define the common table options and callbacks
 */
var tableParams = { 
    // Define table specific properties
    'Open Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Submitted': 'Submitted',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Submitted',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    },
    'Closed Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Closed': 'Closed',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Closed',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    },
    'Draft Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Modified': 'Started',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: requestsParkedCompleteCallback
    },
    'Pending Approval': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Sent': 'Sent',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Sent',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: approvalsPendingCompleteCallback
    },
    'Completed Approval': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Submitted': 'Submitted',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Submitted',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    }
};

/*
 * Default row callback
 */
function defaultRowCallback(tr, value, index) {
    // This is used to create new links for the row dropdown
    tr.addClass('new');
    tr.data('Originating Id', value['Originating Id']);
    tr.data('Originating Request Id', value['Originating Request Id']);
    tr.data('Id', value['Id']);
}

/*
 * Default column callback
 */
function defaultColumnCallback(td, value, fieldname, label) {
    // Note::jQuery data doesn't work on td
    if(fieldname === 'Sent' || fieldname === 'Submitted' || fieldname === 'Closed' || fieldname === 'Modified') {
        td.attr('data-timestamp', ((value !== null) ? moment(value).format('YYYY-MM-DD hh:mm:ss a') : ""))
        .text(
            moment(td.text()).fromNow()
        )
    }
}

/**
 * Default Complete callback
 */
function defaultCompleteCallback() {
    // Create Review and activity details links
    this.consoleTable.on('click', 'table tbody tr.new', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Prevents recreation of link below since onclick event looks for tr.new
        $(this).removeClass('new');
        $(this).next('tr.footable-row-detail')
            .find('div.footable-row-detail-inner')
            .append(
                $('<div>').addClass('footable-row-detail-row').append(
                    $('<a>').addClass('requests view-activity-details')
                        .attr('href', 'javascript:void()')
                        .attr('data-submission-id', $(this).data('Originating Id'))
                        .append('View Activity Details')
                )
            ).append(
                $('<div>').addClass('footable-row-detail-row').append(
                    $('<a>').addClass('requests review')
                        .attr('href', 'javascript:void()')
                        .attr('data-submission-id', $(this).data('Originating Id'))
                        .append('View Submitted Form')
                )
            ); 
    });
    // Unobstrusive live on click event for view activity details
    this.consoleTable.on('click touchstart', 'a.view-activity-details', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.config['submissionActivityUrl'] + '&id=' + $(this).data('submission-id');
    });

    // Unobstrusive live on click event for review request
    this.consoleTable.on('click touchstart', 'a.review', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'ReviewRequest?excludeByName=Review%20Page&csrv=' + $(this).data('submission-id');
    });
}

/**
 * Complete callback for parked requests
 */
function requestsParkedCompleteCallback() {
    // Unobstrusive live on click event for complete form
    this.consoleTable.on('click touchstart', 'a.complete-form', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('submission-id') + '&return=yes';
    });
    // Create complete form link
    this.consoleTable.on('click', 'table tbody tr.new', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Prevents recreation of link below since onclick event looks for tr.new
        $(this).removeClass('new');
        $(this).next('tr.footable-row-detail')
            .find('div.footable-row-detail-inner')
            .append(
                $('<div>').addClass('footable-row-detail-row').append(
                    $('<a>').addClass('requests complete-form')
                        .attr('href', 'javascript:void()')
                        .attr('data-submission-id', $(this).data('Originating Id'))
                        .append('Complete Form')
                )
            ); 
    });
}

/**
 * Complete callback for pending requests
 */
function approvalsPendingCompleteCallback() {
    // Unobstrusive live on click event for complete form
    this.consoleTable.on('click touchstart', 'a.complete-approval', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('submission-id');
    });
    // Create complete approval link
    this.consoleTable.on('click', 'table tbody tr.new', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Prevents recreation of link below since onclick event looks for tr.new
        $(this).removeClass('new');
        $(this).next('tr.footable-row-detail')
            .find('div.footable-row-detail-inner')
            .append(
                $('<div>').addClass('footable-row-detail-row').append(
                    $('<a>').addClass('requests complete-approval')
                        .attr('href', 'javascript:void()')
                        .attr('data-submission-id', $(this).data('Id'))
                        .append('Complete Approval')
                )
            ); 
    });
}

function initialize(table, status, entryOptionSelected) {
    var loader = $('div#loader');
    var responseMessage = $('div.results-message');
    // Start list
    $('div.results').consoleTable({
        displayFields: table.displayFields,
        range: 3,
        pagination: true,
        entryOptionSelected: entryOptionSelected,
        entryOptions: [5, 10, 20, 50, 100],
        entries: true,
        info: true,
        sortOrder: 'DESC',
        serverSidePagination: true,
        sortOrderField: table.sortField,
        dataSource: function(limit, index, sortOrder, sortOrderField) {
            var widget = this;
            // Execute the ajax request.
            BUNDLE.ajax({
                dataType: 'json',
                cache: false,
                type: 'get',
                url: BUNDLE.packagePath + 'interface/callbacks/submissions.json.jsp?qualification=' + status + '&offset=' + index + '&limit=' + limit + '&orderField=' + sortOrderField + '&order=' + sortOrder,
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
                        responseMessage.html('<h4>There Are No ' + status + '</h4>').show();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    loader.hide();
                    responseMessage.html(errorThrown).show();
                }
            });
        },
        rowCallback: function(tr, value, index) { table.rowCallback.call(this, tr, value, index); },
        columnCallback: function(td, value, fieldname, label) { table.columnCallback.call(this, td, value, fieldname, label); },
        completeCallback: function() { 
            // Foo tables ui
            this.table.find('thead tr th:nth-child(3)').attr('data-hide', 'phone');
            this.table.find('thead tr th:nth-child(4)').attr('data-hide', 'phone');
            this.table.footable();
            this.table.trigger('footable_initialize');
            table.completeCallback.call(this); 
        }
    });
}