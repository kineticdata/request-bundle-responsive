<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);
    // Get map of description templates
    Map<String, String> templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);
    // Get popular requests
    List<String> globalTopTemplates = SubmissionStatisticsHelper.getMostCommonTemplateNames(systemContext, new String[] {customerRequest.getCatalogName()}, templateTypeFilterTopSubmissions, 5);
%>
<%-- Include the bundle js config initialization. --%>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/package.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/catalog.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/package.js"></script>
<script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/catalog.js"></script> 
<%@include file="../../fragments/flyout.jspf"%>
<section class="container">
    <% if(globalTopTemplates.size() > 0){%>
        <header class="container">
            <h2>
                Popular Requests
            </h2>
            <hr class="soften">
        </header>
        <ul class="templates unstyled">
            <% for(String templateName : globalTopTemplates) { %>
                <li class="border-top border-gray-light clearfix">
                    <% Template popularRequest = catalog.getTemplateByName(templateName); %>
                    <div class="content-wrap"> 
                        <% if (popularRequest.hasTemplateAttribute("ServiceItemImage")) { %>
                            <div class="image">
                                <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(popularRequest.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" />
                            </div>
                            <div class="col-sm-6 description-small">
                        <% } else {%>
                            <div class="col-sm-6 description-wide">
                        <% }%>
                        <h3>
                            <%= popularRequest.getName()%>
                        </h3>
                        <p>
                            <%= popularRequest.getDescription() %>
                        </p>
                        <div class="visible-xs left">
                            <a class="templateButton" href="<%= popularRequest.getAnonymousUrl() %>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                        <% if (templateDescriptions.get(popularRequest.getId()) != null ) { %>
                            <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(popularRequest.getId()) %>">
                                Read More
                            </a>
                        <% }%>                                         
                    </div>
                    <div class="col-sm-5">
                        <div class="hidden-xs">
                            <!-- Load description attributes config stored in package config -->
                            <% for (String attributeDescriptionName : attributeDescriptionNames) {%>
                                <% if (popularRequest.hasTemplateAttribute(attributeDescriptionName)) { %>
                                    <p>
                                        <strong><%= attributeDescriptionName%>:</strong> <%= popularRequest.getTemplateAttributeValue(attributeDescriptionName) %>
                                    </p>
                                <% }%>
                            <%}%>
                        </div>
                        <div class="hidden-xs">
                            <a class="templateButton" href="<%= popularRequest.getAnonymousUrl() %>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                    </div>
                </li>
            <% } %>
        </ul>
    <% } else {%>
        <h3>
            <i>No popular requests. Please start requesting services to see them.</i>
        </h3>
    <% } %>
</section>
<nav class="catalog">
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
</nav>
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
                                            <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(template.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" alt="<%= template.getName()%>" />
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