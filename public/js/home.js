new Chart(useQuery('#project-dashboard__body'), {
  type: 'bar',
  data: {
    labels: [...Array(12).keys()].map((val) => `Tháng ${val + 1}`),
    datasets: [
      {
        label: 'Số dự án',
        data: [1, 3, 5, 2, 3, 0],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          //   padding: 100,
        },
      },
    },
  },
});

new Chart(useQuery('#employee-dashboard__body'), {
  type: 'line',
  data: {
    labels: [...Array(12).keys()].map((val) => `Tháng ${val + 1}`),
    datasets: [
      {
        label: 'Nhân viên mới',
        data: [20, 3, 50, 0, 3, 0],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  },
});
