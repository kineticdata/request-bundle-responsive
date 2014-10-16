<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../framework/includes/serviceLanguageInitialization.jspf"%>
<%-- Include the application head content. --%>
<%@include file="../../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../../core/interface/fragments/reviewHeadContent.jspf"%>
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
<%@include file="../../../../../core/interface/fragments/formHeadContent.jspf"%>
<section class="container">
    <%@include file="../../../../../core/interface/fragments/reviewBodyContent.jspf"%>
</section>
