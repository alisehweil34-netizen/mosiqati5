<?php
/**
 * init_db.php
 * يُشغَّل مرة واحدة لإنشاء الجداول في قاعدة بيانات Railway
 * افتح: https://your-app.railway.app/init_db.php
 */
require 'config.php';

$queries = [
    "CREATE TABLE IF NOT EXISTS orders (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255),
        phone         VARCHAR(100),
        address       TEXT,
        products      LONGTEXT,
        promo_code    VARCHAR(100),
        subtotal      DECIMAL(10,2),
        discount      DECIMAL(10,2),
        total         DECIMAL(10,2),
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        full_name  VARCHAR(255)  NOT NULL,
        email      VARCHAR(255)  NOT NULL UNIQUE,
        phone      VARCHAR(30)   NOT NULL,
        password   VARCHAR(255)  NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
];

$success = true;
$messages = [];

foreach ($queries as $sql) {
    if ($conn->query($sql)) {
        $messages[] = '✅ ' . substr($sql, 0, 60) . '...';
    } else {
        $messages[] = '❌ خطأ: ' . $conn->error;
        $success = false;
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>تهيئة قاعدة البيانات</title>
  <style>
    body { font-family: Arial; background: #0d0d0d; color: #fff; padding: 2rem; }
    h2   { color: #c9a84c; }
    .ok  { color: #4caf73; }
    .err { color: #e05555; }
    .box { background: #111; border: 1px solid #222; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
  </style>
</head>
<body>
  <h2>🎵 موسيقاتي — تهيئة قاعدة البيانات</h2>
  <div class="box">
    <?php foreach ($messages as $msg): ?>
      <p><?= htmlspecialchars($msg) ?></p>
    <?php endforeach; ?>
    <hr style="border-color:#222; margin:1rem 0;">
    <?php if ($success): ?>
      <p class="ok"><strong>✅ تمت التهيئة بنجاح! يمكنك الآن حذف هذا الملف.</strong></p>
    <?php else: ?>
      <p class="err"><strong>❌ حدث خطأ — راجع رسائل الخطأ أعلاه</strong></p>
    <?php endif; ?>
  </div>
</body>
</html>