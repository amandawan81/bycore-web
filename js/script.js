const carrinho = [];

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.aberto")) {
        document.body.classList.remove("modal-aberto");
    }
}

function abrirProduto(produto) {
    const imagem = produto.querySelector("img");
    const nome = produto.dataset.nome;
    const preco = Number(produto.dataset.preco);
    const descricao = produto.dataset.descricao;

    document.getElementById("detalheImagem").src = imagem.src;
    document.getElementById("detalheImagem").alt = nome;
    document.getElementById("detalheNome").textContent = nome;
    document.getElementById("detalheDescricao").textContent = descricao;
    document.getElementById("detalhePreco").textContent = formatarPreco(preco);

    document.getElementById("botaoAdicionarDetalhe").onclick = function () {
        adicionarCarrinho(nome, preco, imagem.src);
    };

    abrirModal("modalProduto");
}

function adicionarCarrinho(nome, preco, imagem) {
    const produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome,
            preco,
            imagem,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    fecharModal("modalProduto");
    abrirCarrinho();
}

function abrirCarrinho() {
    atualizarCarrinho();
    abrirModal("modalCarrinho");
}

function verCarrinho() {
    abrirCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("listaCarrinho");
    const totalElemento = document.getElementById("totalCarrinho");
    const quantidadeElemento = document.getElementById("quantidade");

    lista.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="vazio">Seu carrinho está vazio.</p>';
    }

    carrinho.forEach((produto, indice) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");
        item.className = "item-carrinho";

        const imagem = document.createElement("img");
        imagem.src = produto.imagem;
        imagem.alt = produto.nome;

        const info = document.createElement("div");
        info.className = "item-info";

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(produto.preco);

        const controles = document.createElement("div");
        controles.className = "controles-qtd";

        const diminuir = document.createElement("button");
        diminuir.type = "button";
        diminuir.textContent = "−";
        diminuir.setAttribute("aria-label", "Diminuir quantidade");
        diminuir.addEventListener("click", () => alterarQuantidade(indice, -1));

        const qtd = document.createElement("span");
        qtd.textContent = produto.quantidade;

        const aumentar = document.createElement("button");
        aumentar.type = "button";
        aumentar.textContent = "+";
        aumentar.setAttribute("aria-label", "Aumentar quantidade");
        aumentar.addEventListener("click", () => alterarQuantidade(indice, 1));

        controles.append(diminuir, qtd, aumentar);

        const remover = document.createElement("button");
        remover.type = "button";
        remover.className = "remover";
        remover.textContent = "Remover";
        remover.addEventListener("click", () => removerProduto(indice));

        info.append(nome, preco, controles, remover);

        const subtotalElemento = document.createElement("strong");
        subtotalElemento.className = "subtotal-item";
        subtotalElemento.textContent = formatarPreco(subtotal);

        item.append(imagem, info, subtotalElemento);
        lista.appendChild(item);
    });

    totalElemento.textContent = formatarPreco(total);
    quantidadeElemento.textContent = quantidadeTotal;
}

function alterarQuantidade(indice, variacao) {
    carrinho[indice].quantidade += variacao;

    if (carrinho[indice].quantidade <= 0) {
        carrinho.splice(indice, 1);
    }

    atualizarCarrinho();
}

function removerProduto(indice) {
    carrinho.splice(indice, 1);
    atualizarCarrinho();
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    alert("Esta é uma demonstração. O pagamento ainda não está integrado.");
}

// Liga os cliques das fotos, nomes e botões dos produtos.
document.querySelectorAll(".produto").forEach(produto => {
    const imagem = produto.querySelector("img");
    const nome = produto.querySelector("h3");
    const botao = produto.querySelector(".comprar");

    imagem.addEventListener("click", () => abrirProduto(produto));
    nome.addEventListener("click", () => abrirProduto(produto));

    botao.addEventListener("click", () => {
        const imagemProduto = produto.querySelector("img");
        adicionarCarrinho(
            produto.dataset.nome,
            Number(produto.dataset.preco),
            imagemProduto.src
        );
    });
});

// Fecha ao clicar no fundo escuro ou nos botões X.
document.querySelectorAll("[data-fechar]").forEach(botao => {
    botao.addEventListener("click", () => fecharModal(botao.dataset.fechar));
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", evento => {
        if (evento.target === modal) {
            fecharModal(modal.id);
        }
    });
});

// Fecha os pop-ups com a tecla Esc.
document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        document.querySelectorAll(".modal.aberto").forEach(modal => {
            fecharModal(modal.id);
        });
    }
});

document.getElementById("botaoFinalizar").addEventListener("click", finalizarCompra);

// Atualiza o contador inicial.
atualizarCarrinho();
