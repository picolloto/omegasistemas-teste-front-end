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
        $('#state').append(`<option value="" selected> Selecione um Estado </option>`);
        $('#city').append(`<option value="" selected> Selecione um Município </option>`);

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
    const urlCity = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idState}/municipios`
    const reqCity = requestApi(urlCity);

    reqCity.then((response) => {

        response.forEach(city => {
            $('#city').append(`<option value="${city.id}">${city.nome}</option>`);
        });

        $('#buttonSubmit').click((event) => {
            event.preventDefault();
            var idCity = $('#city').val();
            if (idCity != '') { getData(idCity); }
        });
    });
}

function getData(idIbge) {

}