<?php
$conn = mysqli_connect("localhost", "root", "", "login");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
} else {
    echo "Conexão estabelecida com sucesso!";
}
?>