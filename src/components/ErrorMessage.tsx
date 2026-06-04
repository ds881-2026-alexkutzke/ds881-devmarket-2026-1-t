import './styles/ErrorMessage.css';
import { BiError } from "react-icons/bi";

export default function ErrorMessage({message}: {message: string}) {
    return (
        <div className="error-message" role="alert">
            <span className="error-icon"><BiError /></span>
            <span className="error-text">{message}</span>
        </div>
    )
}
