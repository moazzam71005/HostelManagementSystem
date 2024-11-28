import React from "react";

export const SelectContent = ({ children, onValueChange }) => {
  return <div>{React.Children.map(children, (child) => React.cloneElement(child, { onValueChange }))}</div>;
};
