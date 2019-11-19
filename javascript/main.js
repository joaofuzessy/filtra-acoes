const mapButtonFilter = () =>{
  let buttonFilters = document.querySelectorAll(".button-filter");
  buttonFilters.forEach( button => button.addEventListener('click', handleButtonClick));
}

const handleButtonClick = (e) => {
  e.preventDefault();    
  let termoPesquisa = document.querySelector(".termoPesquisa").value.toUpperCase();
  let totalAcoes = callWebInfo(termoPesquisa);
  callApi(termoPesquisa);
}


const callWebInfo = (termoPesquisa) => {
  let webInfoUrl = 'https://br.tradingview.com/symbols/BMFBOVESPA-'+termoPesquisa;
  var proxy = 'https://cors-anywhere.herokuapp.com/';
  let requestApi = new XMLHttpRequest();
  requestApi.open('GET', proxy+webInfoUrl);
  requestApi.responseType = 'document';
  requestApi.send();
  requestApi.onload = function(){
    try{
      console.log(jQuery('#js-category-content > div > div > div > div > div.tv-card-container__columns.tv-sticky-columns > div.tv-card-container__widgets.tv-sticky-columns__column.tv-sticky-columns__column--fix-bottom.tv-sticky-columns__column--layered > div:nth-child(2) > div > div.tv-feed-widget__body.js-widget-body.tv-scroll-button-wrap.tv-scroll-button-wrap--is-at-start.tv-scroll-button-wrap--is-at-end.scrollButtonCircleWrap-1TFUo-U9- > div.tv-scroll-wrap.tv-scroll-wrap--horizontal > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > span.tv-widget-fundamentals__value.apply-overflow-tooltip'));
    }
    catch{renderNotFoundCard();}
  }
}

const callApi = (termoPesquisa) => {
  let apiKey = '99775757';
  let apiUrl = 'https://api.hgbrasil.com/finance/stock_price?format=json-cors&key='+apiKey+'&symbol='+termoPesquisa;
  
  let requestApi = new XMLHttpRequest();
  requestApi.open('GET', apiUrl);
  requestApi.responseType = 'json';
  requestApi.send();
  requestApi.onload = function(){
    try{createObjResponse(requestApi.response, termoPesquisa);}
    catch{renderNotFoundCard();}
  }
}

const createObjResponse = (response, termoPesquisa) => {
    let name = response.results[termoPesquisa].name;
    let symbol = response.results[termoPesquisa].symbol;
    let price = response.results[termoPesquisa].price;
    let marketcap = response.results[termoPesquisa].market_cap;
    let responseObj = {
      name: name,
      symbol: symbol,
      price: price,
      marketcap: marketcap
    }
    renderPage(responseObj);
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
  mapButtonFilter();
}


function renderPage(responseObj, ){
  var pesquisaContent = document.querySelector(".pesquisa-container");
  var pesquisaCard= document.querySelector(".pesquisa-container .card");
  var jumbotronHome = document.querySelector(".home-page-container .jumbotron");
  var feedbackInfoCard = document.querySelector(".feedback-info .card");
  var va = responseObj.price;
  var ple = responseObj.marketcap;
  var qa = 1;
  var vpa = 1;
  var difVaVpa = 1;

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
  cardHeader.textContent = responseObj.symbol;
  cardPesquisa.appendChild(cardHeader);

  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardPesquisa.appendChild(cardBody);

  var cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = responseObj.name;
  cardBody.appendChild(cardTitle);

  var cardInfo = document.createElement('div');
  cardInfo.classList.add('card-info');
  cardInfo.innerHTML = `
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item"><span class="font-weight-bold">VPA =</span> Valor Patrimonial da Ação (Valor "REAL" da ação): <span class="font-weight-bold">${vpa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></li>
                          <li class="list-group-item"><span class="font-weight-bold">PLE =</span> Patrimônio Líquido x Trimestre da Empresa (2019): <span class="font-weight-bold">${(ple*1000000).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></li>
                          <li class="list-group-item"><span class="font-weight-bold">QA =</span> Quantidade de Ações: <span class="font-weight-bold">${qa}</span></li>
                        </ul>
                        <div class="mini-card">
                          <p>VA = Valor Atual da ação</p>
                          <h4 class="font-weight-bold">${(va.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</h4>
                        </div>
                        <div class="mini-card">
                          <p>Diferença de VA e VPA</p>
                          <h4 class="font-weight-bold">${(difVaVpa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</h4>
                        </div>
                        `;
  cardPesquisa.appendChild(cardInfo);
  pesquisaContent.appendChild(cardPesquisa);
  pesquisaContent.appendChild(renderJumbotron());
  document.querySelector(".pesquisa-container").style.display = "block";
  mapButtonFilter();
}

mapButtonFilter();