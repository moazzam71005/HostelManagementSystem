// src/components/ui/card/CardContent.js
export default function CcardContent({ children, className }) {
    return (
      <div className={`p-4 ${className || ''}`}>
        {children}
      </div>
    );
  }
  