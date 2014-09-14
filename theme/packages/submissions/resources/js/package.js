(function($, _) {    
    /*----------------------------------------------------------------------------------------------
     * PACKAGE INIALIZATION
     *   This code is executed when the Javascript file is loaded
     *--------------------------------------------------------------------------------------------*/
    
    // Ensure the BUNDLE global object exists
    BUNDLE = BUNDLE || {};
    // Create the package namespace
    BUNDLE.package = BUNDLE.package || {};
    // Create a scoped alias to simplify references
    var package = BUNDLE.package;
    // Determine if startsWith exists
    if (typeof String.prototype.startsWith != 'function') {
      // Define startsWith
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }
})(jQuery, _);