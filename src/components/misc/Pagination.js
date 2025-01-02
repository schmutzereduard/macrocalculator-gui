import React from "react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {

    return (
        <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={page === currentPage ? "pagination-button-active" : "pagination-button"}
                >
                    {page}
                </button>
            ))}
        </div>
    );
}

export default Pagination;
