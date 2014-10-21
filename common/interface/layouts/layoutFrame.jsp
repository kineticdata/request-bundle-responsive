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
    </head> 
    <body class="<%if(request.getAttribute("bodyClass")!=null){%><%=request.getAttribute("bodyClass")%><%}%>">
        <jsp:include page="${content}" />
    </body>
</html>