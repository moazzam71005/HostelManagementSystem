'use client';

export const SelectItem = ({ value, children, onValueChange, closeDropdown }) => {
  const handleClick = () => {
    onValueChange(value);
    closeDropdown();
  };

  return (
    <div
      onClick={handleClick}
      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
    >
      {children}
    </div>
  );
};
