// src/components/ui/card/Card.js
export default function Card({ children, className }) {
    return (
      <div className={`bg-white shadow rounded-lg overflow-hidden ${className || ''}`}>
        {children}
      </div>
    );
  }
  