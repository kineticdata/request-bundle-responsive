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

3. Edit the “CATALOG_NAME” variable with the name you want to call your catalog. Use dashes or underscores instead of spaces.

4. Edit the “THEMES_BASE” with the path to the bundle directory

5. Edit the "DISPLAY_NAME_FOR_URL" with the name of your catalog or with a user friendly unique name. 

6. Using [Kurl](http://community.kineticdata.com/10_Kinetic_Request/KURL/02_Get_Started) and a command line (if you do not have Kurl in stalled [start here](http://community.kineticdata.com/10_Kinetic_Request/KURL/02_Get_Started)), execute the following kurl command to start your catalog import by replacing the text, "path-to-kurl-catalog-directory", with the path (from your kurl directory) to your catalog kurl files:
```shell
java -jar kurl.jar -action=build_catalog -directory=path-to-kurl-catalog-directory
```
> **Tip**: If you are executing the kurl.jar from **bundle/setup**, your path to the kurl directory is **kurl/**.


7. When the import is complete, verify that the catalog is visible in the Kinetic authoring tool and the following service items are imported:
    * About
    * Catalog (home page to browse catalog)
    * Common
    * Profile
    * Service Item Example with Person Lookup
    * Site Feedback

8. Once you have verified that the catalog is installed and complete, add the following catalog attributes to your catalog. (If these catalog attributes are not available you will need to add them to your catalog by following the [instructions on community](http://community.kineticdata.com/10_Kinetic_Request/Documentation/Kinetic_Request_5.1/Kinetic_Request_User_Guide/Chapter_05_-_Manage_Requests/15_Configuration_Manager/16_Attribute_Types_Tab) and and using the KS_RQT_ServiceCatalog_base for "Parent Form").
    * slug (set to the same value as DISPLAY_NAME_FOR_URL with a delimeter such as a dash or underscore - e.g. ACME-)
    * catalogName (set to the name of your catalog)
    * companyName (set to your company name as you want displayed on the portal)

9. Verify configuration by opening the web site in a browser:  

```url
http://_your-web-server_/kinetic/DisplayPage?name=_slug_Catalog
```