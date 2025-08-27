let repoManifest = []
// A variavel repoManifest é uma lista de caminhos dos arquivos e diretorios do banquinho seus respectivos tipos (dir ou file)


// Listagem dos arquivos
function listFiles(path = "") {
    const container = document.getElementById("file-list") // html que vai listar as representações dos arquivos e diretorios
    const viewer = document.getElementById("viewer") // Container onde vai ser renderizado os conteúdos dos arquivos
    container.innerHTML = "" // Serve para "limpar" a listagem anterior

    viewer.innerHTML = path ? `<h2>${path}</h2>` : "<h2>Bem vindo ao site do Banquinho</h2>" // Se não for a página inicial vai mostrar o caminho que o usuário está

    // Botão de voltar
    if (path !== ""){ // Só pode voltar se não estiver dentro de alguma pasta ou arquivo
        const upPath = path.split("/").slice(0, -1).join("/") // Esse código vai "quebrar" em uma array apenas com os nomes do caminho e sem as / depois vai excluir a ultima e vai juntar todos com / entre eles
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.textContent = "📁 .."
        a.href = `#/${encodeURIComponent(upPath)}` // Meio que "traduz" o upPath com / pra um código que funciona na url (ja que não são pastas criadas de verdade e sim infos num arquivo json)
        li.appendChild(a);
        container.appendChild(li);
    }

    const depth = path === "" ? 0 : path.split("/").length // Aqui ele checa a profundidade do caminho, a home é profundidade 0 por exemplo e psi/ é profundidade 1

    const displayItems = repoManifest.filter(item => { // "displayItems" são os diretorios e os arquivos que devem ser mostrados na tela dado um certo path
        if (depth === 0){ // Se path === "" ou seja, está na raiz
            return !item.path.includes("/") && item.path !== "static" // retorna todos os itens que estão na raiz e que não é o "static"
        }
        return item.path.startsWith(path + "/") && item.path.split("/").length === depth + 1 // Se o usuário não estiver na raiz (depth > 0) 
        // então ele checar todos os items dentro da dir atual e checa se esses itens estão apenas 1 nivel abaixo, exemplo:
        // se o usuário estiver na pasta PSI, vai mostrar só a pasta flask e não vai mostrar o que tem dentro de flask sem abrir a pasta flask
    });
    
    displayItems.forEach(item => { // Gera a parte do html dos items 
        const li = document.createElement("li")
        const a = document.createElement("a")
        const itemName = item.path.split("/").pop()
        a.textContent = item.type === "dir" ? "📁 " + itemName : "📄 " + itemName
        a.href = `#/${encodeURIComponent(item.path)}`;
        li.appendChild(a);
        container.appendChild(li);
    });
}

// Visualização de arquivos
async function viewFile(path) {
    const viewer = document.getElementById("viewer");
    const container = document.getElementById("file-list");
    container.innerHTML = "";

    const ext = path.split(".").pop().toLowerCase()
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp']

    if (imageExtensions.includes(ext)) { // Renderizar imagens no site
        renderImage(path)
    } else {
        const encodedPath = path.split('/').map(encodeURIComponent).join('/');
        const response = await fetch(encodedPath);
        const text = await response.text();

        if (['md', 'markdown', 'txt'].includes(ext)) {
            renderMarkdown(text, path)
        } else {
            renderCode(text, path, ext)
        }
    }
    
}

// Função pra criar botão voltar
function renderBackButton(path) {
    const upPath = path.split("/").slice(0, -1).join("/");
    return `<a href="#/${encodeURIComponent(upPath)}" 
        style="display:inline-block; margin-bottom:15px; 
        text-decoration:none; background:#f0f0f0; 
        padding:6px 12px; border-radius:6px;">📁 ..</a>`;
}

// Renderização de imagens
function renderImage(path) {
    const viewer = document.getElementById("viewer");
    viewer.innerHTML = `
        <h2>${path}</h2>
        ${renderBackButton(path)}
        <img src="${path}" alt="${path}">
    `;
}

