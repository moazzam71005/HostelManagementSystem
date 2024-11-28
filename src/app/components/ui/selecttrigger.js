'use client';

export default function SelectTrigger({ children, onClick }) {
  return (
    <div
      tabIndex="0"
      role="button"
      onClick={onClick}
      className="p-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {children}
    </div>
  );
}
