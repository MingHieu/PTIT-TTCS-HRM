// Upload thumbnail
const thumbnailUpload = useQuery('#thumbnail');
const thumbnailPreview = useQuery('#thumbnail-preview');

if (thumbnailPreview.src) {
  thumbnailPreview.style.display = 'block';
}
thumbnailUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    thumbnailPreview.src = e.target.result;
    thumbnailPreview.style.display = 'block';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    thumbnailPreview.src = '';
    thumbnailPreview.style.display = 'none';
  }
});

// Content
let editorJS = new EditorJS({
  /**
   * Id of Element that should contain the Editor
   */
  holder: 'content',

  /**
   * Available Tools list.
   * Pass Tool's class or Settings object for each Tool you want to use
   */
  tools: {
    header: Header,
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: '/file', // Your backend file uploader endpoint
        },
      },
    },
    list: NestedList,
  },
  data:
    useQuery('input[class="content"]').value &&
    JSON.parse(useQuery('input[class="content"]').value),
});

const form = useQuery('form');
form.onreset = () => {
  thumbnailPreview.src = '';
  thumbnailPreview.style.display = 'none';
};

form.onsubmit = (e) => {
  e.preventDefault();
  showLoading();
  editorJS
    .save()
    .then((outputData) => {
      const formData = new FormData(form);
      formData.append('content', JSON.stringify(outputData));
      return fetch(location.pathname, {
        method: 'POST',
        body: formData,
      });
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
        editorJS.blocks.clear();
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
    title: 'Bạn có chắc muốn xoá bản tin này?',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Huỷ',
    confirmButtonText: 'Đồng ý',
    confirmButtonColor: 'red',
  }).then((result) => {
    if (result.isConfirmed) {
      location.replace(
        `${location.origin}/news/${location.pathname.split('/')[2]}/delete`,
      );
    }
  });
};
