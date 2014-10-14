<% 
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    request.setAttribute("view", "confirmation");
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layoutDisplay.jsp");
    dispatcher.forward(request, response);
    return;
%>