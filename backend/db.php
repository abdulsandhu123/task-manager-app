<?php
// db.php - shared connection + CORS/JSON headers for every endpoint

require_once __DIR__ . '/config.php';

// Allow the frontend (possibly on a different port/origin) to call this API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

// Helper to read JSON body sent by fetch()
function get_json_input() {
    $data = json_decode(file_get_contents("php://input"), true);
    return is_array($data) ? $data : [];
}
