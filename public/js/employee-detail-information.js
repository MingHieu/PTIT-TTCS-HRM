const avatar = useQuery('#information-tab img');
const avatarUpload = useQuery('#avatar-upload');

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    avatar.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
