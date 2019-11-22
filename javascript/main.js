const mapButtonFilter = () =>{
  let buttonFilters = document.querySelectorAll(".button-filter");
  buttonFilters.forEach( button => button.addEventListener('click', handleButtonClick));
}

function handleButtonClick(e){
  e.preventDefault();    
  let termoPesquisa = document.querySelector(".termoPesquisa").value.toUpperCase();
 
  Promise.all([getData(termoPesquisa), getVolume(termoPesquisa)]).then(function(values) {
    let objShareInfo =  createObjResponse(termoPesquisa, values[0]);
      try{
        let objShareVolume = values[1].data[0].shares;
        objShareInfo.volume = objShareVolume;
        renderPage(objShareInfo);
      }
      catch(e){
        renderNotFoundCard();
      }
  });
}

function getData(termoPesquisa){
  return new Promise (function(resolve, reject){
      
    let apiKey = '9880e950';
    let apiUrl = 'https://api.hgbrasil.com/finance/stock_price?format=json-cors&key='+apiKey+'&symbol='+termoPesquisa;
    
    let requestApi = new XMLHttpRequest();
    requestApi.onload = function(){
      resolve(this.response);
    }
    requestApi.onerror = reject;
    requestApi.open('GET', apiUrl);
    requestApi.responseType = 'json';
    requestApi.send();

  });
}


function getVolume(termoPesquisa){
  return new Promise (function(resolve, reject){
    
    let apiKey = 'qH8PW5yn7ogrbmipfMYlgVL66cy38iY0jFtwN3wApdwLfiCDiQdzjiKztkFB';
    let url = 'https://api.worldtradingdata.com/api/v1/stock?symbol='+termoPesquisa+'.SA&api_token='+apiKey;
    
    let request = new XMLHttpRequest();
    request.onload = function(){
      resolve(this.response);
    }
    request.onerror = reject;
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

  });
}
  

 function createObjResponse(termoPesquisa, response){
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
    return (responseObj);
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


function renderPage(responseObj ){
  console.log(responseObj);
  var pesquisaContent = document.querySelector(".pesquisa-container");
  var pesquisaCard= document.querySelector(".pesquisa-container .card");
  var jumbotronHome = document.querySelector(".home-page-container .jumbotron");
  var feedbackInfoCard = document.querySelector(".feedback-info .card");
  var va = responseObj.price;
  var ple = responseObj.marketcap;
  var qa = responseObj.volume;
  var vpa = (ple*1000000)/qa;
  var difVaVpa = va - vpa;

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
                          <li class="list-group-item"><span class="font-weight-bold">QA =</span> Quantidade de Ações: <span class="font-weight-bold">${qa.toLocaleString('pt-BR')}</span></li>
                        </ul>
                        <div class="mini-card">
                          <p>VA = Valor Atual da ação</p>
                          <h4 class="font-weight-bold">${(va.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</h4>
                        </div>
                        <div class="mini-card">
                          <p>Diferença de VA e VPA</p>
                          <h4 class="font-weight-bold">${(difVaVpa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))}</h4>
                        </div>
                        <div>
                          <button class="btn btn-dark my-2 my-sm-0 button-bookmarker">Favoritar ação</button>
                        </div>
                        `;
  cardPesquisa.appendChild(cardInfo);
  pesquisaContent.appendChild(cardPesquisa);
  pesquisaContent.appendChild(renderJumbotron());
  document.querySelector(".pesquisa-container").style.display = "block";
  mapButtonFilter();
}

mapButtonFilter();