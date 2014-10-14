<% 
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layout.jsp");
    dispatcher.forward(request, response);
    return;
%>