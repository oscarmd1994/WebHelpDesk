document.addEventListener('DOMContentLoaded', () => {

    const quantityTotal     = document.getElementById('quantityTotal');
    const quantityNotImport = document.getElementById('quantityNotImport');
    //const quantityInSip     = document.getElementById('quantityInSip');
    //const downloadReportImport = document.getElementById('downloadReportImport');
    const btnStartImport    = document.getElementById('btnStartImport');
    const dateImportTEM     = document.getElementById('dateImportTEM');
    const dateImportSIP     = document.getElementById('dateImportSIP');
    const contentDownloadFile = document.getElementById('content-download-file');
    const optionsReports      = document.getElementById('optionsReports');
    const dateEntry           = document.getElementById('dateEntry');
    const btnGenerateReport   = document.getElementById('btnGenerateReport');
    const contentDownloadReport  = document.getElementById('contentDownloadReport');
    const contentLoadBusiness    = document.getElementById('contentLoadBusiness');
    const btnCloseGenerateReport = document.getElementById('btnCloseGenerateReport');
    const icoCloseGenerateReport = document.getElementById('icoCloseGenerateReport');

    btnStartImport.disabled = true;
    btnStartImport.title = "Inactivo, sin registros que importar";

    const contentBtnDownloadReportNotImport = document.getElementById('contentBtnDownloadReportNotImport');
    const btnDownloadTemplateGeneralActive = document.getElementById('btnDownloadTemplateGeneralActive');

    const btnDownloadTemplateGeneralDowns = document.getElementById('btnDownloadTemplateGeneralDowns');

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
            }
            if (con == 1) {
                fCheckConnectionWs();
            }
        });
    }

    // Funcion que carga los registros totales en el ws
    fLoadQuantityTotal = () => {
        try {
            $.ajax({
                url: "../Employees/QuantityTotal",
                type: "POST",
                data: {},
                beforeSend: () => {
                    console.log('Consultando cantidad...');
                }, success: (request) => {
                    console.log(request);
                    if (request.Bandera == true) {
                        quantityTotal.textContent = request.Cantidad;
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

    fLoadQuantityTotal();

    // Funcion que carga los registros sin importar en el ws

    fLoadQuantityRegistersNotImport = () => {
        try {
            $.ajax({
                url: "../Employees/InformationQuantitysDatesImport",
                type: "POST",
                data: {},
                beforeSend: () => {
                    document.getElementById('txtBtnDownloadTGA').textContent = "Generando, espere...";
                    document.getElementById('txtBtnDownloadTGD').textContent = "Generando, espere...";
                    document.getElementById('txtDateConsume').textContent = "Cargando...";
                }, success: (request) => {
                    console.log(request);
                    if (request.Bandera == true) {
                        quantityNotImport.textContent = request.Cantidad  + " registros.";
                        dateImportTEM.textContent     = request.FechaC;
                        dateImportSIP.textContent     = request.FechaI;
                        const sepDate  = request.FechaC.split(" ");
                        const sepMonth = sepDate[0].split("/")[1];
                        const monthsYear = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                        let monthClear = 0; 
                        if (sepMonth < 10) {
                            monthClear = sepMonth.replace("0", "");
                        } 
                        document.getElementById('txtDateConsume').textContent = sepDate[0].split("/")[0] + " de " + monthsYear[monthClear - 1] + " del " + sepDate[0].split("/")[2] + " a las " + sepDate[1] + " " + sepDate[2] + " " + sepDate[3];
                        localStorage.setItem("countDEmployees", request.Cantidad);
                        if (request.Cantidad != 0) {
                            btnStartImport.disabled = false;
                            btnStartImport.title = "Activo, listo para importar";
                            if (request.Reporte.bBandera == true) {
                                contentBtnDownloadReportNotImport.innerHTML += `
                                    <a href="/Content/${request.Reporte.sCarpeta}/${request.Reporte.sArchivo}" download="${request.Reporte.sArchivo}" class="btn btn-sm btn-success text-white font-weight-bold shadow-lg btnDownloadFloat rounded">
                                        <i class="fas fa-file-download mr-2"></i>
                                        Descargar reporte de empleados sin importar
                                    </a>
                                `;
                                Command: toastr["success"]("Reporte de empleados sin importar, completado.");
                            }
                        }
                        if (request.Plantilla.bBandera == true) {
                            btnDownloadTemplateGeneralActive.setAttribute("href", `/Content/${request.Plantilla.sCarpeta}/${request.Plantilla.sArchivo}`);
                            btnDownloadTemplateGeneralActive.setAttribute("download", `${request.Plantilla.sArchivo}`);
                            btnDownloadTemplateGeneralActive.setAttribute("title", "Reporte generado, listo para su descarga");
                            document.getElementById('txtBtnDownloadTGA').textContent = "Plantilla general de activos";
                            Command: toastr["success"]("Reporte de plantilla general de activos, completado.");
                        } else {
                            btnDownloadTemplateGeneralActive.disabled = true;
                            btnDownloadTemplateGeneralActive.setAttribute("title", "Ocurrio un problema al generar el reporte o no se encontro información");
                            document.getElementById('txtBtnDownloadTGA').textContent = "No disponible.";
                        }
                        if (request.Bajas.bBandera == true) {
                            btnDownloadTemplateGeneralDowns.setAttribute("href", `/Content/${request.Bajas.sCarpeta}/${request.Bajas.sArchivo}`);
                            btnDownloadTemplateGeneralDowns.setAttribute("download", `${request.Bajas.sArchivo}`);
                            btnDownloadTemplateGeneralDowns.setAttribute("title", "Reporte generado, listo para su descarga");
                            document.getElementById('txtBtnDownloadTGD').textContent = "Plantilla general de bajas";
                            Command: toastr["success"]("Reporte de plantilla general de bajas, completado.");
                            document.getElementById('quantityTotalDowns').textContent = request.Bajas.iCantidadDatos;
                        } else {
                            btnDownloadTemplateGeneralDowns.disabled = true;
                            btnDownloadTemplateGeneralDowns.setAttribute("title", "Ocurrio un problema al generar el reporte o no se encontro información");
                            document.getElementById('txtBtnDownloadTGD').textContent = "No disponible.";
                        }
                    } 
                }, error: (jqXHR, exception) => {
                    console.log(jqXHR);
                    console.log(exception);
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

    fLoadQuantityRegistersNotImport();

    // -- CONSUMOS -- \\

    fLoadDataTableConsumes = () => {
        setTimeout(() => {
            $('#table-consumes').DataTable({
                language: {
                    url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                order: [0, "DESC"]
            });
        }, 1500);
    }

    const btnConsumesTab = document.getElementById('consumes-tab');
    const bodyConsumes = document.getElementById('body-consumes');

    btnConsumesTab.addEventListener('click', () => {
        const tableC = $("#table-consumes").DataTable();
        tableC.destroy();
        $.ajax({
            url: "../Information/InformationC",
            data: { option: "WSEmpleados" },
            type: "POST",
            beforeSend: () => {
                bodyConsumes.innerHTML = "";
            }, success: (data) => {
                if (data.Bandera === true) {
                    bodyConsumes.innerHTML += data.Html;
                }
                fLoadDataTableConsumes();
            }, error: (jqXHR, exception) => {
                console.log(jqXHR);
                console.log(exception);
            }
        });
    });

    fLoadDataTableImport = () => {
        setTimeout(() => {
            $('#table-import').DataTable({
                language: {
                    url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                order: [0, "DESC"]
            });
        }, 1500);
    }

    const btnImportTab = document.getElementById('import-tab');
    const bodyImport = document.getElementById('body-import');

    btnImportTab.addEventListener('click', () => {
        const tableC = $("#table-import").DataTable();
        tableC.destroy();
        $.ajax({
            url: "../Information/InformationC",
            data: { option: "SIPEmpleados" },
            type: "POST",
            beforeSend: () => {
                bodyImport.innerHTML = "";
            }, success: (data) => {
                if (data.Bandera === true) {
                    bodyImport.innerHTML += data.Html;
                }
                fLoadDataTableImport();
            }, error: (jqXHR, exception) => {
                console.log(jqXHR);
                console.log(exception);
            }
        });
    });

    // Funcion que inicia la importacion de los datos
    fStartImportData = () => { 
        //fRestartOptions(1);
        try {
            const count   = localStorage.getItem("countDEmployees");
            let quantity  = 0;
            let continueP = 0;
            if (count != null) {
                quantity = count;
                if (quantity != 0) {
                    continueP = 1;
                }
            }
            if (continueP == 1) {
                $.ajax({
                    url: "../Employees/StartImportData",
                    type: "POST",
                    data: { quantity: parseInt(quantity), key: "WSEmployees" },
                    beforeSend: () => {
                        btnStartImport.disabled = true;
                        btnStartImport.title = "Importación en curso...";
                        contentDownloadFile.innerHTML = `
                        <div class="card text-center p-2 animated fadeIn delay-1s" style="width: 18rem;"> 
                            <div class="card-body">
                                <div class="spinner-border text-primary mr-2" role="status">
                                    <span class="sr-only">Cargando...</span>
                                </div>
                                <span class="card-title">Procesando petición...</span>
                            </div>
                        </div>
                    `;
                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera == true) {
                            if (request.BanderaInsercion == true || request.BanderaErrores) {
                                if (request.BanderaArchivo == true) {
                                    setTimeout(() => {
                                        contentDownloadFile.innerHTML = `
                                        <div class="card text-center animated fadeIn">
                                            <div class="card-header">
                                                Log de sistema
                                            </div>
                                            <div class="card-body">
                                                <h6 class="mb-3 text-primary font-weight-bold"> Descargar archivo generado</h6>
                                                <a title="${request.Archivo}" href="/Content/${request.Carpeta}/${request.Archivo}" download="${request.Archivo}" class="btn btn-sm btn-primary rounded shadow-lg animated bounceIn delay-2s"> <i class="fas fa-file-download mr-2"></i> <i class="fas fa-arrow-right mr-2"></i> <i class="fas fa-laptop"></i> </a>
                                            </div>
                                        </div>
                                    `;
                                        // <button class="btn btn-sm btn-secondary" title="Reiniciar" onclick="fRestartOptions(1);"> <i class="fas fa-undo"></i> </button>
                                        fLoadQuantityRegistersNotImport();
                                    }, 2000);
                                }
                            }
                        } else {
                            Swal.fire({
                                title: "Error!", text: "Ocurrio un error interno en la aplicacion " + request.MensajeExc, icon: "error", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            }).then((acepta) => {
                                fRestartOptions(1);
                                fLoadQuantityRegistersNotImport();
                            });
                        }
                    }, error: (jqXHR, exception) => {
                        console.log(jqXHR);
                        console.log(exception);
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

    // Funcion que restaura las opciones
    fRestartOptions = (paramtype) => {
        contentDownloadFile.innerHTML = "";
    }

    // Funcion que genera los reportes
    fGenerateReport = () => {
        contentDownloadReport.innerHTML = "";
        try {
            const flagBusiness = (optionsReports.value == "REPONE") ? true : false;
            let flagContinue   = false;
            let flagDateEntry = false;
            if (optionsReports.value == "REPDOWNS" || optionsReports.value == "REPUPS") {
                dateEntry.value = "2020-01-01";
            }
            if (optionsReports.value != "none" && dateEntry.value != "") {
                if (flagBusiness) {
                    if (document.getElementById('businessOption').value != 'none') {
                        flagContinue = true
                    } else {
                        Swal.fire({
                            title: "Atencion!", text: "Selecciona una empresa para generar el reporte", icon: "info", confirmButtonText: 'Aceptar',
                            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                            showClass: { popup: 'animated fadeInDown fast' },
                            hideClass: { popup: 'animated fadeOutUp fast' }
                        }).then((acepta) => {
                            setTimeout(() => {
                                document.getElementById('businessOption').focus();
                            }, 1500);
                        });
                    }
                } else {
                    flagContinue = true;
                }
                const dateClear  = dateEntry.value.replaceAll("-", "");
                const dateStatic = 20200101;
                const dataSend   = { key: "Employees", option: String(optionsReports.value), date: String(dateClear) };
                const business   = (optionsReports.value == "REPONE") ? document.getElementById('businessOption').value : 0;
                if (flagContinue) {
                    if (dateClear >= dateStatic) {
                        const dataSend = { key: "Employees", option: String(optionsReports.value), date: String(dateClear), business: business, dateEndPeriod: document.getElementById('dateEndPeriod').value };
                        console.log(dataSend);
                        $.ajax({
                            url: "../Employees/GenerateReport",
                            type: "POST",
                            data: dataSend,
                            beforeSend: () => {
                                btnGenerateReport.disabled = true;
                                btnGenerateReport.title = "Generando reporte...";
                                icoCloseGenerateReport.disabled = true;
                                btnCloseGenerateReport.disabled = true;
                                btnCloseGenerateReport.title = "Proceso en curso...";
                                icoCloseGenerateReport.title = "Proceso en curso...";
                            }, success: (request) => {
                                console.log(request);
                                if (request.Bandera == true && request.BanderaFolder == true && request.MensajeError == "none") {
                                    contentDownloadReport.innerHTML += ` 
                                    <div class="text-center mt-3">
                                        <h6 class="card-title font-weight-bold">Reporte generado...</h6>
                                        <a class="btn btn-block cardAnimation" href="/Content/REPORTES/${request.Carpeta}/${request.Archivo}" download="${request.Archivo}">  <i class="fas fa-file-download mr-2"></i> Descargar </a>
                                    </div>
                                `;
                                    btnGenerateReport.disabled = false;
                                    icoCloseGenerateReport.disabled = false;
                                    btnCloseGenerateReport.disabled = false;
                                    btnCloseGenerateReport.title = "";
                                    icoCloseGenerateReport.title = "";
                                } else {

                                }
                            }, error: (jqXHR, exception) => {
                                console.error(jqXHR);
                                console.error(exception);
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Atencion!", text: "La fecha de ingreso debe de ser mayor al Primero de Enero del 2020 (01/01/2020)", icon: "info", confirmButtonText: 'Aceptar',
                            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                            showClass: { popup: 'animated fadeInDown fast' },
                            hideClass: { popup: 'animated fadeOutUp fast' }
                        }).then((acepta) => {
                            setTimeout(() => {
                                dateEntry.focus();
                            }, 1500);
                        });
                    }
                }
            } else {
                Swal.fire({
                    title: "Atencion!", text: "Selecciona una opcion de reporte y una fecha de ingreso", icon: "info", confirmButtonText: 'Aceptar',
                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                    showClass: { popup: 'animated fadeInDown fast' },
                    hideClass: { popup: 'animated fadeOutUp fast' }
                }).then((acepta) => {
                    setTimeout(() => {
                        optionsReports.focus();
                    }, 1500);
                });
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

    // Funcion que carga el listado de empresas
    fLoadBusinessReport = () => {
        try {
            dateEntry.value    = "";
            dateEntry.disabled = false;
            contentDownloadReport.innerHTML = "";
            if (optionsReports.value == "REPONE") {
                document.getElementById('content-date-end').classList.add("d-none");
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
                if (optionsReports.value == "REPDOWNS" || optionsReports.value == "REPUPS") {
                    document.getElementById('content-date-end').classList.add("d-none");
                    dateEntry.disabled = true;
                } else if (optionsReports.value == "REPPER") {
                    document.getElementById('content-date-end').classList.remove("d-none");
                } else {
                    document.getElementById('content-date-end').classList.add("d-none");
                }
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

    // Funcion que limpia los campos al cerrar la ventana modal
    fClearFieldsWindowModal = () => {
        contentLoadBusiness.innerHTML   = "";
        contentDownloadReport.innerHTML = "";
        optionsReports.value = "none";
        dateEntry.value      = "";
        btnGenerateReport.disabled = false;
        document.getElementById('content-date-end').classList.add("d-none");
        document.getElementById('dateEndPeriod').value = "";
    }

    optionsReports.addEventListener('change', fLoadBusinessReport);
    btnStartImport.addEventListener('click', fStartImportData);
    btnGenerateReport.addEventListener('click', fGenerateReport);
    icoCloseGenerateReport.addEventListener('click', fClearFieldsWindowModal);
    btnCloseGenerateReport.addEventListener('click', fClearFieldsWindowModal);

    // INFORMACION DE EMPLEADOS POR FECHA \\

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "1500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const dateInfoStart = document.getElementById('dateInfoStart');
    const dateInfoEnd   = document.getElementById('dateInfoEnd');
    const typeInfo      = document.getElementById('typeInfo');
    const btnConsultationInfo = document.getElementById('btnConsultationInfo');

    const dateMain    = new Date();
    const dayMain     = (dateMain.getDate() < 10) ? "0" + dateMain.getDate() : dateMain.getDate();
    const monthMain   = ((dateMain.getMonth() + 1) < 10) ? "0" + (dateMain.getMonth() + 1) : (dateMain.getMonth() + 1);
    const dateCurrent = dateMain.getFullYear() + "-" + monthMain + "-" + dayMain;

    dateInfoStart.value = dateMain.getFullYear() + "-" + monthMain + "-" + "01"; 
    dateInfoEnd.value   = dateCurrent;

    //document.getElementById('dateMovementToday').textContent = dayMain + " de " + months[dateMain.getMonth()] + " del " + dateMain.getFullYear() + ".";
    document.getElementById('dateMovementDowns').textContent = dayMain + " de " + months[dateMain.getMonth()] + " del " + dateMain.getFullYear() + ".";
    
    btnConsultationInfo.disabled = true;
    btnConsultationInfo.title = "Completa los campos para continuar";

    // Funcion que activa el boton al seleccionar un tipo de informacion
    fActiveButton = () => {
        if (dateInfoStart.value != "" && dateInfoEnd.value != "") {
            if (typeInfo.value == "DOWN" || typeInfo.value == "ACTIVE") {
                btnConsultationInfo.disabled = false;
                btnConsultationInfo.title = "";
            } else {
                btnConsultationInfo.disabled = true;
                btnConsultationInfo.title = "Completa los campos para continuar";
            }
        } else {
            btnConsultationInfo.disabled = true;
            btnConsultationInfo.title = "Completa los campos para continuar";
        }
    }

    typeInfo.addEventListener('change', fActiveButton);
    dateInfoStart.addEventListener('change', fActiveButton);
    dateInfoEnd.addEventListener('change', fActiveButton);

    fDisabledParamsInfoPeriod = (flag) => {
        dateInfoStart.disabled = flag;
        dateInfoEnd.disabled   = flag;
        typeInfo.disabled      = flag;
        btnConsultationInfo.disabled = flag;
    }

    // Funcion que envía los parametros a consulta
    fSendDataSearch = () => {
        document.getElementById('contentImgDownloadFile').classList.remove('btnDownloadFloat', 'shadow-lg');
        document.getElementById('contentBtnDownloadFile').innerHTML = '';
        try {
            if (dateInfoStart.value != "" && dateInfoEnd.value != "") {
                if (typeInfo.value != "0" || typeInfo.value == "ACTIVE" || typeInfo.value == "DOWN") {
                    const dataSend = { dateStart: String(dateInfoStart.value), dateEnd: String(dateInfoEnd.value), type: String(typeInfo.value) };
                    $.ajax({
                        url: "../Employees/SendDataSearch",
                        type: "POST",
                        data: dataSend,
                        beforeSend: () => {
                            fDisabledParamsInfoPeriod(true);
                        }, success: (request) => {
                            console.log(request);
                            setTimeout(() => {
                                if (request.Bandera == true && request.BanderaFolder == true) {
                                    document.getElementById('contentImgDownloadFile').classList.add('btnDownloadFloat', 'shadow-lg');
                                    document.getElementById('contentBtnDownloadFile').innerHTML = `
                                    <a class="btn btn-sm btn-block mt-4 btn-success text-white" download="${request.Archivo}" href="/Content/REPORTES/${request.Carpeta}/${request.Archivo}"> 
                                        <i class="fas fa-file-download mr-2"></i> 
                                        Descargar Archivo 
                                    </a>
                                `;
                                } else {
                                    Command: toastr["error"]("Ocurrio un problema al generar el reporte");
                                }
                                fDisabledParamsInfoPeriod(false);
                            }, 1500);
                        }, error: (jqXHR, exception) => {
                            console.log(jqXHR);
                            console.log(exception);
                        }
                    });
                } else {
                    Command: toastr["warning"]("Completa el campo tipo");
                }
            } else {
                Command: toastr["warning"]("Completa el campo fecha");
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

    btnConsultationInfo.addEventListener('click', fSendDataSearch);

    //const btnDownloadReportMovements = document.getElementById('btn-download-report-movements');

    fDownloadReportMovements = () => {
        try {
            $.ajax({
                url: "../Employees/DownloadReportMovements",
                type: "POST",
                data: {},
                beforeSend: () => {

                }, success: (request) => {
                    console.log(request);
                    setTimeout(() => {
                        if (request.Bandera == true && request.BanderaFolder == true) {
                            //btnDownloadReportMovements.setAttribute("href", `/Content/REPORTES/${request.Carpeta}/${request.Archivo}`);
                            //btnDownloadReportMovements.setAttribute("download", `${request.Archivo}`);
                        } else {
                            Command: toastr["error"]("Ocurrio un problema al generar el reporte");
                        }
                        fDisabledParamsInfoPeriod(false);
                    }, 1500);
                }, error: (jqXHR, exception) => {
                    console.log(jqXHR);
                    console.log(exception);
                }
            });
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

    //fDownloadReportMovements();

    /* BAJAS IPSNet */

    localStorage.removeItem("downs");

    const btnDownloadReportDowns = document.getElementById('btn-download-report-downs');
    const btnStartDowns = document.getElementById('btnStartDowns');
    const dateDowns     = document.getElementById('dateDowns');
    const btnCheckInfoDowns = document.getElementById('btnCheckInfoDowns');

    //btnStartDowns.disabled = true;
    const monthAct = ((dateMain.getMonth() + 1) < 10) ? "0" + (dateMain.getMonth() + 1) : (dateMain.getMonth() + 1); 
    dateDowns.value = dateMain.getFullYear() + "-" + monthAct + "-" + dayMain;

    btnCheckInfoDowns.addEventListener('click', () => {
        if (dateDowns.value != "") {
            btnStartDowns.disabled = false;
            if (dateDowns.value.length == 10) {
                fLoadDataDownsOfTheDay(2); 
                let dataDateDown = dateDowns.value.split("-");
                console.log(dataDateDown);
                let monthT = dataDateDown[1];
                let monthClear = (monthT < 10) ? monthT.replace("0", "") : monthT;
                console.log(monthClear);
                document.getElementById('dateMovementDowns').textContent = dataDateDown[2] + " de " + months[monthClear - 1] + " del " + dataDateDown[0] + ".";

            }
        } else {
            btnStartDowns.disabled = true;
            Command: toastr["warning"]("Selecciona una fecha valida");
        }
    });

    // Funcion que muestra las bajas al día de hoy y genera reporte
    fLoadDataDownsOfTheDay = (type) => {
        try {
            $.ajax({
                url: "../Employees/LoadDataDownsOfTheDay",
                type: "POST",
                data: { dateDown: String(dateDowns.value), type: parseInt(type) },
                beforeSend: () => {
                    btnCheckInfoDowns.disabled = true;
                    btnStartDowns.disabled = true;
                    btnDownloadReportDowns.textContent = "Generando...";
                    dateDowns.disabled = true;
                    document.getElementById('quantityDownNotApply').textContent = "0";
                }, success: (request) => {
                    console.log(request);
                    if (request.Session == true) {
                        if (request.Bandera == true && request.Filas > 0) {
                            document.getElementById('quantityDownNotApply').textContent = request.Filas;
                            btnStartDowns.disabled = false;
                            btnDownloadReportDowns.textContent = "Descargar reporte de bajas.";
                            btnDownloadReportDowns.setAttribute("href", `/Content/REPORTES/${request.Carpeta}/${request.Archivo}`);
                            btnDownloadReportDowns.setAttribute("download", `${request.Archivo}`);
                            btnDownloadReportDowns.classList.remove("disabled");
                        } else {
                            btnStartDowns.disabled = true;
                            btnDownloadReportDowns.classList.add("disabled");
                            btnDownloadReportDowns.textContent = "No Disponible.";
                            btnStartDowns.title = "No disponible";
                            document.getElementById('quantityDownNotApply').textContent = 'No se encontraron registros.';
                        }
                    } else {
                        fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                    }
                    btnCheckInfoDowns.disabled = false;
                    dateDowns.disabled = false;
                    localStorage.setItem("downs", request.Filas);
                }, error: (jqXHR, exception) => {
                    console.log(jqXHR);
                    console.log(exception);
                }
            });
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

    fLoadDataDownsOfTheDay(1);

    // Funcion que inicia el proceso de bajas del empleado 
    fStartProcessDowns = () => {
        try {
            const rows = localStorage.getItem("downs");
            if (rows > 0) {
                if (dateDowns.value != "" && dateDowns.value.length == 10) {
                    const dataSend = { dateDown: dateDowns.value, quantity: rows };
                    $.ajax({
                        url: "../Employees/StartProcessDowns",
                        type: "POST",
                        data: dataSend,
                        beforeSend: () => {
                            document.getElementById('contentLoadingDowns').innerHTML = `
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <br />
                                <hr />
                                <h5 class="card-title text-center"> <i class="fas fa-user-times fa-lg text-danger mr-2"></i> <b>Iniciando proceso de bajas, espere...</b> </h5>
                            `;
                            document.getElementById('cardContentInfoDowns').classList.add('d-none');
                            btnStartDowns.disabled = true;
                            btnCheckInfoDowns.disabled = true;
                            dateDowns.disabled = true;
                            $("html, body").animate({ scrollTop: $('#contentLoadingDowns').offset().top - 50 }, 1000);
                        }, success: (request) => {
                            console.group("Proceso de bajas");
                            console.log(request);
                            console.groupEnd();
                            document.getElementById('cardContentInfoDowns').classList.remove("d-none");
                            document.getElementById('contentLoadingDowns').innerHTML = "";
                            document.getElementById('contentInfoDowns').innerHTML = `
                                <div class="card-body">
                                    <h5 class="card-title text-center font-weight-bold text-primary"> <i class="fas fa-list mr-2"></i> Resultados Bajas de Empleados </h5>
                                    <ul class="list-group list-group-flush mt-3">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-search text-info fa-lg"></i> Bajas encontradas
                                            <span class="badge badge-info badge-pill">${request.CantidadBajas}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-database text-success fa-lg"></i> Bajas procesadas
                                            <span class="badge badge-success badge-pill">${request.Informacion.iCompleto}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-database text-info fa-lg"></i> Bajas existentes
                                            <span class="badge badge-info badge-pill">${request.Informacion.iExisteBaja}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-database text-warning fa-lg"></i> Nominas no existentes
                                            <span class="badge badge-warning badge-pill">${request.Informacion.iNoExisteSistema}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-laptop text-dark fa-lg"></i> Registros leidos
                                            <span class="badge badge-dark badge-pill">${request.Informacion.iRecorridos}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <i class="fas fa-file text-primary fa-lg"></i> Archivo Log
                                            <span class="badge badge-primary badge-pill"><a class="text-white" href="/Content/${request.Informacion.sCarpeta}/${request.Informacion.sArchivo}" download="${request.Informacion.sArchivo}"> <i class="fas fa-file-download"></i> </a></span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="card-footer text-center justify-content-center">
                                    <button type="button" class="btn btn-sm btn-outline-primary" id="btnRestartConsume" onclick="fRestartSarchDowns();">
                                        <i class="fas fa-undo mr-2"></i> Volver a consultar
                                    </button>
                                </div>
                            `;
                        }, error: (jqXHR, exception) => {
                            console.error(jqXHR);
                            console.error(exception);
                        }
                    });
                } else {
                    Command: toastr["warning"]("Selecciona una fecha valida");
                }
            } else {
                alert('Accion invalida');
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

    btnStartDowns.addEventListener('click', fStartProcessDowns);

    fRestartSarchDowns = () => {
        $("html, body").animate({ scrollTop: $('#contentOneDowns').offset().top - 50 }, 1000);
        btnStartDowns.disabled     = false;
        btnCheckInfoDowns.disabled = false;
        dateDowns.disabled         = false;
        setTimeout(() => {
            document.getElementById('contentInfoDowns').innerHTML = "";
            document.getElementById('cardContentInfoDowns').classList.add('d-none');
        }, 500);
    }

});