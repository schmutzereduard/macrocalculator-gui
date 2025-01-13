import { VscAdd } from 'react-icons/vsc'; // Font Awesome React Icons
import "./PlusCard.css";

function PlusCard({onClick}) {

    return (
        <div onClick={onClick} className="plus-card">
            <VscAdd className="plus-icon" />
        </div>
    );
}

export default PlusCard;