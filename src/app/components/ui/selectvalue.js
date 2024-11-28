'use client';

export const SelectValue = ({ placeholder, value }) => (
  <span className="text-gray-700">{value || placeholder}</span>
);
