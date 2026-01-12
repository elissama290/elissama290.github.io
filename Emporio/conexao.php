<?php
$host = "localhost";
$user = "root";     // seu usuário do MySQL
$pass = "";         // sua senha
$db = "emporio_barboza";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$total = 0;
foreach ($data as $item) {
    $total += $item['preco'] * $item['qtd'];
}

$conn->query("INSERT INTO pedidos (total) VALUES ($total)");
$pedido_id = $conn->insert_id;

foreach ($data as $item) {
    $conn->query("INSERT INTO pedido_itens (pedido_id, produto_id, quantidade)
                VALUES ($pedido_id, {$item['id']}, {$item['qtd']})");
}

echo "Pedido salvo com sucesso! Total: R$ " . number_format($total, 2, ',', '.');
$conn->close();
?>