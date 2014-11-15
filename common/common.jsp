<%-- Include the Bundle initialization file. --%>
<%@include file="../core/framework/includes/bundleInitialization.jspf"%>
<%
// Define callback
String callback = request.getParameter("callback");
// Determine if callback value exists and route to the correct display
// If the callback is provided in the query string parameter display callback
if(StringUtils.equals("updateLocale", callback)) {%>
    <%@include file="interface/callbacks/updateLocale.json.jsp"%>
<%
// Return 404
} else { response.setStatus(response.SC_NOT_FOUND); }%>