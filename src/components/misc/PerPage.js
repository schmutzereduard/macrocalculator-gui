import "./PerPage.css";

function PerPage({ itemsPerPage, onChange }) {

    return (
        <select className="per-page" value={itemsPerPage} onChange={onChange}>
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </select>
    );
}

export default PerPage;