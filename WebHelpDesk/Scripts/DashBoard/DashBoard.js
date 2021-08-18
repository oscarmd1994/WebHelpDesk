$(function () {
    const d = document;
    loadServicios = () => {
        $.ajax({
            url: "../DashBoard/getTipoServicios",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                var options = "<option value=''> Selecciona </option>";
                for (i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i]['IdTipoServicio'] + "'>" + data[i]['Nombre'] + "</option>";
                }
                $('#tipoServicioSelect').html(options);
                $('#modalidadSelect').removeClass("is-invalid");
            }
        });
    };
    loadEmpresas = () => {
        $.ajax({
            url: "../DashBoard/getEmpresas",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                var options = "<option value=''> Selecciona </option>";
                for (i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i]['Id'] + "'>" + data[i]['NombreEmpresa'] + "</option>";
                }
                $('#empresaSelect').html(options);
            }
        });
    };
    loadModalidades = (tipoServicio) => {
        $.ajax({
            url: "../DashBoard/getModalidades",
            type: "POST",
            data: JSON.stringify({ "servicio_id": tipoServicio }),
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                var options = "<option value=''> Selecciona </option>";
                for (i = 0; i < data.length; i++) {
                    options += "<option value='" + data[i]['Id'] + "'>" + data[i]['NombreModalidad'] + "</option>";
                }
                $('#modalidadSelect').html(options);
                $('#modalidadSelect').toggleClass("is-invalid", false);
            }
        });
    };
    $('#tipoServicioSelect').on('change', function () {
        if (this.value == "" || this.value == undefined || this.value == String.empty) {
            $('#modalidadSelect').html('');
        } else {
            loadModalidades(this.value);
        }
    });
    $('#modalidadSelect').click(function () {
        var tipoServicio = d.getElementById('tipoServicioSelect').value;
        if (this.value.length == 0) {
            if (tipoServicio.length == 0) {
                $('#modalidadSelect').toggleClass("is-invalid", true);
                $('#tipoServicioSelect').focus();
            }
        } else {
            $('#modalidadSelect').toggleClass("is-invalid", false);
        }
    });

    loadServicios();
    loadEmpresas();
});