// Renderização do código
function renderCode(text, path, ext) { // Tem um bug e acho que é aqui
    let lang = "plaintext";
    if (["py"].includes(ext)) lang = "python";
    else if (["js"].includes(ext)) lang = "javascript";
    else if (["html", "htm"].includes(ext)) lang = "html";
    else if (["css"].includes(ext)) lang = "css";

    const viewer = document.getElementById("viewer");
    viewer.innerHTML = `
        <h2>${path}</h2>
        ${renderBackButton(path)}
        <pre><code class="language-${lang}">${escapeHtml(text)}</code></pre>
    `;

    hljs.highlightAll();
}

// Renderização do markdown
// Aqui tenho que admitir que foi o chat que fez porque não entendi nada dessa parte
function renderMarkdown(markdown, path) {
    markdown = tratarBlocosEspeciais(markdown);
    const html = marked.parse(markdown, {
        highlight: (code, lang) => {
            const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language: validLang }).value;
        }
    });

    const viewer = document.getElementById("viewer");
    viewer.innerHTML = `
        <h2>${path}</h2>
        ${renderBackButton(path)}
        ${html}
    `;
    // Adiciona títulos aos blocos especiais
    document.querySelectorAll('.note').forEach(el => {
        el.insertAdjacentHTML('afterbegin', '<strong style="display:block; margin-bottom:0.5em">Nota</strong>');
    });
    document.querySelectorAll('.important').forEach(el => {
        el.insertAdjacentHTML('afterbegin', '<strong style="display:block; margin-bottom:0.5em">Importante</strong>');
    });
    document.querySelectorAll('.tip').forEach(el => {
        el.insertAdjacentHTML('afterbegin', '<strong style="display:block; margin-bottom:0.5em">Dica</strong>');
    });
    document.querySelectorAll('.warning').forEach(el => {
        el.insertAdjacentHTML('afterbegin', '<strong style="display:block; margin-bottom:0.5em">Atenção</strong>');
    });
}

// Tratamento de blocos especiais em Markdown 
function tratarBlocosEspeciais(markdown) {
    const patterns = [
        { tag: 'NOTE', className: 'note' },
        { tag: 'TIP', className: 'tip' },
        { tag: 'WARNING', className: 'warning' },
        { tag: 'IMPORTANT', className: 'important' }
    ];

    patterns.forEach(p => {
        const inlineRegex = new RegExp(`^\\[!${p.tag}\\][ \\t]*(.+)$`, 'gm');
        const blockRegex = new RegExp(`\\[!${p.tag}\\][ \\t]*\\n([\\s\\S]*?)(?=\\n{2,}|$)`, 'g');
        markdown = markdown.replace(inlineRegex, `<div class="${p.className}">$1</div>`);
        markdown = markdown.replace(blockRegex, `<div class="${p.className}">$1</div>\n`);
    });

    return markdown;
}


function router() { //Modifica a url do site pra funcionar bonitinho
    const hash = decodeURIComponent(window.location.hash.slice(2));

    if (hash === "") {
        listFiles("")
        return
    }

    const item = repoManifest.find(i => i.path === hash)

    if (item) {
        if (item.type === 'dir') listFiles(hash)
        else viewFile(hash)
    } else {
        listFiles("")
    }
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
} // Pedi pro chat fazer um estilo melhor e ele disse pra colocar isso no código (não faço ideia doq isso faz)


async function init() {
    try {
        const response = await fetch('manifest.json');
        repoManifest = await response.json();

        // Ordena diretórios antes de arquivos
        repoManifest.sort((a, b) => {
            if (a.type === 'dir' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'dir') return 1;
            return a.path.localeCompare(b.path);
        });

        window.addEventListener("hashchange", router);
        router();
    } catch (error) {
        document.body.innerHTML = `
            <h1>Erro</h1>
            <p>Não foi possível carregar o arquivo <code>manifest.json</code>. 
            Certifique-se de que ele foi gerado e está na raiz do projeto.</p>
        `;
        console.error(error);
    }
}

init();
