// Pagination
const prevBtn = useQuery(`#pg-button-prev`);
const nextBtn = useQuery(`#pg-button-next`);
const lastPage = useQuery('input[name="lastPage"]');
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
  if (lastPage.checked) {
    return;
  }
  ++currentPage;
  searchParams.set('page', currentPage);
  let paramStr = '';
  searchParams.forEach((v, k) => (paramStr += `${k}=${v}&`));
  paramStr = paramStr.substring(0, paramStr.length - 1);
  location.replace(`${location.origin}${location.pathname}?${paramStr}`);
};
