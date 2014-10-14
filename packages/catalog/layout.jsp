<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<%
// Load all of the package's JSON configurations
Configurator configuration = new Configurator(bundle);
configuration.processView(request, response);
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <title>
            <%= bundle.getProperty("companyName")%>&nbsp;|&nbsp;<%= configuration.getCurrentViewTitle(request)%>
        </title>
        <script type="text/javascript">
            // Ensure the BUNDLE global object exists
            BUNDLE = BUNDLE || {};
            // Initialize the BUNDLE configuration hash
            BUNDLE.config = BUNDLE.config || {};
            // Setup packages configuration
            BUNDLE.config.packages = <%= configuration.getPackagesConfiguration()%>
        </script>
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <jsp:include page="${content}" />
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
    </body>
</html>