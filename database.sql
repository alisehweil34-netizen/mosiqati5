-- إنشاء قاعدة البيانات إذا لم تكن موجودة مع دعم العربية
CREATE DATABASE IF NOT EXISTS mosiqati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- تحديد قاعدة البيانات النشطة للأوامر التالية
USE mosiqati_db;

-- إنشاء جدول جديد في قاعدة البيانات
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255),
    phone VARCHAR(100),
    address TEXT,
    products LONGTEXT,
    promo_code VARCHAR(100),
    subtotal DECIMAL(10,2),
    discount DECIMAL(10,2),
    total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين المسجلين
CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(255)        NOT NULL,
    email        VARCHAR(255)        NOT NULL UNIQUE,
    phone        VARCHAR(30)         NOT NULL,
    password     VARCHAR(255)        NOT NULL,
    created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);