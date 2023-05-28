const form = useQuery('form');
form.onsubmit = (e) => {
  e.preventDefault();
  showLoading();
  const formData = new FormData(form);
  const body = {};
  formData.forEach((value, key) => (body[key] = value));
  fetch(location.pathname, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast(
        location.pathname.includes('edit')
          ? 'Chỉnh sửa thành công'
          : 'Tạo mới thành công',
      );
      if (!location.pathname.includes('edit')) {
        form.reset();
      }
    })
    .catch((e) => {
      console.log(e);
      setTimeout(() => {
        hideLoading();
      }, 1000);
      showToast(
        location.pathname.includes('edit')
          ? 'Chỉnh sửa thất bại'
          : 'Tạo mới thất bại',
        false,
      );
    });
};

useQuery('a[href="delete"').onclick = (e) => {
  e.preventDefault();
  Swal.fire({
    title: 'Bạn có chắc muốn xoá sự kiện này?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Huỷ',
    confirmButtonText: 'Đồng ý',
    confirmButtonColor: 'red',
  }).then((result) => {
    if (result.isConfirmed) {
      location.replace(
        `${location.origin}/event/${location.pathname.split('/')[2]}/delete`,
      );
    }
  });
};

useQuery('#show-modal').onclick = () => {
  showModal();
};
