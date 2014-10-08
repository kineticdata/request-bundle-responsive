/**
 * Build can be used wiht requirejs optimization suite to build a UI distribution for this Bundle.
 * NOTE: Node JS and r.js are a required to run this file.
 * 
 * @example from bash (Unix Shell) using node js with r.js:
 *  $ sudo node ../../libraries/requirejs/r.js -o build.js
 * 
 * More informaiton about requirejs optimization at:
 * http://requirejs.org/docs/optimization.html
 */
({
    appDir: '../../../responsive/', // Defines the application root, which is Bundle root.
    baseUrl: 'common/resources/js', // Defines the base directory where main is stored.
    dir: './dist', // Defines the distribution output directory
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/, // Exclude this file
    // Define the paths that are required by main to process this distribution
    paths: {
        placeholders: 'libraries/placeholders/placeholders.min',
        moment: 'libraries/moment/moment',
        jquery: 'libraries/jquery/jquery-1.11.0.min',
        jqueryUi: 'libraries/jquery/jquery-ui-1.10.3.custom.min',
        jqueryCookie: 'libraries/jquery.cookie/jquery.cookie',
        jqueryMd5: 'libraries/jquery.md5/jquery.md5',
        bootstrap: 'libraries/bootstrap/js/bootstrap.min',
        qtip: 'libraries/jquery.qtip/jquery.qtip.min',
        underscore: 'libraries/underscore/underscore-min',
        client: 'common/resources/js/client',
        ajaxLogin: 'common/resources/js/ajaxLogin',
        bridges: 'common/resources/js/Bridges',
        common: 'common/resources/js/common'
    },
    // Define dependencies
    shim: {
        jqueryUi: {
            'export':'$',
            'deps' : ['jquery']
        },
        jqueryCookie: {
            'deps' : ['jquery']
        },
        jqueryMd5: {
            'deps' : ['jquery']
        },
        bootstrap: {
            'deps' : ['jquery']
        },
        qtip: {
            'deps' : ['jquery']
        },
        underscore: {
            'export' :'_'
        }
    }
})