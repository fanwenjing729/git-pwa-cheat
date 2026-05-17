// ===== PWA: Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js', {
      scope: './'
    }).catch(function(err) {
      console.warn('SW registration failed:', err);
    });
  });
}

// === 折叠/展开 ===
document.querySelectorAll('.cmd-header').forEach(function(header) {
  header.addEventListener('click', function() {
    header.parentElement.classList.toggle('open');
  });
});

// === 搜索 ===
var searchInput = document.getElementById('search');
var noResult = document.getElementById('noResult');
if (searchInput && noResult) {
  searchInput.addEventListener('input', function() {
    var q = searchInput.value.toLowerCase().trim();
    var foundAny = false;

    document.querySelectorAll('.category').forEach(function(cat) {
      var catHasVisible = false;

      cat.querySelectorAll('.cmd').forEach(function(cmd) {
        var text = cmd.textContent.toLowerCase();
        if (!q || text.indexOf(q) !== -1) {
          cmd.classList.remove('hidden');
          catHasVisible = true;
          foundAny = true;
        } else {
          cmd.classList.add('hidden');
        }
      });

      cat.style.display = catHasVisible || !q ? '' : 'none';
    });

    noResult.style.display = foundAny || !q ? 'none' : 'block';
  });
}

// === 回到顶部 ===
var backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', function() {
    backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  backTop.addEventListener('click', function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

// === 侧边栏平滑滚动 ===
document.querySelectorAll('nav a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({behavior: 'smooth'});
    document.body.classList.remove('nav-open');
  });
});

// === 移动端汉堡菜单 ===
var hamburger = document.getElementById('hamburger');
var overlay = document.getElementById('overlay');
if (hamburger) {
  hamburger.addEventListener('click', function() {
    document.body.classList.toggle('nav-open');
  });
}
if (overlay) {
  overlay.addEventListener('click', function() {
    document.body.classList.remove('nav-open');
  });
}

// === 默认展开第一个命令作为示例 ===
var firstCmd = document.querySelector('.cmd');
if (firstCmd) firstCmd.classList.add('open');
