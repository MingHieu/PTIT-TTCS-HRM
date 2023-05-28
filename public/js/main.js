const useQuery = (selector) => document.querySelector(selector);
const useQueryAll = (selector) => document.querySelectorAll(selector);

const showToast = (text, success = true, onClick = () => {}) => {
  Toastify({
    text,
    duration: 3000,
    newWindow: true,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: success ? '#0abf30' : '#f24d4c',
    },
    onClick, // Callback after click
  }).showToast();
};

const successMsg = useQuery('#successMsg');
if (successMsg) {
  showToast(successMsg.value);
}

const errorMsg = useQuery('#errorMsg');
if (errorMsg) {
  showToast(errorMsg.value, false);
}

const loader = useQuery('.loader-wrapper');
const showLoading = () => {
  loader.style.display = 'flex';
};

const hideLoading = () => {
  loader.style.display = 'none';
};

const modalContainer = useQuery('.modal-container');
if (modalContainer) {
  modalContainer.onclick = (e) => {
    if (e.target == modalContainer) {
      modalContainer.style.display = 'none';
    }
  };
}

const showModal = () => {
  modalContainer.style.display = 'grid';
};
