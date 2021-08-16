document.addEventListener('DOMContentLoaded', () => {

    /*
     * Constantes de botones
     */

    const btnUploadUpEmp    = document.getElementById('btn-upload-up-emp');
    const btnUploadDownEmp  = document.getElementById('btn-upload-down-emp');
    const btnUploadWSTalentia  = document.getElementById('btn-upload-ws-talentia');
    const btnUpFileDown     = document.getElementById('btn-up-file-down');
    const btnUpFileUp       = document.getElementById('btn-up-file-up');
    const btnUploadSizesEmp = document.getElementById('btn-upload-sizes-emp');
    const btnUpFileSizes    = document.getElementById('btn-up-file-sizes');
    //const btnCheckConnectWS = document.getElementById('btn-check-connection-ws');

    /*
     * Inhabilitar botones de accion
     */

    // Boton de carga de tallas
    //btnUpFileSizes.disabled    = true;
    //btnUploadSizesEmp.disabled = true;
    //btnUploadSizesEmp.style.cursor = "default";
    //btnUploadSizesEmp.setAttribute("title", "Esta accion aun no esta disponible para su uso");
    //btnUpFileSizes.style.cursor = "deafult";
    //btnUpFileSizes.setAttribute("title", "Esta accion aun no esta disponible para su uso");

    //Boton consumo de WebService
    //btnUploadWSTalentia.disabled = true;
    //btnUploadWSTalentia.style.cursor = "default";
    //btnUploadWSTalentia.setAttribute("title", "Esta accion aun no esta disponible para su uso");
    //btnCheckConnectWS.disabled = true;
    //btnCheckConnectWS.style.cursor = "default";
    //btnCheckConnectWS.setAttribute("title", "Esta accion aun no esta disponible para su uso");

    /*
     * Constantes de elementos
     */

    const pageInit          = document.getElementById('page-init');
    const contentUploadDown = document.getElementById('content-upload-down');
    const resultsFileUploadDown = document.getElementById('results-file-upload-down');
    const contentUploadUp       = document.getElementById('content-upload-up');
    const resultsFileUploadUp   = document.getElementById('results-file-upload-up');
    const contentUploadSizes    = document.getElementById('content-upload-sizes');
    const resultsFileUploadSizes  = document.getElementById('results-file-upload-sizes');
    const contentUploadWebService = document.getElementById('content-upload-ws');
    const resultsFileUploadWs     = document.getElementById('results-file-upload-ws');

    /*
     * Constantes de inputs
     */
    const fileDown  = document.getElementById('file-down');
    const fileUp    = document.getElementById('file-up');
    const fileSizes = document.getElementById('file-sizes');

    /*
     * Constantes de WS
     */
    const icoConnect = document.getElementById('ico-connect');
    const labConnect = document.getElementById('lab-connect');
    const loadConnectWs = document.getElementById('load-connect-ws');
    const loadInfoConnectWs = document.getElementById('load-info-connect-ws');
    const listResultsWs  = document.getElementById('list-results-ws');
    const btnImportResWs = document.getElementById('btn-import-res-ws');
    const loadImportBd   = document.getElementById('load-import-bd');

    /*
     * Funciones de carga de archivos para cargas masivas, bajas masivas y otras
     */

    // Funcion que captura los errores que ajax pueda obtener \\

    fcaptureaerrorsajax = (jq, exc) => {
        let msg = "";
        if (jq.status === 0) {
            msg = "No conectado. \n Verifica tu conexión de red.";
        } else if (jq.status === 404) {
            msg = 'Página solicitada no encontrada. [404]';
        } else if (jq.status == 500) {
            msg = 'Error interno del servidor [500].';
        } else if (exc === 'parsererror') {
            msg = 'El análisis JSON solicitado falló.';
        } else if (exc === 'timeout') {
            msg = 'Error de tiempo de espera.';
        } else if (exc === 'abort') {
            msg = 'Solicitud de Ajax abortada.';
        } else {
            msg = 'Error no detectado.\n' + jq.responseText;
        }
        console.log(msg);
    }

    // Funcion que muestra alertas al fallar la carga de un archivo
    fShowAlertFailedUpFile = (binder, namefile) => {
        Swal.fire({
            title: '<strong>Error</strong>',
            icon: 'error',
            html:
                `<a class="btn btn-primary btn-sm" href="/Content/${binder}/${namefile}" download="${namefile}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                <div class="card mt-4 shadow">
                    <div class="card-body">
                        <p class="justify-content"> <b> Descarga el Log y envíalo a los siguientes correos del área de TI. </b> </p>
                    </div>
                </div>
                <ul class="list-group mt-3 rounded"> 
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        mcarranza@gruposeri.com
                        <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        rgomez@gruposeri.com
                        <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                    </li>
                </ul>`,
            focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
            confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!'
        });
    }

    // Funcion que muestra alerta al faltar un archivo excel 
    fShowAlertFile = (typealert) => {
        if (typealert == 1) {
            Swal.fire({
                title: 'Atencion', text: 'Selecciona un archivo para continuar', icon: 'warning', confirmButtonText: 'Aceptar',
                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                showClass: { popup: 'animated fadeInDown fast' },
                hideClass: { popup: 'animated fadeOutUp fast' }
            });
        } else {
            Swal.fire({
                title: 'Atención', text: 'Archivos permitidos solo Excel con la extension .xlsx',
                icon: 'warning', confirmButtonText: 'Aceptar',
                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                showClass: { popup: 'animated fadeInDown fast' },
                hideClass: { popup: 'animated fadeOutUp fast' }
            });
        }
    }

    // Funcion que bloquea los botones del menu lateral izquierdo
    fBlockButtonsMenu = (flag) => {
        if (flag) {
            btnUploadUpEmp.disabled    = true;
            btnUploadDownEmp.disabled  = true;
            btnUploadWSTalentia.disabled  = true;
            btnUploadSizesEmp.disabled = true;
        } else {
            btnUploadUpEmp.disabled    = false;
            btnUploadDownEmp.disabled  = false;
            btnUploadWSTalentia.disabled  = false;
            btnUploadSizesEmp.disabled = false;
        }
    }

    // Funcion que oculta los formularios de otras opciones
    fOcultFormBnts = (elementinpt, elementresult, elementcontent, elementbtn) => {
        if (elementinpt != null) {
            elementinpt.value = "";
        }
        elementresult.innerHTML = "";
        elementcontent.classList.remove('animated', 'fadeIn');
        elementcontent.classList.add('animated', 'fadeOut');
        setTimeout(() => { elementcontent.classList.add('d-none'); }, 1000);
        elementbtn.classList.remove('active');
    }

    // Funcion que oculta el contenido de inicio y muestra el seleccionado 
    fLoadContentInit = (elementInit, elementContent, elementBtn) => {
        elementInit.classList.add('animated', 'fadeOut');
        setTimeout(() => { elementInit.classList.add('d-none'); }, 1000);
        setTimeout(() => {
            elementContent.classList.remove('d-none', 'animated', 'fadeOut');
            elementContent.classList.add('animated', 'fadeIn');
        }, 1000);
        elementBtn.classList.add('active');
    }

    // Funcion que muestra el formulario de cargas masivas
    fUploadUpEmp = () => {
        fOcultFormBnts(fileDown, resultsFileUploadDown, contentUploadDown, btnUploadDownEmp);
        fOcultFormBnts(fileSizes, resultsFileUploadSizes, contentUploadSizes, btnUploadSizesEmp);
        fOcultFormBnts(null, resultsFileUploadWs, contentUploadWebService, btnUploadWSTalentia);
        fLoadContentInit(pageInit, contentUploadUp, btnUploadUpEmp);
    }

    // Funcion que muestra el formulario de bajas masivas
    fUploadDownEmp = () => {
        fOcultFormBnts(fileUp, resultsFileUploadUp, contentUploadUp, btnUploadUpEmp);
        fOcultFormBnts(fileSizes, resultsFileUploadSizes, contentUploadSizes, btnUploadSizesEmp);
        fOcultFormBnts(null, resultsFileUploadWs, contentUploadWebService, btnUploadWSTalentia);
        fLoadContentInit(pageInit, contentUploadDown, btnUploadDownEmp);
    }

    // Funcion que muestra el apartado para el consumo del web service
    fUploadWsTalentia = () => {
        fOcultFormBnts(fileUp, resultsFileUploadUp, contentUploadUp, btnUploadUpEmp);
        fOcultFormBnts(fileDown, resultsFileUploadDown, contentUploadDown, btnUploadDownEmp);
        fOcultFormBnts(fileSizes, resultsFileUploadSizes, contentUploadSizes, btnUploadSizesEmp);
        fLoadContentInit(pageInit, contentUploadWebService, btnUploadWSTalentia);
    }

    // Funcion que muestra el formulario de tallas de uniforme
    fUploadSizesEmp = () => {
        fOcultFormBnts(fileUp, resultsFileUploadUp, contentUploadUp, btnUploadUpEmp);
        fOcultFormBnts(fileDown, resultsFileUploadDown, contentUploadDown, btnUploadDownEmp);
        fOcultFormBnts(null, resultsFileUploadWs, contentUploadWebService, btnUploadWSTalentia);
        fLoadContentInit(pageInit, contentUploadSizes, btnUploadSizesEmp);
    }

    fileUp.addEventListener('click', () => {
        fileUp.value = "";
        btnUpFileUp.disabled = false;
        resultsFileUploadUp.classList.add('d-none');
        resultsFileUploadUp.innerHTML = '';
    }); 

    // Funcion que valida y carga el archivo de cargas masivas
    fCheckUploadFileUp = () => {
        if (fileUp.value != "") {
            const allowedExtensions = /(.xlsx)$/i;
            if (!allowedExtensions.exec(fileUp.value)) {
                fShowAlertFile(2);
                fileUp.value = "";
            } else {
                const selectFile = ($("#file-up"))[0].files[0];
                let dataString   = new FormData();
                dataString.append("fileUpload", selectFile);
                dataString.append("typeFile", "CARGA");
                $.ajax({
                    url: "/Home/FileUploadGen",
                    type: "POST",
                    data: dataString,
                    contentType: false,
                    processData: false,
                    async: false,
                    success: (data) => {
                        if (data.Value == true) {
                            resultsFileUploadUp.classList.remove('d-none');
                            resultsFileUploadUp.innerHTML = `
                                <hr/>
                                <div class="row mt-4">
                                    <div class="col-md-6 text-center">
                                        <h6>Estado de la carga: <span class="badge badge-success p-2 ml-2">Correcta</span> </h6>
                                    </div>
                                    <div class="col-md-6 text-center">
                                        <button class="btn btn-sm btn-outline-success" id="btn-continue-up-emp" onclick="fContinueUpEmp()"> 
                                            <i class="fas fa-user-plus mr-2"></i> Proceder con la carga masiva 
                                        </button>
                                    </div>
                                    <div class="col-md-12 text-center mt-4" id="load-gif-up"></div>
                                </div>
                            `;
                            btnUpFileUp.disabled = true;
                        } else if (data.Value == false) {
                            fShowAlertFailedUpFile(data.Binder, data.LogFile);
                        } else {
                            location.reload();
                        }
                    }, error: (jqXHR, exception) => {
                        fcaptureaerrorsajax(jqXHR, exception);
                    }
                });
            }
        } else {
            fShowAlertFile(1);
        }
    }

    fContinueUpEmp = () => {
        fBlockButtonsMenu(true);
        $.ajax({
            url: "/Home/ContinueUpEmp/",
            type: "POST",
            data: {},
            contentType: false,
            processData: false,
            beforeSend: () => {
                document.getElementById('load-gif-up').innerHTML = `
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <h6 class="text-primary mt-3">Cargando...</h6>
                `;
            }, success: (data) => {
                fBlockButtonsMenu(false);
                document.getElementById('btn-continue-up-emp').disabled = false;
                fileUp.disabled = false;
                document.getElementById('load-gif-up').innerHTML = '';
                if (data.Value == true) {
                    Swal.fire({
                        title: '<strong>Resultados</strong>',
                        icon: 'info',
                        html:
                            `<b>Descarga y consulta el log para información mas detallada</b><br/><a class="btn btn-primary btn-sm mt-3" href="/Content/LogsCargas/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <ul class="list-group mt-4"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de datos en excel
                                <span class="badge badge-primary badge-pill">${data.CantReg}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de registros insertados
                                <span class="badge badge-primary badge-pill">${data.TotIns}</span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!',
                    });
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        icon: 'error',
                        html:
                            `<a class="btn btn-primary btn-sm" href="/Content/LogsError/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <div class="card mt-4 shadow">
                            <div class="card-body">
                                <p class="justify-content"> <b> Descarga el Log, verifica alguna de las posibles soluciones y vuelve a intentar por ultimo envíalo a los siguientes correos del área de TI. </b> </p>
                            </div>
                        </div>
                         <ul class="list-group mt-3 rounded"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                mcarranza@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                rgomez@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!'
                    });
                }
                setTimeout(() => {
                    fileUp.value = "";
                    btnUpFileUp.disabled = false;
                    resultsFileUploadUp.classList.add('d-none');
                    resultsFileUploadUp.innerHTML = '';
                }, 1000);
            }, error: (jqXHR, exception) => {
                fcaptureaerrorsajax(jqXHR, exception);
            }
        });
    }

    // Función que limpia el campo de archivo de bajas masivas para cargar uno nuevo
    fileDown.addEventListener('click', () => {
        fileDown.value = "";
        btnUpFileDown.disabled = false;
        resultsFileUploadDown.classList.add('d-none');
        resultsFileUploadDown.innerHTML = '';
    });

    // Funcion que valida y carga el archivo de bajas masivas
    fCheckUploadFileDown = () => {
        if (fileDown.value != "") {
            const allowedExtensions = /(.xlsx)$/i;
            if (!allowedExtensions.exec(fileDown.value)) {
                fShowAlertFile(2);
                fileDown.value = "";
            } else {
                const selectFile = ($("#file-down"))[0].files[0];
                let dataString   = new FormData();
                dataString.append("fileUpload", selectFile);
                dataString.append("typeFile", "BAJA");
                $.ajax({
                    url: "/Home/FileUploadGen",
                    type: "POST",
                    data: dataString,
                    contentType: false,
                    processData: false,
                    async: false,
                    success: (data) => {
                        if (data.Value == true) {
                            resultsFileUploadDown.classList.remove('d-none');
                            resultsFileUploadDown.innerHTML = `
                                <hr/>
                                <div class="row mt-4">
                                    <div class="col-md-6 text-center">
                                        <h6>Estado de la carga: <span class="badge badge-success p-2 ml-2">Correcta</span> </h6>
                                    </div>
                                    <div class="col-md-6 text-center">
                                        <button class="btn btn-sm btn-outline-danger" id="btn-continue-down-emp" onclick="fContinueDownEmp()"> 
                                            <i class="fas fa-user-times mr-2"></i> Proceder con la baja masiva 
                                        </button>
                                    </div>
                                    <div class="col-md-12 text-center mt-4" id="load-gif-down"></div>
                                </div>
                            `;
                            resultsFileUploadDown.classList.add('animated', 'fadeIn', 'delay-1s');
                            btnUpFileDown.disabled = true;
                        } else if (data.Value == false) {
                            fShowAlertFailedUpFile(data.Binder, data.LogFile);
                        } else {
                            location.reload();
                        }
                    }, error: (jqXHR, exception) => {
                        fcaptureaerrorsajax(jqXHR, exception);
                    }
                });
            }
        } else {
            fShowAlertFile(1);
        }
    }

    // Funcion que continua con la baja masiva de los empleados
    fContinueDownEmp = () => {
        fBlockButtonsMenu(true);
        document.getElementById('btn-continue-down-emp').disabled = true;
        fileDown.disabled = true;
        $.ajax({
            url: "/Home/ContinueDownEmp/",
            type: "POST",
            data: {},
            contentType: false,
            processData: false,
            beforeSend: () => {
                document.getElementById('load-gif-down').innerHTML = `
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <h6 class="text-primary mt-3">Cargando...</h6>
                `;
            },
            success: (data) => {
                console.log(data);
                fBlockButtonsMenu(false);
                document.getElementById('btn-continue-down-emp').disabled = false;
                fileDown.disabled = false;
                document.getElementById('load-gif-down').innerHTML = '';
                if (data.Estado === "Correcto") {
                    Swal.fire({
                        title: '<strong>Resultados</strong>',
                        icon: 'info',
                        html:
                            `<a class="btn btn-primary btn-sm" href="/Content/LogsBajas/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <ul class="list-group mt-4"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de datos en excel
                                <span class="badge badge-primary badge-pill">${data.CantReg}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de registros leídos
                                <span class="badge badge-primary badge-pill">${data.RegTotLeidos}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de registros no leídos
                                <span class="badge badge-primary badge-pill">${data.RegNotLeidos}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de filas no validas
                                <span class="badge badge-primary badge-pill">${data.RegNotValid}</span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!',
                    });
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        icon: 'error',
                        html:
                            `<a class="btn btn-primary btn-sm" href="/Content/LogsError/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <div class="card mt-4 shadow">
                            <div class="card-body">
                                <p class="justify-content"> <b> Descarga el Log, verifica alguna de las posibles soluciones y vuelve a intentar por ultimo envíalo a los siguientes correos del área de TI. </b> </p>
                            </div>
                        </div>
                         <ul class="list-group mt-3 rounded"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                mcarranza@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                rgomez@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!'
                    });
                }
                setTimeout(() => {
                    fileDown.value = "";
                    btnUpFileDown.disabled = false;
                    resultsFileUploadDown.classList.add('d-none');
                    resultsFileUploadDown.innerHTML = '';
                }, 1000);
            }, error: (jqXHR, exception) => {
                fcaptureaerrorsajax(jqXHR, exception);
            }
        });
    }

    

    // Funcion que valida y carga el archivo de tallas de uniforme
    fCheckUploadFileSizes = () => {
        if (fileSizes.value != "") {
            const allowedExtensions = /(.xlsx)$/i;
            if (!allowedExtensions.exec(fileSizes.value)) {
                fShowAlertFile(2);
                fileSizes.value = "";
            } else {
                const selectFile = ($("#file-sizes"))[0].files[0];
                let dataString = new FormData();
                dataString.append("fileUpload", selectFile);
                dataString.append("typeFile", "TALLAS");
                $.ajax({
                    url: "/Home/FileUploadGen",
                    type: "POST",
                    data: dataString,
                    contentType: false,
                    processData: false,
                    async: false,
                    success: (data) => {
                        if (data.Value == true) {
                            resultsFileUploadSizes.classList.remove('d-none');
                            resultsFileUploadSizes.innerHTML = `
                                <hr/>
                                <div class="row mt-4">
                                    <div class="col-md-6 text-center">
                                        <h6>Estado de la carga: <span class="badge badge-success p-2 ml-2">Correcta</span> </h6>
                                    </div>
                                    <div class="col-md-6 text-center">
                                        <button class="btn btn-sm btn-outline-success" id="btn-continue-sizes-emp" onclick="fContinueSizesEmp()"> 
                                            <i class="fas fa-undo mr-2"></i> Proceder con la actualizacion
                                        </button>
                                    </div>
                                    <div class="col-md-12 text-center mt-4" id="load-gif-sizes"></div>
                                </div>
                            `;
                            resultsFileUploadSizes.classList.add('animated', 'fadeIn', 'delay-1s');
                            btnUpFileSizes.disabled = true;
                        } else if (data.Value == false) {
                            fShowAlertFailedUpFile(data.Binder, data.LogFile);
                        } else {
                            location.reload();
                        }
                    }, error: (jqXHR, exception) => {
                        fcaptureaerrorsajax(jqXHR, exception);
                    }
                });
            }
        } else {
            fShowAlertFile(1);
        }
    }

    // Funcion que continua con la actualizacion de las tallas de los empleados
    fContinueSizesEmp = () => {
        fBlockButtonsMenu(true);
        document.getElementById('btn-continue-sizes-emp').disabled = true;
        fileSizes.disabled = true;
        $.ajax({
            url: "/Home/ContinueSizesEmp/",
            type: "POST",
            data: {},
            contentType: false,
            processData: false,
            beforeSend: () => {
                document.getElementById('load-gif-sizes').innerHTML = `
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <h6 class="text-primary mt-3">Cargando...</h6>
                `;
            },
            success: (data) => {
                fBlockButtonsMenu(false);
                document.getElementById('btn-continue-sizes-emp').disabled = false;
                fileDown.disabled = false;
                document.getElementById('load-gif-sizes').innerHTML = '';
                if (data.Estado === "Correcto") {
                    Swal.fire({
                        title: '<strong>Resultados</strong>',
                        icon: 'info',
                        html:
                            `<a class="btn btn-primary btn-sm" href="/Content/LogsTallas/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <ul class="list-group mt-4"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de datos en excel
                                <span class="badge badge-primary badge-pill">${data.UPDINS}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de registros Insertados
                                <span class="badge badge-primary badge-pill">${data.INSERT}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Cantidad de registros actualizados
                                <span class="badge badge-primary badge-pill">${data.UPDATE}</span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!',
                    });
                } else {
                    Swal.fire({
                        title: '<strong>Error</strong>',
                        icon: 'error',
                        html:
                            `<a class="btn btn-primary btn-sm" href="/Content/LogsError/${data.NombreLog}" download="${data.NombreLog}"> <i class="fas fa-download mr-1"></i> Descargar Log </a>
                         <div class="card mt-4 shadow">
                            <div class="card-body">
                                <p class="justify-content"> <b> Descarga el Log, verifica alguna de las posibles soluciones y vuelve a intentar por ultimo envíalo a los siguientes correos del área de TI. </b> </p>
                            </div>
                        </div>
                         <ul class="list-group mt-3 rounded"> 
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                mcarranza@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                rgomez@gruposeri.com
                                <span class="badge badge-primary badge-pill"><i class="fas fa-envelope"></i></span>
                            </li>
                         </ul>`,
                        focusConfirm: false, allowOutsideClick: false, allowEnterKey: false, allowEscapeKey: false,
                        confirmButtonText: '<i class="fas fa-check-circle mr-1"></i> Aceptar!'
                    });
                }
                setTimeout(() => {
                    fileSizes.value = "";
                    btnUpFileSizes.disabled = false;
                    resultsFileUploadSizes.classList.add('d-none');
                    resultsFileUploadSizes.innerHTML = '';
                }, 1000);
            }, error: (jqXHR, exception) => {
                fcaptureaerrorsajax(jqXHR, exception);
            }
        });
    }

    /*
     * Ejecucion de las funciones al presionar un boton
     */


    btnUploadUpEmp.addEventListener('click', fUploadUpEmp);

    btnUploadDownEmp.addEventListener('click', fUploadDownEmp);

    btnUploadWSTalentia.addEventListener('click', fUploadWsTalentia);

    btnUploadSizesEmp.addEventListener('click', fUploadSizesEmp);

    btnUpFileDown.addEventListener('click', fCheckUploadFileDown);

    btnUpFileUp.addEventListener('click', fCheckUploadFileUp);

    btnUpFileSizes.addEventListener('click', fCheckUploadFileSizes);

});