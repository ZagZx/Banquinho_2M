let repoManifest = [];

// Listagem das files
function listFiles(path = "") {
    const container = document.getElementById("file-list");
    const viewer = document.getElementById("viewer");
    container.innerHTML = "";

    viewer.innerHTML = path
        ? `<h2>${path}</h2>`
        : "<h2>Bem vindo ao site do Banquinho</h2>";

    // Botão de voltar
    if (path !== "") {
        const upPath = path.split("/").slice(0, -1).join("/");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = "📁 ..";
        a.href = `#/${encodeURIComponent(upPath)}`;
        li.appendChild(a);
        container.appendChild(li);
    }

    const depth = path === "" ? 0 : path.split("/").length;

    const items = repoManifest.filter(item => {
        if (path === "") return !item.path.includes("/");
        return item.path.startsWith(path + "/") && item.path.split("/").length === depth + 1;
    });

    items.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const itemName = item.path.split("/").pop();
        a.textContent = item.type === "dir" ? "📁 " + itemName : "📄 " + itemName;
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

    const ext = path.split(".").pop().toLowerCase();
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'];

    if (imageExtensions.includes(ext)) {
        renderImage(path);
    } else {
        const encodedPath = path.split('/').map(encodeURIComponent).join('/');
        const response = await fetch(encodedPath);
        const text = await response.text();

        if (['md', 'markdown', 'txt'].includes(ext)) {
            renderMarkdown(text, path);
        } else {
            renderCode(text, path, ext);
        }
    }
}

// 🔹 Função utilitária pra criar botão voltar
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
function renderCode(text, path, ext) {
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
    // teste
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


function router() {
    const hash = decodeURIComponent(window.location.hash.slice(2));

    if (hash === "") {
        listFiles("");
        return;
    }

    const item = repoManifest.find(i => i.path === hash);

    if (item) {
        if (item.type === 'dir') listFiles(hash);
        else viewFile(hash);
    } else {
        listFiles("");
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
