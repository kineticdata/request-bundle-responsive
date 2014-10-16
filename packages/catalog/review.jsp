<% 
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    request.setAttribute("view", "review");
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layoutReview.jsp");
    dispatcher.forward(request, response);
    return;
%>