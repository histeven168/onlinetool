document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
      // 使用classList代替直接修改style
      backToTopBtn.classList.toggle('show', window.scrollY > 100);
    });
    
    // 点击事件 - 平滑滚动
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });