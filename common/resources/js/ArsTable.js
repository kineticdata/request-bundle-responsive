/**
 * ArsTable class
 * This could be like a wrapper for the arsTable.json.jsp if the TODO is completed below
 * @TODO, convert arsTable.json.jsp into an object? 
 * Add to object lib with proper name and then take arsTable.json.jsp and only
 * use it to run create object and set params
 */
function ArsTable() {
    // Strict
    'use strict';
    
    /**
     * @var string private
     */
    var form = new String();
    
     /**
     * @var string private
     */
    var fields = {};
    
    /**
     * @var string private
     */
    var fieldIds = {};
    
    /**
     * @var string private
     */
    var sortField = new String();
    
    /**
     * @var string private
     */
    var sortOrder = new String();
    
    /**
     * @var int private
     */
    var pageSize = new String();
    
    /**
     * @var int private
     */
    var pageNumber = new String();
    
    /**
     * @var string private
     */
    var qualification = new String();
    
    /**
     * @var string private
     */
    var url = new String();
    
    /**
     * @param formTemplate
     * @return Table
     */
    this.setForm = function(formTemplate) {
        form = formTemplate;
        return this;
    }
    
    /**
     * @param formFields
     * @return Table
     */
    this.setFields = function(formFields) {
        fields = formFields;
        return this;
    }
    
    /**
     * @return Table
     */
    this.setFieldIds = function() {
        fieldIds = '';
        var index = 0;
        for(var field in fields) {
            if(fields.hasOwnProperty(field)) {
                if (index > 0) {
                    fieldIds += ',';
                }
                fieldIds += fields[field];
                index++;
            }
        }  
        return this;
    }
    
    /**
     * @param field
     * @return Table
     */
    this.setSortField = function(field) {
        sortField = field;
        return this;
    }
    
    /**
     * @param order
     * @return Table
     */
    this.setSortOrder = function(order) {
        sortOrder = order;
        return this;
    }
    
    /**
     * @param size
     * @return Table
     */
    this.setPageSize = function(size) {
        pageSize = size;
        return this;
    }
    
    /**
     * @param number
     * @return Table
     */
    this.setPageNumber = function(number) {
        pageNumber = number;
        return this;
    }
    
    /**
     * @param tableQualification
     * @return Table
     */
    this.setQualification = function(tableQualification) {
        qualification = tableQualification;
        return this;
    }
    
    /**
     * @param webServiceUrl
     * @return Table
     */
    this.setUrl = function(webServiceUrl) {
        // Build a timestamp that will be used as an argument for the noCache paramter
        var date = new Date();
        var timestamp = date.getTime();
        url = webServiceUrl +
        '?form=' + form +
        '&qualification=' + qualification +
        '&fieldIds=' + fieldIds +
        '&sortFieldId=' + fields[sortField] +
        '&sortOrder=' + sortOrder +
        '&pageSize=' + pageSize +
        '&pageNumber=' + pageNumber +
        '&noCache=' + timestamp;
        return this;
    }
    
    /**
     * @return url complete for arsys
     */
    this.getUrl = function() {
        return url;
    }
}