// src/components/ui/card/CardTitle.js
export default function CardTitle({ children, className }) {
    return (
      <h3 className={`text-lg font-semibold text-gray-900 ${className || ''}`}>
        {children}
      </h3>
    );
  }
  