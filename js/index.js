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
            $('#city').append(`<option value="" selected> Selecione um Município </option>`);
            const idState = $('#state').val();
            if (idState !== '') {
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
            if (idCity !== '') {
                var idCity = $('#city').val();
                getData(res, 2900036); // function for fake data 'res'
                //getData(idCity); Uncomment this function for API 
            }
        });
    });
}

const res = [{
    "id": 2900037,
    "dataReferencia": "01/04/2020",
    "municipio": {
        "codigoIBGE": "5107958",
        "nomeIBGE": "TANGARÁ DA SERRA",
        "nomeIBGEsemAcento": "TANGARA DA SERRA",
        "pais": "BRASIL",
        "uf": {
            "sigla": "MT",
            "nome": "MATO GROSSO"
        }
    },
    "tipo": {
        "id": 6,
        "descricao": "Auxílio Emergencial",
        "descricaoDetalhada": "Auxílio Emergencial"
    },
    "valor": 12579000,
    "quantidadeBeneficiados": 17315
}, {
    "id": 2900036,
    "dataReferencia": "01/04/2020",
    "municipio": {
        "codigoIBGE": "5107958",
        "nomeIBGE": "CIDADE FAKE",
        "nomeIBGEsemAcento": "CIDADE FAKE",
        "pais": "BRASIL",
        "uf": {
            "sigla": "MT",
            "nome": "MATO GROSSO"
        }
    },
    "tipo": {
        "id": 6,
        "descricao": "Auxílio Emergencial",
        "descricaoDetalhada": "Auxílio Emergencial"
    },
    "valor": 40579000,
    "quantidadeBeneficiados": 12315
}];


function getData(res, id) { // Comment this function for enable API request
    // function showData(res, id) { Uncomment for enable API results
    $('.cfg').hide(500);
    res.forEach((city) => {
        if (city.id == id) {
            $('#section-form').fadeIn(500, () =>
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
                        <input class="form-control" id="valor" value="R$ ${city.valor}" disabled>
                    </div>
                    <div class="form-group">
                        <button type="button" id="ButtonBack" class="btn btn-info">Voltar</button>
                    </div>
                </div>
                `)
            );
        }
    });
}

// function getData(res, id) {
//     console.log(now);
//     const url =`http:www.transparencia.gov.br/api-de-dados/auxilio-emergencial-por-municipio?mesAno=202004&codigoIbge=${idCity}&pagina=1`;
//     const option = {
//         headers: {
//             'Accept': '*/*',
//             'chave-api-dados': '5a0d8cbc9b8729f9d0a72451550f604e'
//         }
//     };

// const reqData = requestApi(url, option);

// reqData.then((response) => {
//  

// });
// }