jQuery(document).ready(function() {
    // Infield Label for user search
    jQuery('.infield').inFieldLabels();
    // Display the "request for" information in the selectors specified
    jQuery('#requestForName').html(jQuery('.firstName input').val() +'&nbsp;'+ jQuery('.lastName input').val());
    jQuery('#requestForEmail').html(jQuery('.email input').val());

    // Instantiate classes
    var dialogInit = new DialogInitializer();
    var tabsInit = new TabsInitializer();
    var contactEdit = new ContactEdit();

    // On click event for starting tabs and dialog
    jQuery('.editContactDetails').on('click', function(event) {
        event.preventDefault(); 
        // Fluent interface to set properties and start tabs
        tabsInit.setTabsSelector('#tabs')
                .setSelectedTab(jQuery(this).data('id'))
                .setCreateAction(tabsCreate)
                .setSelectAction(tabsSelect)
                .startTabs();
        
        // Fluent interface to set properties and start dialog
        dialogInit.setDialogSelector('#contactSetup')                 
                  .setOpenAction(dialogOpen)
                  .setCloseAction(dialogClose)
                  .startDialog();
    });

    // On submit event for bridged lookup
    jQuery('#lookupForm').on('submit', function(event) {
        // Prevent default action.
        event.preventDefault();
        // start lookup
        contactEdit.lookup();
    });
    
    // On click event for declining contact update
    jQuery('#noContactEdit').on('click', function() {
        // Reset
        contactEdit.lookupReset();
    });

    // Functions for DialogInitializer
    function dialogOpen(dialogObj, event, ui) {
        // Cancel behavior
        jQuery('#close').on('click', function() {
            jQuery('#contactSetup').dialog('close');
        });
    }
    function dialogClose(dialogObj, event, ui) {
        // Destory dialog
        jQuery(dialogObj).dialog('destroy');
        // Reset
        contactEdit.lookupReset();
    }

    // Functions for the TabsInitializer
    function tabsCreate(tabsObj, event, ui) {
        tabRouter(ui.index);
    }
    function tabsSelect(tabsObj, event, ui) {
        contactEdit.lookupReset();
        jQuery('input[name="searchValue"]').val('');
        tabRouter(ui.index);
    }

    // Function for routing the lookup display and action based on which tab is selected
    function tabRouter(index) {
        // Remove delegated click handler
        jQuery('#yesContactEdit').off('click');
        if(index <= 1) {
            jQuery('#lookup').show();
        } else {
            jQuery('#lookup').hide();
        }

        // On click event for saving contact information
        jQuery('#yesContactEdit').on('click', function() {
            // Set route action
            if(index == 0) {
                contactEdit.requestForEdit();
            } else if(index == 1) {
                contactEdit.additionalContactEdit();
            } else {
                contactEdit.alternateContactEdit();
            }
            // Hide yes no
            jQuery('#userFound').hide();
            // Display message
            jQuery('#yesContactEditMsg').html('<div class="message alert alert-success"><a class="close" data-dismiss="alert">x</a> User Updated</div>');
        });
    }

    /**
     * ContactEdit Class
     */
    function ContactEdit() {
        'use strict';

        /**
         * @return ContactEdit
         */
        this.lookup = function() {
            // Before retrieve
            this.lookupReset();
            // Loading message
            blockUICustom('<h1>searching...</h1>', '300px');
            // Set object params
            var parameters = {};
            parameters[jQuery('input[name="parameter"]').val()] = jQuery('input[name="searchValue"]').val();
            // Instantiate object
            var connector = new KD.bridges.BridgeConnector();
            // Retrieve
            connector.retrieve(jQuery('input[name="model"]').val(), jQuery('input[name="qualification"]').val(), {
                parameters: parameters,
                success: function(record) {
                    if(!record.attributes) {
                        // Display error message inside alert
                        jQuery('#searchMsg').html('<div class="message alert alert-error"><a class="close" data-dismiss="alert">x</a> No Account Found</div>');
                        jQuery.unblockUI();
                    } else {
                        console.log(record);
                        jQuery.each(record.attributes, function(index, value) {
                            console.log(value)
                            jQuery('#user').append('<div id="'+index+'" class="userDetail">'+value+'</div>');
                            jQuery('#searchResult').show();
                            jQuery('#userFound').show();
                            jQuery.unblockUI();
                        });
                    }
                },
                failure: function(arg) {
                    // Display error message inside alert
                    jQuery('#searchMsg').html('<div class="message alert alert-error"><a class="close" data-dismiss="alert">x</a> '+arg.responseMessage+'</div>');
                    jQuery.unblockUI();
                }
            });
            return this;
        }

        /**
         * @return ContactEdit
         */
        this.lookupReset = function() {
            jQuery('#yesContactEditMsg').empty();
            jQuery('#searchMsg').empty();
            jQuery('#requestForYesResponse').empty();
            jQuery('#searchResult').hide();
            jQuery('#user').empty();
            return this;
        }

        /**
         * @return ContactEdit
         */
        this.additionalContactEdit = function() {
            console.log('additionalContactEdit')
            // Loop through each detail and update the hidden input submission values
            jQuery('.userDetail').each(function(index, value) {
                jQuery('.addContact-'+jQuery(this).attr('id')+' input').val(jQuery(this).text());
            });
            return this;
        }

        /**
         * @return ContactEdit
         */
        this.alternateContactEdit = function() {
            console.log('alternateContactEdit')
            return this;
        }

        /**
         * @return ContactEdit
         */
        this.requestForEdit = function() { 
            console.log('requestForEdit')
            // Display the request for information in the selectors specified
            jQuery('#requestForName').html(jQuery('#firstName').text() +'&nbsp;'+ jQuery('#lastName').text());
            jQuery('#requestForEmail').html(jQuery('#email').text());
            // Loop through each detail and update the hidden input submission values
            jQuery('.userDetail').each(function(index, value) {
                jQuery('.'+jQuery(this).attr('id')+' input').val(jQuery(this).text());
            });
            return this;
        }
    }
});