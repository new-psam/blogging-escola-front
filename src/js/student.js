
// Verifica se está logado
if (!localStorage.getItem('token'))window.location.href = 'index.html';

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function renderPosts(posts) {
    const list = document.getElementById('posts-list');
    list.innerHTML = '';

    if (!posts || posts.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#666;">Nenhum post encontrado.</p>';
        return;
    }

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post-card';
        div.innerHTML = `
            <a href="post-details.html?id=${post._id}" class="post-title" style="text-decoration:none; color:#333;display:block;">
                ${post.titulo}
            </a>
            <div class="post-meta">Por:${post.autor} | Em: ${new Date(post.dataCriacao).toLocaleDateString()}</div>
            <div class="post-content">${post.conteudo}</div>
        `;
        list.appendChild(div);
    });
}

async function loadPosts() {
    try {
        const posts = await getPosts();
        renderPosts(posts);
    } catch (err) {
        console.error(err);
    }
}

async function doSearch() {
    const query = document.getElementById('search').value;
    if(!query) return loadPosts();

    const posts = await searchPosts(query);
    renderPosts(posts);
}

// Carrega posts ao abrir a página
window.onload = loadPosts;

// Exportações para testes (Npde.js)
if(typeof module !== 'undefined') {
    module.exports = { renderPosts };
}