export default function StatCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'border-gray-200 bg-white',
    good: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    info: 'border-blue-200 bg-blue-50',
  }

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
