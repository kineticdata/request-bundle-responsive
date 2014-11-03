<%@page contentType="application/json; charset=UTF-8"%>
<%@include file="../../../core/framework/includes/bundleInitialization.jspf"%>
<%
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        LocaleHelper.setPreferredLocale(context, session, request.getParameter("preferredLocale"));
        out.println("{\"msg\": \"save successful\"}");
        out.flush();
    }
%>