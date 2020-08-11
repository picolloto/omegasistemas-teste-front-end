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
    $('#city').attr("disabled", true);

    reqState.then((response) => {

        $('#state').append(`<option value="" selected> Selecione um Estado </option>`);

        response.forEach(state => {
            $('#state').append(`<option value="${state.id}">${state.sigla}</option>`);
        });
        $('#state').click(() => {
            $('#city').empty();
            $('#city').append(`<option value="" selected> Selecione um Município </option>`);
            const idState = $('#state').val();
            if (idState != '') {
                $('#city').attr("disabled", false);
                getCity(idState);

            }
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
            const idCity = $('#city').val();
            if (idCity != '') {
                getData(idCity);
            }
        });
    });
}

// This main function for API Auxilio Emergêncial
function getData(idCity) {

    const url = `http:www.transparencia.gov.br/api-de-dados/auxilio-emergencial-por-municipio?mesAno=202004&codigoIbge=${idCity}&pagina=1`;
    const option = {
        headers: {
            'Accept': '*/*',
            'chave-api-dados': '5a0d8cbc9b8729f9d0a72451550f604e'
        }
    };
    const reqData = requestApi(url, option);

    reqData.then((response) => {
        showData(response, idCity);
    });
}

function showData(res, id) { //Uncomment for enable API results
    $('.cfg').hide(500);
    console.log(res, id);
    res.forEach((city) => {
        $('#section-form').show(500, () =>
            $('#section-form').append(`
                <div class="container cfg">
                    <div class="form-group">    
                        <label id="cityAfter">Município: </label>
                        <input class="form-control" id="cityAfter" value="${city.municipio.nomeIBGE}" disabled>
                    </div>
                    <div class="form-group">    
                    <label id="stateAfter">Estado: </label>
                    <input class="form-control" id="stateAfter" value="${city.municipio.uf.sigla}" disabled>
                    </div>
                    <div class="form-group">
                        <label id="beneficiados">Quantidade de Beneficiados: </label>
                        <input class="form-control" id="beneficiados" value="${city.quantidadeBeneficiados}" disabled>
                    </div>
                    <div class="form-group">    
                        <label id="valor">Valor Pago: </label>
                        <input class="form-control" id="valor" value="${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(city.valor)}" disabled>
                    </div>
                    <div class="form-group">
                        <a type="submit" href="index.html" class="btn btn-info">Voltar</a>
                    </div>
                </div>
                `)
        );
    });
}