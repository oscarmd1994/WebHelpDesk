document.addEventListener('DOMContentLoaded', () => {

    // Constantes

    /* Formulario */
    const formUser = document.getElementById('form-user');
    const userName = document.getElementById('user-name');
    const userPass = document.getElementById('user-pass');
    const btnLogin = document.getElementById('btn-login');

    //userName.value = "";
    //userPass.value = "";

    setTimeout(() => {
        userName.focus();
    }, 1000);

    // Funciones

    /* Captura errores ajax */
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

    /* Emite alertas dinamicas */
    fShowAlert = (element, title, text, icon, type) => {
        Swal.fire({
            title: title, text: text, icon: icon, confirmButtonText: 'Aceptar',
            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
            showClass: { popup: 'animated fadeInDown fast' },
            hideClass: { popup: 'animated fadeOutUp fast' }
        }).then((acepta) => {
            if (type == 0) {
                location.href = "../Process/Index";
            } else if (type == 1) {
                setTimeout(() => {
                    element.focus();
                }, 1000);
            } else {
                userName.value = "";
                userPass.value = "";
                setTimeout(() => {
                    element.focus();
                }, 1000);
            }
        });
    }

    /* Valida la informacion del login */
    fValidateDataLogin = () => {
        try {
            const systemInit = "IPSNet";
            if (userName.value != "" && userName.value.length > 3) {
                if (userPass.value != "" && userPass.value.length > 3) {
                    const dataSend = {
                        user: String(userName.value),
                        pass: String(userPass.value)
                    };
                    $.ajax({
                        url:  "../Home/ValidateDataLogin",
                        type: "POST",
                        data: dataSend,
                        beforeSend: () => {
                            btnLogin.disabled    = true;
                            btnLogin.textContent = "Validando información, espere...";
                        }, success: (data) => {
                            console.log(data);
                            setTimeout(() => {
                                if (data.ErrorV == "none" && data.MensajeV == "success" && data.BanderaV == true) {
                                    fShowAlert(null, 'Bienvenido!', 'Sesion iniciada, presiona aceptar...', 'success', 0);
                                } else if (data.ErrorV == "user" && data.MensajeV == "errorUser") {
                                    fShowAlert(userName, 'Atención!', 'Usuario incorrecto', 'warning', 1);
                                } else if (data.ErrorV == "pass" && data.MensajeV == "errorPass") {
                                    fShowAlert(userPass, 'Atención!', 'Contraseña incorrecta', 'warning', 1);
                                } else if (data.ErrorV == "register" && data.MensajeV == "errorRegister") {
                                    fShowAlert(userName, 'Atención!', 'Los datos ingresados son incorrectos', 'warning', 2);
                                } else {
                                    fShowAlert(btnLogin, 'Opss!', 'Error interno en la aplicación', 'error', 2);
                                }
                                btnLogin.disabled    = false;
                                btnLogin.textContent = "Iniciar sesión";
                            }, 2000);
                        }, error: (jqXHR, exception) => {
                            fcaptureaerrorsajax(jqXHR, exception);
                        }
                    });
                } else {
                    fShowAlert(userPass, 'Atención!', 'Completa el campo contraseña', 'warning', 1);
                }
            } else {
                fShowAlert(userName, 'Atención!', 'Completa el campo usuario', 'warning', 1);
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

    fRememberData = () => {
        try {
            $.ajax({
                url: "../Home/RememberData",
                type: "POST",
                data: {},
                beforeSend: () => { },
                success: (data) => {
                    if (data.Bandera == true && data.MensajeError == "none") {
                        document.getElementById('remember').checked = 1;
                        //fValidateDataLogin();
                    } else {
                        userName.value = "";
                        userPass.value = "";
                    }
                    console.log(data);
                }, error: (jqXHR, exception) => {
                    fcaptureaerrorsajax(jqXHR, exception);
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

    fRememberData();

    // Ejecucion de funciones

    btnLogin.addEventListener('click', fValidateDataLogin);

});