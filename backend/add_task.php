<?php
// add_task.php - CREATE: inserts a new task

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST method is allowed"]);
    exit;
}

$input = get_json_input();

$title = isset($input['title']) ? trim($input['title']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';

if ($title === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Title is required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO tasks (title, description) VALUES (?, ?)");
$stmt->bind_param("ss", $title, $description);

if ($stmt->execute()) {
    $newId = $stmt->insert_id;

    // Return the newly created task so the frontend can add it straight to state
    $result = $conn->query("SELECT id, title, description, is_completed, created_at, updated_at FROM tasks WHERE id = $newId");
    $task = $result->fetch_assoc();
    $task['id'] = (int) $task['id'];
    $task['is_completed'] = (bool) $task['is_completed'];

    echo json_encode([
        "success" => true,
        "message" => "Task added successfully",
        "data" => $task
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to add task: " . $stmt->error]);
}

$stmt->close();
$conn->close();
