import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ title, data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      title: {
        text: title,
        align: "left",
      },
      xaxis: {
        categories: [],
      },
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const transformedData = {
        x: data.map((item) => item.x),
        y: data.map((item) => item.y),
      };

      setChartData({
        series: [
          {
            name: title,
            data: transformedData.y,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: transformedData.x, 
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="w-full">
      {chartData.series.length > 0 ? (
        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
      ) : (
        <div className="text-center text-gray-500">No Data Available</div>
      )}
    </div>
  );
};

export default BarChart;
