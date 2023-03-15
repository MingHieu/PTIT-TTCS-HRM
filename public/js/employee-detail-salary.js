useQuery('button[type="submit"]').onclick = () => {
  Swal.fire({
    title: 'Cập nhật mức lương mới',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Mức lương mới">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Ghi chú">',
    showCancelButton: true,
    confirmButtonText: 'Cập nhật',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return fetch(`//api.github.com/users/${login}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url,
      });
    }
  });
};
