document.addEventListener('DOMContentLoaded', () => {

    const dataTable    = document.getElementById('dataTable');
    const loader       = document.getElementById('loader');
    const bodyBusiness = document.getElementById('body-business');

    fLoadDataTable = () => {
        $('#dataTable').DataTable({
            language: {
                url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            }
        });
    }

    // Funcion que consulta los datos para llenar la tabla de empresas
    fExtractionOfInformationOfBusiness = () => {
        try {
            $.ajax({
                url: "../Information/Business",
                type: "POST",
                data: {},
                beforeSend: () => {
                    loader.innerHTML += `
                        <div class="text-center">
                          <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                            <span class="sr-only">Cargando...</span>
                          </div>
                        </div>
                        <div class="text-center mt-3"><b>Cargando información...</b></div>
                    `;
                }, success: (data) => {
                    console.log(data);
                    if (data.Bandera == true && data.MensajeError == "none") {
                        let count = 0;
                        let quantity = data.Datos.length;
                        for (let i = 0; i < data.Datos.length; i++) {
                            count += 1;
                            bodyBusiness.innerHTML += `
                                <tr>
                                    <td>${data.Datos[i].sIdEmpresa}</td>
                                    <td>${data.Datos[i].sEmpresa}</td>
                                    <td>${data.Datos[i].sFechaC}</td>
                                    <td>${data.Datos[i].sUsuarioC}</td>
                                </tr>
                            `;
                        }
                        if (count == quantity) {
                            setTimeout(() => { loader.innerHTML = ""; }, 1500);
                            setTimeout(() => {
                                dataTable.classList.remove('d-none');
                                dataTable.classList.add('fadeIn');
                                fLoadDataTable();
                            }, 2000);
                        }
                    }
                }, error: (jqXHR, exception) => {
                    console.log(jqXHR);
                    console.log(exception);
                }
            });
        } catch (error) {
            if (error instanceof EvalError) {
                console.error('EvalError: ', error.message);
            } else if (error instanceof TypeError) {
                console.error('TypeError: ', error.message);
            } else if (error instanceof RangeError) {
                console.error('RangeError: ', error.message);
            } else {
                console.error('Error: ', error);
            }
        }
    }

    fExtractionOfInformationOfBusiness();

    // -- CONSUMOS -- \\

    fLoadDataTableConsumes = () => {
        setTimeout(() => {
            $('#table-consumes').DataTable({
                language: {
                    url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                },
                order: [0, "DESC"]
            });
        }, 1500);
    }

    const btnConsumesTab = document.getElementById('consumes-tab');
    const bodyConsumes   = document.getElementById('body-consumes');

    btnConsumesTab.addEventListener('click', () => {
        const tableC = $("#table-consumes").DataTable();
        tableC.destroy();
        $.ajax({
            url: "../Information/InformationC",
            data: { option: "WSEmpresas" },
            type: "POST",
            beforeSend: () => {
                bodyConsumes.innerHTML = "";
            }, success: (data) => {
                if (data.Bandera === true) {
                    bodyConsumes.innerHTML += data.Html;
                    fLoadDataTableConsumes();
                }
            }, error: (jqXHR, exception) => {
                console.log(jqXHR);
                console.log(exception);
            }
        });
    });

});