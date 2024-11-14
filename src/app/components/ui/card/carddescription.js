// src/components/ui/card/CardDescription.js
export default function CardDescription({ children, className }) {
    return (
      <p className={`text-sm text-gray-600 ${className || ''}`}>
        {children}
      </p>
    );
  }
  