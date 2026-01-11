function toggleForms() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const data = await login(email, senha);

        if (data.token){
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redireciona baseado no papel (role)
            if (data.user.role === 'professor'){
                window.location.href = 'teacher.html';
            }else {
                window.location.href = 'student.html';
            }
        } else {
            alert('Erro: ' + (data.error || 'Login falhou'));
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

async function handleRegister() {
    const nome = document.getElementById('reg-nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;
    const role = document.getElementById('reg-role').value;

    const data = await register({nome, email, senha, role});
    if (data.user) {
        alert('Cadastro realizado! Faça login.');
        toggleForms();
    }else {
        alert('Erro ao cadastrar!');
    }
}