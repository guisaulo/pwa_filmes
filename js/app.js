
//Carregar dados dos filmes (AJAX)

var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var conteudo = document.getElementById("conteudo");

    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);

        //Caso não tenha filmes no JSON mostra uma mensagem
        if(data_json.length == 0){

            conteudo.innerHTML = '<div class="alert alert-warning" role="alert">Não há filmes cadastrados no sistema!</div>';

        //Tendo filmes, vamos processar a renderização
        }else{

            var html_conteudo = "";
            
            for(var i =0; i < data_json.length; i++)
            {
                html_conteudo += '<div class="col-12"><h2 class="categoria">'+data_json[i].categoria+'</h2></div>';

                if(data_json[i].filmes.length == 0){

                    html_conteudo += '<div class="col-lg-12"><div class="alert alert-warning" role="alert">Ainda não temos filmes nesta categoria!</div></div>';

                }else{

                    for(var j = 0; j < data_json[i].filmes.length; j++)
                    {
                        html_conteudo += card_filme(data_json[i].filmes[j].titulo,data_json[i].filmes[j].sinopse,data_json[i].filmes[j].imagem,data_json[i].filmes[j].url_assistir,data_json[i].filmes[j].html_ficha);
                    }

                }

            }
            cache_dinamico(data_json);
            conteudo.innerHTML = html_conteudo;
        }

    }

}

//Template Engine
var card_filme = function (titulo, sinopse, imagem, url_assistir, html_ficha){

    var html_modal = '<p><strong>Sinopse:</strong>'+sinopse+'</p><hr><p><strong>Ficha Técnica</strong></p>'+html_ficha;

    var html ='<div class="col-lg-3 col-md-4 col-6 mb-3">'+
                '<div class="card text-white bg-dark mb-3">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="Foto do filme">'+
                    '<div class="card-body">'+
                    '<h5 class="card-title">'+titulo+'</h5>'+
                    '<div class="d-grid gap-2">'+
                        '<a href="#" data-bs-toggle="modal" onClick="javascript:dadosModal(\''+titulo+'\',\''+html_modal+'\',\''+url_assistir+'\');" data-bs-target="#fichaFilme" class="btn btn-secondary btFicha">Informações</a>'+
                        '<a href="'+url_assistir+'" target="_blank" class="btn btn-warning">Assistir</a>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
                '</div>';

    return html;

}

//Alterar Modal

var dadosModal = function(titulo, html_ficha, url_assistir){

    var tituloHTML = document.getElementById("tituloFilme");
    var corpoHTML = document.getElementById("corpoModal");
    var btAssistirModal = document.getElementById("btAssistirModal");

    tituloHTML.innerHTML = titulo;
    corpoHTML.innerHTML = html_ficha;

    btAssistirModal.setAttribute('href', url_assistir);

}

//Cache Dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        caches.delete('filmes-app-dinamico').then(function(){
            console.log("Deletando cache antigo");
        });

        caches.open('filmes-app-dinamico').then(function(cache){

            if(data_json.length > 0){

                var arquivos_dinamicos = ['dados.json'];

                for(var i =0; i < data_json.length; i++){

                    for(var j = 0; j < data_json[i].filmes.length; j++){

                        if(arquivos_dinamicos.indexOf(data_json[i].filmes[j].imagem) == -1){
                            arquivos_dinamicos.push(data_json[i].filmes[j].imagem);
                        }

                    }

                }
            }

            cache.addAll(arquivos_dinamicos).then(function(){
                console.log("Cache dinâmico criado com sucesso!");
            });
        });
    }
}

//Botão de Instalação

let disparoInstalacao = null;
const btInstalar = document.getElementById("btInstalar");

let inicializarInstalacao = function(){

    btInstalar.removeAttribute("hidden");
    btInstalar.addEventListener("click", function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário aceitou a instalação");
            }else{
                console.log("Usuário NÃO aceitou a instalação");
            }

        });

    });

}

window.addEventListener('beforeinstallprompt', (evt) => {

    disparoInstalacao = evt;

});

