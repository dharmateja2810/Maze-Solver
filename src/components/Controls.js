import React from 'react';
import { MODE } from '../utils/constants';

function Controls({ currentMode, setCurrentMode, animationDelay, setAnimationDelay, MAX_ANIMATION_SLIDER_VALUE, selectedAlgorithm, setSelectedAlgorithm, solveMaze, isControlsDisabled }) {
    const animationSpeedValueText = `${animationDelay}ms`;   

    return (
        <div className="shadow-md" style={{ backgroundColor: 'var(--bg-controls-bar)' }}> 
            <div className="container mx-auto p-2 sm:p-3">
                <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 mb-3">
                    <div className="flex items-center gap-2"> 
                        <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Edit Mode:</h3> 
                        <div className="flex gap-1">
                            <input
                                type="radio"
                                name="mode"
                                id="setSourceMode"
                                value={MODE.SET_SOURCE}
                                checked={currentMode === MODE.SET_SOURCE}
                                onChange={() => setCurrentMode(MODE.SET_SOURCE)}
                                className="mode-radio"   
                                disabled={isControlsDisabled}
                            />
                            <label htmlFor="setSourceMode" className="mode-radio-label">Source</label> {/* [cite: 72] */}
                            <input
                                type="radio"
                                name="mode"
                                id="setTargetMode"
                                value={MODE.SET_TARGET}
                                checked={currentMode === MODE.SET_TARGET}
                                onChange={() => setCurrentMode(MODE.SET_TARGET)}
                                className="mode-radio"   
                                disabled={isControlsDisabled}
                            />
                            <label htmlFor="setTargetMode" className="mode-radio-label">Target</label> {/* [cite: 112] */}
                            <input
                                type="radio"
                                name="mode"
                                id="addWallMode"
                                value={MODE.ADD_WALL}
                                checked={currentMode === MODE.ADD_WALL}
                                onChange={() => setCurrentMode(MODE.ADD_WALL)}
                                className="mode-radio"   
                                disabled={isControlsDisabled}
                            />
                            <label htmlFor="addWallMode" className="mode-radio-label">Wall</label> {/* [cite: 113] */}
                            <input
                                type="radio"
                                name="mode"
                                id="removeWallMode"
                                value={MODE.REMOVE_WALL}
                                checked={currentMode === MODE.REMOVE_WALL}
                                onChange={() => setCurrentMode(MODE.REMOVE_WALL)}
                                className="mode-radio"   
                                disabled={isControlsDisabled}
                            />
                            <label htmlFor="removeWallMode" className="mode-radio-label">Empty</label> {/* [cite: 114] */}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="animationSpeed" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Speed:</label> {/* [cite: 7] */}
                        <input
                            type="range"
                            id="animationSpeed"
                            min="0"
                            max={MAX_ANIMATION_SLIDER_VALUE}
                            value={MAX_ANIMATION_SLIDER_VALUE - animationDelay}   
                            onChange={(e) => setAnimationDelay(MAX_ANIMATION_SLIDER_VALUE - parseInt(e.target.value))}
                            className="w-24 sm:w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"   
                            style={{ accentColor: 'var(--btn-primary-bg)' }}   
                            disabled={isControlsDisabled}
                        />
                        <span id="animationSpeedValue" className="text-sm w-12 text-right" style={{ color: 'var(--text-muted)' }}>{animationSpeedValueText}</span> {/* [cite: 9] */}
                    </div>
                </div>
                <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-2 mb-2">
                    <div className="flex items-center gap-2"> 
                        <label htmlFor="algorithmSelect" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Algorithm:</label> {/* [cite: 7] */}
                        <select
                            id="algorithmSelect"
                            value={selectedAlgorithm}
                            onChange={(e) => setSelectedAlgorithm(e.target.value)}
                            className="nav-select"   
                            disabled={isControlsDisabled}
                        >
                            <option value="bfs">BFS</option> 
                            <option value="dfs">DFS</option> 
                            <option value="dijkstra">Dijkstra</option> 
                            <option value="astar">A*</option>
                            <option value="greedy">Greedy BFS</option>
                            <option value="bidirectional">Bidirectional BFS</option> 
                        </select>
                    </div>
                    <button id="solveMazeBtn" className="control-button btn-primary" onClick={solveMaze} disabled={isControlsDisabled}>Solve Maze</button> {/* [cite: 81] */}
                </div>
            </div>
        </div>
    );
}

export default Controls;