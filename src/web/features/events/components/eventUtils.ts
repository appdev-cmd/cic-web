export const cleanEventHtml = (html: string) => {
  if (!html) return '';
  return html
    // Prefix any relative /upload_images URLs to https://www.cic.com.vn/upload_images
    .replace(/src="\/upload_images\//g, 'src="https://www.cic.com.vn/upload_images/')
    // Ensure referrerpolicy="no-referrer" on all img tags
    .replace(/<img\b(?![^>]*\breferrerpolicy=)/gi, '<img referrerpolicy="no-referrer"');
};

export const getDaysRemaining = (isoDateStr: string) => {
  if (!isoDateStr) return 0;
  const date = new Date(isoDateStr).getTime();
  if (isNaN(date)) return 0;
  const diffMs = date - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

export const getStatusLabel = (status: 'upcoming' | 'ongoing' | 'past') => {
  switch (status) {
    case 'upcoming':
      return 'Sắp diễn ra';
    case 'ongoing':
      return 'Đang diễn ra';
    case 'past':
      return 'Đã kết thúc';
  }
};

export const getStatusBadgeStyle = (status: 'upcoming' | 'ongoing' | 'past') => {
  switch (status) {
    case 'upcoming':
      return 'bg-orange-600 text-white font-bold';
    case 'ongoing':
      return 'bg-emerald-600 text-white font-bold';
    case 'past':
      return 'bg-slate-700 text-white font-bold';
  }
};

export const getStatusColor = getStatusBadgeStyle;

export const formatAgendaDate = (isoStr: string, dateStr: string) => {
  try {
    const d = new Date(isoStr);
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = monthNames[d.getMonth()] || 'T' + (d.getMonth() + 1);
    const time = isoStr.includes('T') ? isoStr.split('T')[1].slice(0, 5) : '08:30';
    return { day, month, time };
  } catch {
    const parts = dateStr.split('/');
    return { day: parts[0] || '15', month: 'THÁNG ' + (parts[1] || '8'), time: '08:30' };
  }
};
