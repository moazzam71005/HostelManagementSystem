import React, { useState } from "react";

export const Select = ({ children, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {React.Children.map(children, (child) => {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, { selectedValue });
          }
          return null;
        })}
      </div>
      {isOpen && (
        <div className="absolute bg-white border rounded mt-2 z-10">
          {React.Children.map(children, (child) => {
            if (child.type === SelectContent) {
              return React.cloneElement(child, { onValueChange: handleValueChange });
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};
