<jsp:useBean id="customerSurvey" scope="request" class="com.kd.kineticSurvey.beans.CustomerSurvey"/>
<%@include file="../../core/framework/CustomerRequest.jspf" %>
<%-- Initialize the customerRequest variable. --%>
<% CustomerRequest customerRequest = new CustomerRequest(request, customerSurvey); %>
<%
    request.setAttribute("bodyClass", "loadAllPages_" + customerRequest.getLoadAllPages() + " reviewFrame");
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    request.setAttribute("view", "reviewFrame");
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layoutFrame.jsp");
    dispatcher.forward(request, response);
    return;
%>