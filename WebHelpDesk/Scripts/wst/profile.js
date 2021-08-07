document.addEventListener('DOMContentLoaded', () => {

    const bodyUsers = document.getElementById('body-users');
    const btnGeneratePassUser = document.getElementById('btn-generate-pass-user');
    const btnCopyPassUser = document.getElementById('btn-copy-pass-user');
    const btnSaveNewUser = document.getElementById('btn-save-new-user');

    const myLength = document.getElementById("length");
    const myLower = document.getElementById("lowercase");
    const myUpper = document.getElementById("uppercase");
    const myNumber = document.getElementById("number");
    const mySymbol = document.getElementById("symbol");

    const nameUser  = document.getElementById('name-user');
    const passUser  = document.getElementById('pass-user');
    const emailUser = document.getElementById('email-user');

    const nameUserEdit = document.getElementById('name-user-edit');
    const emailUserEdit = document.getElementById('email-user-edit');

    fLoadDataTable = () => {
        $("#dataTable").DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            }
        });
    }

    fShowDataLoadTable = () => {
        try {
            $.ajax({
                url: "../Profile/ShowDataLoadTable",
                type: "POST",
                data: {},
                beforeSend: () => {

                }, success: (request) => {
                    console.log(request);
                    if (request.Bandera == true) {
                        bodyUsers.innerHTML = request.Html;
                        setTimeout(() => {
                            fLoadDataTable();
                        }, 1000);
                    } else {

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

    fShowDataLoadTable();

    let randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "1500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    btnGeneratePassUser.addEventListener("click", () => {
        const length = +myLength.value;
        const hasLower = myLower.checked;
        const hasUpper = myUpper.checked;
        const hasNumber = myNumber.checked;
        const hasSymbol = mySymbol.checked;
        passUser.value = generatePsd(hasLower, hasUpper, hasNumber, hasSymbol, length);
        if (passUser.value != "") {
            Command: toastr["success"]("Contraseña generada");
        }
    });

    btnCopyPassUser.addEventListener('click', () => {
        const textarea = document.createElement("textarea");
        const password = passUser.value;
        console.log(password);
        if (!password) {
            return;
        }
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        var input = $("<input>");
        var color = $(this).children(".color-hex").text();
        $("body").append(input);
        input.val(color).select();
        document.execCommand("copy");
        console.log(input);
        console.log(color);
        console.log(textarea);
        //passUser.innerText = "";
        //$(".copied").fadeIn().delay(2000).fadeOut();
        Command: toastr["info"]("Contraseña copiada!!");
    });

    function generatePsd(lower, upper, number, symbol, length) {
        let generatedPassword = "";
        const typesCount = lower + upper + number + symbol;
        const typesArray = [{ lower }, { upper }, { number }, { symbol }].filter((item) => Object.values(item)[0]);
        if (typesCount === 0) {
            return "";
        }
        // create a loop
        for (let i = 0; i < length; i += typesCount) {
            typesArray.forEach((type) => {
                const funcName = Object.keys(type)[0];
                generatedPassword += randomFunc[funcName]();
            });
        }
        const finalPassword = generatedPassword.slice(0, length);
        return finalPassword;
    }

    function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    function getRandomNumber() {
        return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }

    function getRandomSymbol() {
        const symbols = "!@#$%^&*(){}[]=<>/,.";
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function b64EncodeUnicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    }

    // Guardado
    fSaveNewUser = () => {
        try {
            if (nameUser.value != "" && nameUser.value.length >= 8 && emailUser.value != "") {
                if (passUser.value != "") {
                    const dataSend = { nameUser: String(nameUser.value), passUser: String(passUser.value), emailUser: String(emailUser.value) };
                    $.ajax({
                        url: "../Profile/SaveNewUser",
                        type: "POST",
                        data: dataSend,
                        beforeSend: () => {
                            nameUser.disabled = true;
                            emailUser.disabled = true;
                            btnSaveNewUser.disabled = true;
                        }, success: (request) => {
                            console.log(request);
                            if (request.Bandera == true) {
                                Swal.fire({
                                    title: "Correcto!", text: "Usuario registrado correctamente", icon: "success", confirmButtonText: 'Aceptar',
                                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                    showClass: { popup: 'animated fadeInDown fast' },
                                    hideClass: { popup: 'animated fadeOutUp fast' }
                                }).then((acepta) => {
                                    nameUser.value = "";
                                    passUser.value = "";
                                    emailUser.value = "";
                                    nameUser.disabled = false;
                                    emailUser.disabled = false;
                                    btnSaveNewUser.disa = false;
                                    setTimeout(() => {
                                        const table = $('#dataTable').DataTable();
                                        table.destroy();
                                        setTimeout(() => {
                                            fShowDataLoadTable();
                                        }, 1500);
                                    }, 1000);
                                });
                            } else {
                                Swal.fire({
                                    title: "Error!", text: "Ocurrio un error interno en la aplicación", icon: "warning", confirmButtonText: 'Aceptar',
                                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                    showClass: { popup: 'animated fadeInDown fast' },
                                    hideClass: { popup: 'animated fadeOutUp fast' }
                                }).then((acepta) => {
                                    setTimeout(() => {
                                        location.reload();
                                    }, 1500);
                                });
                            }
                        }, error: (jqXHR, exception) => {
                            console.error(jqXHR);
                            console.error(exception);
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Atención!", text: "Genera una nueva contraseña para continuar", icon: "warning", confirmButtonText: 'Aceptar',
                        allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                        showClass: { popup: 'animated fadeInDown fast' },
                        hideClass: { popup: 'animated fadeOutUp fast' }
                    }).then((acepta) => {
                        setTimeout(() => {
                            passUser.focus();
                        }, 1500);
                    });
                }
            } else {
                Swal.fire({
                    title: "Atención!", text: "Ingresa un correo y un nombre de usuario para continuar, el usuario debe de contener minimo 8 caracteres", icon: "warning", confirmButtonText: 'Aceptar',
                    allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                    showClass: { popup: 'animated fadeInDown fast' },
                    hideClass: { popup: 'animated fadeOutUp fast' }
                }).then((acepta) => {
                    setTimeout(() => {
                        if (nameUser.value == "" || nameUser.value.length < 8) {
                            nameUser.focus();
                        } else if (nameUser.value != "" && nameUser.value.length >= 8 && emailUser.value == "") {
                            emailUser.focus();
                        }
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

    btnSaveNewUser.addEventListener('click', fSaveNewUser);

    fActiveInactiveUser = (user, status) => {
        try {
            if (parseInt(user) > 0) {
                $.ajax({
                    url: "../Profile/ActiveInactiveUser",
                    type: "POST",
                    data: { keyUser: parseInt(user), keyStatus: parseInt(status) },
                    beforeSend: () => {

                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera) {
                            const table = $('#dataTable').DataTable();
                            table.destroy();
                            setTimeout(() => {
                                fShowDataLoadTable();
                            }, 1000);
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

    fShowInfoUser = (keyUser) => {
        try {
            localStorage.setItem('optionSelected', 'cPassword');
            if (parseInt(keyUser) > 0) {
                $.ajax({
                    url: "../Profile/ShowInfoUser",
                    type: "POST",
                    data: { keyUser: parseInt(keyUser) },
                    beforeSend: () => {

                    }, success: (request) => {
                        console.log(request);
                        if (request.Bandera) {
                            document.getElementById('key-user-edit').value = request.Datos.iIdUsuario;
                            nameUserEdit.value  = request.Datos.sUsuario;
                            emailUserEdit.value = request.Datos.sCorreo;
                            document.getElementById('email-user-edit-static').value = request.Datos.sCorreo;
                        } else {
                            nameUserEdit.disabled  = true;
                            emailUserEdit.disabled = true;
                            document.getElementById('alert-error-load-data').classList.remove('d-none');
                            document.getElementById('alert-error-load-data').innerHTML = `<strong>Hola estimado usuario</strong> ha ocurrido un error al consultar la información.`;
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
                consol.error('TypeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

});