// Upload thumbnail
const thumbnailUpload = document.getElementById('thumbnail');
const thumbnailPreview = document.getElementById('thumbnail-preview');

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
const editorJS = new EditorJS({
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
          byFile: '/api/upload',
        },
      },
    },
    list: NestedList,
  },
});
