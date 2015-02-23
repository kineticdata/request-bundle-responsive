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
        <div class="col-md-8" style='margin-top:-3em;'>
            <% for (Category category : catalog.getRootCategories(context)) { %>
                <% if (category.hasTemplates()) { %>
                    <div class='row' style='margin-bottom:2em;'>
                      <h3><%=themeLocalizer.getString(category.getName())%></h3>
                      <% for (Template template : category.getTemplates()) {%>
                        <% String[] icons = template.getTemplateAttributeValues("fa-class");%>
                        
                        <div class='panel' style='width:24%;float:left;text-align:center;margin-right:1em;border:1px solid #E8E8E8;'>
                          <span class='fa <%= (icons.length > 0) ? icons[0] : "fa-list-alt" %>' style='margin:.25em;color:#CCC;font-size:3em;'></span>
                          <div class='panel-footer clearfix' style='font-size:.8em;'>
                            <a href='<%= template.getAnonymousUrl() %>'>
                              <%= themeLocalizer.getString(template.getName())%>
                            </a>
                          </div>
                        </div>
                      <% }%>
                    </div>
                <% } %>
            <% }%>
        </div>
        <div class="col-md-4">
            <a class="twitter-timeline"  href="https://twitter.com/KineticData" data-widget-id="569678005275226112" data-chrome="nofooter">Tweets by @KineticData</a>
            <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
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