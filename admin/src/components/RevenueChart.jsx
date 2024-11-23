import React, { useState, useEffect } from "react";
import { Chart } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { AdminContext } from "../context/AdminContext";

const RevenueChart = () => {
  const { dashData } = useContext(AdminContext); // Lấy dữ liệu từ AdminContext
  const [chartData, setChartData] = useState({});
  const [chartType, setChartType] = useState("day"); // Mặc định hiển thị theo ngày

  useEffect(() => {
    if (!dashData) return; // Nếu chưa có dữ liệu thì không làm gì

    // Dữ liệu từ dashData
    const dailyStats = dashData.dailyStats || [];
    const monthlyStats = dashData.monthlyStats || [];
    const yearlyStats = dashData.yearlyStats || [];

    // Tùy theo chartType, định nghĩa labels và data
    let labels = [];
    let data = [];

    if (chartType === "day") {
      labels = dailyStats.map((stat) => stat.date); // Ngày
      data = dailyStats.map((stat) => stat.totalAmount);
    } else if (chartType === "month") {
      labels = monthlyStats.map((stat) => `${stat.month}/${stat.year}`); // Tháng/Năm
      data = monthlyStats.map((stat) => stat.totalAmount);
    } else if (chartType === "year") {
      labels = yearlyStats.map((stat) => stat.year); // Năm
      data = yearlyStats.map((stat) => stat.totalAmount);
    }

    setChartData({
      labels,
      datasets: [
        {
          label: `Doanh thu (${
            chartType === "day"
              ? "ngày"
              : chartType === "month"
              ? "tháng"
              : "năm"
          })`,
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.4, // Đường cong mềm mại
        },
      ],
    });
  }, [chartType, dashData]);

  return (
    <div className="revenue-chart">
      {/* Dropdown lựa chọn */}
      <div className="mb-4">
        <select
          className="border px-4 py-2 rounded"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      {/* Biểu đồ */}
      {chartData.labels ? (
        <Line data={chartData} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default RevenueChart;
