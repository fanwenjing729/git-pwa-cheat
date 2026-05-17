// ===== PWA: Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/git-pwa-cheat/sw.js', {
      scope: '/git-pwa-cheat/'
    }).catch(function(err) {
      console.warn('SW registration failed:', err);
    });
  });
}

// === 折叠/展开 ===
document.querySelectorAll('.cmd-header').forEach(header => {
  header.addEventListener('click', () => {
    header.parentElement.classList.toggle('open');
  });
});

// === 搜索 ===
const searchInput = document.getElementById('search');
const noResult = document.getElementById('noResult');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  let foundAny = false;

  document.querySelectorAll('.category').forEach(cat => {
    let catHasVisible = false;

    cat.querySelectorAll('.cmd').forEach(cmd => {
      const text = cmd.textContent.toLowerCase();
      if (!q || text.includes(q)) {
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

// === 回到顶部 ===
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.style.display = window.scrollY > 400 ? 'flex' : 'none';
});
backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// === 侧边栏平滑滚动 ===
document.querySelectorAll('nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// === 默认展开第一个命令作为示例 ===
document.querySelector('.cmd').classList.add('open');
