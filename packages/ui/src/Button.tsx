
type varianceType = "primary" | "outline"
function Button({ className, style = 'primary', onClick }: { className?: string, style?: varianceType, onClick?: () => void }) {
     const defaultStyle = "px-4 py-2 rounded font-semibold";
     const variancea = {
          "primary": "bg-blue-600 text-white hover:bg-blue-700",
          "outline": "border border-blue-600 text-blue-600 hover:bg-blue-50"
     }
     return (
          <button 
               className={`${className} ${defaultStyle} ${variancea[style]} `}
               onClick={onClick}
          >
               Button
          </button>
     )
}

export default Button