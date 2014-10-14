<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="../../../core/framework/includes/bundleInitialization.jspf"%>
<%
// Load all of the package's JSON configurations
Configurator configuration = new Configurator(bundle);
configuration.processView(request, response, (String) request.getAttribute("view"));
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the common content. --%>
        <%@include file="../fragments/head.jspf"%>
        <script type="text/javascript">
            // Ensure the BUNDLE global object exists
            BUNDLE = BUNDLE || {};
            // Initialize the BUNDLE configuration hash
            BUNDLE.config = BUNDLE.config || {};
            // Setup packages configuration
            BUNDLE.config.packages = <%= configuration.getPackagesConfiguration()%>
        </script>
    </head> 
    <body class="loadAllPages_<%=customerRequest.getLoadAllPages()%> reviewFrame">
        <jsp:include page="${content}" />      
    </body>
</html>