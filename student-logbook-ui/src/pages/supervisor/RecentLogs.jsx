const RecentLogsTable = () => {
  const logs = [
    { student: "John Doe", date: "2025-05-22", status: "pending" },
    { student: "Aisha Bello", date: "2025-05-21", status: "approved" },
    { student: "Chinedu Okeke", date: "2025-05-21", status: "rejected" },
  ];

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2">Student</th>
          <th className="p-2">Date</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index} className="border-b hover:bg-gray-100">
            <td className="p-2">{log.student}</td>
            <td className="p-2">{log.date}</td>
            <td className="p-2 capitalize text-blue-700">{log.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default RecentLogsTable;