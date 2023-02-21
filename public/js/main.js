if (document.querySelector(`input[name="pagination"]`)) {
  // Pagination
  const prevBtn = document.querySelector(`#pg-button-prev`);
  const nextBtn = document.querySelector(`#pg-button-next`);
  const lastPage = document.querySelector('input[name="lastPage"]');
  const searchParams = new URLSearchParams(location.search.split('?')[1]);
  let currentPage = searchParams.has('page') ? +searchParams.get('page') : 1;

  prevBtn.onclick = () => {
    if (currentPage <= 1) {
      return;
    }
    --currentPage;
    searchParams.set('page', currentPage);
    let paramStr = '';
    searchParams.forEach((v, k) => (paramStr += `${k}=${v}&`));
    paramStr = paramStr.substring(0, paramStr.length - 1);
    location.replace(`${location.origin}${location.pathname}?${paramStr}`);
  };

  nextBtn.onclick = () => {
    if (currentPage >= +lastPage.value) {
      return;
    }
    ++currentPage;
    searchParams.set('page', currentPage);
    let paramStr = '';
    searchParams.forEach((v, k) => (paramStr += `${k}=${v}&`));
    paramStr = paramStr.substring(0, paramStr.length - 1);
    location.replace(`${location.origin}${location.pathname}?${paramStr}`);
  };

  // Search
  const searchBtn = document.querySelector(`.search-btn`);
  searchBtn.onclick = () => {
    const searchInput = document.querySelector('.search-input');
    location.replace(
      `${location.origin}${location.pathname}?keySearch=${searchInput.value}`,
    );
  };
}
