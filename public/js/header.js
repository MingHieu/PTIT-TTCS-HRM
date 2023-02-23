const menuToggle = useQuery('.menu-toggle');
const nav = useQuery('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});
