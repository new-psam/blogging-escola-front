if (!localStorage.getItem('token') || user.role !== 'professor') {
    window.location.href = 'index.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

async function loadAdminPosts() {
    const posts = await getPosts();
    const list = document.getElementById('posts-list');
    list.innerHTML = '';

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <div>
                    <div class="post-title">${post.titulo}</div>
                    <div class="post-meta">${new Date(post.dataCriacao).toLocaleDateString()} - ${post.autor}</div>
                    <div class="post-content">${post.conteudo}</div>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

async function handleCreate() {
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;

    if (!titulo || !conteudo) return alert('Preencha tudo!');

    const res = await createPost({
        titulo,
        conteudo,
        autor: user.nome || 'Professor'
    });

    if (res.ok) {
        alert('Post criado!');
        document.getElementById('titulo').value = '';
        document.getElementById('conteudo').value = '';
        loadAdminPosts();
    }else {
        alert('Erro ao criar post (Token inválido oi expirado');
    }
}

async function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir?')) {
        await deletePost(id);
        loadAdminPosts();
    }
}

window.onload = loadAdminPosts;