$(document).ready(() => {
    getState();
});

// Requests to all API's
async function requestApi(url, options) {
    const response = await fetch(url, options);
    return response.json();
}

function getState() {
    const urlState = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;
    const reqState = requestApi(urlState);

    reqState.then((response) => {
        console.log(response);
        $('#state').append(`<option value="" selected> Selecione um Estado </option>`);

        response.forEach(state => {
            $('#state').append(`<option value="${state.id}">${state.sigla}</option>`);
        });

        $('#state').click(() => {
            const idState = $('#state').val();
            if (idState != '') { getCity(idState); }
        });
    });
}

function getCity(idState) {

}