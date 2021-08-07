document.addEventListener('DOMContentLoaded', () => {

    const databaseSIP = document.getElementById('databaseSIP');
    const databaseIPS = document.getElementById('databaseIPS');
    const btnSaveConfiguration = document.getElementById('btnSaveConfiguration');

    fLoadInfo = () => {
        $.ajax({
            url: "../Configuration/ConfigBD",
            type: "POST",
            data: {},
            success: (request) => {
                console.log(request);
                if (request.Bandera == true) {
                    if (request.BDDefinida == "IPSNet") {
                        databaseIPS.checked = 1;
                    } else if (request.BDDefinida == "SIP2000") {
                        databaseSIP.checked = 1;
                    }
                    //document.getElementById('dateConfig').innerHTML += `<i class="fas fa-calendar-day mr-2"></i><b>${request.Fecha}</b>`;
                    document.getElementById('codeConfig').innerHTML += `<i class="fas fa-code mr-2"></i><b>${request.Codigo}</b>`;

                }
            }, error: (jqXHR, exception) => {
                console.error(jqXHR);
                console.error(exception);
            }
        });
    }

    setTimeout(() => {
        fLoadInfo();
    }, 1000);

    // Funcion que comprueba que guarda la configuracion
    fSaveConfigurationDatabase = () => {
        try {
            if ($('input[name="databaseC"]:radio').is(':checked')) {
                const databaseSelect = $('input[name="databaseC"]:checked').val();
                $.ajax({
                    url: "../Configuration/CDatabase",
                    type: "POST",
                    data: { db: databaseSelect },
                    beforeSend: () => {
                        btnSaveConfiguration.disabled = true;
                        document.getElementById('contentLoading').innerHTML += `
                            <div class="spinner-border text-primary mr-2" role="status">
                                <span class="sr-only">Loading...</span>
                            </div> Procesando cambios...
                        `;
                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera == true && request.MensajeError == "none") {
                            if (request.Estado == "NOTUPDATE") {
                                document.getElementById('contentLoading').innerHTML = "";
                                Swal.fire({
                                    title: "Info!", text: "No hay nada que actualizar", icon: "info", confirmButtonText: 'Aceptar',
                                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                    showClass: { popup: 'animated fadeInDown fast' },
                                    hideClass: { popup: 'animated fadeOutUp fast' }
                                }).then((acepta) => {
                                    setTimeout(() => {
                                        btnSaveConfiguration.disabled = false;
                                    }, 1000);
                                });
                            } else {
                                setTimeout(() => {
                                    document.getElementById('contentLoading').innerHTML = "";
                                    Swal.fire({
                                        title: "Correcto!", text: "Configuración guardada", icon: "success", confirmButtonText: 'Aceptar',
                                        allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                        showClass: { popup: 'animated fadeInDown fast' },
                                        hideClass: { popup: 'animated fadeOutUp fast' }
                                    }).then((acepta) => {
                                        setTimeout(() => {
                                            location.reload();
                                        }, 1000);
                                    });
                                }, 5000);
                            }
                        } else {
                            document.getElementById('contentLoading').innerHTML = "";
                            Swal.fire({
                                title: "Error!", text: "Ocurrio un problema interno en la aplicacion", icon: "error", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            }).then((acepta) => {
                                setTimeout(() => {
                                    location.reload();
                                }, 1000);
                            });
                        }
                    }, error: (jqXHR, exception) => {
                        console.error(jqXHR);
                        console.error(exception);
                    }
                });
            } else {
                Swal.fire({
                    title: "Atención!", text: "Selecciona una base de datos para continuar", icon: "warning", confirmButtonText: 'Aceptar',
                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                    showClass: { popup: 'animated fadeInDown fast' },
                    hideClass: { popup: 'animated fadeOutUp fast' }
                }).then((acepta) => {
                    setTimeout(() => {
                        btnSaveConfiguration.focus();
                    }, 1500);
                });
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

    btnSaveConfiguration.addEventListener('click', fSaveConfigurationDatabase);
    
});