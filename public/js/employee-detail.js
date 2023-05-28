useQuery('a[href="delete"').onclick = (e) => {
  e.preventDefault();
  Swal.fire({
    title: 'Bạn có chắc muốn xoá tài khoản này?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Huỷ',
    confirmButtonText: 'Đồng ý',
    confirmButtonColor: 'red',
  }).then((result) => {
    if (result.isConfirmed) {
      location.replace(
        `${location.origin}/employee/${location.pathname.split('/')[2]}/delete`,
      );
    }
  });
};
