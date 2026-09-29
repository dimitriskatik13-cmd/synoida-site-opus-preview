/* Αξιολόγηση: the four steps of «Η διαδικασία, βήμα βήμα» light up one by one while scrolling,
   the same way the «Πότε να απευθυνθείτε» signs do on the therapy pages. Decorative only. */
(function () {
  var main = document.querySelector('main.assessment-refined');
  var steps = main && main.querySelector('.assessment-steps');
  if (!steps || !('IntersectionObserver' in window)) return;
  var items = Array.prototype.slice.call(steps.children);
  if (items.length < 2) return;
  main.classList.add('as-on');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setActive(idx) {
    items.forEach(function (li, i) { li.classList.toggle('is-on', i === idx); li.classList.toggle('is-past', i < idx); });
  }
  if (reduce) { setActive(items.length - 1); return; }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) setActive(items.indexOf(e.target)); });
  }, { rootMargin: '-42% 0px -42% 0px' });
  items.forEach(function (li) { io.observe(li); });
})();
