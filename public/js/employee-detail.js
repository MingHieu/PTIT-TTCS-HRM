// get all tab links and tab content
const tabLinks = document.querySelectorAll('.tab-links li a');
const tabContent = document.querySelectorAll('.tab-content');

// add click event listeners to tab links
tabLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    // remove active class from all tab links and tab content
    tabLinks.forEach((link) => link.classList.remove('active'));
    tabContent.forEach((tab) => tab.classList.remove('active'));
    // add active class to clicked tab link and corresponding tab content
    link.classList.add('active');
    const tabId = link.getAttribute('href');
    document.querySelector(tabId).classList.add('active');
  });
});

// // add click event listener to sign out button
// const signOutButton = document.getElementById('sign-out-button');
// signOutButton.addEventListener('click', (e) => {
//   e.preventDefault();
//   // perform sign out logic here
//   alert('You have been signed out.');
// });
