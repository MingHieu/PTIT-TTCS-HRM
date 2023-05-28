new Chart(useQuery('#project-dashboard__body'), {
  type: 'bar',
  data: {
    labels: [...Array(12).keys()].map((val) => `Tháng ${val + 1}`),
    datasets: [
      {
        label: 'Số dự án',
        data: JSON.parse(useQuery('input[name="projectStatistic"]').value),
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
        data: JSON.parse(useQuery('input[name="userStatistic"]').value),
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
