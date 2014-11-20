<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%
    // Define vairables we are working with
    String templateId = null;
    Submission submission = null;
    Template submissionTemplate = null;
    CycleHelper zebraCycle = new CycleHelper(new String[]{"odd", "even"});
    Map<String,String> additionalFields = new HashMap<String,String>();
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        // Set request for information as additional fields from customer survey
        additionalFields.put("Requsted For First Name", "300299800"); // Attribute 5
        additionalFields.put("Requsted For Last Name", "700001806"); // Attribute 6
        templateId = customerRequest.getTemplateId();
        submission = Submission.findByInstanceId(context, request.getParameter("id"), additionalFields);
        submissionTemplate = submission.getTemplate();
        if (submissionTemplate == null) {
            throw new Exception("Either the template no longer exists or bundle not configured to correct catalog");
        }
    }
%>
<%-- Include the bundle js config initialization. --%>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/submissionActivity.css" type="text/css" />
<header class="container">
    <div class="border-top border-left border-right border-gray-light clearfix">
        <div class="request-status border-bottom border-gray-light">
            <h3 class="pull-left color-gray-darkest">
                <%= themeLocalizer.getString(submission.getOriginatingForm())%> 
            </h3>
            <h3 class="pull-right">
                <%= themeLocalizer.getString(submission.getOriginatingRequestId())%>

           </h3>
        </div>
        <div class="request-information">
            <div class="col-md-4  border-right border-gray-light">
                <div class="wrap">
                    <div class="submitted-label color-gray">
                        <%= themeLocalizer.getString("Submitted On")%>&nbsp;
                    </div>
                    <div class="submitted-value">
                        <%= DateHelper.formatDate(submission.getCompletedDate(), request.getLocale())%>
                    </div>
                </div>
                <% if (submission.getRequestStatus().equals("Closed")) {%>
                    <div class="closed-label color-gray">
                        <%= themeLocalizer.getString("Closed On")%>&nbsp;
                    </div>
                    <div class="closed-value">
                        <%= DateHelper.formatDate(submission.getRequestClosedDate(), request.getLocale())%>
                    </div>
                <%}%>
                <% if (!"".equals(submission.get("Requsted For First Name")) &&
                        !"".equals(submission.get("Requsted For Last Name"))) {%>
                    <div class="wrap">
                        <div class="requested-for-label color-gray">
                            <%= themeLocalizer.getString("Requested For")%>&nbsp;
                        </div>
                        <div class="requested-for-value">
                            <%= submission.get("Requsted For First Name")%>&nbsp;<%= submission.get("Requsted For Last Name")%>
                        </div>
                    </div>
                <%}%>
            </div>
            <div class="col-md-4 middle">
                <h4 class="color-tertiary-compliment">
                    <%= themeLocalizer.getString(submission.getValiationStatus())%>
                </h4>
                <div class="content-wrap">
                    <% if(submissionTemplate.hasTemplateAttribute("ServiceItemImage")) {%>
                        <div class="image">
                            <img width="40" src="<%= ServiceItemImageHelper.buildImageSource(submissionTemplate.getTemplateAttributeValue("ServiceItemImage"), bundle.getProperty("serviceItemImagePath"))%>" alt="<%= themeLocalizer.getString(submission.getOriginatingForm())%>">
                        </div>
                    <%}%>
                </div>
            </div>
            <div class="col-md-4">
                <% if(!submission.getType().equals(bundle.getProperty("autoCreatedRequestType"))) {%>
                    <a class="view-submitted-form templateButton pull-right" target="_self" href="<%= bundle.applicationPath()%>ReviewRequest?csrv=<%=submission.getId()%>&excludeByName=Review%20Page&reviewPage=<%= bundle.getProperty("reviewJsp")%>">
                        <%= themeLocalizer.getString("View Submitted Form")%>
                    </a>
                <%}%>
            </div>
        </div>
    </div>
