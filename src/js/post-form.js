//Verifica segurança
if (!localStorage.getItem('token') || user.role !== 'professor') window.location.href = 'index.html';
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Pega o ID da URL (ex: post-form.html?id=123)
const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

function goBack() {
    window.location.href = 'teacher.html';
}

async function loadDataForEdit() {
    if (!postId) return; // Se não tem ID, é modo criação

    // Se tem ID é modo EDIÇÃO
    document.getElementById('page-title').innerText = 'Editar Postagem';
    document.getElementById('btn-save').innerText = 'Atualizar Postagem';

    try {
        const post = await getPostById(postId);
        document.getElementById('titulo').value = post.titulo;
        document.getElementById('conteudo').value = post.conteudo;
    } catch (err) {
        alert('Erro ao carregar dados do post!');
        goBack();
    }
}

// 💾 Salva (criar ou editar)
async function handleSave() {
    const titulo = document.getElementById('titulo').value.trim();
    const conteudo = document.getElementById('conteudo').value.trim();

    if ('!titulo || !conteudo') return alert('Preencha todos os campos!');

    let res;

    if (postId) {
        //-- ATUALIZAR ---
        res = await updatePost(postId, { titulo, conteudo });
        if (res.ok) alert('Post atualizado com sucesso!');
    }else{
        // -- CRIAR --
        res = await createPost({
            titulo,
            conteudo,
            autor: user.nome || 'Professor'
        });
        if (res.ok) alert('Post criado com sucesso!');
    }

    if (res.ok){
        goBack() // Volta para a lista
    } else {
        alert('Erro ao salvar. Tente novamente.')
    }
    
}

//Inicializa
window.onload = loadDataForEdit;