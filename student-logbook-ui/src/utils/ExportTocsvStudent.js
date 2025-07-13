export default function exportScoresToCSV(scores, filename = 'my_scores.csv') {
  if (!scores || scores.length === 0) return;

  const headers = [
    'Date',
    ...criteria.map(c => c.label),
    'Preceptor',
    'Email',
    'Comment',
  ];

  const rows = scores.map(score => [
    new Date(score.createdAt).toLocaleDateString(),
    ...criteria.map(c => score[c.key]),
    score.supervisorName,
    score.supervisorEmail,
    score.comment || '-',
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
