import React, { useRef } from 'react';
import Cell from './Cell';
import { getCellClass } from '../utils/helpers';

function MazeGrid({ grid, numRows, numCols, handleCellInteraction, isMouseDownRef, isSolving, isGenerating }) {
    const lastMouseDown = useRef(0);

    const handleMouseDown = (e) => {
        e.preventDefault();
        if (isGenerating || isSolving) {
            return;
        }
        const now = Date.now();
        if (now - lastMouseDown.current < 100) {
            return;
        }
        lastMouseDown.current = now;
        isMouseDownRef.current = true;
        const { row, col } = e.target.dataset;
        handleCellInteraction(parseInt(row), parseInt(col), false);
    };

    const handleMouseEnter = (e) => {
        if (isMouseDownRef.current && !isGenerating && !isSolving) {
            const { row, col } = e.target.dataset;
            handleCellInteraction(parseInt(row), parseInt(col), true);
        }
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        if (isGenerating || isSolving) {
            return;
        }
        const now = Date.now();
        if (now - lastMouseDown.current < 100) {
            return;
        }
        lastMouseDown.current = now;
        isMouseDownRef.current = true;
        const touch = e.touches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementUnderTouch && elementUnderTouch.classList.contains('cell')) {
            const { row, col } = elementUnderTouch.dataset;
            handleCellInteraction(parseInt(row), parseInt(col), false);
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (isMouseDownRef.current && !isGenerating && !isSolving) {
            const touch = e.touches[0];
            const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
            if (elementUnderTouch && elementUnderTouch.classList.contains('cell')) {
                const touchedRow = parseInt(elementUnderTouch.dataset.row);
                const touchedCol = parseInt(elementUnderTouch.dataset.col);
                handleCellInteraction(touchedRow, touchedCol, true);
            }
        }
    };

    const handleMouseUpOrTouchEnd = () => {
        isMouseDownRef.current = false;
    };

    React.useEffect(() => {
        document.addEventListener('mouseup', handleMouseUpOrTouchEnd);
        document.addEventListener('touchend', handleMouseUpOrTouchEnd);
        return () => {
            document.removeEventListener('mouseup', handleMouseUpOrTouchEnd);
            document.removeEventListener('touchend', handleMouseUpOrTouchEnd);
        };
    }, []);

    return (
        <div id="mazeContainer" className="w-full p-1 sm:p-2 md:p-4 flex items-center justify-center flex-grow overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div
                id="mazeGridDisplay"
                className="maze-grid shadow-2xl"
                style={{
                    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                    gridTemplateRows: `repeat(${numRows}, 1fr)`
                }}
            >
                {grid.map((rowArr, r) =>
                    rowArr.map((cellType, c) => (
                        <Cell
                            key={`${r}-${c}`}
                            row={r}
                            col={c}
                            type={cellType}
                            className={getCellClass(cellType)}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MazeGrid;