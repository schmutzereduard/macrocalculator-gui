import { useState } from "react";

function useModals() {

    const [modals, setModals] = useState({});

    const openModal = (modalKey, config = {}) => {

        setModals((prev) => ({
            ...prev,
            [modalKey]: { isOpen: true, ...config },
        }));
    };

    const closeModal = (modalKey) => {

        setModals((prev) => ({
            ...prev,
            [modalKey]: { ...prev[modalKey], isOpen: false },
        }));
    };

    const resetModal = (modalKey) => {

        setModals((prev) => {
            const updatedModals = { ...prev };
            delete updatedModals[modalKey];
            return updatedModals;
        });
    };

    return { modals, openModal, closeModal, resetModal };
}

export default useModals;
