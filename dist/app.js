"use strict";
let filmes = [
    { id: 1, titulo: "Interestelar", diretor: "Christopher Nolan", ano: 2014, genero: "Ficção Científica", avaliacao: 9.2, capa: "images/interestelar.jpg" },
    { id: 2, titulo: "Cidade de Deus", diretor: "Fernando Meirelles", ano: 2002, genero: "Drama", avaliacao: 9.5, capa: "images/cidade-de-deus.jpg" },
    { id: 3, titulo: "Tropa de Elite", diretor: "José Padilha", ano: 2007, genero: "Ação", avaliacao: 9.1, capa: "images/tropa-de-elite.jpg" },
    { id: 4, titulo: "Central do Brasil", diretor: "Walter Salles", ano: 1998, genero: "Drama", avaliacao: 8.8, capa: "images/central-do-brasil.jpg" },
    { id: 5, titulo: "Bacurau", diretor: "Kleber Mendonça Filho", ano: 2019, genero: "Suspense", avaliacao: 8.5, capa: "images/bacurau.jpg" },
    { id: 6, titulo: "O Auto da Compadecida", diretor: "Guel Arraes", ano: 2000, genero: "Comédia", avaliacao: 9.3, capa: "images/auto-da-compadecida.jpg" },
    { id: 7, titulo: "Parasita", diretor: "Bong Joon-ho", ano: 2019, genero: "Suspense", avaliacao: 9.0, capa: "images/parasita.jpg" },
    { id: 8, titulo: "O Poderoso Chefão", diretor: "Francis Ford Coppola", ano: 1972, genero: "Drama", avaliacao: 9.7, capa: "images/poderoso-chefao.jpg" },
    { id: 9, titulo: "A Origem", diretor: "Christopher Nolan", ano: 2010, genero: "Ficção Científica", avaliacao: 9.0, capa: "images/origem.jpg" },
    { id: 10, titulo: "Que Horas Ela Volta?", diretor: "Anna Muylaert", ano: 2015, genero: "Drama", avaliacao: 8.2, capa: "images/que-horas-ela-volta.jpg" }
];
let proximoId = 11;
let idEmEdicao = null;
const form = document.getElementById("form-filme");
const inputTitulo = document.getElementById("titulo");
const inputDiretor = document.getElementById("diretor");
const inputAno = document.getElementById("ano");
const inputGenero = document.getElementById("genero");
const inputAvaliacao = document.getElementById("avaliacao");
const corpoTabela = document.getElementById("corpo-tabela");
const btnSalvar = document.getElementById("btn-salvar");
const inputFiltroTitulo = document.getElementById("filtro-titulo");
const selectFiltroGenero = document.getElementById("filtro-genero");
function renderizarTabela(listaParaExibir = filmes) {
    corpoTabela.innerHTML = "";
    for (const filme of listaParaExibir) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td><img src="${filme.capa}" alt="${filme.titulo}" class="poster"></td>
            <td>${filme.titulo}</td>
            <td>${filme.diretor}</td>
            <td>${filme.ano}</td>
            <td>${filme.genero}</td>
            <td>${filme.avaliacao.toFixed(1)}</td>
            <td>
                <button onclick="editarFilme(${filme.id})">Editar</button>
                <button onclick="excluirFilme(${filme.id})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    }
}
function aplicarFiltros() {
    const textoBusca = inputFiltroTitulo.value.toLowerCase().trim();
    const generoSelecionado = selectFiltroGenero.value;
    const filmesFiltrados = filmes.filter(filme => {
        const bateTitulo = filme.titulo.toLowerCase().includes(textoBusca);
        const bateGenero = generoSelecionado === "" || filme.genero === generoSelecionado;
        return bateTitulo && bateGenero;
    });
    renderizarTabela(filmesFiltrados);
}
function popularFiltroGenero() {
    const generosUnicos = [...new Set(filmes.map(f => f.genero))];
    selectFiltroGenero.innerHTML = '<option value="">Todos os gêneros</option>';
    for (const genero of generosUnicos) {
        const opcao = document.createElement("option");
        opcao.value = genero;
        opcao.textContent = genero;
        selectFiltroGenero.appendChild(opcao);
    }
}
function cadastrarOuAtualizar(evento) {
    evento.preventDefault();
    const dados = {
        titulo: inputTitulo.value.trim(),
        diretor: inputDiretor.value.trim(),
        ano: Number(inputAno.value),
        genero: inputGenero.value.trim(),
        avaliacao: Number(inputAvaliacao.value),
        capa: "images/sem-capa.jpg"
    };
    if (!dados.titulo || !dados.diretor || !dados.genero) {
        alert("Preencha todos os campos.");
        return;
    }
    if (idEmEdicao === null) {
        const novoFilme = { id: proximoId, ...dados };
        filmes.push(novoFilme);
        proximoId++;
    }
    else {
        filmes = filmes.map(f => f.id === idEmEdicao ? { ...f, ...dados } : f);
        idEmEdicao = null;
        btnSalvar.textContent = "Cadastrar";
    }
    form.reset();
    renderizarTabela();
}
function editarFilme(id) {
    const filme = filmes.find(f => f.id === id);
    if (!filme)
        return;
    inputTitulo.value = filme.titulo;
    inputDiretor.value = filme.diretor;
    inputAno.value = String(filme.ano);
    inputGenero.value = filme.genero;
    inputAvaliacao.value = String(filme.avaliacao);
    idEmEdicao = id;
    btnSalvar.textContent = "Atualizar";
}
function excluirFilme(id) {
    const confirmar = confirm("Excluir este filme?");
    if (!confirmar)
        return;
    filmes = filmes.filter(f => f.id !== id);
    renderizarTabela();
}
inputFiltroTitulo.addEventListener("input", aplicarFiltros);
selectFiltroGenero.addEventListener("change", aplicarFiltros);
form.addEventListener("submit", cadastrarOuAtualizar);
renderizarTabela();
popularFiltroGenero();
window.editarFilme = editarFilme;
window.excluirFilme = excluirFilme;