</header>
<section class="container submission-activity-container">
    <div class="border-left border-bottom border-right border-gray-light clearfix">
        <div class="submission-activity">
            <!-- Start Tasks -->
            <ul class="tasks unstyled">
                <% if(submission.getValiationStatus().equals("Cancelled")) {%>
                    <!-- Start display cancelled request notes -->
                    <li class="task cancelled">
                        <header class="clearfix">
                            <h4>
                                <%= themeLocalizer.getString("Request Cancelled")%>
                            </h4>
                        </header>
                        <hr class="soften" />
                        <%= submission.getNotesForCustomer()%>
                    </li>
                    <!-- End display cancelled request notes -->
                <%}%>
                <% for (String treeName : submission.getTaskTreeExecutions(context).keySet()) {%>
                    <% for (Task task : submission.getTaskTreeExecutions(context).get(treeName)) {%>
                    <%
                        // Define ticket related data
                        String incidentId = null;
                        Incident incident = null;
                        String changeId = null;
                        Change change = null;
                        // Define and Get ticket records if they actually exist for current task
                        if (task.getDefName().equals(bundle.getProperty("incidentHandler"))) {
                            incidentId = task.getResult("Incident Number");
                            incident = Incident.findById(context, templateId, incidentId);
                        } else if (task.getDefName().equals(bundle.getProperty("changeHandler"))) {
                            changeId = task.getResult("Change Number");
                            change = Change.findById(context, templateId, changeId);
                        }
                        String ticketId = null;
                        if (incident != null) {
                            ticketId = incident.getId();
                        } else if(change != null) {
                            ticketId = change.getId();
                        }
                    %>
                        <li class="task <%= zebraCycle.cycle()%>" data-task-id="<%= task.getId()%>" data-ticket-id="<%= ticketId%>">
                            <header class="clearfix">
                                <h4>
                                    <%= themeLocalizer.getString(task.getName())%>
                                </h4>
                            </header>
                            <hr class="soften" />
                            <% if (incident == null && change == null) {%>
                                <div class="wrap">
                                <div class="label"><%= themeLocalizer.getString("Status")%></div>
                                    <div class="value">
                                        <%= themeLocalizer.getString(task.getStatus())%>
                                    </div>
                                </div>
                            <%}%>
                            <div class="wrap">
                                <div class="label"><%= themeLocalizer.getString("Initiated")%></div>
                                <div class="value"><%= DateHelper.formatDate(task.getCreateDate(), request.getLocale())%></div>
                            </div>
                            <% if (task.getStatus().equals("Closed")) {%>
                                <div class="wrap">
                                    <div class="label"><%= themeLocalizer.getString("Completed")%></div>
                                    <div class="value"><%= DateHelper.formatDate(task.getModifiedDate(), request.getLocale())%></div>
                                </div>
                            <%}%>

                            <!-- Start Custom Incident and Change details -->
                            <!-- Pending Reason -->
                            <% if (incident != null && !incident.getStatusReason().equals("") && incident.getStatus().equals("Pending")) {%>
                                <div class="label"><%= themeLocalizer.getString("Pending Reason")%></div>
                                <div class="value">
                                    <span><%= themeLocalizer.getString(incident.getStatusReason())%></span>
                                </div>
                            <% } else if(change != null && !change.getStatusReason().equals("") && change.getStatus().equals("Pending")) {%>
                                <div class="label"><%= themeLocalizer.getString("Pending Reason")%></div>
                                <div class="value">
                                    <span><%= themeLocalizer.getString(change.getStatusReason())%></span>
                                </div>
                            <%}%>
                            <!-- Notes -->
                            <% if (submission.getType().equals(bundle.getProperty("autoCreatedRequestType")) && incident != null && !incident.getNotes().equals("")) {%>
                                <div class="label"><%= themeLocalizer.getString("Notes")%></div>
                                <div class="value">
                                    <span><%= themeLocalizer.getString(incident.getNotes())%></span>
                                </div>
                            <% } else if(submission.getType().equals(bundle.getProperty("autoCreatedRequestType")) && change != null && !change.getNotes().equals("")) {%>
                                <div class="label"><%= themeLocalizer.getString("Notes")%></div>
                                <div class="value">
                                    <span><%= themeLocalizer.getString(change.getNotes())%></span>
                                </div>
                            <%}%>
                            <!-- End Custom Incident and Change details -->

                            <% if (incident == null && change == null) {%>
                                <% TaskMessage[] messages = task.getMessages(context); %>
                                <% if(task.hasMessages()) {%>
                                    <div class="wrap">
                                        <div class="label"><%= themeLocalizer.getString("Messages")%></div>
                                        <div class="value">
                                            <% for (TaskMessage message : messages) {%>
                                                <div class="message"><%= themeLocalizer.getString(message.getMessage())%></div>
                                            <% }%>
                                        </div>
                                    </div>
                                <% }%>
                            <%}%>
                            <!-- Start Worklogs -->
                            <%@include file="../../fragments/worklogs.jspf"%>
                            <!-- End Worklogs -->
                        </li>
                    <% }%>
                <% }%>
            </ul>
        </div>
    </div>
</section>