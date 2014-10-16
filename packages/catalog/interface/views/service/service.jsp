<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../framework/includes/serviceLanguageInitialization.jspf"%>
<%-- Include the application head content. --%>
<%@include file="../../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../../core/interface/fragments/displayHeadContent.jspf"%>
<!-- Package Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/display.css" type="text/css" />
<!-- Package Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/package.js"></script>
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/display.js"></script>
<%-- Include the form head content, including attached css/javascript files and custom header content --%>
<%@include file="../../../../../core/interface/fragments/formHeadContent.jspf"%>
<header class="container">
    <h2>
        <%= customerRequest.getTemplateName()%>
    </h2>
    <hr class="soften">
</header>
<section class="container display-page">
    <%@include file="../../../../../core/interface/fragments/displayBodyContent.jspf"%>
</section>