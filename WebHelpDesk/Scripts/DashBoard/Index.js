$(function () {

    var TicketsPendientesTab;

    $("#newTicket").click(function () {
        $("#homeBody").empty();
        $("#homeBody").load("../DashBoard/Nuevo");
        /*$("#newTicketModal").modal("show");*/

    });

    loadTicketsPendientes = () => {

        $.ajax({
            url: "../Tickets/getTicketsPendientesTab",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                var prioridad = "";
                var tab = document.getElementById("bodyTicketsPendientesTab");
                tab.innerHTML = "";
                for (var i = 0; i < data.length; i++) {
                    if (data[i]["prioridadId"] == "1") { prioridad = "badge-danger"; }
                    if (data[i]["prioridadId"] == "2") { prioridad = "badge-warning"; }
                    if (data[i]["prioridadId"] == "3") { prioridad = "badge-success"; }
                    var dropdown =
                        "<div class='btn-group small'><div class='dropdown'>"
                        + "<button class='btn btn-secondary btm-sm dropdown-toggle font-body' type='button' id='dp" + data[i]["idTicket"] + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
                        + "Mas"
                        + "</button>"
                        + "<div class='dropdown-menu' aria-labelledby='dp" + data[i]["idTicket"] + "'>"
                        + "<a class='dropdown-item'>Action</a>"
                        + "<a class='dropdown-item'>Another action</a>"
                        + "<a class='dropdown-item'>Something else here</a>"
                        + "</div>"
                        + "</div></div>";
                    var btns = ""
                        + "<a class='badge badge-info badge-pill text-white py-1 px-2'>Atender</a>"
                        + "<a class='badge badge-info badge-pill text-white py-1 px-2'>Atender</a>";
                    tab.innerHTML += ""
                        + "<td class='align-middle text-center'><a class='text-white badge badge-pill " + prioridad + "'> " + data[i]["prioridadId"] + " </a></td>"
                        + "<td>" + data[i]["nombreModalidad"] + "</td>"
                        + "<td>" + data[i]["descripcionProblema"] + "</td>"
                        + "<td>" + data[i]["usuarioSolicitante"] + "</td>"
                        + "<td>" + data[i]["fechaCreacion"] + "</td>"
                        + "<td>" + data[i]["empresaId"] + " " + data[i]["nombreEmpresa"] + "</td>"
                        + "<td class='text-center'>" + btns + "</td>";
                }
                TicketsPendientesTab = $("#TicketsPendientesTab").DataTable({
                    "language": {
                        "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
                    }
                });
            }
        });
    }

    loadTicketsPendientes();


});