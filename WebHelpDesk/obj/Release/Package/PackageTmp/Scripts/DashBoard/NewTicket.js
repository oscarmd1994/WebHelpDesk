$(function () {
    loadServicios = () => {
        $.ajax({
            url: "../DashBoard/getServicios",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                for (i = 0; i < data.length; i++) {
                    
                }
            }
        })
    };
});