<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../framework/includes/serviceLanguageInitialization.jspf"%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);
    // Retrieve objects
    Template currentTemplate = catalog.getTemplateById(customerSurvey.getSurveyTemplateInstanceID());
    if(currentTemplate == null) {
        throw new Exception("Current template does not exist!");
    }
    if(!currentTemplate.hasTemplateAttribute("IsTemplateDescription")) {
        throw new Exception("The required attribute IsTemplateDescription is missing");
    }  
    Template requestTemplate = catalog.getTemplateByName(currentTemplate.getTemplateAttributeValue("IsTemplateDescription"));
    if(requestTemplate == null) {
        throw new Exception("IsTemplateDescription is not properly configured to an existing request template. Confirm the template exists and the name is correct");
    }
    // Check if the category exists in the query string
    Category currentCategory = catalog.getCategoryByName(request.getParameter("category"));
    if(currentCategory == null) {
        if(!currentTemplate.hasTemplateAttribute("DefaultCategory")) {
            throw new Exception("The required attribute DefaultCategory is missing");
        } else {
            currentCategory = catalog.getCategoryByName(currentTemplate.getTemplateAttributeValue("DefaultCategory"));
            if(currentCategory == null) {
                throw new Exception("DefaultCategory is not properly configured to an existing category. Confirm the category exists and the name is correct");
            }
        }
    }
%>
<%-- Include the bundle js config initialization. --%>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<%-- Include the application content. --%>
<%@include file="../../../../../core/interface/fragments/applicationHeadContent.jspf"%>
<%@include file="../../../../../core/interface/fragments/displayHeadContent.jspf"%>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/description.css" type="text/css" />
<!-- Page JavaScript -->
<script type="text/javascript" src="<%= bundle.packagePath()%>assets/js/description.js"></script>
<%-- Include the form content, including attached css/javascript files and custom header content --%>
<%@include file="../../../../../core/interface/fragments/formHeadContent.jspf"%>
<header class="container">
    <h2>
        <%= themeLocalizer.getString(requestTemplate.getName())%>
    </h2>
    <a class="templateButton create-request hide" href="<%= requestTemplate.getAnonymousUrl()%>&category=<%= URLEncoder.encode(currentCategory.getFullName(), "UTF-8")%>">
        <i class="fa fa-share"></i><%= themeLocalizer.getString("Request this Service")%>
    </a>
    <hr class="soften">
</header>
<section class="container">
    <%@include file="../../../../../core/interface/fragments/displayBodyContent.jspf"%>
</section>