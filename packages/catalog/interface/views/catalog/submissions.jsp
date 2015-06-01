<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf" %>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<%-- // Determine if view is set to table. --%>
<% if(StringUtils.isNotBlank(request.getParameter("look")) && 
    "table".equals(request.getParameter("look"))) {%>
<script> console.log('equals table'); </script>
    <%-- Include the libraries for rendering a submission's table UI. --%>
    <!-- Page Libraries -->
    <link rel="stylesheet" href="<%=bundle.bundlePath()%>libraries/jquery.qtip/jquery.qtip.min.css" type="text/css" />
    <link rel="stylesheet" href="<%=bundle.bundlePath()%>libraries/footable/css/footable.core.min.css" type="text/css" />
    <script type="text/javascript" src="<%=bundle.bundlePath()%>libraries/jquery.qtip/jquery.qtip.min.js"></script>
    <script type="text/javascript" src="<%=bundle.bundlePath()%>libraries/footable/js/footable.min.js"></script>
    <script type="text/javascript" src="<%=bundle.bundlePath()%>libraries/kinetic-consoleTable/jquery.consoleTable.js"></script>
    <!-- Page Stylesheets -->
    <link rel="stylesheet" href="<%=bundle.packagePath()%>assets/css/package.css" type="text/css" />
    <link rel="stylesheet" href="<%=bundle.packagePath()%>assets/css/submissionsTable.css" type="text/css" />
    <!-- Page Javascript -->
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/package.js"></script>
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/submissions.js"></script>
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/submissionsTable.js"></script>
<%}else{%>
    <%-- Default to the libraries for rendering a submission's list UI. --%>
    <!-- Page Libraries -->
    <script type="text/javascript" src="<%=bundle.bundlePath()%>libraries/kinetic-consoleList/jquery.consoleList.js"></script>
    <!-- Page Stylesheets -->
    <link rel="stylesheet" href="<%=bundle.packagePath()%>assets/css/package.css" type="text/css" />
    <link rel="stylesheet" href="<%=bundle.packagePath()%>assets/css/submissionsList.css" type="text/css" />
    <!-- Page Javascript -->
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/package.js"></script>
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/submissions.js"></script>
    <script type="text/javascript" src="<%=bundle.packagePath()%>assets/js/submissionsList.js"></script>
<%}%>
<%-- SUBMISSION TABLE LINKS --%>
<% if (context != null) { %>
    <header class="sub background-gray-lightest">
        <div class="container">
            <ul class="unstyled">
                <% if(bundle.getProperty("submissionType").equals("requests")) {%>
                    <% for (String groupName : submissionGroups.keySet()) { %>
                        <% if(requestsFilter.contains(groupName)) {%>
                            <%-- Count the number of submissions that match the current query --%>
                            <% Integer count = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName)); %>
                            <li class="">
                                <a data-group-name="<%=groupName%>" href="<%= bundle.getProperty("catalogUrl")%>&view=submissions&type=requests#<%=groupName%>">
                                    <%=themeLocalizer.getString(groupName)%>&nbsp;(<%=count%>)
                                </a>
                            </li>
                        <%}%>
                    <% }%>
                <% } else if(bundle.getProperty("submissionType").equals("approvals")) {%>
                    <% for (String groupName : submissionGroups.keySet()) { %>
                        <% if(approvalsFilter.contains(groupName)) {%>
                            <%-- Count the number of submissions that match the current query --%>
                            <% Integer count = ArsBase.count(context, "KS_SRV_CustomerSurvey", submissionGroups.get(groupName)); %>
                            <li class="">
                                <a data-group-name="<%=groupName%>" href="<%= bundle.getProperty("catalogUrl")%>&view=submissions&type=approvals#<%=groupName%>">
                                    <%=themeLocalizer.getString(groupName)%>&nbsp;(<%=count%>)
                                </a>
                            </li>
                        <%}%>
                    <% }%>
                <%}%>
            </ul>
        </div>
    </header>
<% }%>
<section class="container">  
    <%-- SUBMISSIONS VIEW --%>
    <div class="results hide">
    </div>
    <div class="results-message hide"></div>
    <%-- LOADER --%>
    <div id="loader">
        <img alt="<%= themeLocalizer.getString("Please Wait")%>." src="<%=bundle.bundlePath()%>common/assets/images/spinner.gif" />
        <br />
        <%= themeLocalizer.getString("Loading Results")%>
    </div>
</section>