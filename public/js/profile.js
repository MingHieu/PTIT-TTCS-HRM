const tabLinks = useQueryAll('.tab-links li a:not([href="/signout"])');
const tabContent = useQueryAll('.tab-content');

tabLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    tabLinks.forEach((link) => link.classList.remove('active'));
    tabContent.forEach((tab) => tab.classList.remove('active'));
    link.classList.add('active');
    const tabId = link.getAttribute('href');
    document.querySelector(tabId).classList.add('active');
  });
});
