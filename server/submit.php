<?php
require '../connect/config.php';

header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1.
header("Pragma: no-cache"); // HTTP 1.0.
header("Expires: 0"); // Proxies.


function jsonResponse($success, $message, $data = [])
{
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = filter_var($_POST['phone'] ?? '', FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);

    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        jsonResponse(false, "All fields are required.");
    }

    $stmt = $conn->prepare("INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $phone, $message);

    if ($stmt->execute()) {
        jsonResponse(true, "Thank you, $name. Your inquiry is sent to Raisah. We'll get in touch as soon as possible.");
    } else {
        jsonResponse(false, "Failed to save your message. Please try again later.");
    }

    $stmt->close();
} else {
    jsonResponse(false, "Invalid request method.");
}

$conn->close();
