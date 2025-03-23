import React, { useState } from 'react';

const Report = () => {
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (date) {
      const [selectedYear, selectedMonth] = date.split('-');
      setMonth(selectedMonth);
      setYear(selectedYear);
      window.location.href = `http://localhost:5000/report?month=${selectedMonth}&year=${selectedYear}`;
    }

  };

  return (
    <div>
      <div className="border border-gray-400 p-4 mt-5 mb-5 rounded-md">
        <span className="text-2xl font-bold">Generate Report</span>
      </div>
      <div className="flex flex-col border-solid border-2 bg-white border-gray-300 h-100 p-4 rounded-xl">
        <form onSubmit={handleSubmit}>
          {/* Report Periods */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Report Periods
            </label>
            <input
              type="month"
              placeholder='For example, "June, 2024"'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="appearance-none border-solid border-0 border-b border-gray-900 focus:outline-none focus:border-teal-500 focus:ring-0 w-full text-gray-700 leading-tight"
              required
            />
          </div>

          <button 
            type="submit"
            className="bg-blue-500 text-white drop-shadow-xl p-2"
          >
            Generate PDF
          </button>
        </form>

      </div>
    </div>
  );
};

export default Report;
