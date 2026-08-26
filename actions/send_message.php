<?php


header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../config/database.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Método no permitido. Se requiere petición POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Obtener datos ya sea por FormData ($_POST) o JSON body
$name = '';
$email = '';
$message = '';
$website = '';

if (!empty($_POST)) {
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $website = trim($_POST['website'] ?? '');
} else {
    $rawInput = file_get_contents('php://input');
    $jsonData = json_decode($rawInput, true);
    if (is_array($jsonData)) {
        $name    = trim($jsonData['name'] ?? '');
        $email   = trim($jsonData['email'] ?? '');
        $message = trim($jsonData['message'] ?? '');
        $website = trim($jsonData['website'] ?? '');
    }
}

// 0. VERIFICACIÓN HONEYPOT ANTISPAM
// Si el campo oculto 'website' tiene contenido, es un bot automatizado.
if (!empty($website)) {
    http_response_code(200);
    echo json_encode([
        'success'    => true,
        'saved_db'   => false,
        'message_es' => 'Mensaje recibido correctamente.',
        'message_en' => 'Message received successfully.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. VALIDACIÓN DEL SERVIDOR
$errors = [];

if (empty($name)) {
    $errors[] = 'El nombre es obligatorio.';
} elseif (mb_strlen($name) < 2) {
    $errors[] = 'El nombre debe tener al menos 2 caracteres.';
} elseif (mb_strlen($name) > 100) {
    $errors[] = 'El nombre no puede superar los 100 caracteres.';
}

if (empty($email)) {
    $errors[] = 'El correo electrónico es obligatorio.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'El formato del correo electrónico no es válido.';
} elseif (mb_strlen($email) > 150) {
    $errors[] = 'El correo electrónico no puede superar los 150 caracteres.';
}

if (empty($message)) {
    $errors[] = 'El mensaje es obligatorio.';
} elseif (mb_strlen($message) < 5) {
    $errors[] = 'El mensaje debe tener al menos 5 caracteres.';
} elseif (mb_strlen($message) > 3000) {
    $errors[] = 'El mensaje no puede superar los 3000 caracteres.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errors'  => $errors,
        'message' => implode(' ', $errors)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. METADATOS DE SEGURIDAD Y CONEXIÓN
$ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
if (strpos($ipAddress, ',') !== false) {
    $ipAddress = trim(explode(',', $ipAddress)[0]);
}
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown User-Agent', 0, 500);

$db = getDBConnection();
$savedInDB = false;

if ($db) {
    try {
        $sql = "INSERT INTO messages (name, email, message, ip_address, user_agent, created_at) 
                VALUES (:name, :email, :message, :ip, :ua, NOW())";
        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':message' => $message,
            ':ip'      => $ipAddress,
            ':ua'      => $userAgent
        ]);
        $savedInDB = true;
    } catch (PDOException $e) {
        error_log("Error al insertar mensaje en PostgreSQL: " . $e->getMessage());
    }
}

// Respaldo secundario en archivo de log para garantizar que ningún mensaje se pierda
$logEntry = sprintf(
    "[%s] IP: %s | %s <%s>: %s%s",
    date('Y-m-d H:i:s'),
    $ipAddress,
    $name,
    $email,
    str_replace(["\r", "\n"], ' ', $message),
    PHP_EOL
);
@file_put_contents(__DIR__ . '/../mensajes.txt', $logEntry, FILE_APPEND | LOCK_EX);

// 3. RESPUESTA JSON EXITOSA
http_response_code(200);
echo json_encode([
    'success'    => true,
    'saved_db'   => $savedInDB,
    'message_es' => 'Mensaje recibido y procesado correctamente. ¡Gracias por contactarme!',
    'message_en' => 'Message successfully received and processed. Thank you for reaching out!',
    'data'       => [
        'name'       => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
        'email'      => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
        'timestamp'  => date('c')
    ]
], JSON_UNESCAPED_UNICODE);
