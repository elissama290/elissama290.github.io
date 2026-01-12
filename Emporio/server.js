// =======================================================
// B. CÓDIGO DO SERVIDOR (BACKEND) - Roda no Servidor
// =======================================================
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Adicionado para permitir requisições do Frontend

const app = express();
const PORT = 3000;
const JWT_SECRET = 'sua_chave_secreta_e_longa';

// --- Configuração da Conexão com o Banco de Dados ---
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sua_senha_do_bd',
    database: 'emporio_barboza_db'
};

// --- Middlewares ---
app.use(express.json());
// O CORS é essencial se o seu Frontend e Backend estiverem em domínios diferentes
app.use(cors());

// --- Rota de REGISTRO (/api/auth/signup) ---
app.post('/api/auth/signup', async (req, res) => {
    const { nome, email, senha } = req.body;
    // ... (restante do código de registro que você já enviou) ...

    // (O CÓDIGO DE REGISTRO ESTÁ OK AQUI)
    try {
        const connection = await mysql.createConnection(dbConfig);
        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);

        const [result] = await connection.execute(
            'INSERT INTO USUARIOS (nome, email, senha_hash) VALUES (?, ?, ?)',
            [nome, email, senha_hash]
        );

        const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuário registrado com sucesso!', token: token });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        }
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// --- Rota de LOGIN (/api/auth/login) ---
app.post('/api/auth/login', async (req, res) => {
    // ... (restante do código de login que você já enviou) ...

    // (O CÓDIGO DE LOGIN ESTÁ OK AQUI)
    const { email, senha } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT id, email, senha_hash FROM USUARIOS WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const usuario = rows[0];
        const isMatch = await bcrypt.compare(senha, usuario.senha_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido!', token: token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// --- Rota de Exemplo: Salvar Contato (Simulação de um novo endpoint) ---
app.post('/api/contato', async (req, res) => {
    // Neste ponto, você conectaria ao BD e salvaria o nome/email/mensagem
    console.log("Contato recebido:", req.body);
    // Simplesmente retorna OK para o Frontend por enquanto
    res.status(200).json({ message: "Contato recebido." });
});


// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Middleware para verificar o Token JWT
function verificarToken(req, res, next) {
    // Busca o token no cabeçalho 'Authorization' (ex: Bearer token_aqui)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token de autenticação ausente.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }
        req.userId = user.userId; // Adiciona o ID do usuário à requisição
        next();
    });
}
// --- Rota de Finalização da Compra (/api/pedidos) ---
app.post('/api/pedidos', verificarToken, async (req, res) => {
    // O userId foi adicionado pelo middleware verificarToken
    const usuario_id = req.userId;
    const { itens_carrinho } = req.body;

    if (!itens_carrinho || itens_carrinho.length === 0) {
        return res.status(400).json({ message: 'Carrinho vazio. Adicione produtos para finalizar.' });
    }

    let connection;
    try {
        // Inicia a Conexão e a Transação
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        let valor_total = 0;

        // 1. Processar e Validar cada item do carrinho
        for (const item of itens_carrinho) {
            const [rows] = await connection.execute(
                'SELECT preco, estoque FROM PRODUTOS WHERE id = ?',
                [item.id]
            );

            if (rows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: `Produto ID ${item.id} não encontrado.` });
            }

            const produto = rows[0];

            if (produto.estoque < item.quantidade) {
                await connection.rollback();
                return res.status(400).json({ message: `Estoque insuficiente para ${item.nome}.` });
            }

            // O preço final do item deve ser o preço registrado no BD, não o enviado pelo cliente
            const preco_real = parseFloat(produto.preco);
            valor_total += preco_real * item.quantidade;

            // 2. Atualizar o estoque
            await connection.execute(
                'UPDATE PRODUTOS SET estoque = estoque - ? WHERE id = ?',
                [item.quantidade, item.id]
            );
        }

        // 3. Criar o Pedido Principal (tabela PEDIDOS)
        const [pedidoResult] = await connection.execute(
            'INSERT INTO PEDIDOS (usuario_id, valor_total) VALUES (?, ?)',
            [usuario_id, valor_total]
        );
        const pedido_id = pedidoResult.insertId;

        // 4. Inserir os Itens do Pedido (tabela ITENS_PEDIDO)
        for (const item of itens_carrinho) {
            const preco_unitario = item.preco; // Usamos o preço validado ou buscado acima
            await connection.execute(
                'INSERT INTO ITENS_PEDIDO (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
                [pedido_id, item.id, item.quantidade, preco_unitario]
            );
        }

        // 5. Finalizar a Transação
        await connection.commit();
        res.json({ message: 'Compra finalizada com sucesso!', pedido_id: pedido_id, total: valor_total });

    } catch (error) {
        // Em caso de erro, desfaz todas as alterações no BD
        if (connection) {
            await connection.rollback();
        }
        console.error('Erro na finalização da compra:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao processar o pedido.' });
    } finally {
        // Fecha a conexão
        if (connection) {
            connection.end();
        }
    }
});