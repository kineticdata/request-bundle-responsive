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
            <%= bundle.getProperty("companyName")%>&nbsp;|&nbsp;<%= customerRequest.getTemplateName()%>
        </title>
         <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <header class="container">
                        <h2>
                            <%= customerRequest.getTemplateName()%>
                        </h2>
                        <hr class="soften">
                    </header>
                    <section class="container display-page">
                        <p>
                            <b>Thank you for submitting a request for <%= customerRequest.getTemplateName()%>. Your Request ID is <%= customerRequest.getKsr()%>.
                            </b>
                        </p>
                        <p>
                            To track the status of your request, click the <a href="<%= bundle.getProperty("submissionsUrl")%>">My Request</a> link.
                        </p>
                    </section>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
    </body>
</html>