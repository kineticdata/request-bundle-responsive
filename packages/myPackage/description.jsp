<jsp:useBean id="customerSurvey" scope="request" class="com.kd.kineticSurvey.beans.CustomerSurvey"/>
<%@include file="../../core/framework/CustomerRequest.jspf" %>
<%-- Initialize the customerRequest variable. --%>
<% CustomerRequest customerRequest = new CustomerRequest(request, customerSurvey); %>
<% 
    request.setAttribute("title", customerRequest.getTemplateName());
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    request.setAttribute("view", "description");
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layout.jsp");
    dispatcher.forward(request, response);
    return;
%>