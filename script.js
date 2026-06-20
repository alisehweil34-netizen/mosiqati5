/* ===== ربط Firebase (Realtime Database) =====
   ملاحظة: هذا الملف عادي (ليس module)، لذلك نستخدم نسخة Firebase Compat
   عبر تاغات <script> في كل صفحة HTML (قبل تاغ script.js) بدلاً من import/export. */
var firebaseConfig = {
  apiKey: "AIzaSyAfBj5Ck-AxDc53vBHvPoVpTi5Q2SJEz1o",
  authDomain: "mosiqati-9be19.firebaseapp.com",
  databaseURL: "https://mosiqati-9be19-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mosiqati-9be19",
  storageBucket: "mosiqati-9be19.firebasestorage.app",
  messagingSenderId: "417020610982",
  appId: "1:417020610982:web:224a8ffb77dbc136f42767",
  measurementId: "G-P6DFNKZMX1"
};

var db = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.database();
  } else {
    console.warn('Firebase SDK لم يتم تحميله في هذه الصفحة (تحقق من تاغات <script> في <head>).');
  }
} catch (e) {
  console.error('فشل تهيئة Firebase:', e);
}

(function applySettingsImmediate() {
  
  try {
    
    var s = JSON.parse(localStorage.getItem('mosiqati-settings') || '{}');

    
    
    if (s.fontSize) {
      
      document.documentElement.style.fontSize = s.fontSize + 'px';
    
    }

    
    
    if (s.accentColor) {
      
      document.documentElement.style.setProperty('--color-gold',       s.accentColor);
      
      document.documentElement.style.setProperty('--color-gold-light', s.accentLight || '#e8c96a');
      
      document.documentElement.style.setProperty('--color-gold-dark',  s.accentDark  || '#a07830');
    
    }

    
    
    if (s.bgColor) {
      
      document.documentElement.style.setProperty('--color-black', s.bgColor);
      
      document.documentElement.style.setProperty('--color-dark',  s.bgDark  || '#111111');
      
      document.documentElement.style.setProperty('--color-card',  s.bgCard  || '#1a1a1a');
      
      document.body && (document.body.style.backgroundColor = s.bgColor);
    
    }

    
    
    if (s.noAnim) {
      
      var st = document.createElement('style');
      st.id = 'no-anim-style';
      
      st.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
      
      document.head.appendChild(st);
    
    }

  
  } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', function () {

  
  
  
  
  applyAllSettings();

  
  
  
  
  var hamburger = document.getElementById('hamburger');
  
  var navLinks  = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    
    hamburger.addEventListener('click', function () {
      
      navLinks.classList.toggle('open');
    
    });
    
    navLinks.querySelectorAll('a').forEach(function (link) {
      
      link.addEventListener('click', function () {
        
        navLinks.classList.remove('open');
      
      });
    
    });
  
  }

  
  
  
  
  updateCartCount();

  
  
  
  
  var currentPage = window.location.pathname.split('/').pop() || 'home.html';
  
  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    
    var href = link.getAttribute('href');
    
    if (href === currentPage || (currentPage === '' && href === 'home.html')) {
      
      link.classList.add('active');
    
    }
  
  });

  
  
  
  
  document.querySelectorAll('.btn-add-cart').forEach(function (btn) {
    
    btn.addEventListener('click', function () {
      
      var id    = parseInt(this.dataset.id) || Math.floor(Math.random()*1000);
      
      var name  = this.dataset.name  || this.closest('.product-card,.product-info')?.querySelector('.product-name')?.textContent || 'منتج';
      
      var price = parseFloat(this.dataset.price) || 0;
      
      var emoji = this.dataset.emoji || '🎵';

      
      var cart = [];
      
      try { cart = JSON.parse(localStorage.getItem('mosiqati-cart') || '[]'); } catch(e) {}

      
      var existing = cart.find(function(i) { return i.id === id; });
      
      if (existing) {
        existing.qty += 1;
      
      } else {
        
        cart.push({ id: id, name: name, price: price, emoji: emoji, qty: 1 });
      
      }

      
      localStorage.setItem('mosiqati-cart', JSON.stringify(cart));
      updateCartCount();
      playSound('addToCart');

      
      
      var orig = this.textContent;
      
      var origBg = this.style.background;
      
      this.textContent = '✅ تمت الإضافة!';
      
      this.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
      
      this.disabled = true;
      
      var self = this;
      
      setTimeout(function () {
        
        self.textContent = orig;
        
        self.style.background = origBg;
        self.disabled = false;
      }, 1500);
    
    });
  
  });

  
  
  
  
  document.querySelectorAll('.btn-gift').forEach(function (btn) {
    
    btn.addEventListener('click', function () {
      
      var lang = getLang();
      
      alert(lang === 'en'
        ? '🎁 We will contact you soon to confirm the gift order!'
        : '🎁 سيتم التواصل معك قريباً لتأكيد طلب الهدية!');
    
    });
  
  });

  
  
  
  
  document.querySelectorAll('.btn-offer').forEach(function (btn) {
    
    btn.addEventListener('click', function () {
      
      var card  = this.closest('.offer-card');
      
      var title = card ? (card.querySelector('.offer-title')?.textContent || '') : '';
      
      var lang  = getLang();
      
      alert(lang === 'en'
        ? '🎉 Great! Offer activated: "' + title + '"'
        : '🎉 رائع! تم تفعيل عرض: "' + title + '"');
    
    });
  
  });

  
  
  
  
  var contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    
    contactForm.addEventListener('submit', function (e) {
      
      e.preventDefault();
      
      var lang    = getLang();
      
      var fname   = (document.getElementById('fname')   || document.getElementById('name'))?.value.trim() || '';
      
      var email   = document.getElementById('email')?.value.trim() || '';
      
      var message = document.getElementById('message')?.value.trim() || '';

      
      if (!fname || !email || !message) {
        
        alert(lang === 'en'
          ? '⚠️ Please fill all required fields.'
          : '⚠️ يرجى ملء جميع الحقول المطلوبة.');
        
        return;
      
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        
        alert(lang === 'en'
          ? '⚠️ Please enter a valid email address.'
          : '⚠️ يرجى إدخال بريد إلكتروني صحيح.');
        
        return;
      
      }

      
      var phone = document.getElementById('phone')?.value.trim() || '';

      var toast = document.getElementById('toast') || document.getElementById('successMessage');

      function showSuccess() {
        if (toast) {

          toast.textContent = lang === 'en'
            ? '✅ Message sent successfully! We will contact you soon.'
            : '✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';

          toast.style.display = 'block';

          setTimeout(function () { toast.style.display = 'none'; }, 4000);

        }
        contactForm.reset();
      }

      if (db) {
        db.ref('messages').push({
          name: fname,
          email: email,
          phone: phone,
          message: message,
          createdAt: new Date().toISOString()
        }).then(showSuccess).catch(function (err) {
          console.error('فشل حفظ الرسالة في Firebase:', err);
          alert(lang === 'en'
            ? '⚠️ Could not send the message, please try again.'
            : '⚠️ تعذّر إرسال الرسالة، حاول مجدداً.');
        });
      } else {
        showSuccess();
      }
    
    });
  
  }

  
  
  
  
  var s = {};
  
  try { s = JSON.parse(localStorage.getItem('mosiqati-settings') || '{}'); } catch(e) {}
  
  if (!s.noAnim) {
    
    var observer = new IntersectionObserver(function (entries) {
      
      entries.forEach(function (entry) {
        
        if (entry.isIntersecting) entry.target.classList.add('visible');
      
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    
    document.querySelectorAll('.product-card,.gift-card,.offer-card,.value-card,.team-card,.stat-item,.review-card').forEach(function (el) {
      
      el.style.opacity = '0';
      
      el.style.transform = 'translateY(20px)';
      
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      observer.observe(el);
    
    });

    
    var visStyle = document.createElement('style');
    
    visStyle.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
    
    document.head.appendChild(visStyle);
  
  }

  
  
  
  
  var counterObserver = new IntersectionObserver(function (entries) {
    
    entries.forEach(function (entry) {
      
      if (!entry.isIntersecting) return;
      
      var el     = entry.target;
      
      var target = parseInt(el.dataset.target) || 0;
      
      var suffix = el.dataset.suffix || '';
      
      var start  = 0;
      
      var step   = target / (1500 / 16);
      
      var timer  = setInterval(function () {
        start += step;
        
        if (start >= target) {
          
          el.textContent = target + suffix;
          
          clearInterval(timer);
        
        } else {
          
          el.textContent = Math.floor(start) + suffix;
        
        }
      }, 16);
      
      counterObserver.unobserve(el);
    
    });
  }, { threshold: 0.5 });

  
  document.querySelectorAll('.counter-number').forEach(function (el) {
    
    counterObserver.observe(el);
  
  });

});

function getLang() {
  
  try {
    
    return JSON.parse(localStorage.getItem('mosiqati-settings') || '{}').lang || 'ar';
  
  } catch(e) { return 'ar'; }

}

function updateCartCount() {
  try {
    var cart  = JSON.parse(localStorage.getItem('mosiqati-cart') || '[]');
    var total = cart.reduce(function(s, i) { return s + (i.qty || 1); }, 0);

    // عداد زر navbar القديم (إن وجد)
    var el = document.getElementById('cart-count');
    if (el) {
      if (total > 0) {
        el.textContent = total;
        el.style.display = 'flex';
      } else {
        el.textContent = '';
        el.style.display = 'none';
      }
    }
  } catch(e) {}
}

function applyAllSettings() {
  
  var s = {};
  try { s = JSON.parse(localStorage.getItem('mosiqati-settings') || '{}'); } catch(e) {}

  var lang = s.lang || 'ar';
  var isAr = lang === 'ar';

  document.documentElement.lang = lang;
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

  // ترجمة جميع العناصر التي عندها data-ar وdata-en
  document.querySelectorAll('[data-ar][data-en]').forEach(function(el) {
    // نحافظ على الـ HTML الداخلي إذا كان فيه عناصر أبناء
    var hasChildElements = el.children.length > 0;
    if (!hasChildElements) {
      el.textContent = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    }
  });

  // ترجمة placeholder
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(function(el) {
    el.placeholder = isAr ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
  });

  // ترجمة العناصر الثابتة بدون data attributes
  var fixedTranslations = [
    { selector: '.product-price span',       ar: 'دينار أردني',    en: 'JOD'          },
    { selector: '.price-currency',           ar: 'دينار أردني',    en: 'JOD'          },
    { selector: '.logo-tagline',             ar: 'متجر الآلات الموسيقية', en: 'Music Instruments Store' },
    { selector: '.hero-subtitle',            ar: null,              en: null           },
    { selector: '.cart-empty-title',         ar: 'سلتك فارغة!',   en: 'Your Cart is Empty!' },
    { selector: '.cart-empty-sub',           ar: 'أضف بعض الآلات الموسيقية', en: 'Add some music instruments' },
    { selector: '.order-summary-title',      ar: 'ملخص الطلب',    en: 'Order Summary' },
    { selector: '.subtotal-label',           ar: 'المجموع الجزئي', en: 'Subtotal'     },
    { selector: '.discount-label',           ar: 'الخصم',          en: 'Discount'     },
    { selector: '.shipping-label',           ar: 'الشحن',          en: 'Shipping'     },
    { selector: '.total-label',              ar: 'الإجمالي',       en: 'Total'        },
    { selector: '.free-text',               ar: 'مجاني',           en: 'Free'         },
    { selector: '.btn-checkout',            ar: 'إتمام الطلب',     en: 'Checkout'     },
    { selector: '.cart-float',             ar: '🛒',              en: '🛒'           },
  ];

  fixedTranslations.forEach(function(t) {
    if (!t.ar || !t.en) return;
    document.querySelectorAll(t.selector).forEach(function(el) {
      if (el.children.length === 0) {
        el.textContent = isAr ? t.ar : t.en;
      }
    });
  });

  // تغيير عنوان الصفحة
  var titles = {
    'ar': {
      'home.html'    : 'موسيقاتي - الرئيسية',
      'store.html'   : 'موسيقاتي - المتجر',
      'gifts.html'   : 'موسيقاتي - الهدايا',
      'offers.html'  : 'موسيقاتي - العروض',
      'about.html'   : 'موسيقاتي - من نحن',
      'Contact.html' : 'موسيقاتي - تواصل معنا',
      'settings.html': 'موسيقاتي - الإعدادات',
      'cart.html'    : 'موسيقاتي - سلة التسوق',
      'index.html'   : 'موسيقاتي - تسجيل الدخول',
      'register.html': 'موسيقاتي - إنشاء حساب',
    },
    'en': {
      'home.html'    : 'MOSIQATI - Home',
      'store.html'   : 'MOSIQATI - Store',
      'gifts.html'   : 'MOSIQATI - Gifts',
      'offers.html'  : 'MOSIQATI - Offers',
      'about.html'   : 'MOSIQATI - About Us',
      'Contact.html' : 'MOSIQATI - Contact Us',
      'settings.html': 'MOSIQATI - Settings',
      'cart.html'    : 'MOSIQATI - Shopping Cart',
      'index.html'   : 'MOSIQATI - Login',
      'register.html': 'MOSIQATI - Register',
    }
  };
  var page = window.location.pathname.split('/').pop() || 'home.html';
  var titleMap = titles[lang] || titles['ar'];
  if (titleMap[page]) document.title = titleMap[page];

  // تغيير اتجاه الخط للعناصر
  if (!isAr) {
    document.body.style.fontFamily = "'Segoe UI', Arial, sans-serif";
  } else {
    document.body.style.fontFamily = "";
  }

  // الإعدادات الأخرى
  var compactStyle = document.getElementById('compact-style');
  if (s.compact) {
    if (!compactStyle) {
      var st = document.createElement('style');
      st.id = 'compact-style';
      st.textContent = 'section { padding: 40px 5% !important; } .products-grid, .gifts-grid, .offers-grid, .values-grid { gap: 15px !important; }';
      document.head.appendChild(st);
    }
  } else {
    if (compactStyle) compactStyle.remove();
  }

  var topBar = document.querySelector('.top-bar');
  if (topBar) topBar.style.display = s.hideTopBar ? 'none' : '';

}

/* ===== نظام الأصوات ===== */
var SFX = {};

function playSound(name) {
  try {
    var files = {
      addToCart   : 'add-to-cart.mp3',
      orderSuccess: 'order-success.mp3',
      error       : 'error.mp3'
    };
    if (!files[name]) return;
    if (!SFX[name]) SFX[name] = new Audio(files[name]);
    SFX[name].currentTime = 0;
    SFX[name].volume = 0.7;
    SFX[name].play().catch(function(){});
  } catch(e) {}
}

/* الموسيقى الخلفية */
var _bgAudio   = null;
var _bgStarted = false;
var _bgPlaying = false;

function getBgAudio() {
  if (!_bgAudio) {
    _bgAudio = new Audio('background.mp3');
    _bgAudio.loop   = true;
    _bgAudio.volume = 0.18;
  }
  return _bgAudio;
}

function startBg() {
  if (_bgStarted) return;
  _bgStarted = true;
  getBgAudio().play().then(function(){
    _bgPlaying = true;
    var btn = document.getElementById('musicToggle');
    if (btn) { btn.textContent = '🔇'; btn.classList.add('playing'); }
  }).catch(function(){});
}
document.addEventListener('click', startBg, { once: true });
