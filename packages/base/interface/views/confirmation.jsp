<%-- Include the package initialization file. --%>
<%@include file="../../framework/includes/packageInitialization.jspf"%>
<!-- Page Stylesheets -->
<link rel="stylesheet" href="<%= bundle.packagePath()%>resources/css/displayPackage.css" type="text/css" />
<header class="container">
    <h2>
        <%= customerRequest.getTemplateName()%>
    </h2>
    <hr class="soften">
</header>
<section class="container display-page">
    <p>
        <b>Thank you for submitting a request for <%= customerRequest.getTemplateName()%>. Your Request ID is <%= customerRequest.getKsr()%>.
        </b>
    </p>
    <p>
        To track the status of your request, click the <a href="<%= bundle.getProperty("submissionsUrl")%>">My Request</a> link.
    </p>
</section>