import "./Button.css"

const Button = ({className, handleClick, buttonText, disabled}) => {
  return (
    <button className={`button ${className}`} onClick={handleClick} disabled={disabled}>{buttonText}</button>
  )
}

export default Button