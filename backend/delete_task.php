<?php
// delete_task.php - DELETE: removes a task by id

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST or DELETE method is allowed"]);
    exit;
}

$input = get_json_input();
$id = isset($input['id']) ? (int) $input['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid id is required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Task not found"]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "Task deleted successfully"
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to delete task: " . $stmt->error]);
}

$stmt->close();
$conn->close();
