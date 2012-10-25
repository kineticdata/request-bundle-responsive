/**
 * On document ready we will load the tables present on the page and bind events
 * that handle the navigation tabs as well as the table controls.
 */
$(document).ready(function() {
    /**
     * Define the common table options that all of the tables on this page will
     * share.  Here we define the form the tables represent, the fields present,
     * the default sort field and order, the default page size and number.
     */
    var tableParams = {
        form: "KS_SRV_CustomerSurvey_base",
        fields: {
            'Request Id'   : '1',
            'Submitted'    : '700001285',
            'Service Item' : '700001000',
            'Status'       : '700002400',
            'First Name'   : '300299800',
            'Last Name'    : '700001806',
            'Instance Id' : '179'
        },
        sortField: "Request Id",
        sortOrder: 0,
        pageSize: 0,
        pageNumber: 0,
        // Define table specific properties
        "Requests Open": {
            container: '#tableContainerRequestsOpen',
            qualification: 'Requests Open',
            rowCallback: defaultRowCallback,
            completeCallback: requestsOpenClosedCompleteCallback
        },
        "Requests Closed": {
            container: '#tableContainerRequestsClosed',
            qualification: 'Requests Closed',
            rowCallback: defaultRowCallback,
            completeCallback: requestsOpenClosedCompleteCallback
        },
        "Requests Parked": {
            container: '#tableContainerRequestsParked',
            qualification: 'Requests Parked',
            rowCallback: defaultRowCallback,
            completeCallback: defaultCompleteCallback
        },
        "Approvals Pending": {
            container: '#tableContainerApprovalsPending',
            qualification: 'Approvals Pending',
            rowCallback: defaultRowCallback,
            completeCallback: defaultCompleteCallback
        },
        "Approvals Completed": {
            container: '#tableContainerApprovalsCompleted',
            qualification: 'Approvals Completed'
        }
    }

    $('.tableLink').on('click', function(event) {
        event.preventDefault();
        // Loading Message  
        blockUICustom('<h1>Loading...</h1>', '300px');  
        // Get table specific properties
        var table = tableParams[$(this).data('group-name')];
        // Instantiate object
        var arsTable = new ArsTable();
        // Fluent interface to set properties and build url
        arsTable.setForm(tableParams.form)                 
                .setFields(tableParams.fields)
                .setFieldIds()
                .setSortField(tableParams.sortField)
                .setSortOrder(tableParams.sortOrder)
                .setPageSize(tableParams.pageSize)
                .setPageNumber(tableParams.pageNumber)
                .setQualification(table.qualification)
                .setUrl(BUNDLE.bundlePath + 'common/interface/callbacks/arsTable.json.jsp');
            
        // Hide elements
        $('#catalogContainer').hide(); 
        $('#submissionsTable').hide();
        $('.tableContainer').hide();
        // Datatable
        $(table.container).dataTable({
            'bDestroy': true,
            'iDisplayStart': 0,
            'aLengthMenu': [[5, 10, 15, 20, 25, 50, 75, 100 , -1], [5, 10, 15, 20, 25, 50, 75, 100, 'All']],
            'b$UI': true,
            'sAjaxDataProp': 'records',
            'bProcessing': true,
            //'bServerSide': true,
            'sAjaxSource': arsTable.getUrl(),
            'fnServerData': function (sSource, aoData, fnCallback, oSettings) {
                
                //console.log(sSource)
                //console.log(aoData)
                
                oSettings.jqXHR = BUNDLE.ajax({
                  'dataType': 'json',
                  'type': 'POST',
                  'url': sSource,
                  'data': aoData,
                  'success': fnCallback
                }); 
            },
            'sPaginationType': 'full_numbers',
            /**
             * ColumnDefs has many options for manipulation of column specific data
             * mRender can be used to render column data from json object
             */
            'aoColumnDefs': [
                {
                    'aTargets': [0],
                    'sName': 'Request ID',
                    'mRender': function (data, type, full) {
                        return data;                        
                    }                 
                },
                {
                    'aTargets': [1],
                    'sName': 'Submitted',
                    'mRender': function (data, type, full) {
                        return data;                       
                    }                 
                },
                {
                    'aTargets': [2],
                    'sName': 'Service Item',
                    'mRender': function (data, type, full) {
                        return data;                       
                    }                 
                },
                {
                    'aTargets': [3],
                    'sName': 'Status',
                    'mRender': function (data, type, full) {
                        return data;                      
                    }                 
                },
            ],
            'fnRowCallback': function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                table.rowCallback(table, nRow, aData, iDisplayIndex, iDisplayIndexFull);
            },
            'fnInitComplete': function(oSettings, json) {
                table.completeCallback(table, oSettings, json);
                console.log('fnInitComplete')
                // Show elements
                $('#submissionsTable').fadeIn();
                $(table.container).show();
                // Turn off loading message
                $.unblockUI();
            }
        });         
    });
});

/**
 * Default row callback, which will add csrv as a data attribute to each row
 */
function defaultRowCallback(table, nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    $(nRow).data('csrv', aData[6]);
}

/**
 * Default complete callback, which will bind a $ live on click event.
 * It uses the data attribute csrv as part of the url param in the link
 */
function defaultCompleteCallback(table, oSettings, json) {
    // Remove all delegated click handlers from all rows
    $('#testDataTable tbody').off('click', 'tr');
    // Click Event
    $('#testDataTable tbody').on('click', 'tr', function() {
        window.open('/kinetic/DisplayPage?csrv=' + $(this).data('csrv'));
    });
}

/**
 * Custom complete callback, which will bind a $ live on click event.
 * It uses the data attribute csrv as part of the url param in the link
 */
function requestsOpenClosedCompleteCallback(table, oSettings, json) {
    // Remove all delegated click handlers from all rows
    $(table.container + ' tbody').off('click', 'tr');
    // Click Event
    $(table.container + ' tbody').on('click', 'tr', function() {
        var csrv = $(this).data('csrv');
        BUNDLE.ajax({
            url: BUNDLE.packagePath + 'interface/callbacks/submissionDetails.html.jsp?csrv=' + csrv,
            success: function(data) {
                var element = $(data);
                $('#dialogContainer').append(element);
                element.dialog({
                    closeText: 'close',
                    width: 500
                });
                $(element).parent().append('<div class="kd-shadow"></div>');
            }
        });
    }); 
}