import {useState} from "react";

function usePagination() {
    const [pageConfig, setPageConfig] = useState({
        currentPage: 1,
        itemsPerPage: 10
    })

    const handlePageChange = (page) => {
        setPageConfig({
           ...pageConfig,
           currentPage: page
        });
    }

    const handleItemsPerPageChange = (e) => {
        setPageConfig({
            currentPage: 1,
            itemsPerPage: Number(e.target.value)
        })
    };

    const paginate = (items) => {
        return[...items].slice(
            (pageConfig.currentPage - 1) * pageConfig.itemsPerPage,
            pageConfig.currentPage * pageConfig.itemsPerPage
        );
    }

    return { pageConfig, paginate, handlePageChange, handleItemsPerPageChange };
}

export default usePagination;