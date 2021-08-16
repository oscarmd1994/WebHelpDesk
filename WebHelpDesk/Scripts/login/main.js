$(function () {
    var formLogin = document.getElementById('form-login');
    setTimeout(() => {
        document.getElementById('user-name').focus();
    }, 1000);
    $("#btn-login").on("click", function () {
        var userName = document.getElementById('user-name');
        var userPass = document.getElementById('user-pass');
        if (userName.value.replace(" ", "").length == 0 && userPass.value.replace(" ", "").length == 0) {
            $("#txtvalidacion").html("Proporciona tus credenciales de acceso!");
            userName.classList.toggle("is-invalid", true);
            userPass.classList.toggle("is-invalid", true);
            formLogin.classList.toggle("was-validated", true);
            setTimeout(function () {
                $("#txtvalidacion").html("");
                userName.classList.toggle("is-invalid", false);
                userPass.classList.toggle("is-invalid", false);
                formLogin.classList.toggle("was-validated", false);
            }, 5000);
        } else if (userName.value.replace(" ", "").length == 0) {
            $("#txtvalidacion").html("El usuario no puede estar vacio!");
            userName.classList.toggle("is-invalid", true);
            formLogin.classList.toggle("was-validated", true);
            setTimeout(function () {
                $("#txtvalidacion").html("");
                userName.classList.toggle("is-invalid", false);
                formLogin.classList.toggle("was-validated", false);
            }, 5000);
        } else if (userPass.value.replace(" ", "").length == 0) {
            $("#txtvalidacion").html("La contraseña no puede estar vacia!");
            userPass.classList.toggle("is-invalid", true);
            formLogin.classList.toggle("was-validated", true);
            setTimeout(function () {
                $("#txtvalidacion").html("");
                userPass.classList.toggle("is-invalid", false);
                formLogin.classList.toggle("was-validated", false);
            }, 5000);
        } else {
            validationLogin(userName.value, userPass.value)
        }
    });
    validationLogin = (user, pass) => {
        $.ajax({
            url: "../Home/ValudaUser",
            type: "POST",
            data: JSON.stringify({ "user": user, "pass": pass }),
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                if (data["iFlag"] == "0") {
                    formLogin.classList.toggle("was-validated", true);
                    $("#txtvalidacion").removeClass("text-danger").addClass("text-info");
                    $("#txtvalidacion").html("<div class='spinner-grow text-info' role='status'><span class='sr-only'> Loading...</span></div>" + data["sMessage"]);
                    setTimeout(function () {
                        location.href = "../DashBoard/Index";
                    }, 2500);
                } else {
                    $("#txtvalidacion").html("Ocurrio un error al momento de validar, favor de reintentar!.");
                }
            }
        });
    }
});