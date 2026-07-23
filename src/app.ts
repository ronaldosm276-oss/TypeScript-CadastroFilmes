
// ===== DEFINIÇÃO DO TIPO =====
// Isso é um "molde": diz que TODO filme no sistema precisa ter exatamente esses campos,
// com esses tipos. Se faltar um campo, ou o tipo estiver errado, o TypeScript recusa compilar.
interface Filme {
    id: number;
    titulo: string;
    diretor: string;
    ano: number;
    genero: string;
    avaliacao: number;
    capa: string;
}

// ===== "BANCO DE DADOS" EM MEMÓRIA =====
// Um array de objetos Filme. É aqui que TODOS os filmes ficam guardados
// enquanto a página está aberta. Some quando recarrega a página.
let filmes: Filme[] = [
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

// Controla qual ID o PRÓXIMO filme cadastrado vai receber.
// Começa em 11 porque já usamos os IDs de 1 a 10 acima.
let proximoId: number = 11;

// Guarda o ID do filme que está sendo editado no momento.
// null = ninguém está sendo editado (modo "cadastrar novo")
// um número = estamos editando o filme com esse ID
let idEmEdicao: number | null = null;

// ===== REFERÊNCIAS AOS ELEMENTOS DO HTML =====
// document.getElementById busca um elemento pelo id="..." no HTML.
// "as HTMLInputElement" diz ao TypeScript "trate isso como um input",
// pra podermos usar .value, .reset(), etc, sem erro de tipo.
const form = document.getElementById("form-filme") as HTMLFormElement;
const inputTitulo = document.getElementById("titulo") as HTMLInputElement;
const inputDiretor = document.getElementById("diretor") as HTMLInputElement;
const inputAno = document.getElementById("ano") as HTMLInputElement;
const inputGenero = document.getElementById("genero") as HTMLInputElement;
const inputAvaliacao = document.getElementById("avaliacao") as HTMLInputElement;
const corpoTabela = document.getElementById("corpo-tabela") as HTMLTableSectionElement;
const btnSalvar = document.getElementById("btn-salvar") as HTMLButtonElement;
const inputFiltroTitulo = document.getElementById("filtro-titulo") as HTMLInputElement;
const selectFiltroGenero = document.getElementById("filtro-genero") as HTMLSelectElement;

// ===== FUNÇÃO: DESENHAR A TABELA NA TELA =====
// Recebe uma lista de filmes pra mostrar. Se ninguém passar nada,
// usa o array "filmes" completo (valor padrão).
function renderizarTabela(listaParaExibir: Filme[] = filmes): void {
    // Apaga tudo que já estava desenhado na tabela, pra redesenhar do zero
    corpoTabela.innerHTML = "";

    // Percorre CADA filme da lista recebida, um de cada vez
    for (const filme of listaParaExibir) {
        // Cria uma nova linha <tr> de tabela (ainda vazia, só na memória)
        const linha = document.createElement("tr");

        // Preenche essa linha com o HTML de cada coluna,
        // usando os dados do filme atual (${filme.titulo}, etc)
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

        // Adiciona essa linha pronta dentro da tabela de verdade, na tela
        corpoTabela.appendChild(linha);
    }
}

// ===== FUNÇÃO: FILTRAR E ORDENAR =====
// Roda toda vez que o usuário digita na busca ou troca o filtro de gênero
function aplicarFiltros(): void {
    // Pega o texto digitado na busca, tudo em minúsculo, sem espaço nas pontas
    const textoBusca = inputFiltroTitulo.value.toLowerCase().trim();

    // Pega o gênero selecionado no dropdown ("" = "Todos os gêneros")
    const generoSelecionado = selectFiltroGenero.value;

    // .filter() cria um array NOVO, só com os filmes que passam no teste
    let filmesFiltrados = filmes.filter(filme => {
        // bateTitulo = true se o texto buscado aparece em algum lugar do título
        const bateTitulo = filme.titulo.toLowerCase().includes(textoBusca);

        // bateGenero = true se não escolheu gênero (mostra tudo) OU se bate exatamente
        const bateGenero = generoSelecionado === "" || filme.genero === generoSelecionado;

        // Só entra no resultado final se as DUAS condições forem verdadeiras
        return bateTitulo && bateGenero;
    });

    // Se o usuário clicou em algum cabeçalho pra ordenar...
    if (colunaOrdenada) {
        // .sort() reorganiza o array. Recebe uma função que compara 2 itens de cada vez (a e b)
        filmesFiltrados = filmesFiltrados.sort((a, b) => {
            // Pega o valor da coluna escolhida (ex: avaliacao) dos dois filmes sendo comparados
            const valorA = a[colunaOrdenada!];
            const valorB = b[colunaOrdenada!];

            // Se os dois valores forem número, subtrai (compara como número).
            // Senão, compara como texto usando localeCompare (entende acento correto)
            const comparacao = typeof valorA === "number" && typeof valorB === "number"
                ? valorA - valorB
                : String(valorA).localeCompare(String(valorB));

            // Se a direção for "asc" (crescente), mantém o resultado normal.
            // Se for "desc" (decrescente), inverte o sinal (troca positivo por negativo)
            return direcaoOrdenacao === "asc" ? comparacao : -comparacao;
        });
    }

    // Redesenha a tabela só com o resultado filtrado e ordenado
    renderizarTabela(filmesFiltrados);
}

// ===== FUNÇÃO: PREENCHER O DROPDOWN DE GÊNEROS =====
function popularFiltroGenero(): void {
    // filmes.map(f => f.genero) pega só o campo "genero" de cada filme, vira array de textos
    // new Set(...) remove duplicados automaticamente
    // [...algo] transforma o Set de volta em array normal
    const generosUnicos = [...new Set(filmes.map(f => f.genero))];

    // Reseta o dropdown, deixando só a opção "Todos os gêneros"
    selectFiltroGenero.innerHTML = '<option value="">Todos os gêneros</option>';

    // Pra cada gênero único encontrado, cria uma <option> nova e adiciona no dropdown
    for (const genero of generosUnicos) {
        const opcao = document.createElement("option");
        opcao.value = genero;
        opcao.textContent = genero;
        selectFiltroGenero.appendChild(opcao);
    }
}

// ===== FUNÇÃO: CADASTRAR NOVO FILME OU ATUALIZAR UM EXISTENTE =====
// Essa função faz as DUAS coisas, dependendo do valor de idEmEdicao
function cadastrarOuAtualizar(evento: Event): void {
    // Impede o comportamento padrão do formulário (que seria recarregar a página)
    evento.preventDefault();

    // Monta um objeto com os valores atuais dos campos do formulário.
    // Number(...) converte o texto do input pra número, já que inputs sempre devolvem string
    const dados = {
        titulo: inputTitulo.value.trim(),
        diretor: inputDiretor.value.trim(),
        ano: Number(inputAno.value),
        genero: inputGenero.value.trim(),
        avaliacao: Number(inputAvaliacao.value),
        capa: "images/sem-capa.jpg" // imagem padrão pra filme cadastrado pelo formulário
    };

    // Validação simples: se algum campo obrigatório estiver vazio, avisa e para aqui
    if (!dados.titulo || !dados.diretor || !dados.genero) {
        alert("Preencha todos os campos.");
        return;
    }

    // Se NINGUÉM está sendo editado (idEmEdicao é null) → modo CADASTRAR
    if (idEmEdicao === null) {
        // Cria um filme novo, juntando um id novo com os dados do formulário
        const novoFilme: Filme = { id: proximoId, ...dados };
        // Adiciona esse filme no final do array
        filmes.push(novoFilme);
        // Prepara o próximo id pra não repetir
        proximoId++;
    } else {
        // Modo ATUALIZAR: alguém está sendo editado
        // .map() percorre TODOS os filmes; no que bate o id, troca pelos dados novos;
        // nos outros, mantém exatamente como estava
        filmes = filmes.map(f =>
            f.id === idEmEdicao ? { ...f, ...dados } : f
        );
        // Sai do modo edição
        idEmEdicao = null;
        // Volta o texto do botão pro normal
        btnSalvar.textContent = "Cadastrar";
    }

    // Limpa os campos do formulário
    form.reset();
    // Redesenha a tabela com os dados atualizados
    renderizarTabela();
}

// ===== ORDENAÇÃO DAS COLUNAS =====

// "type" cria um tipo customizado: só aceita esses 5 valores de texto exatos.
// Isso evita erro de digitação — se você escrever "titulo2" em algum lugar, o TS acusa erro.
type ChaveOrdenavel = "titulo" | "diretor" | "ano" | "genero" | "avaliacao";

// Guarda qual coluna está ordenada agora (começa sem nenhuma = null)
let colunaOrdenada: ChaveOrdenavel | null = null;
// Guarda a direção atual da ordenação
let direcaoOrdenacao: "asc" | "desc" = "asc";

// Busca TODOS os <th> que têm o atributo data-coluna no HTML (todos os cabeçalhos clicáveis)
const thsOrdenaveis = document.querySelectorAll<HTMLTableCellElement>("th[data-coluna]");

// Roda quando o usuário clica em algum cabeçalho de coluna
function ordenarPor(coluna: ChaveOrdenavel): void {
    // Se clicou na MESMA coluna que já estava ordenada, inverte a direção
    if (colunaOrdenada === coluna) {
        direcaoOrdenacao = direcaoOrdenacao === "asc" ? "desc" : "asc";
    } else {
        // Se clicou numa coluna DIFERENTE, começa ordenando crescente
        colunaOrdenada = coluna;
        direcaoOrdenacao = "asc";
    }

    // Atualiza as setinhas visuais (▲ ou ▼)
    atualizarSetas();
    // Reaplica filtro + ordenação e redesenha a tabela
    aplicarFiltros();
}

// Atualiza qual cabeçalho mostra a seta, e em qual direção
function atualizarSetas(): void {
    // .forEach percorre cada <th> ordenável (parecido com for...of, mas específico de listas do DOM)
    thsOrdenaveis.forEach(th => {
        // Acha o <span> da seta dentro desse cabeçalho específico
        const seta = th.querySelector(".seta") as HTMLSpanElement;
        // Pega qual coluna esse <th> representa (guardado no atributo data-coluna do HTML)
        const coluna = th.dataset.coluna;

        // Se essa é a coluna ordenada atualmente, mostra a seta certa. Senão, deixa vazio.
        seta.textContent = coluna === colunaOrdenada
            ? (direcaoOrdenacao === "asc" ? "▲" : "▼")
            : "";
    });
}

// Conecta o evento de clique em CADA cabeçalho ordenável, de uma vez só
thsOrdenaveis.forEach(th => {
    const coluna = th.dataset.coluna as ChaveOrdenavel;
    // Quando clicar nesse <th> específico, chama ordenarPor() com a coluna certa
    th.addEventListener("click", () => ordenarPor(coluna));
});

// ===== FUNÇÃO: PREPARAR EDIÇÃO DE UM FILME =====
function editarFilme(id: number): void {
    // Procura, dentro do array, o ÚNICO filme cujo id bate com o que foi clicado
    const filme = filmes.find(f => f.id === id);

    // Se por algum motivo não achou (não deveria acontecer), para aqui sem quebrar o código
    if (!filme) return;

    // Preenche o formulário com os dados atuais desse filme
    inputTitulo.value = filme.titulo;
    inputDiretor.value = filme.diretor;
    inputAno.value = String(filme.ano);
    inputGenero.value = filme.genero;
    inputAvaliacao.value = String(filme.avaliacao);

    // Marca que agora estamos editando ESSE id específico
    idEmEdicao = id;
    // Troca o texto do botão pra deixar claro que é edição, não cadastro novo
    btnSalvar.textContent = "Atualizar";
}

// ===== FUNÇÃO: EXCLUIR UM FILME =====
function excluirFilme(id: number): void {
    // Mostra um popup de confirmação nativo do navegador
    const confirmar = confirm("Excluir este filme?");
    // Se o usuário clicou "Cancelar", para aqui sem excluir nada
    if (!confirmar) return;

    // .filter() cria um array novo com TODOS os filmes, EXCETO o que tem esse id
    filmes = filmes.filter(f => f.id !== id);
    // Redesenha a tabela sem o filme excluído
    renderizarTabela();
}

// ===== CONECTANDO OS EVENTOS =====

// Quando o texto de busca mudar (a cada tecla digitada), reaplica os filtros
inputFiltroTitulo.addEventListener("input", aplicarFiltros);
// Quando o dropdown de gênero mudar de valor, reaplica os filtros
selectFiltroGenero.addEventListener("change", aplicarFiltros);
// Quando o formulário for enviado (botão Cadastrar/Atualizar clicado), chama a função principal
form.addEventListener("submit", cadastrarOuAtualizar);

// ===== EXECUÇÃO INICIAL, AO CARREGAR A PÁGINA =====
renderizarTabela();       // Desenha a tabela pela primeira vez, com todos os filmes
popularFiltroGenero();    // Preenche o dropdown de gêneros

// ===== EXPONDO FUNÇÕES PARA O window =====
// Os botões "Editar"/"Excluir" no HTML usam onclick="editarFilme(...)",
// que procura essas funções dentro do objeto global "window".
// TypeScript não expõe funções globalmente por padrão, então forçamos isso aqui.
(window as any).editarFilme = editarFilme;
(window as any).excluirFilme = excluirFilme;