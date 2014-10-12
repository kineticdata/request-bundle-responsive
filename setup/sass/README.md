# SASS Setup

## Overview

Use  [SASS](http://sass-lang.com/) to organize your CSS code with functions (mixins) and variables as well as minification capabilities.

## Dependencies

[Ruby](https://www.ruby-lang.org/), [SASS](http://sass-lang.com/) and [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer).

## Installation
SASS requires [Ruby](https://www.ruby-lang.org/).  More documentation can be found  [here](http://sass-lang.com/install) for setting up Ruby with SASS on different operating systems.

After Ruby is installed, you can execute the following command to install SASS:

```shell
gem install sass
```

The current SASS configuration, which is in **bundle/setup/sass/application.scss**, is setup for importing .css and .scss.  SASS does not support .css imports. In order to import .css files using SASS, install the [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer):

```shell
gem install --pre sass-css-importer
```

## Build

The SASS preprocessor can be used to output **bundle/setup/sass/application.scss** to a single minified version of all the css files required by common with the .css file type:

```shell
sass -r sass-css-importer application.scss application.min.css --style compressed
```