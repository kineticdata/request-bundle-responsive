# SASS Setup

## Overview

Use  [SASS](http://sass-lang.com/) to organize your CSS code with functions (mixins) and variables as well as minification capabilities.

## Required Dependencies for this Setup

[Ruby](https://www.ruby-lang.org/) and [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer).

## Installation
Installing SASS requires Ruby and depends on the operating system you are working with.  More documentation can be found  [here](http://sass-lang.com/install) for setting up SASS on different operating systems.

After Ruby is installed, you would run the follow command from command line to install SASS:

```bash
gem install sass
```

The current SASS configuration, which is in **bundle/setup/sass/application.scss**, is designed to import .css and well as .scss.  In order to leverage this, install the [SASS CSS importer](https://github.com/chriseppstein/sass-css-importer):

```bash
gem install --pre sass-css-importer
```

## Build CSS

You can process **bundle/setup/sass/application.scss** so it's a single minified version of all the css files required by common:

```bash
sass -r sass-css-importer application.scss application.css --style compressed
```