(function renderBookmarks(){
  if(localStorage.length>0){
    for (var i = 0; i < localStorage.length; i++){
      let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      document.querySelector("#listBookmarks").innerHTML += `<li  class="list-group-item" id="${i}">
                                                              ${item.name} 
                                                              <button type="button" id="${i}" class="btn btn-danger btnRemoveItem">Remover</button>
                                                              <button type="button" id="${i}" class="btn btn-info btnViewItem" data-toggle="modal" data-target="#modalInfo">Visualizar</button>
                                                             </li>`;
    }
  }
  else{
    document.querySelector("#listBookmarks").innerHTML = `<div class="alert alert-info" role="alert">
                                                            Não há ações favoritas cadastradas.
                                                          </div>`
  }
 
  })();
  

  (function viewBookmark(){
    document.querySelectorAll(".btnViewItem").forEach(element => {
      element.addEventListener('click', (e) => {
        let item = JSON.parse(localStorage.getItem(localStorage.key(e.target.id)));
        renderModal(item);
      })
    });
    
    })();

  (function removeLocalStorage(){
    document.querySelectorAll(".btnRemoveItem").forEach(element => {
      element.addEventListener('click', (e) => {
        localStorage.removeItem(localStorage.key(e.target.id));
        e.target.parentNode.style.display = "none";
      })
    });
    })();

    
function renderModal(responseObj){
  let defaultBody = document.querySelector("body");
  let va = responseObj.price;
  let ple = responseObj.marketcap;
  let qa = responseObj.volume;
  let vpa = (ple*1000000)/qa;
  let difVaVpa = va - vpa;
  let modal = document.getElementById('modalInfo');

  if(modal){
    defaultBody.removeChild(modal.parentNode);
  } 

  let ModalInfo = document.createElement('div');
  ModalInfo.innerHTML = `<div class="modal fade" id="modalInfo" tabindex="-1" role="dialog" aria-labelledby="ModalInfo" aria-hidden="true">
                          <div class="modal-dialog" role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title">${responseObj.symbol} - ${responseObj.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
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
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        `;

defaultBody.appendChild(ModalInfo);
}