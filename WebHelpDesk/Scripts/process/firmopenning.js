document.addEventListener('DOMContentLoaded', () => {

    const yearP       = document.getElementById('yearP');
    const periodP     = document.getElementById('periodP');
    const businessP   = document.getElementById('businessP');
    const invoiceP    = document.getElementById('invoiceP');
    const btnPlayFirm = document.getElementById('btn-play-firm');

    const date  = new Date();
    yearP.value = date.getFullYear();

    // Funcion que envia los parametros
    fSendParametersOppeningFirm = () => {
        alert('Btn listo');
    }

    btnPlayFirm.addEventListener('click', fSendParametersOppeningFirm);

});