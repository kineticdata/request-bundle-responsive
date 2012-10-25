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
%>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title><%= bundle.getProperty("companyName") + " " + bundle.getProperty("catalogName")%></title>

        <%-- Include the common content. --%>
        <%@include file="../../common/interface/fragments/headContent.jspf"%>

        <!-- Page Stylesheets -->
        <link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/catalog.css" type="text/css" />
        <!-- Page Javascript -->
        <script type="text/javascript" src="<%=bundle.packagePath()%>resources/js/catalog.js"></script>
    </head>

    <body>
        <%@include file="../../common/interface/fragments/contentHeader.jspf"%>
        <section class="container">
            <!-- Search Form -->
            <div class="row-fluid">
                <div class="span12">
                <form id="catalogSearchForm" class="well" style="padding: 10px 10px 0px 10px;" method="get" action="<%= bundle.packagePath() %>interface/callbacks/catalogSearch.html.jsp">
                    <fieldset>
                    <input type="hidden" name="catalogName" value="<%= bundle.getProperty("catalogName") %>" />
                    <p>
                       <label class="infield" for="search-input">Search Catalog</label>
                       <input id="search-input" class="input-xxlarge search-query" name="query" type="text" />
                       <input class="btn btn-primary" type="submit" value="Search" />
                    </p>
                    </fieldset>
                </form>
            </div>
            </div>
            <%-- TEMPLATES DATA --%>
            <div class="row-fluid">
            <!-- Search Loader -->
                <div id="loader" class="hidden" style="text-align: center;">
                    <img style="margin: 0px 0px 10px 0px; height: 28px; width: 28px;" alt="Please Wait." src="<%=bundle.bundlePath()%>common/resources/images/spinner.gif" />
                    <br />
                    Loading Results
                </div>
                <div id="content-box" class="border rounded clearfix">
                    <div class="span8 borderRight" style="padding: 0px 10px 10px 10px;">
                        <div style="padding: 10px; font-weight: bold;" id="results-for">Enter a search term in the field above</div>
                        <ul id="search-result" style="margin: 0;">
                        <% for(Template template : catalog.getTemplates(context)) { %>
                            <% if (template.hasCategories()) {%>
                            <li style="margin: 0px 0px 10px 0px; padding: 10px 10px 10px 10px;" class="template gradient borderTop">
                                <div class="name">
                                    <%= template.getName()%>
                                </div>
                                <div class="description">
                                    <%= template.getDescription()%>
                                </div>
                                <a style="margin: 10px 0px 0px 0px;" class="btn btn-primary" href="<%= pathHelper.templateUrl(template.getId())%>">Request</a>
                            </li>
                            <% }%>
                        <% }%>
                        </ul>
                    </div>
                    <div class="span4" style="margin: 0; padding: 0px 10px 10px 10px;">
                         <h4>Most Recent</h4>
                        <div class="borderTop"></div>
                        <% for(Submission recentSubmission : Submission.findRecentRequestsByCatalogName(context, customerRequest.getCatalogName(), 4)) { %>
                        <div style="margin: 0; padding: 10px 10px 10px 10px;">
                            <a href="/kinetic/DisplayPage?srv=<%= recentSubmission.getTemplateId() %>"></a>
                            <div class="name">
                                <%= recentSubmission.getTemplateName() %>
                            </div>
                            <div class="description">
                                <% Template details = Template.findById(context, customerRequest.getCatalogName(), recentSubmission.getTemplateId()); %>
                                <%= details.getDescription() %>
                            </div>
                           <a style="margin: 10px 0px 0px 0px;" class="btn btn-primary" href="<%= pathHelper.templateUrl(recentSubmission.getTemplateId())%>">Request</a>
                        </div>
                        <% } %>
                    </div>
                </div>
            </div>
     </section>
     <%@include file="../../common/interface/fragments/contentFooter.jspf"%>
    </body>
</html>