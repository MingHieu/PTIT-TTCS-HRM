// Upload avatar
const avatarUpload = useQuery('#avatar');
const avatarPreview = useQuery('.avatar-wrapper img');

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    avatarPreview.src = e.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    avatarPreview.src = 'https://via.placeholder.com/200';
  }
});

// Submit form
const form = useQuery('form');
form.onreset = () => {
  avatarPreview.src = 'https://via.placeholder.com/200';
};

form.onsubmit = (e) => {
  e.preventDefault();
  showLoading();
  fetch(location.pathname, {
    method: 'POST',
    body: new FormData(form),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast('Tạo mới thành công');
      form.reset();
    })
    .catch((e) => {
      console.log(e);
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast('Tạo mới thất bại', false);
    });
};
