/**
 * Build CSS can be used with Require JS optimization suite to minify css files for this Bundle.
 * NOTE: Node JS and r.js are a required to run this file.
 * 
 * @example from bash (Unix Shell) using Node JS with r.js,
 * which assumes you are inside bundle/setup/requirejs/:
 *  $ sudo node ../../libraries/requirejs/r.js -o buildCss.js
 * 
 * More informaiton about requirejs optimization at:
 * http://requirejs.org/docs/optimization.html
 */
({
  cssIn: '../sass/application.css',
  out: 'application.min.css',
  optimizeCss: 'standard', // Minifies to one line
  preserveLicenseComments: false, // Removes comments.
})