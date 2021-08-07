document.addEventListener('DOMContentLoaded', () => {

    const contentConsumes = document.getElementById('contentConsumes');
    const contentImports  = document.getElementById('contentImports');
    const bodyData        = document.getElementById('bodyData');

    fLoadDataTable = () => {
        $("#dataTable").DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            },
            order: [0, "DESC"]
        });
    }

    fLoadDataTable();

    // Funcion que carga los consumos e importaciones realizadas
    fLoadImpCompUser = () => {
        try {
            const badges = ["primary", "secondary", "success", "info", "light", "dark", "warning"];
            $.ajax({
                url: "../Activity/LoadImportConsumeUser",
                type: "POST",
                data: {},
                beforeSend: () => {

                }, success: (request) => {
                    console.log(request);
                    for (let i = 0; i < request.Consumos.length; i++) {
                        let randomNumeric = Math.floor(Math.random() * (badges.length - 0) + 0);
                        if (randomNumeric == 7) {
                            randomNumeric = randomNumeric - 1;
                        }
                        contentConsumes.innerHTML += `<span onclick="fShowDataTable(1, '${request.Consumos[i].sAccion}', '${badges[randomNumeric]}');" title="Mostrar consumos de ${request.Consumos[i].sAccion}" style="cursor:pointer;" class="badge badge-${badges[randomNumeric]} mr-2 p-2 mt-2">${request.Consumos[i].sAccion} </span>`;
                    }
                    for (let i = 0; i < request.Importaciones.length; i++) {
                        let randomNumeric = Math.floor(Math.random() * (badges.length - 0) + 0);
                        if (randomNumeric == 7) {
                            randomNumeric = randomNumeric - 1;
                        }
                        contentImports.innerHTML += `<span onclick="fShowDataTable(2, '${request.Importaciones[i].sAccion}', '${badges[randomNumeric]}');" title="Mostrar consumos de ${request.Importaciones[i].sAccion}" style="cursor:pointer;" class="badge badge-${badges[randomNumeric]} mr-2 p-2 mt-2">${request.Importaciones[i].sAccion} </span>`;
                    }
                }, error: (jqXHR, exception) => {
                    console.error(jqXHR);
                    console.error(exception);
                }
            });
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else if (error instanceof RangeError) {
                console.error('RangeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

    fLoadImpCompUser();

    // Funcion que muestra los consumos de un servicio
    fShowDataTable = (paramtype, paramname, paramcolor) => {
        document.getElementById("nameWs").innerHTML = '<span class="badge badge-' + paramcolor + ' p-2">Seleccionado: ' + paramname + '</span>';
        bodyData.innerHTML = "";
        const table = $("#dataTable").DataTable();
        table.destroy();
        try {
            if (paramtype > 0 && paramname != "") {
                const dataSend = { type: parseInt(paramtype), name: String(paramname) };
                console.log(dataSend);
                $.ajax({
                    url: "../Activity/ShowDataTable",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {

                    }, success: (request) => {
                        console.log(request);
                        bodyData.innerHTML = request.Html;
                        setTimeout(() => {
                            fLoadDataTable();
                            console.clear();
                        }, 500);
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR, exception);
                    }
                });
            } else {
                alert('Accion invalida');
                location.reload();
            }
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else if (error instanceof RangeError) {
                console.error('RangeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

});