const { login, getPosts } = require('../src/js/api');

// Simula o fetch globalmente (Mock)
global.fetch = jest.fn()


describe('API Service', () => {
    beforeEach(()=> {
        fetch.mockClear();

        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'fake-token', user: { role: 'professor'}}),
        });
    });

    it('Deve chamar o fetch de login com os parâmetros corretos', async () => {
        await login('teste@email.com', '123456');

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ email: 'teste@email.com', senha: '123456'}),
        });
    });

    it('Deve buscar posts passando o token no header', async () => {
        // Simulando que já temos um token salvo
        const localStorageMock = {
            getItem: jest.fn().mockReturnValue('token-teste'),
        };
        // Sobrescreve o localStorage global para este teste
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        })
        await getPosts();

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/posts', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                'Authorization': 'Bearer token-teste'
            })
        }));
    });
});