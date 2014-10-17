<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>

<%-- 
    Include the CatalogSearch fragment that defines the CatalogSearch class that
    will be used to retrieve and filter the catalog data.
--%>
<%@include file="../../../framework/helpers/CatalogSearch.jspf"%>
<%
    // Retrieve the main catalog object
    Catalog catalog = Catalog.findByName(context, customerRequest.getCatalogName());
    // Preload the catalog child objects (such as Categories, Templates, etc)
    catalog.preload(context);

    // Get map of description templates
    Map<String, String> templateDescriptions = DescriptionHelper.getTemplateDescriptionMap(context, catalog);

    // Define variables
    String[] querySegments;
    String responseMessage = null;
    List<Template> templates = new ArrayList();
    Template[] matchingTemplates = templates.toArray(new Template[templates.size()]);
    Pattern combinedPattern = Pattern.compile("");
    // Retrieve the searchableAttribute property
    String searchableAttributeString = bundle.getProperty("searchableAttributes");
    // Initialize the searchable attributes array
    String[] searchableAttributes = new String[0];
    if(request.getParameter("q") != null) {
        // Build the array of querySegments (query string separated by a space)
        querySegments = request.getParameter("q").split(" ");
        // Display an error message if there are 0 querySegments or > 10 querySegments
        if (querySegments.length == 0 || querySegments[0].length() == 0) {
            responseMessage = "Please enter a search term.";
        } else if (querySegments.length > 10) {
            responseMessage = "Search is limited to 10 search terms.";
        } else {
            // Default the searchableAttribute property to "Keyword" if it wasn't specified
            if (searchableAttributeString == null) {searchableAttributeString = "Keyword";}
            // If the searchableAttributeString is not empty
            if (!searchableAttributeString.equals("")) {
                searchableAttributes = searchableAttributeString.split("\\s*,\\s*");
            }
            CatalogSearch catalogSearch = new CatalogSearch(context, catalog.getName(), querySegments);
            //Category[] matchingCategories = catalogSearch.getMatchingCategories();
            matchingTemplates = catalogSearch.getMatchingTemplates(searchableAttributes);
            combinedPattern = catalogSearch.getCombinedPattern();
            if (matchingTemplates.length == 0) {
                responseMessage = "No results were found.";
            }
        }
    } else {
        responseMessage = "Please Start Your Search";
    }
%>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/package.css" type="text/css" />
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/search.css" type="text/css" />
<!-- Page Javascript -->
<script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/search.js"></script>
<% if(responseMessage != null) {%>
    <header class="container">
        <h2>
            <%= responseMessage %>
        </h2>
        <hr class="soften">
    </header>
<% } else {%>
    <header class="container">
        <h2>
            Results found for '<%= request.getParameter("q")%>'.
        </h2>
        <hr class="soften">
    </header>
    <section class="container">
        <ul class="templates unstyled">
            <% for (int i = 0; i < matchingTemplates.length; i++) {%>
                <li class="border-top border-gray-light clearfix">
                    <div class="content-wrap">
                        <% if (matchingTemplates[i].hasTemplateAttribute("ServiceItemImage")) { %>
                            <div class="image">
                                <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(matchingTemplates[i].getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" />
                            </div>
                            <div class="col-sm-6 description-small">
                        <% } else {%>
                            <div class="col-sm-6 description-wide">
                        <% }%>
                        <h3>
                            <%= matchingTemplates[i].getName()%>
                        </h3>
                        <p>
                            <%= matchingTemplates[i].getDescription()%>
                        </p>
                        <div class="visible-xs left">
                            <a class="templateButton" href="<%= matchingTemplates[i].getAnonymousUrl()%>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                        <% if (templateDescriptions.get(matchingTemplates[i].getId()) != null ) { %>
                            <a class="read-more" href="<%= bundle.applicationPath()%>DisplayPage?srv=<%= templateDescriptions.get(matchingTemplates[i].getId()) %>">
                                Read More
                            </a>
                        <% }%>
                        <ul class="keywords unstyled clearfix hidden-xs">
                            <% for (String attributeName : searchableAttributes) {%>
                                <% if (matchingTemplates[i].hasTemplateAttribute(attributeName)) {%>
                                    <li class="keyword">
                                        <div class="keyword-name">
                                            <strong>
                                                <%= attributeName %>(s):
                                            </strong>
                                        </div>
                                        <ul class="keyword-values unstyled">
                                            <% for (String attributeValue : matchingTemplates[i].getTemplateAttributeValues(attributeName)) {%>
                                                <li class="keyword-value">
                                                    <%= attributeValue%>
                                                </li>
                                            <% }%>
                                        </ul>
                                    </li>
                                <% }%>
                            <% }%>
                        </ul>
                    </div>
                    <div class="col-sm-5">
                        <div class="hidden-xs">
                            <!-- Load description attributes config stored in package config -->
                            <% for (String attributeDescriptionName : attributeDescriptionNames) {%>
                                <% if (matchingTemplates[i].hasTemplateAttribute(attributeDescriptionName)) { %>
                                    <p>
                                        <strong><%= attributeDescriptionName%>:</strong> <%= matchingTemplates[i].getTemplateAttributeValue(attributeDescriptionName) %>
                                    </p>
                                <% }%>
                            <%}%>
                        </div>
                        <div class="hidden-xs">
                            <a class="templateButton" href="<%= matchingTemplates[i].getAnonymousUrl()%>">
                                <i class="fa fa-share"></i>Request
                            </a>
                        </div>
                    </div>
                </li>
            <% }%>
        </ul>
    </section>
<% }%>