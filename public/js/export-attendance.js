const attendanceData = JSON.parse(
  useQuery('input[name="attendance-data"]').value,
);

const sheetData = [
  [
    'STT',
    'Họ và tên',
    'Tên đăng nhập',
    'Đúng giờ',
    'Đi muộn',
    'Nghỉ có phép',
    'Nghỉ không phép',
  ],
];

attendanceData.forEach((value) => {
  sheetData.push(sheetData[0].map((key) => value[key]));
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(sheetData);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
XLSX.writeFile(wb, 'BaoCaoChamCong.xlsx');
