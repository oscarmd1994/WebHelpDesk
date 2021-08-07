document.addEventListener('DOMContentLoaded', () => {

    localStorage.removeItem('optionSelected');

    const myLengthC = document.getElementById("lengthC");
    const myLowerC  = document.getElementById("lowercaseC");
    const myUpperC  = document.getElementById("uppercaseC");
    const myNumberC = document.getElementById("numberC");
    const mySymbolC = document.getElementById("symbolC");
    const passUserC = document.getElementById('pass-userC');

    const keyUserEdit = document.getElementById('key-user-edit');
    const nameUserEdit  = document.getElementById('name-user-edit');
    const emailUserEdit = document.getElementById('email-user-edit');

    const icoCloseEditDataUser = document.getElementById('ico-close-edit-data-user');
    const btnCloseEditDataUser = document.getElementById('btn-close-edit-data-user');
    const btnGeneratePassUserC = document.getElementById('btn-generate-pass-userC');
    const btnCopyPassUserC     = document.getElementById('btn-copy-pass-userC');
    const btnSaveEditUser      = document.getElementById('btn-save-edit-user');

    const txtSaveButtonEdit    = document.getElementById('txt-save-button-edit');

    let randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    btnGeneratePassUserC.addEventListener("click", () => {
        const length = +myLengthC.value;
        const hasLower = myLowerC.checked;
        const hasUpper = myUpperC.checked;
        const hasNumber = myNumberC.checked;
        const hasSymbol = mySymbolC.checked;
        passUserC.value = generatePsd(hasLower, hasUpper, hasNumber, hasSymbol, length);
        if (passUserC.value != "") {
            Command: toastr["success"]("Contraseña generada");
        }
    });

    btnCopyPassUserC.addEventListener('click', () => {
        const textarea = document.createElement("textarea");
        const password = passUserC.value;
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
        //passUserC.innerText = "";
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

    document.getElementById('passwordC-tab').addEventListener('click', () => {
        txtSaveButtonEdit.textContent = 'Guardar y enviar por correo';
        localStorage.setItem('optionSelected', 'cPassword');
    });

    document.getElementById('dataC-tab').addEventListener('click', () => {
        txtSaveButtonEdit.textContent = 'Guardar';
        localStorage.setItem('optionSelected', 'cData');
    });

    fClearModalDataEditUser = () => {
        keyUserEdit.value = '';
        passUserC.value = '';
        nameUserEdit.disabled  = true;
        emailUserEdit.disabled = false;
        document.getElementById('alert-error-load-data').innerHTML = '';
        document.getElementById('alert-error-load-data').classList.add('d-none');
        document.getElementById('dataC').classList.remove('show', 'active');
        document.getElementById('passwordC').classList.add('show', 'active');
        document.getElementById('dataC-tab').classList.remove('active');
        document.getElementById('passwordC-tab').classList.add('active');
    }

    icoCloseEditDataUser.addEventListener('click', fClearModalDataEditUser);
    btnCloseEditDataUser.addEventListener('click', fClearModalDataEditUser);

    // Funcion desabilita boton de guardado y cerrado
    fDisabledEnabledButtonsModalEdit = (flag, text) => {
        btnSaveEditUser.disabled = flag;
        btnSaveEditUser.title    = text;
        btnCloseEditDataUser.disabled = flag;
        icoCloseEditDataUser.disabled = flag;
    }

    // Funcion que guarda los datos de cPassword
    fSaveEditPasswordUser = () => {
        try {
            const option = localStorage.getItem('optionSelected');
            if (option == 'cPassword' && document.getElementById('key-user-edit').value != '') {
                if (passUserC.value != "") {
                    const dataSend = { newPassword: String(passUserC.value), keyUserEdit: parseInt(document.getElementById('key-user-edit').value) };
                    $.ajax({
                        url: "../Profile/SaveEditPasswordUser",
                        type: "POST",
                        data: dataSend,
                        beforeSend: () => {
                            fDisabledEnabledButtonsModalEdit(true, "Procesando petición...");
                            passUserC.disabled = true;
                        }, success: (request) => {
                            console.log(request);
                            if (request.Bandera == true && request.MensajeError == "none") {
                                passUserC.value = '';
                                Command: toastr["success"]("Correcto, contraseña actualizada!!");
                            } else {
                                Command: toastr["error"]("Ocurrio un problema interno en la aplicación...")
                            }
                            fDisabledEnabledButtonsModalEdit(false, "");
                            passUserC.disabled = false;
                        }, error: (jqXHR, exception) => {
                            console.error(jqXHR, exception);
                        }
                    });
                } else {
                    Command: toastr["warning"]("Genera una contraseña!!");
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
                consol.error('TypeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

    // Funcion que guarda los datos de edicion del usuario cData
    fSaveEditDataUser = () => {
        try {
            const option = localStorage.getItem('optionSelected');
            if (option == 'cData' && document.getElementById('key-user-edit').value != '') {
                const exprReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                if (emailUserEdit.value != "" && exprReg.test(emailUserEdit.value)) {
                    if (document.getElementById('email-user-edit-static').value != emailUserEdit.value) {
                        const dataSend = { newEmail: String(emailUserEdit.value), keyUserEdit: parseInt(document.getElementById('key-user-edit').value) };
                        $.ajax({
                            url: "../Profile/SaveEditDataUser",
                            type: "POST",
                            data: dataSend,
                            beforeSend: () => {
                                fDisabledEnabledButtonsModalEdit(true, "Procesando petición...");
                                emailUserEdit.disabled = true;
                            }, success: (request) => {
                                console.log(request);
                                if (request.Bandera == true && request.MensajeError == "none") {
                                    Command: toastr["success"]("Correcto, correo actualizado!!");
                                    document.getElementById('email-user-edit-static').value = emailUserEdit.value;
                                } else {
                                    Command: toastr["error"]("Ocurrio un problema interno en la aplicación...")
                                }
                                fDisabledEnabledButtonsModalEdit(false, "");
                                emailUserEdit.disabled = false;
                            }, error: (jqXHR, exception) => {
                                console.error(jqXHR, exception);
                            }
                        });
                    } else {
                        Command: toastr["info"]("No hay nada que actualizar!!");
                    }
                } else {
                    Command: toastr["warning"]("Ingresa un correo electronico valido!!");
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
                consol.error('TypeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

    fSaveEditUser = () => {
        try {
            const option = localStorage.getItem('optionSelected');
            if (option != null) {
                if (option == 'cPassword') {
                    fSaveEditPasswordUser();
                } else if (option == 'cData') {
                    fSaveEditDataUser();
                } else {
                    alert('Accion invalida');
                    location.reload();
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
                consol.error('TypeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

    btnSaveEditUser.addEventListener('click', fSaveEditUser);

});