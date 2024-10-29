import {useState} from "react";

function useModals() {

    const[modalConfig, setModalConfig] = useState({
        isItemModalOpen: false,
        isDeleteItemModalOpen: false,
        itemToDelete: {
            id: null,
            name: null
        }
    });

    return { modalConfig, setModalConfig };
}

export default useModals;