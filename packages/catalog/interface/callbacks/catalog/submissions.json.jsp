<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%
    // Set the page content type, ensuring that UTF-8 is used
    response.setContentType("application/json; charset=UTF-8");
    if (context == null) {
        ResponseHelper.sendUnauthorizedResponse(response);
    } else {
        // Get qualification mapping from config
        String qualification = submissionGroups.get(request.getParameter("qualification"));
        if (qualification == null) {
            throw new Exception("The specified submission qualification ("+
                request.getParameter("qualification")+") does not match any pre-defined "+
                "submission qualifications.");
        }
        // Set size and offset
        int pageSize = 1000;
        int pageOffset = 0;
        try {
            // Try to retrieve the pageSize and convert to ints
            pageSize = Integer.parseInt(request.getParameter("limit"));
        } catch(NumberFormatException e) {
            throw new Exception("Unable to parse limit as integer.");
        }
        try {
            // Try to retrieve offset and convert to ints
            pageOffset = Integer.parseInt(request.getParameter("offset"));
        } catch(NumberFormatException e) {
            throw new Exception("Unable to parse offset as integer.");
        }
        // Set order field.  Currently only sorting for one field
        String sortOrderField = Submission.getSortFieldId(request.getParameter("orderField"));
        String[] sortFieldIds = new String[]{sortOrderField};
        // Retrieve the sortOrder parameter to determine integer value of sort order
        // 1 is ascending order and 2 is descending order
        int sortOrder = request.getParameter("order").equals("DESC") ? 2 : 1;
        // Retrieve the entries with the parameters gathered above
        Submission[] submissions = Submission.find(context, qualification, sortFieldIds, pageSize, pageOffset, sortOrder);
        // Retrieve count of the total number of entries that match the qualification.
        int count = ArsBase.count(context, Submission.FORM_NAME, qualification);
        // Build result map
        Map<String,Object> results = new LinkedHashMap<String,Object>();
        results.put("count", count);
        results.put("limit", pageSize);
        results.put("offset", pageOffset);
        // Build submission array
        List<Submission> submissionData = new LinkedList<Submission>();
        for (int i = 0; i < submissions.length; i++) {
            submissionData.add(submissions[i]);
        }
        // Add submission array to data
        results.put("data", submissionData);
        // Output json string
        out.print(JSONValue.toJSONString(results));
    }
%>