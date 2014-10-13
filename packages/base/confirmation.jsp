<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>

<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<%
    // Define packages path
    String configurationFile = getServletContext().getRealPath(bundle.relativeBundlePath() + "packages");
    // Load the Bundle JSON configuration
    Configurator configuration = new Configurator(configurationFile, "base");
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);

    // Retrieve objects
    Template currentTemplate = catalog.getTemplateById(customerSurvey.getSurveyTemplateInstanceID());
    if(currentTemplate == null) {
        throw new Exception("Current template does not exist!");
    }
    Category currentCategory = null;
    if(currentTemplate.hasTemplateAttribute("DefaultCategory")) {
        currentCategory = catalog.getCategoryByName(currentTemplate.getTemplateAttributeValue("DefaultCategory"));
    }
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the bundle common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <script type="text/javascript">
            // Ensure the BUNDLE global object exists
            BUNDLE = BUNDLE || {};
            // Initialize the BUNDLE configuration hash
            BUNDLE.config = BUNDLE.config || {};
            // Setup packages configuration
            BUNDLE.config.packages = <%= configuration.getPackagesConfiguration()%>
        </script>
        <title>
            <%= bundle.getProperty("companyName")%>&nbsp;|
            <% if(currentCategory != null) {%>
                <%= currentCategory.getName()%> |
            <% }%>
            <%= customerRequest.getTemplateName()%>
        </title>
        <!-- Common Flyout navigation -->
        <script type="text/javascript" src="<%=bundle.bundlePath()%>common/resources/js/flyout.js"></script>
         <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
    </head>
    <body>
        <div class="sticky-footer">
            <%@include file="../../common/interface/fragments/header.jspf"%>
            <header class="container">
                <h2>
                    <% if(currentCategory != null) {%>
                        <%= currentCategory.getName()%>:
                    <% }%> Request <%= customerRequest.getTemplateName()%>
                </h2>
                <hr class="soften">
            </header>
            <section class="container">
                <div id="pageQuestionsForm" class="border rounded">
                    <p>
                        <b>Thank you for submitting a request for <%= customerRequest.getTemplateName()%>. Your Request ID is <%= customerRequest.getKsr()%>.
                        </b>
                    </p>
                    <p>
                        To track the status of your request, click the <a href="<%= bundle.getProperty("submissionsUrl")%>">My Request</a> link.
                    </p>
                </div>
            </section>
            <div class="sticky-footer-push"></div>
        </div>
        <%@include file="../../common/interface/fragments/footer.jspf"%>
    </body>
</html>