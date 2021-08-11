$(function () {
    $("#newTicket").click(function () {
        console.log("click nuevo");
        $("#homeBody").empty();
        $("#homeBody").load("../DashBoard/Nuevo");
    });
});