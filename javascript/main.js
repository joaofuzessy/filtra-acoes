mapButtonFilter();

function mapButtonFilter(){
  var buttonFilters = document.querySelectorAll(".button-filter");

  buttonFilters.forEach( button => {
      button.addEventListener('click', function(e){
          e.preventDefault(); 
          var dbfake; 
          var apiRequested;    
          var fakeDbUrl = './assets/json/dbfake.json';
          var termoPesquisa = document.querySelector(".termoPesquisa").value.toLowerCase();
          var apiUrl = 'https://api.hgbrasil.com/finance/stock_price?format=json-cors&key=99775757&symbol='+termoPesquisa;
          
          var requestApi = new XMLHttpRequest();
          requestApi.open('GET', apiUrl);
          requestApi.responseType = 'json';
          requestApi.send();
          requestApi.onload = function() {
            apiRequested = JSON.parse(requestApi.response);
          }
          
          var request = new XMLHttpRequest();
          request.open('GET', fakeDbUrl);
          request.responseType = 'json';
          request.send();
          request.onload = function() {
            dbfake = request.response;
            populatePage(dbfake, termoPesquisa, apiRequested);
          }

          
        }
      );
    }
  );
}

function populatePage(dbfake, termoPesquisa, apiRequested){
  var resultadoPesquisa = searchDb(dbfake, termoPesquisa);
  if(Array.isArray(resultadoPesquisa) && resultadoPesquisa.length==0){
    renderNotFoundCard();
    mapButtonFilter();
  }
  else{
    renderPage(resultadoPesquisa, apiRequested);
    mapButtonFilter();
  }
}

function searchDb(dbfake, termoPesquisa){
var pesquisa = dbfake.acoes.filter(d => (d.name.title==termoPesquisa));
return pesquisa;
}


function renderJumbotron(){

  let jumbotronPesquisa = document.querySelector(".jumbotronPesquisa");

  if(jumbotronPesquisa){
    jumbotronPesquisa.parentNode.removeChild( jumbotronPesquisa );
    }

  
  let newJumbotronPesquisa = document.createElement('div');
  newJumbotronPesquisa.classList.add('jumbotron');
  newJumbotronPesquisa.classList.add('jumbotronPesquisa');
  newJumbotronPesquisa.innerHTML = `
                                  <h1 class="display-4 font-weight-bold">Não econtrou?</h1>
                                  <hr class="my-4">
                                  <p>Tente uma nova pesquisa com palavras chave diferentes.</p>
                                  <form class="form-inline my-2 my-lg-0">
                                    <input class="form-control termoPesquisa w-75 p-3 mr-sm-2" type="search" placeholder="Digite algo relacionado a sua ação de preferência…" aria-label="Search">
                                    <button class="btn btn-dark my-2 my-sm-0 button-filter" type="submit">Pesquisar</button>
                                  </form>
                                `;
  return newJumbotronPesquisa;
}


function renderNotFoundCard(){
  var homePageContainer = document.querySelector(".home-page-container");
  var pesquisaCard= document.querySelector(".pesquisa-container .card");
  var feedbackInfo = document.querySelector(".feedback-info");
  var feedbackInfoCard = document.querySelector(".feedback-info .card");
  var jumbotronHome = document.querySelector(".home-page-container .jumbotron");

  if(jumbotronHome){
    jumbotronHome.parentNode.removeChild( jumbotronHome );
  }
  if(pesquisaCard){
    pesquisaCard.parentNode.removeChild( pesquisaCard );
  } 

  if(feedbackInfoCard){
    feedbackInfoCard.parentNode.removeChild( feedbackInfoCard );
  } 

  var feedbackCard = document.createElement('div');
  feedbackCard.classList.add('card');

  var cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  cardHeader.textContent = "Sem resultados...";
  feedbackCard.appendChild(cardHeader);

  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  feedbackCard.appendChild(cardBody);

  var cardInfo = document.createElement('div');
  cardInfo.classList.add('card-info');
  cardInfo.innerHTML = `
                        <div class="feedBackText"><p>Infelizmente não encontramos uma ação com o título pesquisado. 
                        <br>Por favor tente novamente com outro código<p><div>
                        `;
  feedbackCard.appendChild(cardInfo);
  feedbackInfo.appendChild(feedbackCard);
  feedbackInfo.appendChild(renderJumbotron());
}


function renderPage(resultadoPesquisa, apiRequested){
  var homePageContainer = document.querySelector(".home-page-container");
  var pesquisaContent = document.querySelector(".pesquisa-container");
  var pesquisaCard= document.querySelector(".pesquisa-container .card");
  var jumbotronHome = document.querySelector(".home-page-container .jumbotron");
  var feedbackInfo = document.querySelector(".feedback-info");
  var feedbackInfoCard = document.querySelector(".feedback-info .card");
  var va = apiRequested.results[0].price;;
  var ple = resultadoPesquisa[0].patrimonio.trimestral;
  var qa = resultadoPesquisa[0].dadosacoes.quantidade;
  var vpa = parseFloat(ple.split('.').join(""))/parseFloat(qa.split('.').join(""));
  var difVaVpa = (parseFloat(va - vpa));

  if(jumbotronHome){
    jumbotronHome.parentNode.removeChild( jumbotronHome );
  }

  if(pesquisaCard){
    pesquisaCard.parentNode.removeChild( pesquisaCard );
  } 

  if(feedbackInfoCard){
    feedbackInfoCard.parentNode.removeChild( feedbackInfoCard );
  } 
  
  var cardPesquisa = document.createElement('div');
  cardPesquisa.classList.add('card');

  var cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  cardHeader.textContent = apiRequested.results[0].symbol;
  cardPesquisa.appendChild(cardHeader);

  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardPesquisa.appendChild(cardBody);

  var cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = apiRequested.results[0].name;
  cardBody.appendChild(cardTitle);

  var cardInfo = document.createElement('div');
  cardInfo.classList.add('card-info');
  cardInfo.innerHTML = `
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item"><span class="font-weight-bold">VPA =</span> Valor Patrimonial da Ação (Valor "REAL" da ação): <span class="font-weight-bold">R$${vpa.toFixed(2).replace('.', ',')}</span></li>
                          <li class="list-group-item"><span class="font-weight-bold">PLE =</span> Patrimônio Líquido x Trimestre da Empresa (2019): <span class="font-weight-bold">R$${ple}</span></li>
                          <li class="list-group-item"><span class="font-weight-bold">QA =</span> Quantidade de Ações: <span class="font-weight-bold">${qa}</span></li>
                        </ul>
                        <div class="mini-card">
                          <p>VA = Valor Atual da ação</p>
                          <h4 class="font-weight-bold">R$${va}</h4>
                        </div>
                        <div class="mini-card">
                          <p>Diferença de VA e VPA</p>
                          <h4 class="font-weight-bold">R$${(difVaVpa.toFixed(2)).replace('.', ',')}</h4>
                        </div>
                        `;
  cardPesquisa.appendChild(cardInfo);
  pesquisaContent.appendChild(cardPesquisa);
  pesquisaContent.appendChild(renderJumbotron());
  document.querySelector(".pesquisa-container").style.display = "block";
}
