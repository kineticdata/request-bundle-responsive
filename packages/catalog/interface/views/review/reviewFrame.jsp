<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../framework/includes/serviceLanguageInitialization.jspf"%>
<%-- Include the application head content. --%>
<%@include file="../../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../../core/interface/fragments/reviewHeadContent.jspf"%>
<!-- Package Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/displayPackage.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/reviewPackage.css" type="text/css" />
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/reviewFrame.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/review.js"></script>
<%-- Include the form head content, including attached css/javascript files and custom header content --%>
<%@include file="../../../../../core/interface/fragments/formHeadContent.jspf"%>
<section class="container">
    <%@include file="../../../../../core/interface/fragments/reviewBodyContent.jspf"%>
</section>
