<%-- Include the package initialization file. --%>
<%@include file="../../../framework/includes/packageInitialization.jspf"%>
<%@include file="../../../framework/includes/serviceLanguageInitialization.jspf"%>
<%-- Include the bundle js config initialization. --%>
<%@include file="../../../../../core/interface/fragments/packageJsInitialization.jspf" %>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>assets/css/displayPackage.css" type="text/css" />
<header class="container">
    <h2>
        <%= themeLocalizer.getString(customerRequest.getTemplateName()) %>
    </h2>
    <hr class="soften">
</header>
<section class="container display-page">
    <p>
        <b><%= themeLocalizer.getString("Thank you for submitting a request for")%> <%= themeLocalizer.getString(customerRequest.getTemplateName()) %>. <%= themeLocalizer.getString("Your Request ID is")%> <%= customerRequest.getKsr()%>.
        </b>
    </p>
    <p>
        <%= themeLocalizer.getString("To track the status of your request, click the")%> <a href="<%= bundle.getProperty("catalogUrl")%>&view=submissions"><%= themeLocalizer.getString("My Request")%></a> <%= themeLocalizer.getString("link")%>.
    </p>
</section>