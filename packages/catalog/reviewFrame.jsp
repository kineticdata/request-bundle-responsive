<% 
    request.setAttribute("lastForwardServletPath", request.getServletPath());
    request.setAttribute("view", "reviewFrame");
    RequestDispatcher dispatcher = request.getRequestDispatcher("../../common/interface/layouts/layoutReviewFrame.jsp");
    dispatcher.forward(request, response);
    return;
%>