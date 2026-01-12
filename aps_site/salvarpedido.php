<?php
// Permitir JSON e CORS para testes locais
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$dados = json_decode(file_get_contents("php://input"), true);

// Verifica se há itens no carrinho
if (empty($dados['carrinho'])) {
    echo json_encode(["status" => "erro", "mensagem" => "Carrinho vazio."]);
    exit;
}

// Simulação de salvamento no banco (pode substituir depois)
$carrinho = $dados['carrinho'];
$total = $dados['total'] ?? 0;

// Aqui futuramente você poderá conectar ao MySQL e salvar
// Exemplo (opcional):
// include('conexao.php');
// mysqli_query($con, "INSERT INTO pedidos (dados, total) VALUES (...)");

echo json_encode([
    "status" => "sucesso",
    "mensagem" => "Pedido recebido com " . count($carrinho) . " item(s)! Total: " . $total
]);

header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "unoce";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "erro", "mensagem" => "Erro de conexão: " . $conn->connect_error]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

if (empty($dados['itens']) || empty($dados['total'])) {
    echo json_encode(["status" => "erro", "mensagem" => "Carrinho vazio ou dados inválidos."]);
    exit;
}

// ⚙️ Simula cliente logado (por enquanto fixo: Ana Clara)
$id_cliente = 1;

// Cria o pedido
$sqlPedido = "INSERT INTO PEDIDOS (id_cliente, status, valor_total) VALUES (?, 'Pendente', ?)";
$stmt = $conn->prepare($sqlPedido);
$stmt->bind_param("id", $id_cliente, $dados['total']);
$stmt->execute();
$id_pedido = $stmt->insert_id;
$stmt->close();

// Insere os itens do pedido
foreach ($dados['itens'] as $item) {
    $id_produto = intval($item['id']);
    $quantidade = intval($item['quantity']);
    $preco = floatval($item['price']);

    $sqlItem = "INSERT INTO ITENS_PEDIDO (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sqlItem);
    $stmt->bind_param("iiid", $id_pedido, $id_produto, $quantidade, $preco);
    $stmt->execute();
    $stmt->close();

    // Atualiza o estoque
    $sqlEstoque = "UPDATE PRODUTOS SET estoque = estoque - ? WHERE id_produto = ?";
    $stmt = $conn->prepare($sqlEstoque);
    $stmt->bind_param("ii", $quantidade, $id_produto);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(["status" => "sucesso", "mensagem" => "Pedido salvo com sucesso no banco!", "id_pedido" => $id_pedido]);

$conn->close();
?>