document.addEventListener('DOMContentLoaded', () => {

    const result    = document.getElementById("generated");
    const myLength  = document.getElementById("length");
    const myLower   = document.getElementById("lowercase");
    const myUpper   = document.getElementById("uppercase");
    const myNumber  = document.getElementById("number");
    const mySymbol  = document.getElementById("symbol");
    const clipboard = document.getElementById("clipboard");

    const save = document.getElementById('save');
    const contentLoadingCP = document.getElementById('contentLoadingCP');

    let randomFunc = {
        lower:  getRandomLower,
        upper:  getRandomUpper,
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

    // Clipbord
    clipboard.addEventListener("click", () => {
        const textarea = document.createElement("textarea");
        const password = result.value;
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
        generated.innerText = "";
        $(".copied").fadeIn().delay(2000).fadeOut();
        Command: toastr["info"]("Contraseña copiada!!");
    });

    //Generate Button
    generate.addEventListener("click", () => {
        const length    = +myLength.value;
        const hasLower  = myLower.checked;
        const hasUpper  = myUpper.checked;
        const hasNumber = myNumber.checked;
        const hasSymbol = mySymbol.checked;
        result.value    = generatePsd(hasLower, hasUpper, hasNumber, hasSymbol, length);
        if (result.value != "") {
            Command: toastr["success"]("Contraseña generada");
            save.disabled = false;
        }
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

    save.addEventListener('click', () => {
        const password = result.value;
        Swal.fire({
            title: 'Completa el campo para continuar',
            html: `<div id="contentPassword"><input autocomplete="off" type="password" id="passwordActually" class="swal2-input" placeholder="Introduce tu contraseña actual"></div>`,
            confirmButtonText: 'Aceptar',
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            preConfirm: () => {
                const password = Swal.getPopup().querySelector('#passwordActually').value
                if (!password) {
                    Swal.showValidationMessage(`Por favor ingresa tu contraseña actual`)
                }
                return { password: password }
            }
        }).then((result) => {
            if (result.value) {
                const encodeN = b64EncodeUnicode(password.trim());
                const encodeA = b64EncodeUnicode(result.value.password.trim());
                fSaveChangePassword(`${encodeA},${encodeN}`);
            } else {
                save.disabled   = true;
                result.value    = "";
                myLength.value  = 10;
            }
        });
    });

    fSaveChangePassword = (parampasswordA) => {
        try {
            const paramArray       = parampasswordA.split(",");
            const encryptPasswordA = b64EncodeUnicode(paramArray[0]);
            const encryptPasswordN = b64EncodeUnicode(paramArray[1]);
            const dataSend         = { passwordNew: encryptPasswordN, passwordActually: encryptPasswordA };
            console.log(dataSend);
            $.ajax({
                url: "../Configuration/SaveChangePassword",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    generate.disabled = true;
                    save.disabled     = true;
                    contentLoadingCP.innerHTML += `
                        <div class="spinner-border text-primary mr-2" role="status">
                            <span class="sr-only">Loading...</span>
                        </div> Procesando cambio de contraseña...
                    `;
                }, success: (request) => {
                    console.log(request);
                    setTimeout(() => {
                        contentLoadingCP.innerHTML = "";
                        if (request.Bandera == true && request.MensajeError == "none") {
                            Swal.fire({
                                title: "Correcto!", text: "Contraseña actualizada", icon: "success", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            }).then((acepta) => {
                                location.href = "../Process/Logout";
                            });
                        } else if (request.Bandera == false && request.MensajeError == "ERRORUPDATE") {
                            Swal.fire({
                                title: "Atención!", text: "La contraseña no pudo ser actualizada", icon: "warning", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            });
                        } else if (request.Bandera == false && request.MensajeError == "ERRORPASSWORDACTUALLY") {
                            Swal.fire({
                                title: "Atención!", text: "La contraseña ingresada no corresponde a la actual", icon: "warning", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            });
                        } else {
                            Swal.fire({
                                title: "Error!", text: "Ocurrio un error interno en la aplicación", icon: "error", confirmButtonText: 'Aceptar',
                                allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
                                showClass: { popup: 'animated fadeInDown fast' },
                                hideClass: { popup: 'animated fadeOutUp fast' }
                            }).then((acepta) => {
                                result.value   = "";
                                myLength.value = 10;
                            });
                        }
                        generate.disabled = false;
                        save.disabled     = false;
                    }, 2000);
                }, error: (jqXHR, exception) => {

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

});