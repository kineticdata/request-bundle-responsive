<%-- Set the page content type, ensuring that UTF-8 is used. --%>
<%@page contentType="text/html; charset=UTF-8"%>
<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>

<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc) so
    // that they are available.  Preloading all of the related objects at once
    // is more efficient than loading them individually.
    catalog.preload(context);

    // Get map of description templates
    Map<String, String> templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);
    // Get popular requests
    HelperContext systemContext = com.kd.kineticSurvey.impl.RemedyHandler.getDefaultHelperContext();
    List<String> globalTopTemplates = SubmissionStatisticsHelper.getMostCommonTemplateNames(systemContext, new String[] {customerRequest.getCatalogName()}, templateTypeFilterTopSubmissions, 5);
%>
<!DOCTYPE html>
<html>
    <head>
        <%-- Include the common content. --%>
        <%@include file="../../common/interface/fragments/head.jspf"%>
        <title>
            <%= bundle.getProperty("companyName")%>&nbsp;<%= bundle.getProperty("catalogName")%>
        </title>
        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/package.css" type="text/css" />
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/catalog.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/catalog.js"></script>
    </head>
    <body>
        <div class="view-port">
            <%@include file="../../common/interface/fragments/navigationSlide.jspf"%>
            <div class="content-slide" data-target="div.navigation-slide">
                <%@include file="../../common/interface/fragments/header.jspf"%>
                <div class="pointer-events">
                    <%-- BREADCRUMBS NAV --%>
                    <ul class="breadcrumbs unstyled">
                        <li data-id="root">
                            Catalog
                        </li>
                    </ul>
                    <%-- TEMPLATES NAV --%>
                    <ul class="templates unstyled">
                    </ul>
                    <%-- CATAGORIES NAV --%>
                    <ul class="categories unstyled">
                    </ul>
                    <%-- TEMPLATE DETAILS --%>
                    <div class="template-details">
                    </div>
                </div>
                <%@include file="../../common/interface/fragments/footer.jspf"%>
            </div>
        </div>
        <!-- Data used for jQuery manipulation -->
        <%-- ROOT CATEGORIES DATA --%>
        <ul class="root-category-data hide">
            <% for (Category category : catalog.getRootCategories(context)) { %>
                <% if (category.hasTemplates()) { %>
                    <li data-id="<%= category.getId()%>" data-name="<%= category.getName()%>" data-description="<%= category.getDescription()%>">
                        <%= category.getName()%>
                        <i class="fa fa-chevron-circle-right"></i>
                    </li>
                <% } %>
            <% }%>
        </ul>
        <%-- CATEGORY DATA --%>
        <ul class="category-data hide">
            <% for (Category category : catalog.getAllCategories(context)) {%>
                <% if (category.hasTemplates()) { %>
                    <li class="" data-id="<%= category.getId()%>" data-name="<%= category.getName()%>" data-description="<%= category.getDescription()%>">
                        <%= category.getName()%>
                        <i class="fa fa-chevron-circle-right"></i>
                        <%-- SUBCATEGORIES DATA --%>
                        <% if (category.hasNonEmptySubcategories()) {%>
                            <ul class="subcategory-data">
                                <% for (Category subcategory : category.getSubcategories()) { %>
                                    <% if (subcategory.hasTemplates()) { %>
                                        <li data-id="<%= subcategory.getId()%>" data-name="<%= subcategory.getName()%>" data-description="<%= subcategory.getDescription()%>">
                                            <%= subcategory.getName()%>
                                            <i class="fa fa-chevron-circle-right"></i>
                                        </li>
                                    <% }%>
                                <% }%>
                            </ul>
                        <% }%>
                        <%-- TEMPLATES DATA --%>
                        <% if (category.hasTemplates()) {%>
                            <ul class="template-data">
                                <% for (Template template : category.getTemplates()) {%>
                                    <li data-id="<%= template.getId()%>" data-name="<%= template.getName()%>">
                                        <%= template.getName()%>
                                        <div class="template-details-data hide">
                                            <% if (template.hasTemplateAttribute("ServiceItemImage")) { %>
                                                <div class="image">
                                                    <img width="40" src="<%= bundle.getProperty("serviceItemImagePath") + template.getTemplateAttributeValue("ServiceItemImage")%>" />
                                                </div>
                                            <% }%>
                                            <p>
                                                <%= template.getDescription()%> 
                                            </p>
                                            <% if (templateDescriptions.get(template.getId()) != null) { %>
                                                <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(template.getId()) %>">
                                                    Read More
                                                </a>
                                            <% }%>
                                            <a class="templateButton" href="<%= template.getAnonymousUrl() %>">
                                                <i class="fa fa-share"></i>
                                                Request
                                            </a>
                                        </div>
                                    </li>
                                <% }%>
                            </ul>
                        <% }%>
                    </li>
                <% }%>
            <% }%>
        </ul>
    </body>
</html>