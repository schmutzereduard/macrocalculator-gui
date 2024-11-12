import {useState} from "react";

function useModals() {

    const[modalConfig, setModalConfig] = useState({
        isItemModalOpen: false,
        isSaveItemModalOpen: false,
        isDeleteItemModalOpen: false,
        item: {
            id: null,
            name: null
        }
    });

    return { modalConfig, setModalConfig };
}

export default useModals;