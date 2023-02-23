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

const successMsg = useQuery('#successMsg');
if (successMsg) {
  Toastify({
    text: successMsg.value,
    duration: 3000,
    newWindow: true,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: '#0abf30',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

const errorMsg = useQuery('#errorMsg');
if (errorMsg) {
  Toastify({
    text: errorMsg.value,
    duration: 3000,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: '#f24d4c',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
