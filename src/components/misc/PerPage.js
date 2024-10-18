function PerPage({ itemsPerPage, handleItemsPerPageChange: onChange }) {

    return (
        <select className="per-page" value={itemsPerPage} onChange={onChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
        </select>
    );
}

export default PerPage;