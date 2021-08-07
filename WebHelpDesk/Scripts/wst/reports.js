document.addEventListener('DOMContentLoaded', () => {

    const selectTypeWS      = document.getElementById('selectTypeWS');
    const informationReport = document.getElementById('informationReport');
    const selectReport      = document.getElementById('selectReport');

    informationReport.disabled = true;
    selectReport.disabled      = true;

    const contentLoadBusiness = document.getElementById('contentLoadBusiness');
    const contentDownLoadFile = document.getElementById('contentDownLoadFile');
    const btnGenerateReport   = document.getElementById('btnGenerateReport');

    // Funcion que muestra alertas dinamicas
    fShowTypeAlert = (title, text, icon, element) => {
        Swal.fire({
            title: title, text: text, icon: icon, confirmButtonText: 'Aceptar',
            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
            showClass: { popup: 'animated fadeInDown fast' },
            hideClass: { popup: 'animated fadeOutUp fast' }
        }).then((acepta) => {
            setTimeout(() => {
                element.focus();
            }, 1500);
        });
    }

    // Funcion que detecta el cambio de la informacion en el reporte
    fChangeInformationReport = () => {
        if (informationReport.value == "DATA") {
            if (selectTypeWS.value != "BRANCHOF" && selectTypeWS.value != "CENTERS") {
                selectReport.disabled = false;
            } else {
                selectReport.value    = "none";
                selectReport.disabled = true;
            }
        } else {
            selectReport.value            = "none";
            selectReport.disabled         = true;
            contentLoadBusiness.innerHTML = "";
        }
    }

    fChangeSelectTypeWS = () => {
        if (selectTypeWS.value != "none") {
            informationReport.disabled = false;
        } else {
            informationReport.disabled = true;
        }
        contentLoadBusiness.innerHTML = "";
        selectReport.value            = "none";
        informationReport.value       = "none";
        selectReport.disabled         = true;
    }

    // Funcion que carga el listado de empresas
    fLoadBusinessReport = () => {
        try {
            if (selectReport.value == "ONEBUSINESS") {
                $.ajax({
                    url: "../Employees/LoadBusinessReport",
                    type: "POST",
                    data: {},
                    beforeSend: () => {

                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera == true) {
                            let options = "<option value='none'>Selecciona</option>";
                            for (let i = 0; i < request.Datos.length; i++) {
                                options += `<option value="${request.Datos[i].sIdEmpresa}"> [${request.Datos[i].sIdEmpresa}] - ${request.Datos[i].sEmpresa}</option>`;
                            }
                            contentLoadBusiness.innerHTML += `
                                <label class="col-form-label text-primary font-weight-bold">
                                    Selecciona una empresa
                                </label>
                                <select class="form-control form-control-sm" id="businessOption">${options}</select>
                            `;
                        } else {
                            Swal.fire({
                                title: "Error!", text: "Ocurrio un problema al cargar las empresas disponibles", icon: "error", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            }).then((acepta) => {
                                setTimeout(() => {
                                    optionsReports.focus();
                                }, 1500);
                            });
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                contentLoadBusiness.innerHTML = "";
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

    // Funcion que envia la informacion para generar el reporte
    fGenerateReport = () => {
        try {
            let flagBusiness = false;
            let flagContinue = false;
            let flagSendData = false;
            let businessSend = 0;
            let routeSendDat = "";
            if (informationReport.value == "IMPORT" || informationReport.value == "CONSUME") {
                routeSendDat = "GenerateReportImCo";
            } else {
                routeSendDat = "GenerateReportsWS";
            }
            if (informationReport.value == "DATA" && selectTypeWS.value != "BRANCHOF" && selectTypeWS.value != "CENTERS") {
                flagBusiness = true;
            }
            if (selectTypeWS.value != "none") {
                if (informationReport.value != "none") {
                    if (flagBusiness) {
                        if (selectReport.value != 'none') {
                            flagContinue = true;
                        } else {
                            fShowTypeAlert("Atención!", "Selecciona la opción del reporte", "warning", informationReport);
                        }
                    } else {
                        flagContinue = true;
                    }
                    if (selectReport.value == "ONEBUSINESS") {
                        const business = document.getElementById('businessOption');
                        if (business.value != "none") {
                            flagSendData = true;
                            businessSend = business.value;
                        } else {
                            fShowTypeAlert("Atención!", "Selecciona la empresa a generar el reporte", "warning", business);
                        }
                    } else {
                        flagSendData = true;
                    }
                    if (flagSendData) {
                        const dataSend = { ws: String(selectTypeWS.value), info: String(informationReport.value), report: String(selectReport.value), business: parseInt(businessSend) };
                        console.log(dataSend);
                        $.ajax({
                            url: "../Reports/" + routeSendDat,
                            type: "POST",
                            data: dataSend,
                            beforeSend: () => {
                                selectTypeWS.disabled      = true;
                                informationReport.disabled = true;
                                selectReport.disabled      = true;
                                btnGenerateReport.disabled = true;
                            }, success: (request) => {
                                console.log(request);
                                if (request.Bandera == true && request.BanderaFolder == true && request.MensajeError == "none") {
                                    let wss = $('select[id="selectTypeWS"] option:selected').text();
                                    let inf = $('select[id="informationReport"] option:selected').text();
                                    let rep = $('select[id="selectReport"] option:selected').text();
                                    if (rep == "Selecciona") {
                                        rep = "NA";
                                    }
                                    contentDownLoadFile.innerHTML = `
                                        <h6 class="text-center mb-4 text-primary font-weight-bold mb-4">Reporte generado de: ${wss}, con información de: ${inf} de ${rep}.</h6>
                                        <a  href="/Content/REPORTES/${request.Carpeta}/${request.Archivo}" download="${request.Archivo}" class="btn btn-sm btn-light text-primary font-weight-bold animated fadeIn shadow-lg rounded"> 
                                            <i class="fas fa-file-download mr-2"></i> Descargar ${request.Archivo}
                                        </a>
                                        <button class="btn btn-sm btn-outline-secondary ml-2 font-weight-bold" onclick="fRestartOptions();"><i class="fas fa-undo mr-2"></i> Restaurar opciones</button>
                                    `;
                                } else {

                                }
                            }, error: (jqXHR, exception) => {
                                console.error(jqXHR);
                                console.error(exception);
                            }
                        });
                    }
                } else {
                    fShowTypeAlert("Atención!", "Selecciona una opción para la información del reporte", "warning", informationReport);
                }
            } else {
                fShowTypeAlert("Atención!", "Selecciona una opción de Web Service", "warning", selectTypeWS);
            }
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else if (error instanceof RangeError) {
                console.log('RangeError: ', error.message);
            } else {
                console.log('Error: ', error)
            }
        }
    }

    // Funcion que restaura las opciones de generacion de reportes
    fRestartOptions = () => {
        selectTypeWS.disabled      = false;
        informationReport.disabled = false;
        selectReport.disabled      = false;
        btnGenerateReport.disabled = false;
        selectTypeWS.value      = "none";
        informationReport.value = "none";
        selectReport.value      = "none";
        contentDownLoadFile.innerHTML = "";
    }

    selectTypeWS.addEventListener('change', fChangeSelectTypeWS);
    informationReport.addEventListener('change', fChangeInformationReport);
    selectReport.addEventListener('change', fLoadBusinessReport);
    btnGenerateReport.addEventListener('click', fGenerateReport);

});