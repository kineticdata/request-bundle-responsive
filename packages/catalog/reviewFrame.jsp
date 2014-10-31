<jsp:useBean id="customerSurvey" scope="request" class="com.kd.kineticSurvey.beans.CustomerSurvey"/>
<%@include file="../../core/framework/CustomerRequest.jspf" %>
<%-- Initialize the customerRequest variable. --%>
<% CustomerRequest customerRequest = new CustomerRequest(request, customerSurvey); %>
<%
    // Define the body class for the layout as a request attribute
    request.setAttribute("bodyClass", "loadAllPages_" + customerRequest.getLoadAllPages() + " reviewFrame");
    // Explicitly set the view we want the layout to use as a request attribute 
    // Views are configured in package/config/config.json
    request.setAttribute("view", "reviewFrame");
    // Define the current servlet path for Bundle to use for package context within the layout
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    // Define dispatcher to forward to the desired layout
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layoutFrame.jsp");
    // Forward
    dispatcher.forward(request, response);
    // Return to ensure nothing else is processed
    return;
%>