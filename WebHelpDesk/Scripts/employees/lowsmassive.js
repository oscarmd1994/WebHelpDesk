document.addEventListener('DOMContentLoaded', () => {

    //const btnUploadDownEmp = document.getElementById('btn-upload-down-emp');
    const btnUpFileDown    = document.getElementById('btn-up-file-down');

    /*
     * Constantes de inputs
     */
    const fileDown = document.getElementById('file-down');

    const resultsFileUploadDown = document.getElementById('results-file-upload-down');

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
                let dataString = new FormData();
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

    //btnUploadDownEmp.addEventListener('click', fUploadDownEmp);

    btnUpFileDown.addEventListener('click', fCheckUploadFileDown);

});