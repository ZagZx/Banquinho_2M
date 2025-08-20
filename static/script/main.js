async function getTutorial(path) {
    try {
        const res = await fetch(`https://api.github.com/repos/livialop/banquinho/contents/${path}`);
        if (!res.ok) throw new Error(`Erro ao buscar arquivo: ${res.status}`);

        const data = await res.json();
        const decoded = atob(data.content);
        return decoded;
    } catch (err) {
        console.error(err);
        return `Erro ao carregar o conteúdo: ${err.message}`;
    }
}

async function renderTutorial() {
    const conteudoMarkdown = await getTutorial("ics/sitenoar.md");
    const htmlConvertido = marked.parse(conteudoMarkdown);
    const divo = document.getElementById('divo');
    divo.innerHTML = htmlConvertido;
}

renderTutorial();