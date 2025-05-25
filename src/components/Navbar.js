import React from 'react';
import ThemeToggle from './ThemeToggle';

function Navbar({ numRows, setNumRows, numCols, setNumCols, createGrid, generateMaze, clearPath, clearAll, theme, toggleTheme, isControlsDisabled }) {
    return (
        <nav className="shadow-lg p-2 sm:p-3 sticky top-0 z-50" style={{ background: 'var(--bg-navbar)' }}>
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold" style={{ color: 'var(--text-navbar)' }}>Maze Solver</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <div className="flex items-center gap-1">
                        <label htmlFor="rows" className="nav-label">R:</label>
                        <input
                            type="number"
                            id="rows"
                            value={numRows}
                            onChange={(e) => setNumRows(parseInt(e.target.value))}
                            min="5"
                            max="101"
                            step="2"
                            className="nav-input w-16"
                            disabled={isControlsDisabled}
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <label htmlFor="cols" className="nav-label">C:</label>
                        <input
                            type="number"
                            id="cols"
                            value={numCols}
                            onChange={(e) => setNumCols(parseInt(e.target.value))}
                            min="5"
                            max="101"
                            step="2"
                            className="nav-input w-16"
                            disabled={isControlsDisabled}
                        />
                    </div>
                  
                    <button id="createGridBtn" className="control-button btn-secondary" onClick={createGrid} disabled={isControlsDisabled}>Set Size</button>

                    <button id="generateMazeBtn" className="control-button btn-primary" onClick={generateMaze} disabled={isControlsDisabled}>Generate Maze</button>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <button id="clearPathBtn" className="control-button btn-secondary" onClick={clearPath} disabled={isControlsDisabled}>Clear Path</button>
                    <button id="clearAllBtn" className="control-button btn-danger" onClick={clearAll} disabled={isControlsDisabled}>Clear All</button>

                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;