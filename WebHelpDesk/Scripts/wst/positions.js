document.addEventListener('DOMContentLoaded', () => {

    const dataTable         = document.getElementById('dataTable');
    //const loader            = document.getElementById('loader');
    //const bodyCenters       = document.getElementById('body-positions');
    const exportDatabaseSip = document.getElementById('export-database-sip');
    const dataBdTemp        = document.getElementById('data-bd-temp');
    const dataBdNotImport   = document.getElementById('data-bd-not-import');
    const dataBdDateCns     = document.getElementById('data-bd-datecns');
    const dataBdDateSip     = document.getElementById('data-bd-datesip');
    const icoShowLoad       = document.getElementById('ico-show-load');
    const txtStatusOper     = document.getElementById('txt-status-oper');
    const txtStatusOper2    = document.getElementById('txt-status-oper-2');
    const btnDownloadReportPositions = document.getElementById('btn-download-report-positions');
    const btnDownloadReportPositionsExists = document.getElementById('btn-download-report-positions-exists');
    const btnDownloadReportPositionsNotExists = document.getElementById('btn-download-report-positions-not-exists');
    const btnUpdateData    = document.getElementById('btn-update-data');
    const btnInsertData    = document.getElementById('btn-insert-data');
    const btnCloseDataInfo = document.getElementById('btn-close-data-info');

    fLoadDataTable = () => {
        $('#dataTable').DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            }
        });
    }


    // Funcion que consulta los datos para llenar la tabla de centros de costo
    fExtractionOfInformationOfPositions = () => {
        exportDatabaseSip.disabled = true;
        exportDatabaseSip.title = "Espera un momento por favor, cargando información....";
        localStorage.removeItem("countDb");
        dataBdTemp.textContent = "";
        dataBdDateCns.textContent = "";
        dataBdDateSip.textContent = "";
        try {
            $.ajax({
                url: "../Information/Positions",
                type: "POST",
                data: {},
                beforeSend: () => {
                    //loader.innerHTML += `
                    //    <div class="text-center">
                    //      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                    //        <span class="sr-only">Cargando...</span>
                    //      </div>
                    //    </div>
                    //    <div class="text-center mt-3"><b>Cargando información...</b></div>
                    //`;
                }, success: (data) => {
                    console.log(data);
                    if (data.Bandera == true && data.MensajeError == "none") {
                        let count = 0;
                        let quantity = data.Datos;
                        localStorage.setItem("countDbPositions", quantity);
                        dataBdTemp.textContent = quantity;
                        if (data.SinImportar == 0) {
                            btnInsertData.disabled = true;
                            btnInsertData.title = "No hay nada que insertar.";
                        } else {
                            btnInsertData.disabled = false;
                            btnInsertData.title = "";
                        }
                        dataBdNotImport.textContent = data.SinImportar;
                        dataBdDateCns.textContent = data.FechaConsumo;
                        dataBdDateSip.textContent = data.FechaSip;
                        //bodyCenters.innerHTML += data.Html;
                        if (quantity > 0) {
                            //setTimeout(() => { loader.innerHTML = ""; }, 1500);
                            setTimeout(() => {
                                document.getElementById('nameBD').textContent = data.NombreBD;
                                document.getElementById('nameBD1').textContent = data.NombreBD;
                                document.getElementById('nameBD2').textContent = data.NombreBD;
                                //dataTable.classList.remove('d-none');
                                //dataTable.classList.add('fadeIn');
                                //fLoadDataTable();
                                exportDatabaseSip.disabled = false;
                                exportDatabaseSip.title = "Información cargada, puedes hacer uso de la exportación.";
                                exportDatabaseSip.setAttribute("href", "#");
                                exportDatabaseSip.setAttribute("data-toggle", "modal");
                                exportDatabaseSip.setAttribute("data-target", "#import-modal");
                                exportDatabaseSip.classList.remove('btn-light');
                                setTimeout(() => { exportDatabaseSip.classList.add('btn-primary'); }, 500);
                            }, 2000);
                        }
                    } else {
                        exportDatabaseSip.disabled = true;
                        exportDatabaseSip.title = "No se encontro información";
                        loader.innerHTML = "";
                        //dataTable.classList.remove('d-none');
                        //dataTable.classList.add('fadeIn');
                        //fLoadDataTable();
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

    fExtractionOfInformationOfPositions();

    // Funcion que genera y descarga el reporte
    fGenerateReport = () => {
        try {
            const dataSend = {ws: "POSITIONS", info: "DATA", report: "GENERAL", business: 0};
            $.ajax({
                url: "../Reports/GenerateReportsWS",
                type: "POST",
                data: dataSend,
                beforeSend: () => {

                }, success: (request) => {
                    console.log(request);
                    if (request.Bandera == true && request.BanderaFolder == true && request.MensajeError == "none") {
                        btnDownloadReportPositions.setAttribute("href", `/Content/REPORTES/${request.Carpeta}/${request.Archivo}`);
                        btnDownloadReportPositions.setAttribute("download", `${request.Archivo}`);
                    } else {
                        alert('Se origino un error al generara el reporte');
                    }
                }, error: (jqXHR, exception) => {
                    console.error(jqXHR);
                    console.error(exception);
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

    fGenerateReport();

    // Funcion que carga los reportes de datos existentes y no existentes
    fLoadReports = (type) => {
        try {
            if (type == 1 || type == 2) {
                $.ajax({
                    url: "../Reports/GenerateReportsPositions",
                    type: "POST",
                    data: { type: parseInt(type) },
                    beforeSend: () => {

                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera == true && request.BanderaFolder == true && request.MensajeError == "none") {
                            if (type == 1) {
                                btnDownloadReportPositionsExists.setAttribute("href", `/Content/REPORTES/${request.Carpeta}/${request.Archivo}`);
                                btnDownloadReportPositionsExists.setAttribute("download", `${request.Archivo}`);
                            } else {
                                btnDownloadReportPositionsNotExists.setAttribute("href", `/Content/REPORTES/${request.Carpeta}/${request.Archivo}`);
                                btnDownloadReportPositionsNotExists.setAttribute("download", `${request.Archivo}`);
                            }
                        } else {
                            if (type == 1) {
                                if (request.Filas == 0) {
                                    btnDownloadReportPositionsExists.disabled = true;
                                    btnDownloadReportPositionsExists.textContent = "No Disponible.";
                                }
                            } else {
                                if (request.Filas == 0) {
                                    btnDownloadReportPositionsNotExists.disabled = true;
                                    btnDownloadReportPositionsNotExists.textContent = "No Disponible.";
                                }
                            }
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
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

    fLoadReports(1);
    fLoadReports(2);

    // F restaura opciones
    fRestartOptions = () => {
        icoShowLoad.classList.remove('text-success', 'text-primary', 'text-info');
        txtStatusOper.textContent = '';
        txtStatusOper2.textContent = '';
        btnInsertData.disabled = false;
        btnUpdateData.disabled = false;
        document.getElementById('content-btn-restart').innerHTML = "";
        document.getElementById('list-info-data-result').innerHTML = "";

    }

    // Funcion que activa la ventana modal
    fActiveModalShow = () => {
        //btnInsertData.disabled = false;
        btnUpdateData.disabled = true;
        $("#import-modal").modal("show");
        exportDatabaseSip.disabled = true;
        icoShowLoad.classList.remove('text-success');
        txtStatusOper.textContent = '';
        txtStatusOper2.textContent = '';
    }

    fClearModalData = () => {
        if (document.getElementById('item-news') != null) {
            const itemNews = document.getElementById('item-news');
            const fatherElem1 = itemNews.parentNode;
            fatherElem1.removeChild(itemNews);
        }
        if (document.getElementById('item-updates') != null) {
            const itemUpdates = document.getElementById('item-updates');
            const fatherElem2 = itemUpdates.parentNode;
            fatherElem2.removeChild(itemUpdates);
        }
        //const table = $('#dataTable').DataTable();
        table.destroy();
        //bodyCenters.innerHTML = "";
        //dataTable.classList.add("d-none");
        setTimeout(() => {
            fExtractionOfInformationOfPositions();
        }, 1000);
        fRestartOptions();
    }

    btnCloseDataInfo.addEventListener('click', fClearModalData);

    exportDatabaseSip.addEventListener('click', fActiveModalShow);

    btnInsertData.addEventListener('click', () => {
        btnInsertData.disabled = true;
        btnUpdateData.disabled = true;
        btnInsertData.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Espere por favor...
        `;
        fImportDataPositionsSip(1, 'Insertando información existente en el WS...');
    });

    btnUpdateData.addEventListener('click', () => {
        btnUpdateData.disabled = true;
        btnInsertData.disabled = true;
        btnUpdateData.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Espere por favor...
        `;
        fImportDataPositionsSip(2, 'Actualizando información existente en el WS...');
    });

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
            data: { option: "WSPosiciones" },
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
            data: { option: "SIPPosiciones" },
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

    fImportDataPositionsSip = (paramint, paramstr1) => {
        try {
            btnCloseDataInfo.disabled = true;
            btnCloseDataInfo.title = "Bloqueado mientras termina el proceso.";
            setTimeout(() => {
                if (paramint == 1) {
                    icoShowLoad.classList.add('text-primary');
                } else {
                    icoShowLoad.classList.add('text-info');
                }
                txtStatusOper.textContent = 'Iniciando conexión...';
                txtStatusOper2.textContent = paramstr1;
                $.ajax({
                    url: "../ImportBD/ImportPositionsSIP",
                    type: "POST",
                    data: { quantity: parseInt(localStorage.getItem("countDbPositions")), option: parseInt(paramint) },
                    beforeSend: () => {
                        icoShowLoad.classList.add('text-primary');
                    }, success: (data) => {
                        console.log(data);
                        if (paramint == 1) {
                            if (data.Insercion === true || data.Busqueda === true || data.Bandera == false) {
                                let downloadFile = "";
                                dataBdDateSip.textContent = "";
                                setTimeout(() => {
                                    if (data.BanderaArchivo == true) {
                                        downloadFile = `
                                            <li class="list-group-item d-flex justify-content-between align-items-center" id="item-news">
                                                <small><i class="fas fa-cloud-download-alt mr-2 text-primary"></i>Archivo:</small>
                                                <span class="badge badge-primary badge-pill">
                                                    <a class="text-white"
                                                        href="/Content/${data.Carpeta}/${data.Archivo}" download="${data.Archivo}"> 
                                                        Descargar 
                                                    </a> 
                                                </span>
                                            </li>
                                        `;
                                    }
                                    dataBdNotImport.textContent = data.SinImportar;
                                    dataBdDateSip.textContent = data.FechaSip;
                                    icoShowLoad.classList.remove('text-primary');
                                    icoShowLoad.classList.add('text-success');
                                    txtStatusOper.textContent = '¡Conexión correcta!';
                                    txtStatusOper2.textContent = 'Inserción con información existente en el WS...';
                                    document.getElementById('list-info-data-result').innerHTML += `
                                        <li class="list-group-item d-flex justify-content-between align-items-center" id="item-news">
                                            <small><i class="fas fa-envelope mr-2 text-primary"></i>Msj:</small>
                                            <span class="badge badge-primary badge-pill">${data.MensajeInsert}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                            <small><i class="fas fa-clock mr-2 text-primary"></i>Tiempo:</small>
                                            <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                        </li>
                                    `;
                                    if (data.BanderaArchivo == true) {
                                        document.getElementById('list-info-data-result').innerHTML += `
                                            <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                                <small><i class="fas fa-clock mr-2 text-primary"></i>Archivo:</small>
                                                <span class="badge badge-light text-primary badge-pill"><a href="/Content/${data.Carpeta}/${data.Archivo}" download="${data.Archivo}">${data.Archivo}</a></span>
                                            </li>
                                        `;
                                    }
                                    btnInsertData.innerHTML = '<i class="fas fa-list-alt mr-2"></i> Registrar datos';
                                    btnCloseDataInfo.disabled = false;
                                    btnCloseDataInfo.title = "";
                                    document.getElementById('content-btn-restart').innerHTML += `
                                            <button class="btn btn-light text-primary shadow btn-sm font-weight-bold" 
                                                    onclick="fRestartOptions();">
                                                Reiniciar opciones.
                                            </button>
                                        `;
                                }, 2000);
                            }
                        } else if (paramint == 2) {
                            if (data.Actualizado === true || data.Busqueda === true) {
                                dataBdDateSip.textContent = "";
                                let downloadFile = "";
                                setTimeout(() => {
                                    if (data.BanderaArchivo == true) {
                                        downloadFile = `
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <small><i class="fas fa-cloud-download-alt mr-2 text-primary"></i>Archivo:</small>
                                            <span class="badge badge-primary badge-pill">
                                                <a class="text-white"
                                                    href="/Content/${data.Carpeta}/${data.Archivo}" download="${data.Archivo}"> 
                                                    Descargar 
                                                </a> 
                                            </span>
                                            </li>
                                        `;
                                    }
                                    dataBdDateSip.textContent = data.FechaSip;
                                    icoShowLoad.classList.remove('text-info');
                                    icoShowLoad.classList.add('text-success');
                                    txtStatusOper.textContent = '¡Conexión correcta!';
                                    txtStatusOper2.textContent = 'Actualización con información existente en el WS...';
                                    document.getElementById('list-info-data-result').innerHTML += `
                                            <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                                <small><i class="fas fa-envelope mr-2 text-info"></i>Msj:</small>
                                                <span class="badge badge-info badge-pill">${data.MensajeInsert}</span>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                                <small><i class="fas fa-clock mr-2 text-info"></i>Tiempo:</small>
                                                <span class="badge badge-info badge-pill">${data.Tiempo}</span>
                                            </li>
                                            ${downloadFile}
                                        `;
                                    btnUpdateData.innerHTML = `<i class="fas fa-undo mr-2"></i> Actualizar datos`;
                                    btnCloseDataInfo.disabled = false;
                                    btnCloseDataInfo.title = "";
                                    document.getElementById('content-btn-restart').innerHTML += `
                                            <button class="btn btn-light text-primary shadow btn-sm font-weight-bold" 
                                                    onclick="fRestartOptions();">
                                                Reiniciar opciones.
                                            </button>
                                        `;
                                }, 2000);
                            }
                        } else {
                            location.reload();
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            }, 2000);
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