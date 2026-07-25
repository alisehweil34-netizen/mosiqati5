# 🚀 خطوات رفع موسيقاتي على GitHub + Railway

---

## الخطوة 1 — رفع الكود على GitHub

1. افتح [github.com](https://github.com) وسجّل الدخول
2. اضغط **New repository**
3. سمّه `mosiqati` واختر **Public** ثم اضغط **Create**
4. في جهازك افتح Terminal/CMD داخل مجلد الموقع ونفّذ:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/اسمك/mosiqati.git
git push -u origin main
```

---

## الخطوة 2 — إنشاء مشروع على Railway

1. افتح [railway.app](https://railway.app) وسجّل الدخول بحساب GitHub
2. اضغط **New Project**
3. اختر **Deploy from GitHub repo**
4. اختر repository اسمه `mosiqati`
5. Railway سيبدأ البناء تلقائياً ✅

---

## الخطوة 3 — إضافة قاعدة البيانات MySQL

1. في مشروع Railway اضغط **+ New**
2. اختر **Database** ثم **MySQL**
3. انتظر حتى تنشأ القاعدة (دقيقة واحدة)
4. Railway سيربط المتغيرات تلقائياً مع موقعك ✅

---

## الخطوة 4 — تهيئة الجداول

1. اضغط على خدمة الموقع في Railway
2. اضغط **Settings** ← **Domains** ← انسخ الرابط
3. افتح المتصفح واكتب:
```
https://رابطك.railway.app/init_db.php
```
4. إذا ظهر ✅ فالجداول اتنشأت بنجاح
5. **احذف ملف init_db.php من GitHub بعدها للأمان**

---

## الخطوة 5 — تشغيل الموقع 🎉

افتح رابط Railway وستجد موقعك يعمل كاملاً مع قاعدة البيانات!

---

## ملاحظات مهمة
- Railway المجاني يعطيك **$5 رصيد شهرياً** وهو كافي للمشاريع الصغيرة
- المتغيرات مثل `MYSQLHOST` و`MYSQLPASSWORD` تُضبط تلقائياً
- لا تحتاج تعدّل `config.php` يدوياً
