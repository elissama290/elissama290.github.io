<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>documento</title>
    <link rel="strylesheet" href="style.css">
</head>

<body>
    <div class="form">
        <form action="" method="post">
            <h2>Registro</h2>
            <p class="msg"></p>
            <div class="form-group">
                <input type="text" name="nome" placeholder="Informe seu nome" class="form-control" require>
            </div>
            <div class="form-group">
                <input type="email" name="email " placeholder="Informe seu email" class="form-control" require>
            </div>
            <div class="form-group">
                <input type="senha" name="senha" placeholder="Informe sua senha" class="form-control" require>
            </div>

            <button class="btn font-weight-blod" name="submit">Login</button>
            <p> Voce ja tem uma conta?<a href="registro.php">Registrar</a></p>


        </form>
    </div>

</body>

</html>