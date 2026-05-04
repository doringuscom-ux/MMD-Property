<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect data from POST
    $to = $_POST['to'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    if (empty($to) || empty($subject) || empty($message)) {
        echo json_encode(["success" => false, "error" => "Missing parameters"]);
        exit;
    }

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: Maa Mansa Devi Property <noreply@mmdproperty.com>' . "\r\n";

    // Send email using PHP mail() with -f flag (Often required by Hostinger/Shared hosting)
    if(mail($to, $subject, $message, $headers, "-f noreply@mmdproperty.com")) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "PHP mail() function failed. Check server logs."]);
    }
}
?>
