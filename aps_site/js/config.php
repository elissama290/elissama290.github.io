<?php
$host = "localhost";
$user = "root"; // altere se seu usuário for diferente
$pass = "";
$dbname = "unoce";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>