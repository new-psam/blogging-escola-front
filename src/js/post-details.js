// verificação de segurança, precisa estar logado
if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

// Função para voltar ã página anterior (seja aluno ou professor)
function goBack() {
    window.history.back();
}

async function loadPostDetails() {
    //2. Pega ID da URL (E: post-details.html?id=456)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('Post não especificado!');
        window.location.href = 'student.html'; // fallback padrão
        return;
    }

    try {
        // Busca API
        const post = await getPostById(id);

        // Verifica se houve err
        if (post.error) {
            alert('Erro: ' + post.error)
            goBack();
            return;
        }

        //3. preenche os dados na tela
        document.getElementById('loading').classList.add('hidden'); // Esconde carregando
        document.getElementById('post-content').classList.remove('hidden');

        document.getElementById('detail-title').innerText = post.titulo;
        document.getElementById('detail-author').innerText = post.autor || 'Desconhecido';

        // Formata a data para padrão brasileiro
        const dataFormatada = new Date(post.dataCriacao).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        document.getElementById('detail-date').innerText = dataFormatada;
        document.getElementById('detail-body').innerText = post.conteudo;
    } catch (err) {
        console.error(err);
        alert('Erro ao carregar post. Tente novamente mais tarde.')
    }
}

//Inicia ao carregar a página
window.onload = loadPostDetails;