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
%>
<%-- Include the bundle js config initialization. --%>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/package.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/popularRequests.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/popularRequests.js"></script>
<section class="container">
    <% if(popularTemplates.size() > 0){%>
            <header class="container">
            <h2>
                <%=themeLocalizer.getString("Popular Requests")%>
            </h2>
            <hr class="soften">
        </header>
        <ul class="templates unstyled">
            <% for(Template popularRequest : popularTemplates) { %>
                <li class="border-top border-gray-light clearfix">
                    <div class="content-wrap"> 
                        <% if (popularRequest.hasTemplateAttribute("ServiceItemImage")) { %>
                            <div class="image">
                                <img width="40" src="<%= bundle.getProperty("serviceItemImagePath") + popularRequest.getTemplateAttributeValue("ServiceItemImage")%>" alt="<%= themeLocalizer.getString(popularRequest.getName())%>" />
                            </div>
                            <div class="col-sm-6 description-small">
                        <% } else {%>
                            <div class="col-sm-6 description-wide">
                        <% }%>
                        <h3>
                            <%= themeLocalizer.getString(popularRequest.getName())%>
                        </h3>
                        <p>
                            <%= themeLocalizer.getString(popularRequest.getDescription()) %>
                        </p>
                        <div class="visible-xs left">
                            <a class="templateButton" href="<%= popularRequest.getAnonymousUrl() %>">
                                <i class="fa fa-share"></i><%= themeLocalizer.getString("Request")%>
                            </a>
                        </div>
                        <% if (templateDescriptions.get(popularRequest.getId()) != null ) { %>
                            <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(popularRequest.getId()) %>">
                                <%= themeLocalizer.getString("Read More")%>
                            </a>
                        <% }%>                                         
                    </div>
                    <div class="col-sm-5">
                        <div class="hidden-xs">
                            <!-- Load description attributes config stored in package config -->
                            <% for (String attributeDescriptionName : attributeDescriptionNames) {%>
                                <% if (popularRequest.hasTemplateAttribute(attributeDescriptionName)) { %>
                                    <p>
                                        <strong><%= themeLocalizer.getString(attributeDescriptionName)%>:</strong> <%= themeLocalizer.getString(popularRequest.getTemplateAttributeValue(attributeDescriptionName)) %>
                                    </p>
                                <% }%>
                            <%}%>
                        </div>
                        <div class="hidden-xs">
                            <a class="templateButton" href="<%= popularRequest.getAnonymousUrl() %>">
                                <i class="fa fa-share"></i><%= themeLocalizer.getString("Request")%>
                            </a>
                        </div>
                    </div>
                </li>
            <% } %>
        </ul>
    <% } else {%>
        <h3>
            <i><%= themeLocalizer.getString("No popular requests. Please start requesting services to see them.")%></i>
        </h3>
    <% } %>
</section>