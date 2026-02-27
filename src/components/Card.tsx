interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Card = ({ children, className = '', ...props }: CardProps) => (
  <div
    className={`glass-card rounded-xl p-4 md:p-5 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
