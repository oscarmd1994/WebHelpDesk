document.addEventListener('DOMContentLoaded', () => {

    const containerImport = document.getElementById('containerImport');
    const rowImport  = document.getElementById('rowImport');
    const rowConsume = document.getElementById('rowConsume'); 

    // Estadisticas y graficas

    fShowCardStatistics = (type) => {
        try {
            const badges = ["primary", "secondary", "success", "info", "dark", "warning", "danger"];
            $.ajax({
                url: "../Process/ShowCardStatistcs",
                type: "POST",
                data: { type: parseInt(type) },
                beforeSend: () => {

                }, success: (data) => {
                    console.log(data);
                    if (data.Bandera == true) {
                        for (let i = 0; i < data.Datos.length; i++) {
                            let randomNumeric = Math.floor(Math.random() * (badges.length - 0) + 0);
                            if (randomNumeric == 7) {
                                randomNumeric = randomNumeric - 1;
                            }
                            let dt = data.Datos[i];
                            let element = "";
                            let typeAction = "";
                            let ico = "";
                            let time = "";
                            if (type == 1) {
                                element = rowImport;
                                typeAction = "Importaciones";
                                ico = "database";
                                time = "1s";
                            } else {
                                element = rowConsume;
                                typeAction = "Consumos";
                                ico = "server";
                                time = "2s";
                            }
                            element.innerHTML += `
                                <div class="col-xl-3 col-md-6 mb-4 animated fadeIn delay-${time}">
                                    <div class="card border-left-${badges[randomNumeric]} shadow-lg h-100 py-2">
                                        <div class="card-body">
                                            <div class="row no-gutters align-items-center">
                                                <div class="col mr-2">
                                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1"><small><b>${dt.sAccion}</b></small></div>
                                                    <div class="h5 mb-0 font-weight-bold text-gray-800">${dt.iCantidad} <small>${typeAction}</small></div>
                                                </div>
                                                <div class="col-auto">
                                                    <i class="fas fa-paper-plane fa-sm text-${badges[randomNumeric]}"></i>
                                                    <i class="fas fa-${ico} fa-2x text-gray-500"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        alert('Ocurrio un problema inesperado');
                    }
                }, error: (jqXHR, exception) => {
                    console.log(jqXHR);
                    console.log(exception);
                }
            })
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

    fShowCardStatistics(1);
    fShowCardStatistics(2);

});