import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

class ViewRecipeModal extends Component {
    render() {
        const { isOpen, onRequestClose, recipe } = this.props;
        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="View Recipe Modal"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60%',
                        padding: '20px'
                    }
                }}
            >
                <h2>{recipe?.name}</h2>
                <p>{recipe?.description}</p>
                <h3>Foods in this Recipe</h3>
                <ul>
                    {recipe?.recipeFoods.map((rf, index) => (
                        <li key={index}>
                            {rf.food.name} - {rf.quantity}g (Carbs: {rf.carbs}g, Calories: {rf.calories}kcal)
                        </li>
                    ))}
                </ul>
                <button onClick={onRequestClose}>Close</button>
            </Modal>
        );
    }
}

export default ViewRecipeModal;
