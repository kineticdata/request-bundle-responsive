<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>
<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<%
    // Define packages path
    String configurationFile = getServletContext().getRealPath(bundle.relativeBundlePath() + "packages");
    // Load the Bundle JSON configuration
    Configurator configuration = new Configurator(configurationFile, "base");
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
            <%= bundle.getProperty("companyName")%>&nbsp;|&nbsp;Review&nbsp;|&nbsp;<%= customerRequest.getTemplateName()%>
        </title>
        <%-- Include the application head content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf" %>
        <%@include file="../../core/interface/fragments/reviewHeadContent.jspf"%>

        <!-- Package Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewPackage.css" type="text/css" />
        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/review.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/review.js"></script>

        <%-- Include the form head content, including attached css/javascript files and custom header content --%>
        <%@include file="../../core/interface/fragments/formHeadContent.jspf"%>
    </head>
    <body class="loadAllPages_<%=customerRequest.getLoadAllPages()%> review">
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <header class="container">
                        <h2>
                            Review: <%= customerRequest.getTemplateName()%>
                        </h2>
                        <hr class="soften">
                    </header>
                    <section class="container">
                        <%@include file="../../core/interface/fragments/reviewBodyContent.jspf"%>
                    </section>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
    </body>
</html>