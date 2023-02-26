const avatar = useQuery('.avatar-wrapper img');
const avatarUpload = useQuery('#avatar');

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    avatar.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
