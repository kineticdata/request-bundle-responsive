<%
    // Set the page content type, ensuring that UTF-8 is used
    response.setContentType("application/json; charset=UTF-8");
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        // @TODO, this needs some way to validate the data before setting the locale
        // so only real locales that exist are being set.  Otherwise, it's possible to set
        // the locale to null or empty or an invaild
        try {
            org.apache.commons.lang.LocaleUtils.toLocale(request.getParameter("fooy"));
        } catch(java.lang.IllegalArgumentException e) {
            logger.debug("bad locale dude");
        }
        
        LocaleHelper.setPreferredLocale(context, session, request.getParameter("locale"));
        out.println("{\"msg\": \"save successful\"}");
        out.flush();
    }
%>