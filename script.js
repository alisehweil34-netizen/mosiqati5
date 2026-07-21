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
      
      // الهيدر دائماً أسود
      var navEl = document.querySelector('.navbar');
      if (navEl) navEl.style.setProperty('background-color', '#0a0a0a', 'important');
      
      document.documentElement.style.setProperty('--color-dark',  s.bgDark  || '#111111');
      
      document.documentElement.style.setProperty('--color-card',  s.bgCard  || '#1a1a1a');

      // نغمّق لون الخطوط (النص) والإطارات تلقائياً عند اختيار خلفية فاتحة كالأبيض
      // حتى تبقى واضحة ومقروءة بدل الألوان الفاتحة المصممة أصلاً لخلفية داكنة
      document.documentElement.style.setProperty('--color-white',  s.bgText   || '#c8c2b0');
      document.documentElement.style.setProperty('--color-border', s.bgBorder || '#2a2a2a');
      document.documentElement.style.setProperty('--color-gray',   s.bgGray   || '#888888');
      
      document.body && (document.body.style.backgroundColor = s.bgColor);
      
      // الهيدر دائماً أسود بغض النظر عن ثيم الصفحة
      var navEl = document.querySelector('.navbar');
      if (navEl) navEl.style.setProperty('background-color', '#0a0a0a', 'important');
    
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

  initMusicToggle();

  
  
  
  
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
      
      var lang = getLang();
      var nameEl = this.closest('.product-card,.product-info')?.querySelector('.product-name');
      var name = (nameEl ? (lang === 'en' ? (nameEl.dataset.en || nameEl.textContent) : (nameEl.dataset.ar || nameEl.textContent)) : this.dataset.name) || 'Product';
      
      var price = parseFloat(this.dataset.price) || 0;
      
      var emoji = this.dataset.emoji || '🎵';

      addItemToCart({ id: id, name: name, price: price, emoji: emoji });
      playSound('addToCart');

      
      
      var orig = this.textContent;
      
      var origBg = this.style.background;
      
      this.textContent = getLang() === 'ar' ? '✅ تمت الإضافة!' : '✅ Added!';
      
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

      var card = this.closest('.gift-card');
      var lang = getLang();
      
      var nameEl = card ? card.querySelector('.gift-name') : null;
      var name = nameEl ? (lang === 'en' ? (nameEl.dataset.en || nameEl.innerText.trim()) : (nameEl.dataset.ar || nameEl.innerText.trim())) : 'Gift';
      
      var priceEl = card ? card.querySelector('.gift-price') : null;
      var price = 0;
      if (priceEl) {
        var raw = priceEl.dataset.en || priceEl.innerText;
        price = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
      }
      
      var emoji = '🎁';
      addItemToCart({ id: 'gift-' + (nameEl ? nameEl.innerText.trim() : name), name: name, price: price, emoji: emoji });
      window.location.href = 'cart.html';
    
    });
  
  });

  
  
  
  
  document.querySelectorAll('.btn-offer').forEach(function (btn) {
    
    btn.addEventListener('click', function () {
      
      var card  = this.closest('.offer-card');
      var lang = getLang();
      
      var titleEl = card ? card.querySelector('.offer-title') : null;
      var title = titleEl ? (lang === 'en' ? (titleEl.dataset.en || titleEl.textContent.trim()) : (titleEl.dataset.ar || titleEl.textContent.trim())) : 'Offer';
      
      var priceEl = card ? card.querySelector('.offer-new-price') : null;
      var price = 0;
      if (priceEl) {
        var raw = priceEl.dataset.en || priceEl.textContent;
        price = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
      }
      var emoji = '🎉';

      addItemToCart({ id: 'offer-' + (titleEl ? titleEl.textContent.trim() : title), name: title, price: price, emoji: emoji });
      window.location.href = 'cart.html';
    
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
    
    return JSON.parse(localStorage.getItem('mosiqati-settings') || '{}').lang || 'en';
  
  } catch(e) { return 'ar'; }

}

function addItemToCart(item) {
  try {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('mosiqati-cart') || '[]'); } catch(e) {}

    var existing = cart.find(function(i) { return i.id === item.id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: 1 });
    }

    localStorage.setItem('mosiqati-cart', JSON.stringify(cart));
    updateCartCount();
  } catch(e) {}
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

  var lang = s.lang || 'en';
  var isAr = lang === 'ar';

  document.documentElement.lang = lang;
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

  // ترجمة جميع العناصر التي عندها data-ar وdata-en
  document.querySelectorAll('[data-ar][data-en]').forEach(function(el) {
    var arText = el.getAttribute('data-ar');
    var enText = el.getAttribute('data-en');
    el.innerHTML = isAr ? arText : enText;
  });

  // ترجمة placeholder
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(function(el) {
    el.placeholder = isAr ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
  });

  // ترجمة العناصر الثابتة بدون data attributes
  var fixedTranslations = [
    { selector: '.product-price span',       ar: 'DJO',    en: 'DJO'          },
    { selector: '.price-currency',           ar: 'DJO',    en: 'DJO'          },
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
      st.textContent = 'section { padding: 25px 5% !important; } .settings-card { padding: 16px !important; margin-bottom: 14px !important; } .setting-row { padding: 10px 0 !important; } .product-card, .gift-card, .offer-card { padding: 14px !important; margin-bottom: 10px; } .products-grid, .gifts-grid, .offers-grid, .values-grid, .offers-grid { gap: 12px !important; }';
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
var MUSIC_KEY  = 'mosiqati-music';
var _bgAudio   = null;
var _bgStarted = false;
var _bgPlaying = false;

function getMusicPref() {
  try { return localStorage.getItem(MUSIC_KEY); } catch(e) { return null; }
}

function setMusicPref(v) {
  try { localStorage.setItem(MUSIC_KEY, v); } catch(e) {}
}

function getBgAudio() {
  if (!_bgAudio) {
    _bgAudio = new Audio('background.mp3');
    _bgAudio.loop   = true;
    _bgAudio.volume = 0.18;
  }
  return _bgAudio;
}

function updateMusicIcon() {
  var btn = document.getElementById('musicToggle');
  if (!btn) return;
  if (_bgPlaying) {
    btn.textContent = '🔇';
    btn.classList.add('playing');
  } else {
    btn.textContent = '🎵';
    btn.classList.remove('playing');
  }
}

function startBg() {
  if (_bgStarted) return;
  _bgStarted = true;
  getBgAudio().play().then(function(){
    _bgPlaying = true;
    setMusicPref('on');
    updateMusicIcon();
  }).catch(function(){
    _bgStarted = false;
  });
}

function initMusicToggle() {
  var btn = document.getElementById('musicToggle');
  if (!btn) return;

  var pref = getMusicPref();

  if (pref !== 'off') {
    // الموسيقى كانت مفعّلة في صفحة سابقة (أو هذه أول زيارة) - نحاول تشغيلها مباشرة
    getBgAudio().play().then(function(){
      _bgPlaying = true;
      _bgStarted = true;
      updateMusicIcon();
    }).catch(function(){
      // المتصفح منع التشغيل التلقائي، ستبدأ مع أول نقرة في الصفحة
    });
  } else {
    _bgPlaying = false;
  }

  updateMusicIcon();

  btn.addEventListener('click', function () {
    var bg = getBgAudio();
    if (_bgPlaying) {
      bg.pause();
      _bgPlaying = false;
      setMusicPref('off');
    } else {
      bg.play().then(function(){ _bgPlaying = true; }).catch(function(){});
      _bgPlaying = true;
      _bgStarted = true;
      setMusicPref('on');
    }
    updateMusicIcon();
  });
}

function clickToStartBg() {
  if (getMusicPref() !== 'off') startBg();
  document.removeEventListener('click', clickToStartBg);
}
document.addEventListener('click', clickToStartBg);

/* DIAGNOSTIC PATCH: language system inspected. applyAllSettings() only translates elements that have data-ar and data-en attributes. Any hard-coded Arabic text in pages will remain Arabic when English is selected. Review pages for missing data-en attributes. */

// ===== قارئ النص عند التحديد (Text-to-Speech) =====
(function() {
  if (!window.speechSynthesis) return;

  var popup = null;
  var readTimeout = null;
  var savedText = '';

  function speak(text) {
    window.speechSynthesis.cancel();
    // استخدام دالة getLang العامة من script.js
    var lang = (typeof getLang === 'function') ? getLang() : 'en';
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  function removePopup() {
    if (popup) { popup.remove(); popup = null; }
    clearTimeout(readTimeout);
  }

  function createPopup(x, y, text) {
    removePopup();
    savedText = text;

    popup = document.createElement('button');
    popup.id = 'tts-popup';
    var _lang = (typeof getLang === 'function') ? getLang() : 'en';
    popup.textContent = _lang === 'ar' ? '🔊 اقرأ' : '🔊 Read';
    popup.style.cssText = [
      'position:fixed',
      'left:' + Math.min(x, window.innerWidth - 120) + 'px',
      'top:' + Math.max(y - 50, 10) + 'px',
      'background:#c9a84c',
      'color:#000000',
      'padding:8px 18px',
      'border-radius:20px',
      'font-size:14px',
      'font-weight:800',
      'cursor:pointer',
      'z-index:999999',
      'box-shadow:0 4px 16px rgba(0,0,0,0.5), 0 0 0 2px #000000',
      'user-select:none',
      'font-family:Cairo,sans-serif',
      'white-space:nowrap',
      'border:2px solid #000000',
      'outline:none',
      'pointer-events:auto',
    ].join(';');

    // استخدام mousedown بدل click لمنع فقدان التحديد
    popup.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      speak(savedText);
      removePopup();
    });

    document.body.appendChild(popup);
    clearTimeout(readTimeout);
    readTimeout = setTimeout(removePopup, 5000);
  }

  document.addEventListener('mouseup', function(e) {
    if (popup && e.target === popup) return;

    setTimeout(function() {
      var selected = window.getSelection();
      var text = selected ? selected.toString().trim() : '';
      if (text.length >= 2) {
        createPopup(e.clientX, e.clientY, text);
      } else {
        removePopup();
      }
    }, 10);
  });

  document.addEventListener('mousedown', function(e) {
    if (popup && e.target !== popup) removePopup();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.speechSynthesis.cancel();
      removePopup();
    }
  });

})();
