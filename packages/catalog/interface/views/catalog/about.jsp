<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);
%>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/about.css" type="text/css" />
<%-- Include the application head content. --%>
<%@include file="../../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../../core/interface/fragments/displayHeadContent.jspf"%>
<%-- Include the form head content, including attached css/javascript files and custom header content --%>
<%@include file="../../../../../core/interface/fragments/formHeadContent.jspf"%>
<section class="container">
    <%@include file="../../../../../core/interface/fragments/displayBodyContent.jspf"%>
</section>