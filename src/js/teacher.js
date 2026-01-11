
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!localStorage.getItem('token') || user.role !== 'professor') {
    window.location.href = 'index.html';
}


// Exibe nome do Professor
document.getElementById('user-name').innerText = `Olá, ${user.nome || 'Professor'}`;

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function goToCreate() {
    // Vai para a página de formulário SEM id (Modo Criação)
    window.location.href = 'post-form.html';
}

function renderList(posts) {
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
            <div style="display:flex; justify-content:space-between; align-items: center;">
                <div style="flex: 1; margin-right: 15px;">
                    <a href="post-details.html?id=${post._id}" class="post-title" style="text-decoration:none; color:#333;">
                        ${post.titulo}
                    </a>
                    <div class="post-meta">
                        ${new Date(post.dataCriacao).toLocaleDateString()} | Autor: ${post.autor}
                    </div>
                </div>

                <div style="display:flex; gap: 5px;">
                    <button
                        style="background-color: #ffc107; color: #000; width: auto; padding: 5px 15px;"
                        onclick="window.location.href='post-form.html?id=${post._id}'">
                        Editar
                    </button>

                    <button
                        class="delete"
                        style="width: auto; padding: 5px 15px;"
                        onclick="handleDelete('${post._id}')">
                        Excluir
                    </button>
                </div>
                    
            </div>
        `;
        list.appendChild(div);
    });
}


async function loadAdminPosts() {
    try {
        const posts = await getPosts();
        renderList(posts);
    } catch (err) {
        console.error(err);
    }

}

async function doSearch() {
    const query = document.getElementById('search').value.trim();
    if(!query) return loadAdminPosts(); // se vazio carrega tudo

    try {
        const posts = await searchPosts(query);
        renderList(posts);
    } catch (err) {
        alert('Erro na busca!');
    }
    
}

async function handleDelete(id) {
    if (confirm('Atenção essa ação não pode ser desfeita. Tem certeza que deseja excluir?')) {
        await deletePost(id);
        // Recarrega a lista atual (se estiver em busca, refaz a busca, senão carrega tudo)
        const query = document.getElementById('search').value;
        if (query) doSearch();
        else loadAdminPosts();
    }
}
// Inicialização
window.onload = loadAdminPosts;