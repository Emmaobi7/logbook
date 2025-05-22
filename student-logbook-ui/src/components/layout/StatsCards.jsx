import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from 'react-icons/fa';

const statsData = [
  {
    id: 1,
    label: 'Total Entries',
    value: 45,
    icon: <FaClipboardList className="text-blue-500" />,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    id: 2,
    label: 'Approved Entries',
    value: 30,
    icon: <FaCheckCircle className="text-green-500" />,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  {
    id: 3,
    label: 'Rejected Entries',
    value: 5,
    icon: <FaTimesCircle className="text-red-500" />,
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  {
    id: 4,
    label: 'Pending Entries',
    value: 10,
    icon: <FaHourglassHalf className="text-yellow-500" />,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
];

export default function StatsCards({ stats = statsData }) {
  return (
    <div className="overflow-x-hidden px-4"> {/* ✅ Prevent horizontal scroll */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
    {stats.map(({ id, label, value, icon, bgColor, textColor }) => (
      <div
        key={id}
        className={`flex items-center gap-4 p-4 rounded-lg shadow ${bgColor} w-full max-w-full overflow-hidden`} // ✅ Constrain width
      >
        <div className={`p-3 rounded-full ${textColor} bg-white shrink-0`}>
          {icon}
        </div>
        <div className="truncate">
          <p className="text-2xl font-semibold break-words">{value}</p> {/* ✅ break long values */}
          <p className="text-sm text-gray-600 break-words">{label}</p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
