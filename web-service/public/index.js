//Representa a página atual - 1 (logo a página 1 é representada por currentPage 0)
let currentPage = 0;

//Inicia a tabela com uma requisição GET vazia
doGet(0, true);

//Recebe os elementos especificados pela requisição GET e gera os dados da página específicada na tabela usando DOM
function generateData(page, data) {
    let dataInPage = [];
    let dataL = data.length;

    //Separa os dados recebidos em 15 entrada por índice da variável dataInPage, definindo assim o tamanho da página
    for (let i = 0; i < Math.ceil((dataL / 15)); i++) {
        dataInPage[i] = data.splice(0, 15);
    }

    let div = document.getElementById("db_entries");

    //Limpa os registros da tabela usando jQuery, deixando-a preparada para uma nova inserçao
    $('#db_entries').empty();

    if (dataInPage[page] != null) {

        // Itera sobre todos os elementos da página, a estrutura adotada consiste em uma div "row" que contém 3 divs "cell"
        // dentro de si, as duas primeiras "cells" representam ID e DESTINATION de cada entrada, a terceira "cell" contém os
        // botões de edição e remoção do elemento a qual se referem
        for (let i = 0; i < dataInPage[page].length; i++) {

            let id = dataInPage[page][i].DTN_ID;

            let row = document.createElement("div");
            row.className = "row";

            let cell = document.createElement("div");
            let cellText = document.createTextNode(id);
            cell.className = "content";

            cell.appendChild(cellText);
            row.appendChild(cell);

            cell = document.createElement("div");
            cellText = document.createTextNode(dataInPage[page][i].DTN_DESTINATION);
            cell.className = "content";

            cell.appendChild(cellText);
            row.appendChild(cell);

            let buttonCell = document.createElement("div");

            let editButton = document.createElement("img");
            editButton.onclick = () => {
                toggleEdit(id);

            }
            editButton.src = "baseline_edit_black_24dp.png";
            editButton.className = "icon"
            editButton.style.cursor = "pointer"
            editButton.id = dataInPage[page][i].DTN_ID;
            editButton.title = "Delete";

            let deleteButton = document.createElement("img");
            deleteButton.onclick = () => {
                doDelete(id);
            }

            deleteButton.src = "baseline_delete_black_24dp.png";
            deleteButton.className = "icon"
            deleteButton.style.cursor = "pointer"
            editButton.title = "Edit";

            buttonCell.className = "iconContent";

            buttonCell.appendChild(editButton);
            buttonCell.appendChild(deleteButton);
            row.appendChild(buttonCell);

            div.appendChild(row);
        }
    }
}
// Função chamada para fazer uma requisição GET, o parâmetro "page" especifica a página a ser gerada pela função generetaData,
// o parâmentro firstTimeorClean é um boolean que sera true se for necessário ler o input do filtro de busca, caso contrário, 
// realiza uma requisição GET com parâmetros id e destination vazios para retornar uma pesquisa não filtrada
async function doGet(page, firstTimeorClean) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let id = "";
    let destination = "";

    if (!firstTimeorClean) {
        id = document.getElementById("fetId").value;
        destination = document.getElementById('fetDestination').value;
    } else {
        currentPage = 0;
        if (document.getElementById("fetId") != null) {
            document.getElementById("fetId").value = "";
            document.getElementById('fetDestination').value = "";
        }
    }

    const response = await fetch('/destination?id=' + id + '&destination=' + destination, options);
    const answer = await response.json();

    console.log(answer);

    //Essa condicional é responsável por corrigir a página para que não possua valores ilegais, como 1 a mais que o limite máximo ou -1
    if (page < 0) {
        currentPage = Math.ceil((answer.data.length / 15)) - 1;
        page = Math.ceil((answer.data.length / 15)) - 1;
    } else if (page > Math.ceil((answer.data.length / 15)) - 1) {
        currentPage = 0
        page = 0;
    }
    generateData(page, answer.data);
}

