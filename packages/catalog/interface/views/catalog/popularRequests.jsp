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
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/package.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/popularRequests.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/popularRequests.js"></script>
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
                                <img width="40" src="<%= bundle.getProperty("serviceItemImagePath") + popularRequest.getTemplateAttributeValue("ServiceItemImage")%>" alt="<%= popularRequest.getName()%>" />
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