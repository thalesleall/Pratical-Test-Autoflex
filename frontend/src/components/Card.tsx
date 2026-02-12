interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className = "", hover = true, style }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 ${hover ? "hover:shadow-2xl hover:-translate-y-1" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}