// OBS: A requisição PUT foi feita de maneira diferente da especificada devido a minha confusão quanto a utilizade do botão de edição,
// então a implementação não atualiza um valor que já foi inserido, em vez disso, retorna um erro ao cliente dizendo que o ID já está em 
// uso, a função de atualização foi reservada para o botão de edição, dessa maneira, pude me manter mais fiel ao design enviado na descrição 
// do desafio.
// Função chamada para realizar uma requisição PUT que adiciona uma entrada na tabela, o parâmentro "add", dentro do body da requisição diz
// que é uma requisição que vai adicionar uma entrada, não alterar. Dependendo do código HTTP recebido no fim da operação, irá retornar ao
// cliente uma mensagem de sucesso, entrada existente, entrada maior que o permitido (ID maior que 20 caracteres ou DESTINATION maior que 10
// caracteres) ou Unknown Error, nesse caso, o erro será especificado no servidor.
async function doPutAdd() {
    const destination = document.getElementById("addDestination").value;
    const id = document.getElementById("addId").value;

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            add: true,
            dest: destination
        })
    }
    const response = await fetch('/destination/' + id, options);
    const status = await response.status;
    //Ao finalizar a operação, atualiza a tabela no frontend
    doGet(0, true);
    if (status == 204) {
        cancelAdd();
        alert("Successfully added");
    } else if (status == 409) {
        alert("Entry already exists");
    } else if (status == 400) {
        alert("ID or Destination fields surpass the limit allowed");
    } else {
        alert("Unknown error");
    }
}

// Função chamada para realizar uma requisição PUT que atualiza uma entrada na tabela, o parâmentro "add", dentro do body da requisição diz
// que é uma requisição que vai alterar uma entrada, não adicionar. O parâmentro "buttonId" contém o ID do botão de edição pressionado, para
// indicar qual entrada deve ser alterada pelo servidor. Dependendo do código HTTP recebido no fim da operação, irá retornar ao cliente uma 
// mensagem de sucesso, entrada maior que o permitido (ID maior que 20 caracteres ou DESTINATION maior que 10 caracteres), 
// entrada inválida(caso o usuário tente editar o campo DESTINATION com um input vazio), ID já utilizado ou Unknown Error, nesse caso, o erro
// será especificado no servidor.
async function doPutEdit(buttonId) {
    const destination = document.getElementById("editDestinationInput").value;
    const id = document.getElementById("editIdInput").value;

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            add: false,
            dest: destination,
            changeId: id,
            changeDestination: destination
        })
    }
    const response = await fetch('/destination/' + buttonId, options);
    const status = await response.status;
    doGet(currentPage, false);
    cancelEdit();
    if (status == 204) {
        alert("Successfully edited");
    } else if (status == 400) {
        alert("ID or Destination fields surpass the limit allowed");
    } else if (status == 422) {
        alert("Destination field cannot be empty");
    } else if (status == 409) {
        alert("ID is already in use");
    } else {
        alert("Unknown error");
    }

}

// Função chamada para realizar uma requisição DELETE que remove uma entrada na tabela, o parâmentro "buttonId" contém 
// o ID do botão de remoção pressionado, para indicar qual entrada deve ser removida pelo servidor. Dependendo do código
// HTTP recebido no fim da operação, irá retornar ao cliente uma mensagem de sucesso, entrada não encontrada ou Unknown,
// Error, nesse caso, o erro será especificado no servidor.
async function doDelete(buttonId) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('/destination/' + buttonId, options);
    const status = await response.status;

    //Ao finalizar a operação, atualiza a tabela no frontend sem atualizar a página
    doGet(currentPage, false);
    if (status == 204) {
        alert("Successfully deleted");
    } else if (status == 404) {
        alert("Entry not found");
    } else {
        alert("Unknown error");
    }

}

// Revela/esconde o menu de adição
function togglePopUp() {
    let sidePopup = document.getElementById("sidePopUp");
    sidePopup.classList.toggle("sidePopUpShow");
}

// Revela/esconde os inputs de edição
function toggleEdit(id) {
    let edit1 = document.getElementById("editId");
    let edit2 = document.getElementById("editDestination");
    let button = document.getElementById(id);

    edit1.classList.toggle("sidePopUpShow");
    edit2.classList.toggle("sidePopUpShow");
    button.classList.toggle("greenButton");

    if (!(button.className == "icon greenButton")) {
        doPutEdit(id);
    }

}

// Limpa os inputs de adição
function cancelAdd() {
    if (document.getElementById("addId") != null) {
        document.getElementById("addId").value = "";
        document.getElementById('addDestination').value = "";
    }
    togglePopUp();
}

// Limpa os inputs de edição
function cancelEdit() {
    if (document.getElementById("editIdInput") != null) {
        document.getElementById("editIdInput").value = "";
        document.getElementById('editDestinationInput').value = "";
    }
}

// Função chamada pelos botões de paginação, faz uam requisição GET especificando a página desejada
function changePage(next) {
    if (next) {
        currentPage++;
        doGet(currentPage, false);
    } else {
        currentPage--;
        doGet(currentPage, false);

    }
}

// Função chamada pelo botão de salvamento CSV, faz uma requisição GET em um endpoint "{baseUrl}/csv"
async function saveToCSV() {
    window.open("http://localhost:3000/csv");
}