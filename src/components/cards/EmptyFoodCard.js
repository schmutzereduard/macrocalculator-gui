import { VscAdd } from 'react-icons/vsc'; // Font Awesome React Icons
import "./EmptyFoodCard.css";

function EmptyFoodCard() {

    return (
        <div className="empty-food-card">
            <VscAdd className="plus-icon" />
        </div>
    );
}

export default EmptyFoodCard;