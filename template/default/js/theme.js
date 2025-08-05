const themeButtons = document.querySelectorAll('.theme-btn');
const { documentElement: html } = document;

const currentSetting = localStorage.getItem('theme') || 'dark';
themeButtons.forEach(btn => {
  btn.classList.toggle('active', btn.dataset.theme === currentSetting);
});

const setTheme = (theme) => {
  const finalTheme = theme === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : theme;

  html.setAttribute('data-theme', finalTheme);
  localStorage.setItem('theme', theme);

  themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
};

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('theme-btn')) {
    setTheme(e.target.dataset.theme);
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'system') {
    setTheme('system');
  }
});
