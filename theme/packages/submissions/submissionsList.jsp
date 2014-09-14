<%-- Include the package initialization file. --%>
<%@include file="framework/includes/packageInitialization.jspf"%>
<%
// Attempt to set record id
String callback = request.getParameter("callback");
// Determine if callback value exists and route to the correct display
// If the callback is provided in the query string parameter display callback
if(StringUtils.equals("submissions", callback)) {%>
    <%@include file="interface/callbacks/submissions.json.jsp"%>
<%
// Display the default view
} else {%>
    <%@include file="interface/fragments/submissionsList.jspf"%>
<%}%>