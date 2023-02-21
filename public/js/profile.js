const tabLinks = document.querySelectorAll(
  '.tab-links li a:not([href="#signout"])',
);
const tabContent = document.querySelectorAll('.tab-content');

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

const signOutButton = document.querySelector('a[href="#signout"]');
signOutButton.addEventListener('click', (e) => {
  e.preventDefault();

  alert('You have been signed out.');
});
