<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%-- Retrieve the Catalog --%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);
    // Preload the catalog child objects (such as Categories, Templates, etc)
    Category currentCategory = catalog.getCategoryByName(request.getParameter("category"));
    // Get map of description templates
    Map<String, String> templateDescriptions = new HashMap<String, String>();
    Map<String, String> categoryDescriptions = new HashMap<String, String>();
    if (currentCategory != null) {
        templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);
        categoryDescriptions = DescriptionHelper.getCategoryDescriptionMap(context, catalog);
    }
%>
<!-- Package Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/package.css" type="text/css" />
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/category.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/package.js"></script>
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/category.js"></script>
<%@include file="../fragments/flyout.jspf"%>
<% if(currentCategory != null) {%>
    <header class="container">
        <ul class="breadcrumb clearfix">
            <% 
                List<Category> parentCategories = CategoryHelper.getCategoryTrail(catalog, currentCategory);
                Iterator<Category> iterator = parentCategories.iterator();
            %>
                <% 
                    while(iterator.hasNext()) {
                    Category category = iterator.next();
                    String activeClass = "";
                    String href = "";
                    if(!iterator.hasNext()) {
                        activeClass = "active";
                        href = category.getName();
                    } else {
                        href= "<a href='"+ bundle.getProperty("catalogUrl")+ "&view=category&category=" + URLEncoder.encode(category.getFullName(), "UTF-8") +"' alt='" + category.getName() + "'>" + category.getName() + "</a>";    
                    }
                %>
                    <li class="<%= activeClass %>">
                            <%= href %>
                    </li>
                <% } %>
        </ul>
        <% if(currentCategory.getImageTag().length() > 0) {%>
            <div class="category-image">
                <%= currentCategory.getImageTag()%>
            </div>
            <div class="wrap-float">
        <% } else { %>
            <div class="wrap">
        <% }%>
            <div class="category-description hide" data-description-id="<%= categoryDescriptions.get(currentCategory.getId()) %>">
                <%= currentCategory.getDescription()%>
            </div>
            <div id="loader" class="hide">
                <img alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                <br />
                Loading Results
            </div>
        </div>
        <div class="clearfix"></div>
        <hr class="soften">
    </header>
<% }%>
<section class="container">
    <% if(currentCategory != null) {%>
        <ul class="templates col-sm-7 unstyled">
            <% for (Template template : currentCategory.getTemplates()) {%>
                <li class="border-top clearfix">
                    <div class="content-wrap">
                        <% if (template.hasTemplateAttribute("ServiceItemImage")) { %>
                            <div class="image">
                                <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(template.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" alt="<%= template.getName()%>" />
                            </div>
                            <div class="col-md-6 description-small">
                        <% } else {%>
                            <div class="col-md-6 description-wide">
                        <% }%>
                        <h3>
                            <%= template.getName()%>
                        </h3>
                        <p>
                            <%= template.getDescription()%>
                        </p>
                        <div class="visible-xs visible-sm left">
                            <a class="templateButton" href="<%= template.getAnonymousUrl() %>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                        <% if (templateDescriptions.get(template.getId()) != null ) { %>
                            <a class="" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(template.getId()) %>&category=<%= URLEncoder.encode(currentCategory.getFullName(), "UTF-8")%>">
                                Read More
                            </a>
                        <% }%>                                           
                    </div>
                    <div class="col-sm-5">
                        <div class="hidden-xs hidden-sm">
                            <!-- Load description attributes config stored in package config -->
                            <% for (String attributeDescriptionName : attributeDescriptionNames) {%>
                                <% if (template.hasTemplateAttribute(attributeDescriptionName)) { %>
                                    <p>
                                        <strong><%= attributeDescriptionName%>:</strong> <%= template.getTemplateAttributeValue(attributeDescriptionName) %>
                                    </p>
                                <% }%>
                            <%}%>
                        </div>
                        <div class="hidden-xs hidden-sm">
                            <a class="templateButton" href="<%= template.getAnonymousUrl() %>&category=<%= URLEncoder.encode(currentCategory.getFullName(), "UTF-8")%>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                    </div>
                </li>
            <%}%>
        </ul>
        <% if (currentCategory.hasNonEmptySubcategories()) {%>
            <div class="subcategories background-tertiary">
                <h5 class="color-white color-hover-white">
                    Subcategories
                </h5>
                <ul class="unstyled">
                    <% for (Category subcategory : currentCategory.getSubcategories()) { %>
                        <% if (subcategory.hasTemplates()) { %>
                        <li class="subcategory" data-id="<%= subcategory.getId()%>" data-name="<%= subcategory.getName()%>">
                            <a href="<%= bundle.getProperty("catalogUrl") %>&view=category&category=<%= URLEncoder.encode(subcategory.getFullName(), "UTF-8")%>" class="name background-tertiary-compliment color-white color-hover-white">
                                <%= subcategory.getName()%>
                            </a>
                        </li>
                        <% }%>
                    <% }%>
                    <div class="clearfix"></div>
                </ul>
            </div>
        <% }%>
    <% }%>
</section>