<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare(
    "INSERT INTO orders(customer_name,phone,address,products,subtotal,discount,total,promo_code) VALUES (?,?,?,?,?,?,?,?)"
);

$stmt->bind_param(
    "ssssddds",
    $data['name'],
    $data['phone'],
    $data['address'],
    $data['products'],
    $data['subtotal'],
    $data['discount'],
    $data['total'],
    $data['promo_code']
);

echo json_encode(['success' => $stmt->execute()]);

$stmt->close();
$conn->close();
?>
