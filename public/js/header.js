const menuToggle = useQuery('.menu-toggle');
const nav = useQuery('.nav-container');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});

nav.onclick = (e) => {
  if (e.target === nav) {
    nav.classList.toggle('show');
  }
};

const cookies = document.cookie
  .split(';')
  .map((item) => item.split('='))
  .reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});

const userAvatarHeader = useQuery('.user-avatar-header');
const avatarCookie = decodeURIComponent(cookies['user_avatar']);
userAvatarHeader.src =
  avatarCookie && avatarCookie != 'j:null'
    ? avatarCookie
    : '/img/default-user.jpeg';

const usernameHeader = useQuery('.username-header');
usernameHeader.innerHTML = cookies['username'];
