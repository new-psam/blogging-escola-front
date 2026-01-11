/**
 * @jest-environment jsdom
 */

// Simula o localStorage e location antes de importar o arquivo, 
// pois o student.js tenta ler o token logo no início.

const localStorageMock = {
    getItem: jest.fn().mockReturnValue('fake-token'),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {value: localStorageMock });

// 2. Mock do console.error para silenciar o aviso "Not implemented: navigation"
// Isso acontece porque o JSDOM não suporta navegação real, mas nosso código tenta redirecionar.
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (args[0] && args[0].includes && args[0].includes('Not implemented: navigation')) {
            return; // Ignora esse erro específico
        }
        originalConsoleError(...args);
    };
});

afterAll(() => {
    console.error = originalConsoleError; // Restaura o console normal
});


// Agora sim importamos a função
const { renderPosts } = require('../src/js/student');

describe('Testes de Manipulação do DOM (Student)', () => {

    beforeEach(() => {
        // Limpa o HTML antes de cada teste
        document.body.innerHTML = '<div id="posts-list"></div>';
    });

    it ('Deve renderizar uma mensagem quando a lista de posts estiver vazia', () => {
        renderPosts([]);

        const list = document.getElementById('posts-list');
        expect(list.innerHTML).toContain('Nenhum post encontrado.');
    });

    it ('Deve renderizar cards de posts corretamente', () => {
        const postsMock = [
            {
                _id: '123',
                titulo: 'Aula de História',
                conteudo: 'Conteúdo sobre Roma Antiga...',
                autor: 'Prof. Xavier',
                dataCriacao: new Date().toISOString()
            },
            {
                _id: '456',
                titulo: 'Aula de Matemática',
                conteudo: 'Equações de segundo grau...',
                autor: 'Prof. Xavier',
                dataCriacao: new Date().toISOString()
            }
        ];

        renderPosts(postsMock);

        // Verifica se criou 2 cards
        const cards = document.querySelectorAll('.post-card');
        expect(cards.length).toBe(2);

        // Verifica se. o título do primeiro post está correto e é um link
        const primeiroTitulo = cards[0].querySelector('.post-title');
        expect(primeiroTitulo.textContent.trim()).toBe('Aula de História');
        expect(primeiroTitulo.getAttribute('href')).toBe('post-details.html?id=123');
    });

    it('Não deve quebrar se posts for null', () => {
    renderPosts(null);
    expect(document.body.innerHTML).toContain('Nenhum post');
    });
});