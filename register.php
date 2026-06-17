<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require 'config.php';

// استقبال البيانات
$data = json_decode(file_get_contents('php://input'), true);

$full_name = trim($data['full_name'] ?? '');
$email     = trim($data['email']     ?? '');
$phone     = trim($data['phone']     ?? '');
$password  = trim($data['password']  ?? '');

// التحقق من البيانات
if (!$full_name || !$email || !$phone || !$password) {
    echo json_encode(['success' => false, 'message' => 'جميع الحقول مطلوبة']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني غير صحيح']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'كلمة المرور قصيرة جداً']);
    exit;
}

// التحقق من عدم تكرار البريد الإلكتروني
$check = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'البريد الإلكتروني مسجل مسبقاً']);
    $check->close();
    exit;
}
$check->close();

// تشفير كلمة المرور
$hashed = password_hash($password, PASSWORD_BCRYPT);

// حفظ المستخدم
$stmt = $conn->prepare(
    "INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssss", $full_name, $email, $phone, $hashed);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'تم إنشاء الحساب بنجاح']);
} else {
    echo json_encode(['success' => false, 'message' => 'حدث خطأ أثناء الحفظ، حاول مجدداً']);
}

$stmt->close();
$conn->close();
?>
