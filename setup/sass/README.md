# SASS Setup

## Overview

Use  [SASS](http://sass-lang.com/) to organize your CSS code with functions (mixins) and variables as well as minification capabilities.

## Dependencies

[Ruby](https://www.ruby-lang.org/) and [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer).

## Installation
Installing SASS requires Ruby and depends on the operating system you are working with.  More documentation can be found  [here](http://sass-lang.com/install) for setting up SASS on different operating systems.

After Ruby is installed, you would execute the following command to install SASS:

```shell
gem install sass
```

The current SASS configuration, which is in **bundle/setup/sass/application.scss**, is setup for importing .css and .scss.  SASS does not support .css imports. In order to import .css files using SASS, install the [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer):

```shell
gem install --pre sass-css-importer
```

## Build

You can process **bundle/setup/sass/application.scss** so it's a single minified version of all the css files required by common:

```shell
sass -r sass-css-importer application.scss application.css --style compressed
```