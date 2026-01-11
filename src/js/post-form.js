// 1. Declaramos as variáveis globais primeiro para evitar erros de referência
let postId = null;
let user = {};

window.onload = async function() {
    const token = localStorage.getItem('token');
    // Carrega o usuário do armazenamento
    user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'professor'){
        window.location.href = 'index.html';
        return;
    }


    // Verifica a URL para ver se tem um ID (ex: ?id=123)
    const params = new URLSearchParams(window.location.search);
    postId = params.get('id');

    // Decide se prepara a tela para EDITAR ou CRIAR
    if (postId) {
        prepareEditMode();
    }else{
        document.getElementById('page-title').innerText = 'Nova Postagem';
        document.getElementById('btn-save').innerText = 'Salvar Publicação';
    }
};

// Função auxiliar para carregar dados quando for Edição
async function prepareEditMode() {
    console.log("Modo Edição ativado para o ID:", postId); debugger

    document.getElementById('page-title').innerText = 'Editar Postagem';
    document.getElementById('btn-save').innerText = 'Atualizar Postagem';

    try {
        const post = await getPostById(postId);

        if(post.error){
            alert('Erro ao buscar post: ' + post.error);
            goBack()
            return;
        }

        // preencher os campos
        document.getElementById('titulo').value = post.titulo;
        document.getElementById('conteudo').value = post.conteudo;

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados do post!');
        goBack();
    }
}


function goBack() {
    window.location.href = 'teacher.html';
}


// 💾 Salva (criar ou editar)
async function handleSave() {
    const titulo = document.getElementById('titulo').value.trim();
    const conteudo = document.getElementById('conteudo').value.trim();

    if (!titulo || !conteudo) return alert('Preencha todos os campos!');

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

