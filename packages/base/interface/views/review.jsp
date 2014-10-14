<%-- Include the package initialization file. --%>
<%@include file="../../framework/includes/packageInitialization.jspf"%>
<%-- Include the application head content. --%>
<%@include file="../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../core/interface/fragments/reviewHeadContent.jspf"%>
<!-- Package Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/reviewPackage.css" type="text/css" />
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/review.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/review.js"></script>
<%-- Include the form head content, including attached css/javascript files and custom header content --%>
<%@include file="../../../../core/interface/fragments/formHeadContent.jspf"%>
<header class="container">
    <h2>
        Review: <%= customerRequest.getTemplateName()%>
    </h2>
    <hr class="soften">
</header>
<section class="container">
    <%@include file="../../../../core/interface/fragments/reviewBodyContent.jspf"%>
</section>