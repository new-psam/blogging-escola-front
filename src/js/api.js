const BASE_URL = 'http://localhost:3000';

async function login(email, senha) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, senha }),
    });
    return response.json();
}

async function register(dados) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    });
    return response.json();
}

async function getPosts() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();

}

async function createPost(postData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
    });
    return response; // retorna a resposta completa para checar status
}

async function deletePost(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
}

async function searchPosts(query) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/posts/search?q=${query}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
}

//Exportação para o Jest funcionar (Node.js)
if (typeof module !== 'undefined') {
    module.exports = { login, register, getPosts, createPost, deletePost, searchPosts };
}