export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-blue-100 shadow-md rounded-2xl p-6 flex items-center gap-4">
      <div className="text-blue-700 text-3xl">
        <Icon />
      </div>
      <div>
        <h4 className="text-gray-600 text-sm">{label}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
