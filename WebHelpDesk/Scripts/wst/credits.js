document.addEventListener('DOMContentLoaded', () => {

    const dateCredit = document.getElementById('dateCredit');
    const btnPlayConsumeWSCredits = document.getElementById('btnPlayConsumeWSCredits');

    const dateSearchConsumes = document.getElementById('dateSearchConsumes');
    const btnSearchConsumes  = document.getElementById('btnSearchConsumes');

    const dateSearchReport  = document.getElementById('dateSearchReport');
    const btnGenerateReport = document.getElementById('btnGenerateReport');

    const dateMain    = new Date();
    const dayMain     = (dateMain.getDate() < 10) ? "0" + dateMain.getDate() : dateMain.getDate();
    const monthMain   = ((dateMain.getMonth() + 1) < 10) ? "0" + (dateMain.getMonth() + 1) : (dateMain.getMonth() + 1);
    const dateCurrent = dateMain.getFullYear() + "-" + monthMain + "-" + dayMain;

    dateCredit.value = dateCurrent;

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

    fStartConsumeWSCredits = () => {
        try {
            if (dateCredit.value != "" && dateCredit.value.length == 10) {
                const dataSend = { dateCredit: dateCredit.value };
                $.ajax({
                    url: "../WSCredits/StartConsumeWSCredits",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {
                        dateCredit.disabled = true;
                        btnPlayConsumeWSCredits.disabled = true;
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
                        console.group('Creditos');
                        console.log(request);
                        console.groupEnd();
                        document.getElementById('contentLoading').innerHTML = "";
                        if (request.Session == true) {
                            if (request.Conexion == true && request.Bandera == true) {
                                if (request.Cantidad > 0) {
                                    $("html, body").animate({ scrollTop: $('#contentResultsConsume').offset().top - 50 }, 1000);
                                    document.getElementById('contentResultsConsume').innerHTML = `
                                    <div class="card shadow p-3 animated fadeIn delay-1s" id="cardContentResults">
                                        <h5 class="card-title text-center font-weight-bold text-primary"> <i class="fas fa-list mr-2"></i> Resultados WebService Creditos </h5>
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
                                            <button type="button" class="btn btn-sm btn-outline-primary" id="btnDownloadReportConsume" onclick="fDownloadReportCredits('${dateCredit.value}');">
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
                                    fShowAlert(dateCredit, 'Atención!', 'No se encontraron registros con la fecha indicada', 'info', 1, 0);
                                    dateCredit.disabled = false;
                                    btnPlayConsumeWSCredits.disabled = false;
                                }
                            } else {
                                fShowAlert(null, 'Atención!', 'Ocurrio un error al conectar al Web Service', 'error', 2, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                fShowAlert(dateCredit, 'Atención!', 'Completa el campo fecha correctamente', 'info', 1, 0);
            }
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else if (error instanceof RangeError) {
                console.error('RangeError: ', error.message);
            } else {
                consol.error('Error: ', error);
            }
        }
    }

    btnPlayConsumeWSCredits.addEventListener('click', fStartConsumeWSCredits);

    fRestartConsume = () => {
        dateCredit.value    = dateCurrent;
        dateCredit.disabled = false;
        btnPlayConsumeWSCredits.disabled = false;
        document.getElementById('contentResultsConsume').innerHTML = "";
        $("html, body").animate({ scrollTop: $('#content-download-wscredits').offset().top - 50 }, 1000);
    }

    fDownloadReportCredits = (paramdate) => {
        try {
            if (document.getElementById('contentDownload') != null) {
                document.getElementById('contentDownload').innerHTML = "";
            }
            if (paramdate != "" && paramdate.length == 10) {
                const dataSend = { dateCredit: paramdate };
                $.ajax({
                    url: "../WSCredits/DownloadReportCredits",
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
                                fShowAlert(dateCredit, 'Atención!', 'No se encontraron registros con la fecha indicada', 'warning', 1, 0);
                            }
                        } else {
                            fShowAlert(dateCredit, 'Atención!', 'No se pudo generar el reporte', 'warning', 1, 0);
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

    fLoadDataTable = () => {
        setTimeout(() => {
            $('#dataTable').DataTable({
                language: {
                    url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                order: [0, "DESC"]
            });
        }, 1500);
    }

    fSearchConsumesCredits = () => {
        const tableC = $("#dataTable").DataTable();
        tableC.destroy();
        document.getElementById('dataTable').classList.add("d-none");
        try {
            if (dateSearchConsumes.value != "" && dateSearchConsumes.value.length == 10) {
                const dataSend = { dateSearch: dateSearchConsumes.value };
                $.ajax({
                    url: "../WSCredits/SearchConsumesCredits",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {
                        btnSearchConsumes.disabled  = true;
                        dateSearchConsumes.disabled = true;
                        document.getElementById('loader').innerHTML = `
                            <div class="text-center text-primary">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <br />
                                <b>Procesando petición, espere...</b>
                            </div>
                        `;
                    }, success: (request) => {
                        console.group("Busqueda creditos");
                        console.log(request);
                        console.groupEnd();
                        setTimeout(() => {
                            document.getElementById('loader').innerHTML = "";
                            if (request.Bandera == true && request.Datos.length > 0) {
                                document.getElementById('body-consumesCredits').innerHTML = request.Html;
                                fLoadDataTable();
                                setTimeout(() => {
                                    document.getElementById('dataTable').classList.remove("d-none");
                                }, 500);
                            } else {
                                fShowAlert(dateSearchConsumes, 'Atención!', 'No se encontraron registros con la fecha indicada', 'warning', 1, 0);
                            }
                        }, 1000);
                        btnSearchConsumes.disabled  = false;
                        dateSearchConsumes.disabled = false;
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                fShowAlert(dateSearchConsumes, 'Atención!', 'Completa el campo fecha correctamente', 'info', 1, 0);
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

    btnSearchConsumes.addEventListener('click', fSearchConsumesCredits);

    fGenerateReportConsumes = () => {
        try {
            if (dateSearchReport.value != "" && dateSearchReport.value.length == 10) {
                const dataSend = { dateCredit: dateSearchReport.value };
                $.ajax({
                    url: "../WSCredits/DownloadReportCredits",
                    type: "POST",
                    data: dataSend,
                    beforeSend: () => {
                    }, success: (request) => {
                        console.group("Reporte Creditos");
                        console.log(request);
                        console.groupEnd();
                        if (request.Bandera == true) {
                            if (request.Datos > 0) {
                                document.getElementById('contentGenerateReport').innerHTML += `
                                    <hr />
                                    <div class="row">
                                        <div class="form-group col-md-4 offset-4 text-center">
                                            <a class="btn btn-sm btn-success btn-block text-white shadow btnDownloadFloat" href="/Content/${request.Folder}/${request.Archivo}" download="${request.Archivo}">
                                                <i class="fas fa-file-download mr-2"></i> Descargar Reporte
                                            </a>
                                        </div>
                                    </div>
                                `;
                            } else {
                                fShowAlert(dateSearchReport, 'Atención!', 'No se encontraron registros con la fecha indicada', 'warning', 1, 0);
                            }
                        } else {
                            fShowAlert(dateSearchReport, 'Atención!', 'No se pudo generar el reporte', 'warning', 1, 0);
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                fShowAlert(dateSearchReport, 'Atención!', 'Completa el campo fecha correctamente', 'info', 1, 0);
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

    btnGenerateReport.addEventListener('click', fGenerateReportConsumes);

});