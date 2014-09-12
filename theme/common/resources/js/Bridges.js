(function($) {
    /*----------------------------------------------------------------------------------------------
     * BRIDGES INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the bridges namespace
    BUNDLE.bridges = BUNDLE.bridges || {};
    // Create a scoped alias to simplify references to BUNDLE.bridges
    var bridges = BUNDLE.bridges;
    
    /**
     * @param {BridgeConnector}
     * @example 
     * new KD.bridges.BridgeConnector();
     * @param {String} model, I.E. People
     * @param {String} qualification, I.E. By Email
     * @param {Object} parameters, I.E. email
     * @param {Array} attributes, I.E. Login ID, First Name, Middle Name
     * @param {Function} successFunction
     * @param {Function} failureFunction
     * @returns {undefined}
     */
    bridges.lookupRetrieve = function(bridgeConnector, model, qualification, parameters, attributes, successFunction, failureFunction) {
        // Retrieve
        bridgeConnector.retrieve(model, qualification, {
            attributes: attributes,
            parameters: parameters,
            success: function(record) {
                successFunction(record);
            },
            failure: function(arg) {
                failureFunction(arg);
            }
        });
    };

    /**
     * @param {BridgeConnector}
     * @example 
     * new KD.bridges.BridgeConnector();
     * @param {String} model, I.E. People
     * @param {String} qualification, I.E. By Email
     * @param {Object} parameters, I.E. email
     * @param {Array} attributes, I.E. Login ID, First Name, Middle Name
     * @param {Object}, metadata, I.E. what expectations you have with the request, sorting, page size, offset
     * @example
     * {'order': '<%=attribute["First Name"]%>:DESC,<%=attribute["Last Name"]%>:ASC', 'pageSize': 2, 'offset': 3}
     * @param {Function} successFunction
     * @param {Function} failureFunction
     * @returns {undefined}
     */
    bridges.lookupSearch = function(bridgeConnector, model, qualification, parameters, attributes, metadata, successFunction, failureFunction) {
        // Search
        bridgeConnector.search(model, qualification, {
            attributes: attributes,
            parameters: parameters,
            metadata: metadata,
            success: function(list) {
                successFunction(list);
            },
            failure: function(arg) {
                failureFunction(arg);
            }
        });
    };
    
})(jQuery);