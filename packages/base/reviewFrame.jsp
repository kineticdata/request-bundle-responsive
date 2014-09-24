<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>
<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the bundle common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <%-- Include the application head content. --%>
        <%@include file="../../core/interface/fragments/applicationHeadContent.jspf" %>
        <%@include file="../../core/interface/fragments/reviewHeadContent.jspf"%>

        <!-- Common js lib -->
        <script type="text/javascript" src="<%=bundle.bundlePath()%>common/resources/js/flyout.js"></script>
        <!-- Package Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewPackage.css" type="text/css" />
        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewFrame.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/review.js"></script>

        <%-- Include the form head content, including attached css/javascript files and custom header content --%>
        <%@include file="../../core/interface/fragments/formHeadContent.jspf"%>
    </head>
    <body class="loadAllPages_<%=customerRequest.getLoadAllPages()%> reviewFrame">
        <section class="container">
            <%@include file="../../core/interface/fragments/reviewBodyContent.jspf"%>
        </section>
    </body>
</html>