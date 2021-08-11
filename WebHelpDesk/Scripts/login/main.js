$(function () {

    

    setTimeout(() => {
        document.getElementById('user-name').focus();
    }, 1000);

    $("#btn-login").on("click", function () {
        var formLogin = document.getElementById('form-login');
        var userName = document.getElementById('user-name');
        var userPass = document.getElementById('user-pass');

        console.log("antes", userName.value.replace(" ", "").length, userPass.value.replace(" ", "").length);

        if (userName.value.replace(" ", "").length == 0 && userPass.value.replace(" ", "").length == 0) {
            console.log("ambos");
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
            console.log("user");
            $("#txtvalidacion").html("El usuario no puede estar vacio!");
            userName.classList.toggle("is-invalid",true);
            formLogin.classList.toggle("was-validated",true);
            setTimeout(function () {
                $("#txtvalidacion").html("");
                userName.classList.toggle("is-invalid", false);
                formLogin.classList.toggle("was-validated", false);
            }, 5000);
            
        } else if (userPass.value.replace(" ", "").length == 0) {
            console.log("pass");
            $("#txtvalidacion").html("La contraseña no puede estar vacia!");
            userPass.classList.toggle("is-invalid", true);
            formLogin.classList.toggle("was-validated", true);
            setTimeout(function () {
                $("#txtvalidacion").html("");
                userPass.classList.toggle("is-invalid", false);
                formLogin.classList.toggle("was-validated", false);
            }, 5000);

        } else {
            console.log("valido");
            $("#txtvalidacion").html("no entro");
            location.href = "../DashBoard/Index";
        }
        //location.href = "../DashBoard/Index";
    });

});