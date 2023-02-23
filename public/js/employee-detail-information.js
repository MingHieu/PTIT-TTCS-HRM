const avatar = document.querySelector('#information-tab img');
const avatarUpload = document.querySelector('#avatar-upload');

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    avatar.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
