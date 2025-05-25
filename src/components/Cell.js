import React from 'react';

function Cell({ row, col, type, className, onMouseDown, onMouseEnter, onClick, onTouchStart, onTouchMove }) {
    return (
        <div
            className={`cell ${className}`}  
            data-row={row}  
            data-col={col}  
            onMouseDown={onMouseDown}  
            onMouseEnter={onMouseEnter}  
            onClick={onClick}  
            onTouchStart={onTouchStart}  
            onTouchMove={onTouchMove}  
        >
        </div>
    );
}

export default React.memo(Cell);  