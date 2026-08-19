<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name  = trim($_POST["name"] ?? "");
    $email  = trim($_POST["email"] ?? "");
    $message = trim($_POST["message"] ?? "");

    if (empty($name) || empty($email) || empty($message)) {
        echo "Error: Todos los campos son obligatorios.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Error: El formato del correo no es válido.";
        exit;
    }

    // 4. Sanitización contra ataques XSS antes de mostrar datos
    $secure_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $secure_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $secure_message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    echo "<h1>Mensaje recibido</h1>";
    echo "<p>Gracias, $secure_name. Nos pondremos en contacto a $secure_email.</p>";

    // Formato de línea para el log
    $registro = "[" . date("Y-m-d H:i:s") . "] $secure_name ($secure_email): $secure_message" . PHP_EOL;

    // FILE_APPEND evita que se sobreescriba lo anterior
    file_put_contents("mensajes.txt", $registro, FILE_APPEND);
    
    // Aquí es donde más adelante insertarás en MySQL con PDO
} else {
    // Si intentan entrar por URL directa (GET), rechazar
    header("Location: index.html");
    exit;
}