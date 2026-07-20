<?php
// get_tasks.php - READ: returns all tasks as JSON

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only GET method is allowed"]);
    exit;
}

$sql = "SELECT id, title, description, is_completed, created_at, updated_at
        FROM tasks
        ORDER BY created_at DESC";

$result = $conn->query($sql);

$tasks = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int) $row['id'];
        $row['is_completed'] = (bool) $row['is_completed'];
        $tasks[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "data" => $tasks
]);

$conn->close();
