# Request Bundle Responsive Documentation
A Kinetic Request Bundle with a responsive user interface for all devices.

## Overview
This project represents an out of the box Bundle solution for Kinetic Request. It contains the Responsive Theme and a Kurl catalog. See the Readme in each directory for further installation instructions and details.

## Installation

### Bundle
This project, should be placed into the "themes" directory of your kinetic installation and renamed to match your catalog name

Parent path:  
.../apache-tomcat-X.X.XX-sr/webapps/kinetic/themes

### Portal Service Items
1. Navigate to setup/kurl/

2. Open the config.rb file in a text editor

3. Edit the “CATALOG_NAME” variable with the name you want to call your catalog. Use underscores or dashes instead of spaces.

4. Edit the “THEMES_BASE” with the path to the bundle directory

5. Using [Kurl](http://community.kineticdata.com/10_Kinetic_Request/KURL/02_Get_Started) and a command line, execute the following kurl command to start your catalog import by replacing the text, "path-to-kurl-catalog-directory", with the path (from your kurl directory) to you catalog kurl files:
```shell
java -jar kurl.jar -action=build_catalog -directory=path-to-kurl-catalog-directory
```
**Note**: If you are executing the kurl.jar from **bundle/setup**, your path to kurl directory would be **kurl/**.


6. When the import is complete, verify that the catalog is visible in Remedy and all the service items are imported.
    * About
    * Catalog (home page to browse catalog)
    * Popular Requests
    * Profile
    * Search
    * Service Item Example with Person Lookup
    * Site Feedback
    * Submissions
    * Submission Activity

7. In the bundle directory open the your-theme-name/common/config/config.jspf file. Update each line where the word "Responsive" is with the name of your catalog then save the file.

8. Verify configuration by opening the web site in a browser:  

```url
http://_your-web-server_/kinetic/DisplayPage?name=_your-catalog-name_
```