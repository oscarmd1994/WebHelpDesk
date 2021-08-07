document.addEventListener('DOMContentLoaded', () => {

    localStorage.clear();

    const dataTable  = document.getElementById('dataTable');
    const loader     = document.getElementById('loader');
    const bodyBranch = document.getElementById('body-branchoff');
    const exportDatabaseSip = document.getElementById('export-database-sip');
    const dataBdNotImport = document.getElementById('data-bd-not-import');
    const dataBdTemp        = document.getElementById('data-bd-temp');
    const dataBdDateCns     = document.getElementById('data-bd-datecns');
    const dataBdDateSip     = document.getElementById('data-bd-datesip');
    const icoShowLoad       = document.getElementById('ico-show-load');
    const txtStatusOper     = document.getElementById('txt-status-oper');
    const txtStatusOper2    = document.getElementById('txt-status-oper-2');
    const btnUpdateData     = document.getElementById('btn-update-data');
    const btnInsertData     = document.getElementById('btn-insert-data');
    const btnCloseDataInfo  = document.getElementById('btn-close-data-info');

    fLoadDataTable = () => {
        $('#dataTable').DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            }
        });
    }

    // Funcion que consulta los datos para llenar la tabla de sucursales
    fExtractionOfInformationOfBranchOff = () => {
        exportDatabaseSip.disabled = true;
        exportDatabaseSip.title = "Espera un momento por favor, cargando información....";
        localStorage.removeItem("countDb");
        dataBdTemp.textContent = "";
        dataBdDateCns.textContent = "";
        dataBdDateSip.textContent = "";
        try {
            $.ajax({
                url: "../Information/BranchOff",
                type: "POST",
                data: {},
                beforeSend: () => {
                    loader.innerHTML += `
                        <div class="text-center">
                          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Cargando...</span>
                          </div>
                        </div>
                        <div class="text-center mt-3"><b>Cargando información...</b></div>
                    `;
                }, success: (data) => {
                    console.log(data);
                    if (data.Bandera == true && data.MensajeError == "none") {
                        let count = 0;
                        let quantity = data.Datos;
                        localStorage.setItem("countDbBranchof", quantity);
                        dataBdTemp.textContent = quantity;
                        if (data.SinImportar == 0) {
                            btnInsertData.disabled = true;
                            btnInsertData.title = "No hay nada que registrar";
                        } else {
                            btnInsertData.disabled = false;
                            btnInsertData.title = "";
                        }
                        dataBdNotImport.textContent = data.SinImportar;
                        dataBdDateCns.textContent = data.FechaConsumo;
                        dataBdDateSip.textContent = data.FechaSip;
                        bodyBranch.innerHTML += data.Html;
                        if (quantity > 0) {
                            document.getElementById('nameBD').textContent  = data.NombreBD;
                            document.getElementById('nameBD1').textContent = data.NombreBD;
                            document.getElementById('nameBD2').textContent = data.NombreBD; 
                            setTimeout(() => { loader.innerHTML = ""; }, 1500);
                            setTimeout(() => {
                                dataTable.classList.remove('d-none');
                                dataTable.classList.add('fadeIn');
                                fLoadDataTable();
                                exportDatabaseSip.disabled = false;
                                exportDatabaseSip.title = "Información cargada, puedes hacer uso de la exportación.";
                                exportDatabaseSip.setAttribute("href", "#");
                                exportDatabaseSip.classList.remove('btn-light');
                                setTimeout(() => { exportDatabaseSip.classList.add('btn-primary'); }, 500);
                            }, 2000);
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

    // Funcion que activa la ventana modal
    fActiveModalShow = () => {
        //btnInsertData.disabled = false;
        btnUpdateData.disabled = true;
        $("#import-modal").modal("show");
        exportDatabaseSip.disabled = true;
        icoShowLoad.classList.remove('text-success');
        txtStatusOper.textContent  = '';
        txtStatusOper2.textContent = '';
    }

    // Funcion que inicia la importacion de puestos a sip
    fImportDataBranchOffSip = (paramint, paramstr1) => {
        try {
            btnCloseDataInfo.disabled = true;
            btnCloseDataInfo.title    = "Bloqueado mientras termina el proceso.";
            setTimeout(() => {
                if (paramint == 1) {
                    icoShowLoad.classList.add('text-primary');
                } else {
                    icoShowLoad.classList.add('text-info');
                }
                txtStatusOper.textContent  = "Iniciando conexión...";
                txtStatusOper2.textContent = paramstr1;
                $.ajax({
                    url: "../ImportBD/ImportBranchOfficesSIP",
                    type: "POST",
                    data: { quantity: parseInt(localStorage.getItem("countDbBranchof")), option: parseInt(paramint) },
                    beforeSend: () => {
                        icoShowLoad.classList.add('text-primary');
                    }, success: (data) => {
                        console.log(data);
                        if (paramint == 1) {
                            if (data.CorrectoInsert === true) {
                                dataBdDateSip.textContent = "";
                                let downloadFile = "";
                                setTimeout(() => {
                                    dataBdDateSip.textContent = data.FechaSip;
                                    icoShowLoad.classList.remove('text-primary');
                                    icoShowLoad.classList.add('text-success');
                                    txtStatusOper.textContent  = '¡Conexión correcta!';
                                    txtStatusOper2.textContent = 'Inserción con información existente en el WS...';
                                    if (data.BanderaArchivo == true) {
                                        downloadFile = `
                                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                                <small><i class="fas fa-clock mr-2 text-primary"></i>Archivo:</small>
                                                <span class="badge badge-primary badge-pill">
                                                    <a class="text-white"s href="/Content/${data.Carpeta}/${data.Archivo}" download="${data.Archivo}"> 
                                                    <i class="fas fa-cloud-download-alt"></i> </a> 
                                                </span>
                                            </li>
                                            `;
                                    }
                                    document.getElementById('list-info-data-result').innerHTML += `
                                        <li class="list-group-item d-flex justify-content-between align-items-center" id="item-news">
                                            <small><i class="fas fa-check mr-2 text-primary"></i>Registrados</small>
                                            <span class="badge badge-primary badge-pill">${data.MensajeInsert}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                            <small><i class="fas fa-clock mr-2 text-primary"></i>Tiempo:</small>
                                            <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                        </li>
                                        ${downloadFile}
                                    `;
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
                            if (data.CorrectoUpdate === true) {
                                dataBdDateSip.textContent = "";
                                let downloadFile = "";
                                setTimeout(() => {
                                    dataBdDateSip.textContent = data.FechaSip;
                                    icoShowLoad.classList.remove('text-info');
                                    icoShowLoad.classList.add('text-success');
                                    txtStatusOper.textContent  = '¡Conexión correcta!';
                                    txtStatusOper2.textContent = 'Actualización con información existente en el WS...';
                                    if (data.BanderaArchivo == true) {
                                        downloadFile = `
                                        <li class="list-group-item d-flex justify-content-between align-items-center" >
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
                                    document.getElementById('list-info-data-result').innerHTML += `
                                        <li class="list-group-item d-flex justify-content-between align-items-center"  id="item-updates">
                                            <small><i class="fas fa-undo mr-2 text-info"></i>Actualizados:</small>
                                            <span class="badge badge-info badge-pill">${data.Actualizados}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center" id="item-updates">
                                            <small><i class="fas fa-clock mr-2 text-info"></i>Tiempo:</small>
                                            <span class="badge badge-info badge-pill">${data.Tiempo}</span>
                                        </li>
                                        ${downloadFile}
                                    `;
                                    btnUpdateData.innerHTML   = `<i class="fas fa-undo mr-2"></i> Actualizar datos`;
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
                        if (data.CorrectoInsert == true || data.CorrectoUpdate == true) {
                            
                        } else {
                            alert('Error interno de la aplicacion!');
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

    // F restaura opciones
    fRestartOptions = () => {
        icoShowLoad.classList.remove('text-success', 'text-primary', 'text-info');
        txtStatusOper.textContent  = '';
        txtStatusOper2.textContent = '';
        btnInsertData.disabled = false;
        btnUpdateData.disabled = false;
        document.getElementById('content-btn-restart').innerHTML   = "";
        document.getElementById('list-info-data-result').innerHTML = "";

    }

    fClearModalData = () => {
        if (document.getElementById('item-news') != null) {
            const itemNews    = document.getElementById('item-news');
            const fatherElem1 = itemNews.parentNode;
            fatherElem1.removeChild(itemNews);
        }
        if (document.getElementById('item-updates') != null) {
            const itemUpdates = document.getElementById('item-updates');
            const fatherElem2 = itemUpdates.parentNode;
            fatherElem2.removeChild(itemUpdates);
        }
        const table = $('#dataTable').DataTable();
        table.destroy();
        bodyBranch.innerHTML = "";
        dataTable.classList.add("d-none");
        setTimeout(() => {
            fExtractionOfInformationOfBranchOff();
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
        fImportDataBranchOffSip(1, 'Insertando información existente en el WS...');
    });

    btnUpdateData.addEventListener('click', () => {
        btnUpdateData.disabled = true;
        btnInsertData.disabled = true;
        btnUpdateData.innerHTML = `
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Espere por favor...
        `;
        fImportDataBranchOffSip(2, 'Actualizando información existente en el WS...');
    });

    fExtractionOfInformationOfBranchOff();

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
    const bodyConsumes   = document.getElementById('body-consumes');

    btnConsumesTab.addEventListener('click', () => {
        const tableC = $("#table-consumes").DataTable();
        tableC.destroy();
        $.ajax({
            url: "../Information/InformationC",
            data: { option: "WSSucursales" },
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
    const bodyImport   = document.getElementById('body-import');

    btnImportTab.addEventListener('click', () => {
        const tableC = $("#table-import").DataTable();
        tableC.destroy();
        $.ajax({
            url: "../Information/InformationC",
            data: { option: "SIPSucursales" },
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

});