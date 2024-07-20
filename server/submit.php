<?php
require '../connect/config.php';
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
        // Send email using PHPMailer
        $mail = new PHPMailer(true); // true enables exceptions

        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'raisahkamilahdayto@gmail.com'; // Your Gmail address
            $mail->Password = 'raisahraisahraisah'; // Your Gmail password
            $mail->SMTPSecure = 'tls'; // Enable TLS encryption
            $mail->Port = 587; // Adjust as necessary

            //Recipients
            $mail->setFrom($email, $name); // Set sender's name and email here
            $mail->addAddress('raisahkamilahdayto@gmail.com', 'Raisah');

            //Content
            $mail->isHTML(false); // Set to true if sending HTML content
            $mail->Subject = 'New Message from Get In Touch Form';
            $mail->Body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage:\n$message\n";

            $mail->send();
            jsonResponse(true, "Your message has been sent successfully.");
        } catch (Exception $e) {
            jsonResponse(false, "Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
        }
    } else {
        jsonResponse(false, "Failed to save your message. Please try again later.");
    }

    $stmt->close();
} else {
    jsonResponse(false, "Invalid request method.");
}

$conn->close();
