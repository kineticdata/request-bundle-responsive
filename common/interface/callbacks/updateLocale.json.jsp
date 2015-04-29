<%
    // Set the page content type, ensuring that UTF-8 is used
    response.setContentType("application/json; charset=UTF-8");
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        // Assume failure
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        // Load all of the package's JSON configurations
        Configurator configuration = new Configurator(bundle);
        Map<String,String> configuredLocales = configuration.getLocales();
        // Determine if language attempting to be set exists in configuration
        String language = configuredLocales.get(request.getParameter("locale"));
        // Build object of json result to return
        Map<String,Object> results = new LinkedHashMap<String,Object>();
        // Determine if locale was found
        if(language != null) {
            // Set preferred locale to session and DB
            LocaleHelper.setPreferredLocale(context, session, request.getParameter("locale"));
            // Update status to 200
            response.setStatus(HttpServletResponse.SC_OK);
            // Insert success messages
            results.put("status", response.getStatusLine().getStatusCode());
            results.put("success", "Locale updated.");
        } else {
            // Setup error message
            Map<String,String> errors = new LinkedHashMap<String,String>();
            errors.put("locale", "The Locale specified does not exist.");
            results.put("status", response.getStatusLine().getStatusCode());
            results.put("errors", errors);
        }
        // Output json string
        out.print(JSONValue.toJSONString(results));
    }
%>