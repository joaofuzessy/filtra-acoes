var buttonFilters = document.querySelectorAll(".button-filter");

buttonFilters.forEach( button => {
    button.addEventListener('click', function(e){
        e.preventDefault(); 
        var dbfake;     
        var fakeDbUrl = './assets/json/dbfake.json';
        var termoPesquisa = document.querySelector(".termoPesquisa").value;
        var request = new XMLHttpRequest();
        request.open('GET', fakeDbUrl);
        request.responseType = 'json';
        request.send();
        request.onload = function() {
          dbfake = request.response;
          populatePage(dbfake, termoPesquisa);
        }
      }
    );
  }
);

function populatePage(dbfake, termoPesquisa){
  var resultadoPesquisa = searchDb(dbfake, termoPesquisa);
  if(Array.isArray(resultadoPesquisa) && resultadoPesquisa.length==0){
    alert("Infelizmente essa ação não foi encontrada em nossa base de dados.");
  }
  else{
    renderPage(resultadoPesquisa);
  }
}

function searchDb(dbfake, termoPesquisa){
var pesquisa = dbfake.acoes.filter(d => (d.name.title==termoPesquisa));
console.log(pesquisa);
return pesquisa;
}

function renderPage(resultadoPesquisa){
  var homePageContainer = document.querySelector(".home-page-container");
  var pesquisaContent = document.querySelector(".pesquisa-container .card");

  if(homePageContainer){
    homePageContainer.parentNode.removeChild( homePageContainer );
  }
  if(document.querySelector(".pesquisa-container .card .card-header")){
    let cardHeader = document.querySelector('.card-header');
    let cardBody = document.querySelector('.card-body');
    cardHeader.parentNode.removeChild(cardHeader);
    cardBody.parentNode.removeChild(cardBody);
  } 
  
  var cardHeader = document.createElement('div');
  cardHeader.classList.add('card-header');
  cardHeader.textContent = resultadoPesquisa[0].name.title;
  pesquisaContent.appendChild(cardHeader);

  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  pesquisaContent.appendChild(cardBody);

  var cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = resultadoPesquisa[0].name.first + ' ' + resultadoPesquisa[0].name.last;
  cardBody.appendChild(cardTitle);

  var cardInfo = document.createElement('div');
  cardInfo.classList.add('card-info');
  cardInfo.innerHTML = `
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item"><span class="font-weight-bold">VPA =</span> Valor Patrimonial da Ação (Valor "REAL" da ação)</li>
                          <li class="list-group-item"><span class="font-weight-bold">PLE =</span> Patrimônio Líquido x Trimestre da Empresa (2019): <span class="font-weight-bold">R$${resultadoPesquisa[0].patrimonio.trimestral}</span></li>
                          <li class="list-group-item"><span class="font-weight-bold">QA =</span> Quantidade de Ações: <span class="font-weight-bold">${resultadoPesquisa[0].dadosacoes.quantidade}</span></li>
                        </ul>
                        `;
  pesquisaContent.appendChild(cardInfo);
  
  document.querySelector(".pesquisa-container").style.display = "block";
}
