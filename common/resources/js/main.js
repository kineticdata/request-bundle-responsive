// Require js config
require.config({
    baseUrl: BUNDLE.bundlePath,
    paths: {
        common: 'common/resources/js',
        libraries: 'libraries'
    }
});
// Require library modules
require(['libraries/placeholders/placeholders.min'], function(placeholders) {});
require(['libraries/moment/moment'], function(moment) {});
require(['libraries/jquery/jquery-1.11.0.min'], function(jquery) {});
require(['libraries/jquery/jquery-ui-1.10.3.custom.min'], function(jqueryUi) {});
require(['libraries/jquery.cookie/jquery.cookie'], function(jqueryCookie) {});
require(['libraries/jquery.md5/jquery.md5'], function(jqueryMd5) {});
require(['libraries/bootstrap/js/bootstrap.min'], function(bootstrap) {});
require(['libraries/jquery.qtip/jquery.qtip.min'], function(qtip) {});
require(['libraries/underscore/underscore-min'], function(underscore) {});
// Require common modules
require(["common/client"], function(client) {});
require(["common/ajaxLogin"], function(ajaxLogin) {});
require(["common/Bridges"], function(bridges) {});
require(["common/common"], function(common) {});