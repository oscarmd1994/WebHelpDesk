document.addEventListener('DOMContentLoaded', () => {

    const dateUpdate = document.getElementById('dateUpdate');
    const btnPlayConsumeWSUpdates = document.getElementById('btnPlayConsumeWSUpdates');

    const dateMain = new Date();
    const dayMain = (dateMain.getDate() < 10) ? "0" + dateMain.getDate() : dateMain.getDate();
    const monthMain = ((dateMain.getMonth() + 1) < 10) ? "0" + (dateMain.getMonth() + 1) : (dateMain.getMonth() + 1);
    const dateCurrent = dateMain.getFullYear() + "-" + monthMain + "-" + dayMain;

    dateUpdate.value = dateCurrent;

    fShowAlert = (element, title, text, icon, type, con) => {
        Swal.fire({
            title: title, text: text, icon: icon, confirmButtonText: 'Aceptar',
            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
            showClass: { popup: 'animated fadeInDown fast' },
            hideClass: { popup: 'animated fadeOutUp fast' }
        }).then((acepta) => {
            if (type == 0) {
                location.href = "../Process/Logout";
            } else if (type == 1) {
                setTimeout(() => {
                    element.focus();
                }, 1000);
            } else {
                location.reload();
            }
        });
    }

    fStartConsumesStructureUpdates = () => {
        try {
            if (dateUpdate.value != "" && dateUpdate.value.length == 10) {
                const dataSend = { dateUpdate: dateUpdate.value };
                $.ajax({
                    url: "../WSStructureUpdates/StartConsumesStructureUpdates",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {
                        dateUpdate.disabled = true;
                        btnPlayConsumeWSUpdates.disabled = true;
                        document.getElementById('contentLoading').innerHTML = `
                            <div class="text-center text-primary">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <br />
                                <b>Procesando petición, espere...</b>
                            </div>
                        `;
                    }, success: (request) => {
                        console.group('Actualizaciones de estructura');
                        console.log(request);
                        console.groupEnd();
                        document.getElementById('contentLoading').innerHTML = "";
                        dateUpdate.disabled = false;
                        btnPlayConsumeWSUpdates.disabled = false;
                        if (request.Bandera == true) {
                            $("html, body").animate({ scrollTop: $('#contentResultsConsume').offset().top - 50 }, 1000);
                            document.getElementById('contentResultsConsume').innerHTML = `
                                    <div class="card shadow p-3 animated fadeIn delay-1s" id="cardContentResults">
                                        <h5 class="card-title text-center font-weight-bold text-primary"> <i class="fas fa-list mr-2"></i> Resultados WebService Estructura </h5>
                                        <div class="card-body">
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <i class="fab fa-connectdevelop text-success fa-lg"></i> Conexión WebService
                                                    <span class="badge badge-success badge-pill">OK</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <i class="fas fa-search text-info fa-lg"></i> Registros encontrados
                                                    <span class="badge badge-info badge-pill">${request.Cantidad}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <i class="fas fa-database text-success fa-lg"></i> Registros insertados
                                                    <span class="badge badge-success badge-pill">${request.Insertados}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <i class="fas fa-code text-info fa-lg"></i> Codigo sistema
                                                    <span class="badge badge-info badge-pill">${request.Codigo}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="card-footer text-center justify-content-center">
                                            <button type="button" class="btn btn-sm btn-outline-primary" id="btnDownloadReportConsume" onclick="fDownloadReportStructure('${dateUpdate.value}');">
                                                <i class="fas fa-play mr-2"></i> Generar reporte
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-primary" id="btnRestartConsume" onclick="fRestartConsume();">
                                                <i class="fas fa-undo mr-2"></i> Volver a consultar
                                            </button>
                                        </div>
                                        <div class="form-group text-center mt-3" id="contentDownload"></div>
                                    </div>
                            `;
                        } else {
                            fShowAlert(dateUpdate, 'Atención!', 'No se encontraron registros con la fecha indicada', 'info', 1, 0);
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                fShowAlert(dateUpdate, 'Atención!', 'Completa el campo fecha correctamente', 'info', 1, 0);
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

    btnPlayConsumeWSUpdates.addEventListener('click', fStartConsumesStructureUpdates);

    fRestartConsume = () => {
        dateUpdate.value    = dateCurrent;
        dateUpdate.disabled = false;
        btnPlayConsumeWSUpdates.disabled = false;
        document.getElementById('contentResultsConsume').innerHTML = "";
        $("html, body").animate({ scrollTop: $('#content-download-wsupdates').offset().top - 50 }, 1000);
    }

    fDownloadReportStructure = (paramdate) => {
        try {
            if (document.getElementById('contentDownload') != null) {
                document.getElementById('contentDownload').innerHTML = "";
            }
            if (paramdate != "" && paramdate.length == 10) {
                const dataSend = { dateUpdate: paramdate };
                $.ajax({
                    url: "../WSStructureUpdates/DownloadReportStructure",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {
                        document.getElementById('btnDownloadReportConsume').disabled = true;
                        document.getElementById('btnRestartConsume').disabled = true;
                    }, success: (request) => {
                        console.group("Reporte Creditos");
                        console.log(request);
                        console.groupEnd();
                        if (request.Bandera == true) {
                            if (request.Datos > 0) {
                                document.getElementById('contentDownload').innerHTML += `
                                    <a class="btn btn-sm btn-success text-white btnDownloadFloat" href="/Content/${request.Folder}/${request.Archivo}" download="${request.Archivo}"> <i class="fas fa-file-download mr-2"></i> Reporte generado, listo para descargar </a>
                                `;
                            } else {
                                fShowAlert(dateUpdate, 'Atención!', 'No se encontraron registros con la fecha indicada', 'warning', 1, 0);
                            }
                        } else {
                            fShowAlert(dateUpdate, 'Atención!', 'No se pudo generar el reporte', 'warning', 1, 0);
                        }
                        document.getElementById('btnDownloadReportConsume').disabled = false;
                        document.getElementById('btnRestartConsume').disabled = false;
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                alert('Acción invalida');
                location.reload();
            }
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof RangeError) {
                console.error('RangeError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

});