<?php
// update_task.php - UPDATE: edits title/description or toggles completion

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST or PUT method is allowed"]);
    exit;
}

$input = get_json_input();

$id = isset($input['id']) ? (int) $input['id'] : 0;
$title = isset($input['title']) ? trim($input['title']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';
$isCompleted = isset($input['is_completed']) ? (int) (bool) $input['is_completed'] : 0;

if ($id <= 0 || $title === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid id and title are required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?");
$stmt->bind_param("ssii", $title, $description, $isCompleted, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows === 0) {
        // Either the id doesn't exist, or the data was identical to what's already stored.
        $check = $conn->query("SELECT id FROM tasks WHERE id = $id");
        if ($check->num_rows === 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Task not found"]);
            $stmt->close();
            $conn->close();
            exit;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully"
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update task: " . $stmt->error]);
}

$stmt->close();
$conn->close();
