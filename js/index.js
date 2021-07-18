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
                getData(idCity, dataArray);
            }
        });
    });
}

var dataArray = [{
    "municipio": {
        "nomeIBGE": '',
        "uf": {
            "nome": ''
        }
    },
    "valor": 0,
    "quantidadeBeneficiados": 0
}];

// This main function for API Auxilio Emergêncial
async function getData(idCity, dataArray) {

    var date = new Date();
    var mesAnoEnd = `${date.getFullYear()}`;

    if (date.getMonth() >= 10) {
        mesAnoEnd += `${date.getMonth()}`;
    } else {
        mesAnoEnd += `0${date.getMonth()}`;
        mesAnoEnd = Number(mesAnoEnd);
    }

    for (var mesAno = 202004; mesAno <= mesAnoEnd; mesAno++) {

        const url = `http://api.portaldatransparencia.gov.br/api-de-dados/auxilio-emergencial-por-municipio?mesAno=${mesAno}&codigoIbge=${idCity}&pagina=1`;
        const option = {
            headers: {
                'Accept': '*/*',
                'chave-api-dados': '{INSIRA SUA CHAVE DA API DO PORTAL DA TRANSPARÊNCIA}'
            }
        };

        const reqData = requestApi(url, option);

        await reqData.then((response) => {
                return response;
            })
            .then((res) => {
                res.forEach((data) => {
                    dataArray[0].municipio.nomeIBGE = data.municipio.nomeIBGE;
                    dataArray[0].municipio.uf.nome = data.municipio.uf.nome;
                    dataArray[0].valor += data.valor;
                    dataArray[0].quantidadeBeneficiados += data.quantidadeBeneficiados;
                });
            });

        if (mesAno >= mesAnoEnd) { showData(); }
    }
}

function showData() { //Uncomment for enable API results
    $('.cfg').hide(500);
    $('#section-form').show(500, () =>
        $('#section-form').append(`
                <div class="container cfg">
                    <div class="form-group">    
                        <label id="cityAfter">Município: </label>
                        <input class="form-control" id="cityAfter" value="${dataArray[0].municipio.nomeIBGE}" disabled>
                    </div>
                    <div class="form-group">    
                    <label id="stateAfter">Estado: </label>
                    <input class="form-control" id="stateAfter" value="${dataArray[0].municipio.uf.nome}" disabled>
                    </div>
                    <div class="form-group">
                        <label id="beneficiados">Quantidade de Beneficiados: </label>
                        <input class="form-control" id="beneficiados" value="${dataArray[0].quantidadeBeneficiados}" disabled>
                    </div>
                    <div class="form-group">    
                        <label id="valor">Valor Pago: </label>
                        <input class="form-control" id="valor" value="${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dataArray[0].valor)}" disabled>
                    </div>
                    <div class="form-group">
                        <a type="submit" href="index.html" class="btn btn-info">Voltar</a>
                    </div>
                </div>
                `)
    );
}
