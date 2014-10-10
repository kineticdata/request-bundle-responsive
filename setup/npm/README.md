# Browserify Setup

[![NPM](https://nodei.co/npm/browserify.png?downloads=true&stars=true)](https://nodei.co/npm/browserify/)

## Overview

Use a [node](http://nodejs.org)-style `require()` to organize your browser code
and load modules installed by [npm](https://npmjs.org).

#### package.json

```json
{
  "name": "browserify",
  "version": "1.0.0",
  "description": "browser-side require() the node way",
  "main": "application.js",
  "scripts": {
    "build-debug": "browserify application.js -d --s application > dist/application.js",
    "build-min": "browserify application.js --s application | uglifyjs -c > dist/application.min.js",
    "build": "npm run build-debug && npm run build-min",
    "watch": "watchify application.js -d --s application -o dist/application.js -v"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/kineticdata/request-bundle-responsive"
  },
  "keywords": [
    "responsive",
    "fluid",
    "browser",
    "require",
    "commonjs",
    "commonj-esque",
    "bundle",
    "npm",
    "javascript"
  ],
  "author": {
    "name": "Kinetic Data",
    "url": "http://www.kineticdata.com/"
  },
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/kineticdata/request-bundle-responsive/issues"
  },
  "homepage": "https://github.com/kineticdata/request-bundle-responsive",
  "devDependencies": {
    "browserify": "^6.0.3",
    "uglify-js": "^2.4.15",
    "watchify": "^2.0.0"
  },
  "dependencies": {
    "jquery": "^1.11.1",
    "jquery-ui": "^1.10.5",
    "jquery.cookie": "^1.4.1",
    "moment": "^2.8.3",
    "qtip2": "^2.2.0",
    "underscore": "^1.7.0"
  }
}
```
## Dependencies
This setup can be leveraged to manage modules using npm. The following dependencies are required for this setup to work:

```json
 "devDependencies": {
    "browserify": "^6.0.3",
    "uglify-js": "^2.4.15",
    "watchify": "^2.0.0"
  },
  "dependencies": {
    "jquery": "^1.11.1",
    "jquery-ui": "^1.10.5",
    "jquery.cookie": "^1.4.1",
    "moment": "^2.8.3",
    "qtip2": "^2.2.0",
    "underscore": "^1.7.0"
  }
```

## Installation

Install [node.js](http://nodejs.org) to start using npm to manage the dependencies above.  These dependencies can be installed using bash (Unix Shell) in bundle/setup/npm.  These commands use [npm install](https://www.npmjs.org/doc/cli/npm-install.html). Navigate to bundle/setup/npm and run the following commands:

```shell
npm install --save-dev browserify watchify uglify-js
npm install -g browserify --save
npm install -g watchify --save
npm install -g uglify-js --save
npm install install moment --save
npm install jquery --save
npm install jquery-ui --save
```

Once the required dependencies for package.json are setup, a minified installation of the JavaScript dependencies including bundle common JavaScript can be generated using the scripts from package.json.  

```json
"scripts": {
    "build-debug": "browserify application.js -d --s application > dist/application.js",
    "build-min": "browserify application.js --s application | uglifyjs -c > dist/application.min.js",
    "build": "npm run build-debug && npm run build-min",
    "watch": "watchify application.js -d --s application -o dist/application.js -v"
  }
```

These scripts use bundle/setup/npm/application.js to create the desired output.  For example, these scripts can be executed in bundle/setup/npm using bash:

```shell
npm run build-min
```