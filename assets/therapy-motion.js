/* Therapy pages: depth and guidance, built from the Synoida motifs (the logo balls, the specialty colour).
   1. Hero in layers: photo, title and four brand balls move at different depths (scroll, and pointer on desktop).
   2. «Πότε να απευθυνθείτε» told as a sequence: signs light up one by one, a fixed counter «03 / 06» with a bar.
   3. Domains: the row being read gets its number in the specialty colour.
   4. Dark «how it works»: the photo gains a colour frame behind it and two balls in front, each at its own speed;
      without a photo, the rules above the three steps draw in one after the other.
   5. Section titles rise word by word.
   Decorative only. Without JS the page is complete; with reduced motion nothing moves (states are shown settled). */
(function () {
  var main = document.querySelector('main.specialty-refined, main.speech-refined');
  if (!main || !('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var accent = (getComputedStyle(main).getPropertyValue('--specialty-color') || '').trim() || '#8DC63F';
  var brand = ['#8DC63F', '#ED1C24', '#00AEEF', '#F7941D'];
  var others = brand.filter(function (c) { return c.toLowerCase() !== accent.toLowerCase(); });
  if (others.length > 3) others.length = 3;
  main.style.setProperty('--accent', accent);
  main.classList.add('tm-on');

  function el(tag, cls, attrs) { var e = document.createElement(tag); if (cls) e.className = cls; if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function clamp(x, a, b) { return Math.min(Math.max(x, a), b); }

  /* ---- 1. hero in layers ---- */
  var hero = main.querySelector('.specialty-hero, .speech-hero');
  var heroBox = hero && hero.firstElementChild;
  var heroCopy = heroBox && heroBox.querySelector('.reveal');
  var orbs = [];
  if (heroBox && heroCopy) {
    var layer = el('div', 'tm-orbs', { 'aria-hidden': 'true' });
    [[accent, 'o1', 0.34], [others[0], 'o2', 0.2], [others[1], 'o3', 0.5], [others[2] || '#58595B', 'o4', 0.12]].forEach(function (s, i) {
      var o = el('i', 'tm-orb ' + s[1]); var b = el('b');
      o.style.setProperty('--c', s[0]); o.style.setProperty('--n', i); o.dataset.depth = s[2];
      o.appendChild(b); layer.appendChild(o); orbs.push(o);
    });
    heroBox.insertBefore(layer, heroCopy);
    heroCopy.classList.add('tm-hero-copy');
    if (fine && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
      hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
    }
  }

  /* ---- 2. «Πότε» as a sequence ---- */
  var steps = main.querySelector('.specialty-signs-list, .speech-observations');
  var counter = null, bar = null, total = 0;
  if (steps) {
    var items = Array.prototype.slice.call(steps.children);
    total = items.length;
    steps.classList.add('tm-steps');
    var intro = steps.parentElement.querySelector('.specialty-signs-intro, .speech-concerns-intro');
    if (intro && total > 1) {
      var prog = el('div', 'tm-progress', { 'aria-hidden': 'true' });
      counter = el('span', 'tm-count'); counter.innerHTML = '<b>01</b><i>/ ' + String(total).padStart(2, '0') + '</i>';
      bar = el('span', 'tm-bar'); bar.appendChild(el('em'));
      prog.appendChild(counter); prog.appendChild(bar);
      var cta = intro.querySelector('.signs-cta');
      intro.insertBefore(prog, cta || null);
    }
    var setActive = function (idx) {
      items.forEach(function (li, i) { li.classList.toggle('is-on', i === idx); li.classList.toggle('is-past', i < idx); });
      if (counter) counter.firstChild.textContent = String(idx + 1).padStart(2, '0');
      if (bar) bar.firstChild.style.transform = 'scaleX(' + ((idx + 1) / total).toFixed(3) + ')';
    };
    var sio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) setActive(items.indexOf(e.target)); });
    }, { rootMargin: '-42% 0px -42% 0px' });
    items.forEach(function (li) { sio.observe(li); });
    if (reduce) setActive(total - 1);
  }

  /* ---- 3. domains: the row being read takes the specialty colour ---- */
  var rows = Array.prototype.slice.call(main.querySelectorAll('.specialty-domains > li, .speech-area-list > li'));
  if (rows.length) {
    var dio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting); });
    }, { rootMargin: '-40% 0px -40% 0px' });
    rows.forEach(function (r) { r.classList.add('tm-row'); dio.observe(r); });
  }

  /* ---- 4. dark section: layered photo, or drawn step rules ---- */
  var layered = [];
  Array.prototype.forEach.call(main.querySelectorAll('.specialty-dark .specialty-photo, .speech-practice .speech-photo'), function (fig) {
    var box = fig.querySelector('.depth-box'); if (!box) return;
    fig.classList.add('tm-layered');
    box.insertBefore(el('span', 'tm-frame', { 'aria-hidden': 'true' }), box.firstChild);
    var d1 = el('span', 'tm-dot d1', { 'aria-hidden': 'true' }); d1.style.setProperty('--c', others[0]);
    var d2 = el('span', 'tm-dot d2', { 'aria-hidden': 'true' }); d2.style.setProperty('--c', accent);
    fig.appendChild(d1); fig.appendChild(d2); layered.push(fig);
  });
  var lists = Array.prototype.slice.call(main.querySelectorAll('.specialty-process-list, .speech-practice-points'));
  var lio = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('tm-in'); lio.unobserve(e.target); } });
  }, { threshold: 0.25 });
  lists.forEach(function (l) { l.classList.add('tm-rules'); Array.prototype.forEach.call(l.children, function (c, i) { c.style.setProperty('--k', i); }); lio.observe(l); });

  /* ---- 5. section titles rise word by word ---- */
  function splitWords(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var w = el('span', 'tm-w'); w.textContent = p; w.style.setProperty('--w', counter.i++); frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1) splitWords(n, counter);
    });
  }
  var heads = Array.prototype.slice.call(main.querySelectorAll('section:not(.specialty-hero):not(.speech-hero) h2'));
  if (!reduce) {
    var hio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('tm-show'); hio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    heads.forEach(function (h) { splitWords(h, { i: 0 }); h.classList.add('tm-words'); hio.observe(h); });
  }

  /* ---- one scroll loop for the depth effects ---- */
  if (reduce) return;
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    if (hero) {
      var r = hero.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var p = clamp(-r.top / r.height, 0, 1);
        hero.style.setProperty('--hp', p.toFixed(3));
      }
    }
    layered.forEach(function (fig) {
      var rr = fig.getBoundingClientRect();
      if (rr.bottom < -200 || rr.top > vh + 200) return;
      fig.style.setProperty('--tp', clamp((rr.top + rr.height / 2 - vh / 2) / vh, -1, 1).toFixed(3));
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
