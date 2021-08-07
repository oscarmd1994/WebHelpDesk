document.addEventListener('DOMContentLoaded', () => {

    fmsgconfirm = (e) => {
        var confirmationMessage = "\o/";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }

    //window.addEventListener("beforeunload", fmsgconfirm);

    /*
     * Constantes de WS
     */
    const btnCheckInfoDataB = document.getElementById('btn-check-information-database');
    const btnCheckConnectWS = document.getElementById('btn-check-connection-ws');
    const icoConnect        = document.getElementById('ico-connect');
    const labConnect        = document.getElementById('lab-connect');
    const loadConnectWs     = document.getElementById('load-connect-ws');
    const loadInfoConnectWs = document.getElementById('load-info-connect-ws');
    const loadInfoDataBDWs  = document.getElementById('load-info-database-ws');
    const listResultsWs     = document.getElementById('list-results-ws');
    const btnImportResWs    = document.getElementById('btn-import-res-ws');
    const loadImportBd      = document.getElementById('load-import-bd');

    /* Emite alertas dinamicas */
    fShowAlert = (element, title, text, icon, type, con) => {
        Swal.fire({
            title: title, text: text, icon: icon, confirmButtonText: 'Aceptar',
            allowOutsideClick: false, allowEscapeKey: false, allowEnterKey: false,
            showClass: { popup: 'animated fadeInDown fast' },
            hideClass: { popup: 'animated fadeOutUp fast' }
        }).then((acepta) => {
            if (type == 0) {
                location.href = "../Process/Logout";
            } else if (type == 1) {
                setTimeout(() => {
                    element.focus();
                }, 1000);
            } 
            if (con == 1) {
                fCheckConnectionWs();
            }
        });
    }

    // Funcion que consulta la informacion existente de la ultima extracion
    fCheckInformationDatabase = () => {
        btnCheckConnectWS.disabled  = true;
        loadInfoConnectWs.innerHTML = "";
        loadInfoDataBDWs.innerHTML  = "";
        try {
            $.ajax({
                url: "../WSTalentia/InformationDatabase",
                type: "POST",
                data: {},
                beforeSend: () => { 
                    document.getElementById('div-show-quantities-consume-ws').innerHTML += `
                        <div class="col-md-8 offset-2 text-center mt-2 testClass" id="show-info-consume-boff">
                            <hr/>
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                            <h6 class="text-primary mt-2" id="labelProcess">Procesando petición, puede tardar varios minutos...</h6>
                        </div>
                    `; 
                }, success: (data) => {
                    console.log(data);
                    if (data.Bandera == true) {
                        $("html, body").animate({ scrollTop: $('#load-info-database-ws').offset().top - 50 }, 1000);
                        document.getElementById('div-show-quantities-consume-ws').innerHTML = "";
                        let divQuantities = "";
                        if (data.Localitys > 0) {
                            divQuantities += `
                                <div class="col-md-12 mb-4"><h5 class="text-center font-weight-bold text-primary">Importar información a tablas temporales <hr/></h5></div>
                            `;
                            divQuantities += `<div class="col-md-6">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('LOCALITYS', ${data.Localitys});" id="btn-consume-business"><h6 class="card-title text-center text-primary">Localidades</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Localitys}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Posts > 0) {
                            divQuantities += `<div class="col-md-6">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('POSTS', ${data.Posts});" id="btn-consume-posts"><h6 class="card-title text-center text-primary">Puestos</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Posts}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.BranchOff > 0) {
                            divQuantities += `<div class="col-md-6 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('BRANCHOFF', ${data.BranchOff});" id="btn-consume-branchoff"><h6 class="card-title text-center text-primary">Sucursales</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.BranchOff}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.CentersCost > 0) {
                            divQuantities += `<div class="col-md-6 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('CENTERS', ${data.CentersCost});" id="btn-consume-centers"><h6 class="card-title text-center text-primary">Centros de Costo</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.CentersCost}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Departaments > 0) {
                            divQuantities += `<div class="col-md-6 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('DEPARTAMENTS', ${data.Departaments});" id="btn-consume-departaments"><h6 class="card-title text-center text-primary">Departamentos</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Departaments}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Positions > 0) {
                            divQuantities += `<div class="col-md-6 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('POSITIONS', ${data.Positions});" id="btn-consume-positions"><h6 class="card-title text-center text-primary">Posiciones</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Positions}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Regionals > 0) {
                            divQuantities += `
                                <div class="col-md-6 offset-3 mt-2">
                                    <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                        <button class="btn btn-sm" onclick="fConsumeWSType('REGIONALS', ${data.Regionals});" id="btn-consume-regionals"><h6 class="card-title text-center text-primary">Regionales</h6>
                                        <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Regionals}</b></button>
                                    </div>
                                </div>
                            `;
                        }
                        loadInfoDataBDWs.innerHTML += `<div class="row mt-4 mb-4">${divQuantities}</div>`;
                    } else {
                        loadInfoDataBDWs.innerHTML += `<div class="row mt-4 mb-4">
                            <div class="alert alert-danger alert-dismissible fade show text-center col-md-12" role="alert">
                              <strong>No se encontro información existente en la base de datos seleccionada! Establezca conexión y comienze la extración.</strong>
                            </div>
                        </div>`;
                    }
                    btnCheckConnectWS.disabled = false;
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
                console.error('Error: ', error.message);
            }
        }
    }

    btnCheckInfoDataB.addEventListener('click', fCheckInformationDatabase);

    // Funcion que comprueba la conectividad y disponibilidad con el WEB SERVICE
    fCheckConnectionWs = () => {
        btnCheckInfoDataB.disabled = true;
        loadInfoConnectWs.innerHTML = "";
        loadInfoDataBDWs.innerHTML  = "";
        //fmsgconfirm();
        window.addEventListener("beforeunload", fmsgconfirm);
        $.ajax({
            url: "../WSTalentia/PlayConsumeWS",
            type: "POST",
            data: {},
            contentType: false,
            processData: false,
            beforeSend: () => {
                loadConnectWs.innerHTML = `
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <h6 class="text-primary mt-2">Este proceso puede durar varios minutos, comenzando conexión y extración de la información...</h6>
                `;
                btnCheckConnectWS.disabled = true;
                console.log('Peticion enviada');
                console.log('Esperando la respuesta...');
            },
            success: (data) => {
                console.log('Imprimiendo data');
                console.log(data);
                loadConnectWs.innerHTML = "";
                //data.Flag == true
                if (true) {
                    let divQuantities = "";
                    //data.Datos.bFlag == true
                    if (data.Flag == true) {
                        window.removeEventListener("beforeunload", fmsgconfirm);
                        divQuantities = '<hr/><div class="row" id="div-show-quantities-consume">'
                        if (data.Localitys > 0) {
                            divQuantities += `<div class="col-md-4">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('LOCALITYS', ${data.Localitys});" id="btn-consume-business"><h6 class="card-title text-center text-primary">Localidades</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Localitys}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Posts > 0) {
                            divQuantities += `<div class="col-md-4">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('POSTS', ${data.Posts});" id="btn-consume-posts"><h6 class="card-title text-center text-primary">Puestos</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Posts}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.BranchOff > 0) {
                            divQuantities += `<div class="col-md-4">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('BRANCHOFF', ${data.BranchOff});" id="btn-consume-branchoff"><h6 class="card-title text-center text-primary">Sucursales</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.BranchOff}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.CentersCost > 0) {
                            divQuantities += `<div class="col-md-4 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('CENTERS', ${data.CentersCost});" id="btn-consume-centers"><h6 class="card-title text-center text-primary">Centros de Costo</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.CentersCost}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Departaments > 0) {
                            divQuantities += `<div class="col-md-4 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('DEPARTAMENTS', ${data.Departaments});" id="btn-consume-departaments"><h6 class="card-title text-center text-primary">Departamentos</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Departaments}</b></button>
                                </div>
                            </div>`;
                        }
                        if (data.Positions > 0) {
                            divQuantities += `<div class="col-md-4 mt-2">
                                <div class="shadow card rounded p-2 animated fadeInDown" title="Consumir metodo">
                                    <button class="btn btn-sm" onclick="fConsumeWSType('POSITIONS', ${data.Positions});" id="btn-consume-positions"><h6 class="card-title text-center text-primary">Posiciones</h6>
                                    <b class="text-center"> <i class="fas fa-play mr-2 text-primary shadow"></i> ${data.Positions}</b></button>
                                </div>
                            </div>`;
                        }
                        divQuantities += '</div><div class="row" id="div-show-quantities-consume-ws"></div>'; 
                        $("html, body").animate({ scrollTop: $(`#${loadInfoConnectWs.id}`).offset().top - 50 }, 1000);
                        loadInfoConnectWs.innerHTML = `
                            <hr/>
                            <div class="text-center"><label>Url: <b><a href="${data.Connection.url}" target="_blank">${data.Connection.url}</a></b></label></div>
                            <br/>
                            <div class="row">
                                <div class="col-md-6 text-center">
                                    <label> <i class="fas fa-concierge-bell text-primary mr-2"></i> Estado de la operación: <b>${data.Connection.status}</b></label>
                                </div>
                                <div class="col-md-6 text-center">
                                    <label> <i class="fas fa-clock mr-2 text-primary"></i> Tiempo transcurrido: <b>${data.TiempoPeticion}</b> </label>
                                </div>
                            </div>
                            ${divQuantities}
                        `;
                        fLoadQuantityRegistersNotImport();
                    } else {
                        window.removeEventListener("beforeunload", fmsgconfirm);
                        loadInfoConnectWs.innerHTML = `
                            <div class="row">
                                <div class="col-md-12 p-3">
                                    <div class="alert alert-danger" role="alert">
                                      <h4 class="alert-heading">Error!</h4>
                                      <p>Ooops! ha ocurrido un error interno en la aplicación al intentar conectar con el Web Service. Contacte al área de TI.</p>
                                      <hr>
                                      <p class="mb-0">Error: ${data.Message}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                } else {
                    alert('ERROR!');
                }
            }, error: (jqXHR, exception) => {
                fcaptureaerrorsajax(jqXHR, exception);
            }
        });
    }

    // Funcion que desabilita o habilita las opciones de consumo
    fDisabledEnabledOptionsWs = (element, type) => {
        //fDisabledEnabledOptionsWs('btn-consume-business', true);
        //fDisabledEnabledOptionsWs('btn-consume-posts', true);
        if (document.getElementById(String(element)) != null) {
            document.getElementById(String(element)).disabled = type;
        }
    }

    // Funcion que restaura el boton de comprobacion
    fRestoreBtnConnect = () => {
        btnCheckConnectWS.disabled = false;
        btnCheckInfoDataB.disabled = false;
        //icoConnect.classList.remove('fas', 'fa-check-circle');
        //icoConnect.classList.add('fas', 'fa-plug');
        //labConnect.textContent = "Comprobar conexion";
        //btnCheckConnectWS.classList.remove('btn-success');
        //btnCheckConnectWS.classList.add('btn-outline-primary');
    }

    // Funcion que habilita e inabilita botones para la extración
    fButtonsDisabledEnabled = (flag, text) => {
        document.getElementById('btn-consume-business').disabled     = flag;
        document.getElementById('btn-consume-business').title        = text;
        document.getElementById('btn-consume-posts').disabled        = flag;
        document.getElementById('btn-consume-posts').title           = text;
        document.getElementById('btn-consume-branchoff').disabled    = flag;
        document.getElementById('btn-consume-branchoff').title       = text;
        document.getElementById('btn-consume-centers').disabled      = flag;
        document.getElementById('btn-consume-centers').title         = text;
        document.getElementById('btn-consume-departaments').disabled = flag;
        document.getElementById('btn-consume-departaments').title    = text;
        document.getElementById('btn-consume-positions').disabled    = flag;
        document.getElementById('btn-consume-positions').text = text;
        if (document.getElementById("btn-consume-regionals")) {
            document.getElementById('btn-consume-regionals').disabled = flag;
            document.getElementById('btn-consume-regionals').disabled = text;
        }
    }

    // Funcion que consume el tipo de datos elegidos
    fConsumeWSType = (paramstr, paramint) => {
        try {
            //document.getElementById('div-show-quantities-consume').classList.add('animated', 'fadeOutUp');
            //setTimeout(() => {
            //    document.getElementById('div-show-quantities-consume').innerHTML = "";
            //    document.getElementById('div-show-quantities-consume').classList.remove('animated', 'fadeOutUp');
            //}, 600);
            let labelShow = "";
            if (paramstr == "BUSINESS") {
                labelShow = "Empresas";
            } else if (paramstr == "POSTS") {
                labelShow = "Puestos";
            } else if (paramstr == "BRANCHOFF") {
                labelShow = "Sucursales";
            } else if (paramstr == "CENTERS") {
                labelShow = "Centros de costo";
            } else if (paramstr == "DEPARTAMENTS") {
                labelShow = "Departamentos";
            } else if (paramstr == "EMPLOYEES") {
                labelShow = "Empleados";
            } else if (paramstr == "LOCALITYS") {
                labelShow = "Localidades";
            } else if (paramstr == "POSITIONS") {
                labelShow = "Posiciones";
            } else if (paramstr == "REGIONALS") {
                labelShow = "Regionales";
            }
            let contentAd = "";
            if (paramint > 1000) {
                //contentAd = '<h6 class="text-primary">Puede tomar un café mientras termino mi proceso <i class="fas fa-smile ml-1"></i></h6>';
            }
            fButtonsDisabledEnabled(true, "Procesando petición");
            setTimeout(() => {
                document.getElementById('div-show-quantities-consume-ws').innerHTML += `
                    <div class="col-md-12 mt-4 mb-4"></div>
                    <div class="col-md-6 text-center">
                        <b class=""> <i class="fas fa-circle mr-1 text-primary"></i> Metodo: <span class="text-primary">${labelShow}.</span></b>
                    </div>
                    <div class="col-md-6 text-center">
                        <b class=""> <i class="fas fa-database mr-1 text-primary"></i> Registros: <span class="text-primary">${paramint}.</span></b>
                    </div>
                    <div class="col-md-8 offset-2 text-center mt-2 testClass" id="show-info-consume-boff">
                        <hr/>
                        <div class="spinner-border text-primary" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                        <h6 class="text-primary mt-2">Procesando petición, puede tardar varios minutos...</h6>
                        ${contentAd}
                    </div>
                `;
            }, 800);
            setTimeout(() => {
                $("html, body").animate({ scrollTop: $('#show-info-consume-boff').offset().top - 50 }, 1000);
                if (paramstr == "BUSINESS") {
                    fExtractionToDatabaseBusiness(paramstr, paramint);
                } else if (paramstr == "POSTS") {
                    fExtractionToDatabasePosts(paramstr, paramint);
                } else if (paramstr == "BRANCHOFF") {
                    fExtractionToDatabaseBranchoff(paramstr, paramint);
                } else if (paramstr == "CENTERS") {
                    fExtractionToDatabaseCenters(paramstr, paramint);
                } else if (paramstr == "DEPARTAMENTS") {
                    fExtractionToDatabaseDepartaments(paramstr, paramint);
                } else if (paramstr == "EMPLOYEES") {
                    fExtractionToDatabaseEmployees(paramstr, paramint);
                } else if (paramstr == "LOCALITYS") {
                    fExtractionToDatabaseLocalitys(paramstr, paramint);
                } else if (paramstr == "POSITIONS") {
                    fExtractionToDatabasePositions(paramstr, paramint);
                } else if (paramstr == "REGIONALS") {
                    fExtractionToDatabaseRegionals(paramstr, paramint);
                }
            }, 1000);
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

    // Funcion que inicia la extraccion de los datos
    fExtractionToDatabaseBusiness = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseBusiness",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                //<li class="list-group-item d-flex justify-content-between align-items-center">
                                //    Actualizados TEMP
                                //        <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                //</li>
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados en tabla Temporal
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extracion de los datos de regionales
    fExtractionToDatabaseRegionals = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseRegionals",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                let txtAccion = "Iniciando importacion a SIP";
                                let elementSHow = "";
                                setTimeout(() => {
                                    //<li class="list-group-item d-flex justify-content-between align-items-center">
                                    //    Actualizados TEMP
                                    //            <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                    //</li>
                                    document.getElementById('show-info-consume-boff').innerHTML = `
                                        <hr />
                                        <div class="col-md-12 mt-3 animated fadeInDown">
                                            <ul class="list-group" id="list-branchoff">
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Consumo
                                                <span class="badge badge-success badge-pill">OK</span>
                                              </li>
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Insertados en tabla Temporal
                                                <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                              </li>
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Tiempo de inserción
                                                <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                              </li>
                                               <li class="list-group-item d-flex justify-content-between align-items-center">
                                                <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                              </li>
                                            </ul>

                                        </div>
                                    `;
                                });
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extraccion de los datos sucursales
    fExtractionToDatabaseBranchoff = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseBranchoff",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                let txtAccion   = "Iniciando importacion a SIP";
                                let elementSHow = "";
                                setTimeout(() => {
                                    //<li class="list-group-item d-flex justify-content-between align-items-center">
                                    //    Actualizados TEMP
                                    //            <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                    //</li>
                                    document.getElementById('show-info-consume-boff').innerHTML = `
                                        <hr />
                                        <div class="col-md-12 mt-3 animated fadeInDown">
                                            <ul class="list-group" id="list-branchoff">
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Consumo
                                                <span class="badge badge-success badge-pill">OK</span>
                                              </li>
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Insertados TEMP
                                                <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                              </li>
                                              <li class="list-group-item d-flex justify-content-between align-items-center">
                                                Tiempo TEMP
                                                <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                              </li>
                                               <li class="list-group-item d-flex justify-content-between align-items-center">
                                                <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                              </li>
                                            </ul>

                                        </div>
                                    `;
                                }, );
                                //fImportData("ImportBranchOfficesSIP", "show-branchoff", "list-branchoff");
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extraccion de los datos centros costo
    fExtractionToDatabaseCenters = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseCenters",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                //<li class="list-group-item d-flex justify-content-between align-items-center">
                                //    Actualizados
                                //        <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                //</li>
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extraccion de los datos de localidades
    fExtractionToDatabaseLocalitys = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseLocalitys",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                //<li class="list-group-item d-flex justify-content-between align-items-center">
                                //    Actualizados
                                //        <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                //</li>
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extraccion de los datos de posiciones
    fExtractionToDatabasePositions = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabasePositions",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li> 
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
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

    // Funcion que inicia la extraccion de los datos departamentos
    fExtractionToDatabaseDepartaments = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url:  "../WSTalentia/ExtractionToDatabaseDepartaments",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
                }, error: (jqXHR, exception) => {
                    fcaptureaerrorsajax(jqXHR, exception);
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

    // Funcion que inicia la extracion de los datos puestos
    fExtractionToDatabasePosts = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabasePosts",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                //<li class="list-group-item d-flex justify-content-between align-items-center">
                                //    Actualizados
                                //        <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                                //</li>
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
                }, error: (jqXHR, exception) => {
                    fcaptureaerrorsajax(jqXHR, exception);
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

    // Funcion que inicia la extracion de los datos empleados
    fExtractionToDatabaseEmployees = (paramstr, paramint) => {
        fRestoreBtnConnect();
        try {
            const consume  = String(paramstr);
            const quantity = parseInt(paramint);
            const dataSend = { method: consume, quantity: quantity };
            $.ajax({
                url: "../WSTalentia/ExtractionToDatabaseEmployees",
                type: "POST",
                data: dataSend,
                beforeSend: () => {
                    console.log('Consumiendo...');
                }, success: (data) => {
                    console.log(data);
                    setTimeout(() => {
                        if (data.Session == true) {
                            if (data.Bandera === true) {
                                document.getElementById('show-info-consume-boff').innerHTML = `
                                <hr />
                                <div class="col-md-12 mt-3 animated fadeInDown">
                                    <ul class="list-group">
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Consumo
                                        <span class="badge badge-success badge-pill">OK</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Insertados
                                        <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                                      </li> 
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        Tiempo
                                        <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                                      </li>
                                      <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                                      </li>
                                    </ul>

                                </div>
                            `;
                            } else {
                                fShowAlert(btnCheckConnectWS, 'Opss!', 'Error interno en la aplicacion', 'error', 1, 0);
                            }
                        } else {
                            fShowAlert(null, 'Atención!', 'Tu session ha expirado', 'warning', 0, 0);
                        }
                    }, 2000);
                }, error: (jqXHR, exception) => {
                    fcaptureaerrorsajax(jqXHR, exception);
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

    // Funcion que restaura el consumo de metodos
    fRestartConsume = () => {
        fButtonsDisabledEnabled(false, "");
        document.getElementById('div-show-quantities-consume-ws').innerHTML = '';
        //fCheckConnectionWs();
    }

    // Funcion que inicia el consumo del WS
    fPlayConsumeWs = () => {
        $.ajax({
            url: "../WSTalentia/PlayConsumeWS",
            type: "POST",
            data: {},
            contentType: false,
            processData: false,
            beforeSend: () => {
                btnCheckConnectWS.disabled = true;
                document.getElementById('btn-play-consume').disabled = true;
                document.getElementById('load-init-consume').innerHTML += `
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                    <h6 class="text-primary mt-4">Iniciando...</h6>
                `;
            }, success: (data) => {
                document.getElementById('load-init-consume').innerHTML = '';
                console.log(data);
                if (data.Flag == true) {
                    $("#exampleModal").modal("show");
                    listResultsWs.innerHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Estado del consumo
                            <span class="badge badge-primary badge-pill">Correcto</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Autenticacíón
                            <span class="badge badge-primary badge-pill">OK</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            Registros encontrados
                            <span class="badge badge-primary badge-pill">${data.DataTable}</span>
                        </li>
                    `;
                    btnImportResWs.innerHTML += `
                        <button class="btn btn-success btn-block" onclick="fImportDataWsDatabase()">
                            <i class="fas fa-file-import mr-2"></i>
                            <i class="fas fa-database mr-2"></i>
                            Importar
                        </button>
                    `;
                }
            }, error: (e) => {
                console.log(e);
                //fcaptureaerrorsajax(jqXHR, exception);
            }
        });
    }

    // Funcion que importa los datos a la base de datos
    fImportDataWsDatabase = () => {
        try {
            $.ajax({
                url: "../WSTalentia/ImportDataWsDB",
                type: "POST",
                data: {},
                contentType: false,
                processData: false,
                beforeSend: () => {
                    loadImportBd.innerHTML += `
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                        <h6 class="text-primary mt-3">Importando...</h6>
                    `;
                }, success: (data) => {
                    loadImportBd.innerHTML = '';
                    console.log(data);
                }, error: (jqXHR, exception) => {
                    fcaptureaerrorsajax(jqXHR, exception);
                }
            });
        } catch (error) {
            if (error instanceof RangeError) {
                console.error("RangeError: -> ", error);
            } else if (error instanceof EvalError) {
                console.error("EvalError: -> ", error);
            } else if (error instanceof TypeError) {
                console.error("TypeError: -> ", error);
            } else {
                console.error("Error: -> ", error);
            }
        }
    }

    // * FUNCIONES PARA LA IMPORTACION DE DATOS A SIP * \\

    // Importando datos a Tablas sip
    fImportData = (urlSend, element1, element2) => {
        try {
            $.ajax({
                url: "../WSTalentia/" + String(urlSend),
                type: "POST",
                data: {},
                beforeSend: () => {
                    console.log('Importando datos');
                }, success: (data) => {
                    console.log(data);
                    if (data.CorrectoInsert == true && data.CorrectoUpdate == true) {
                        document.getElementById(element1).classList.remove("badge-primary");
                        document.getElementById(element1).classList.add("badge-success");
                        document.getElementById(element1).innerHTML = "<i class='fas fa-check-circle text-white'></i>";
                        document.getElementById(element2).innerHTML += `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Actualizados SIP
                                <span class="badge badge-primary badge-pill">${data.Insertados}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Insertados SIP
                                <span class="badge badge-primary badge-pill">${data.Actualizados}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                Tiempo SIP
                                <span class="badge badge-primary badge-pill">${data.Tiempo}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary btn-sm btn-block" onclick="fRestartConsume();"><i class="fas fa-undo mr-2"></i>Reiniciar</button>
                            </li>
                        `;
                    } else {
                        document.getElementById(element1).classList.remove("badge-primary");
                        document.getElementById(element1).classList.add("badge-danger");
                        document.getElementById(element1).innerHTML = "<i class='fas fa-times-circle text-white'></i>";
                    }
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

    btnCheckConnectWS.addEventListener('click', fCheckConnectionWs);

    fLoadQuantityRegistersNotImport = () => {
        try {
            $.ajax({
                url: "../Employees/InformationQuantitysDatesImport",
                type: "POST",
                data: {},
                beforeSend: () => {
                    btnCheckConnectWS.disabled = true;
                    btnCheckInfoDataB.disabled = true;
                    document.getElementById('dateConsume').innerText = "Cargando...";
                }, success: (request) => {
                    //console.log(request);
                    document.getElementById('dateConsume').innerText = request.FechaC;
                    if (request.Bandera) {
                        btnCheckConnectWS.disabled = false;
                        btnCheckInfoDataB.disabled = false;
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

    fLoadQuantityRegistersNotImport();

});