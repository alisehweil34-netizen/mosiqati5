<?php
/**
 * config.php
 * إعداد الاتصال بقاعدة بيانات MySQL على Railway.
 * Railway يضبط هذه المتغيرات تلقائياً عند إضافة خدمة MySQL للمشروع،
 * لذلك لا حاجة لتعديل هذا الملف يدوياً (راجع DEPLOY_GUIDE.md).
 */

$DB_HOST = getenv('MYSQLHOST')     ?: 'localhost';
$DB_PORT = getenv('MYSQLPORT')     ?: '3306';
$DB_USER = getenv('MYSQLUSER')     ?: 'root';
$DB_PASS = getenv('MYSQLPASSWORD') ?: '';
$DB_NAME = getenv('MYSQLDATABASE') ?: 'mosiqati_db';

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, (int) $DB_PORT);

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'تعذّر الاتصال بقاعدة البيانات: ' . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset('utf8mb4');
