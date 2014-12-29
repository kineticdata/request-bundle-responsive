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
    List<Template> popularTemplates = CacheHelper.getSubmissionStatistics(systemContext, catalog, templateTypeFilterTopSubmissions, popularRequestsLimit);
    // Define counts
    Integer totalPopular = popularTemplates.size();
    Integer totalRequests = 0;
    Integer totalApprovals = 0;
    if (context != null) {
        for (String groupName : submissionGroups.keySet()) {
            Integer count = null;
            // Total count of Requests
            if(groupName.equals("Open Request")) {
                totalRequests = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName));
            }
            // Total Count of Approvals
            if(groupName.equals("Pending Approval")) {
                totalApprovals = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName));
            }
        }
    }
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
    <div class="row">
        <div class="col-md-4">
            <div class="popular-requests panel background-tertiary">
                <a>
                    <div class="helper-text hide">
                    </div>
                    <div class="icon">
                    </div>
                    <div class="count">
                        <%= totalPopular%>
                    </div>
                    <div class="clearfix"></div>
                    <div class="label"></div>
                    <div class="panel-footer background-tertiary-compliment clearfix">
                        <div class="pull-left"><%=themeLocalizer.getString("Details")%></div>
                        <i class="pull-right fa fa-arrow-circle-right"></i>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-md-4">
            <div class="approvals panel background-primary">
                <a>
                    <div class="helper-text hide">
                    </div>
                    <div class="icon">
                    </div>
                    <div class="count">
                        <%= totalApprovals%>
                    </div>
                    <div class="clearfix"></div>
                    <div class="label">
                    </div>
                    <div class="panel-footer background-primary-dark clearfix">
                        <div class="pull-left"><%=themeLocalizer.getString("Details")%></div>
                        <i class="pull-right fa fa-arrow-circle-right"></i>
                    </div>
                </a>
            </div>
        </div>
        <div class="col-md-4">
            <div class="requests panel background-secondary">
                <a>
                    <div class="helper-text hide">
                    </div>
                    <div class="icon">
                    </div>
                    <div class="count">
                        <%= totalRequests%>
                    </div>
                    <div class="clearfix"></div>
                    <div class="label">
                    </div>
                    <div class="panel-footer background-secondary-dark clearfix">
                        <div class="pull-left"><%=themeLocalizer.getString("Details")%></div>
                        <i class="pull-right fa fa-arrow-circle-right"></i>
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>
<nav class="catalog">
    <%-- BREADCRUMBS NAV --%>
    <ul class="breadcrumbs unstyled">
        <li data-id="root">
            <%=themeLocalizer.getString("Catalog")%>
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
            <li data-id="<%= category.getId()%>" data-name="<%=themeLocalizer.getString(category.getName())%>" data-description="<%=themeLocalizer.getString(category.getDescription())%>">
                <%=themeLocalizer.getString(category.getName())%>
                <i class="fa fa-chevron-circle-right"></i>
            </li>
        <% } %>
    <% }%>
</ul>
<%-- CATEGORY DATA --%>
<ul class="category-data hide">
    <% for (Category category : catalog.getAllCategories(context)) {%>
        <% if (category.hasTemplates()) { %>
            <li class="" data-id="<%= category.getId()%>" data-name="<%=themeLocalizer.getString(category.getName())%>" data-description="<%=themeLocalizer.getString(category.getDescription())%>">
                <%=themeLocalizer.getString(category.getName())%>
                <i class="fa fa-chevron-circle-right"></i>
                <%-- SUBCATEGORIES DATA --%>
                <% if (category.hasNonEmptySubcategories()) {%>
                    <ul class="subcategory-data">
                        <% for (Category subcategory : category.getSubcategories()) { %>
                            <% if (subcategory.hasTemplates()) { %>
                                <li data-id="<%= subcategory.getId()%>" data-name="<%=themeLocalizer.getString(subcategory.getName())%>" data-description="<%=themeLocalizer.getString(subcategory.getDescription())%>">
                                    <%=themeLocalizer.getString(subcategory.getName())%>
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
                            <li data-id="<%= template.getId()%>" data-name="<%=themeLocalizer.getString(template.getName())%>">
                                <%=themeLocalizer.getString(template.getName())%>
                                <div class="template-details-data hide">
                                    <% if (template.hasTemplateAttribute("ServiceItemImage")) { %>
                                        <div class="image">
                                            <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(template.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" alt="<%=themeLocalizer.getString(template.getName())%>" />
                                        </div>
                                    <% }%>
                                    <p>
                                        <%=themeLocalizer.getString(template.getDescription())%>
                                    </p>
                                    <% if (templateDescriptions.get(template.getId()) != null) { %>
                                        <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(template.getId()) %>">
                                            <%=themeLocalizer.getString("Read More")%>
                                        </a>
                                    <% }%>
                                    <a class="templateButton" href="<%= template.getAnonymousUrl() %>">
                                        <i class="fa fa-share"></i>
                                        <%=themeLocalizer.getString("Request")%>
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