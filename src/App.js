import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from  './components/Navbar';
import Controls from './components/Controls';
import MazeGrid from './components/MazeGrid';
import MessageArea from './components/MessageArea';
import { CELL_TYPE, MODE } from './utils/constants';
import { bfs, dfs, dijkstra, aStar, greedyBFS, bidirectionalSearch } from './algorithms/pathfindingAlgorithms';
import { generateMazeKruskal } from './algorithms/mazeGeneration';

function App() {
   
    const [grid, setGrid] = useState([]);
    const [numRows, setNumRows] = useState(21);
    const [numCols, setNumCols] = useState(31);
    const [sourceNode, setSourceNode] = useState(null);
    const [targetNode, setTargetNode] = useState(null);
    const [currentMode, setCurrentMode] = useState(MODE.SET_SOURCE);
    const [isSolving, setIsSolving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [animationDelay, setAnimationDelay] = useState(50);
    const [message, setMessage] = useState({ text: "Welcome! Create/generate a maze. Set source & target, then solve!", type: "info" });
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');
    const [theme, setTheme] = useState('dark');

   
    const isMouseDown = useRef(false);
    const isSolvingRef = useRef(isSolving);
    const isGeneratingRef = useRef(isGenerating);
    const MAX_ANIMATION_SLIDER_VALUE = 200;

   
    useEffect(() => {
        isSolvingRef.current = isSolving;
    }, [isSolving]);

    useEffect(() => {
        isGeneratingRef.current = isGenerating;
    }, [isGenerating]);

   

   
    const showMessage = useCallback((text, type = "info", allowHTML = false) => {
        setMessage({ text, type, allowHTML });
    }, []);

   
    const setControlsDisabled = useCallback((state) => {
        setIsSolving(state);
        isSolvingRef.current = state;
        setIsGenerating(state);
        isGeneratingRef.current = state;
    }, []);

   

   
    const updateCellState = useCallback((row, col, newType) => {
        if (row < 0 || row >= numRows || col < 0 || col >= numCols) return;

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArr => [...rowArr]);
            const currentCellIsSourceGlobal = sourceNode && sourceNode.row === row && sourceNode.col === col;
            const currentCellIsTargetGlobal = targetNode && targetNode.row === row && targetNode.col === col;
            const cellCurrentVisualType = newGrid[row][col];

            if (newType === CELL_TYPE.SOURCE) {
                if (cellCurrentVisualType === CELL_TYPE.WALL || currentCellIsTargetGlobal) {
                    return newGrid;
                }
                if (sourceNode && (sourceNode.row !== row || sourceNode.col !== col)) {
                    newGrid[sourceNode.row][sourceNode.col] = CELL_TYPE.EMPTY;
                }
                setSourceNode({ row, col });
                newGrid[row][col] = CELL_TYPE.SOURCE;
                return newGrid;
            }

            if (newType === CELL_TYPE.TARGET) {
                if (cellCurrentVisualType === CELL_TYPE.WALL || currentCellIsSourceGlobal) {
                    return newGrid;
                }
                if (targetNode && (targetNode.row !== row || targetNode.col !== col)) {
                    newGrid[targetNode.row][targetNode.col] = CELL_TYPE.EMPTY;
                }
                setTargetNode({ row, col });
                newGrid[row][col] = CELL_TYPE.TARGET;
                return newGrid;
            }

            if (currentCellIsSourceGlobal) setSourceNode(null);
            if (currentCellIsTargetGlobal) setTargetNode(null);

            if (newType === CELL_TYPE.WALL && (currentCellIsSourceGlobal || currentCellIsTargetGlobal)) {
                return newGrid;
            }
            if (newType === CELL_TYPE.EMPTY && (currentCellIsSourceGlobal || currentCellIsTargetGlobal)) {
                return newGrid;
            }

            newGrid[row][col] = newType;
            return newGrid;
        });
    }, [numRows, numCols, sourceNode, targetNode]);

   
    const clearPath = useCallback((showMsg = true) => {
        if ((isSolvingRef.current || isGeneratingRef.current) && showMsg) {
            showMessage("Cannot clear path during active process.", "warning");
            return;
        }
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArr => [...rowArr]);
            for (let r = 0; r < numRows; r++) {
                for (let c = 0; c < numCols; c++) {
                    const type = newGrid[r][c];
                    if (type === CELL_TYPE.VISITED || type === CELL_TYPE.PATH || type === CELL_TYPE.VISITING || type === CELL_TYPE.VISITED_B || type === CELL_TYPE.VISITING_B) {
                        newGrid[r][c] = CELL_TYPE.EMPTY;
                    }
                    if (sourceNode && sourceNode.row === r && sourceNode.col === c) {
                        newGrid[r][c] = CELL_TYPE.SOURCE;
                    } else if (targetNode && targetNode.row === r && targetNode.col === c) {
                        newGrid[r][c] = CELL_TYPE.TARGET;
                    }
                }
            }
            return newGrid;
        });
        if (showMsg) showMessage("Path and visited cells cleared.", "info");
    }, [numRows, numCols, sourceNode, targetNode, showMessage, isSolvingRef, isGeneratingRef]);

   
    const createGrid = useCallback((fullClear = false) => {
        if (isSolvingRef.current || isGeneratingRef.current) return;

        const effectiveRows = Math.max(5, Math.min(101, numRows));
        const effectiveCols = Math.max(5, Math.min(101, numCols));

        const initialGrid = [];
        for (let r = 0; r < effectiveRows; r++) {
            const rowArray = [];
            for (let c = 0; c < effectiveCols; c++) {
                rowArray.push(CELL_TYPE.EMPTY);
            }
            initialGrid.push(rowArray);
        }
        setGrid(initialGrid);

        let newSource = null;
        let newTarget = null;

        if (fullClear) {
            setSourceNode(null);
            setTargetNode(null);
        } else {
            if (sourceNode && sourceNode.row < effectiveRows && sourceNode.col < effectiveCols) {
                newSource = sourceNode;
                initialGrid[sourceNode.row][sourceNode.col] = CELL_TYPE.SOURCE;
            }
            if (targetNode && targetNode.row < effectiveRows && targetNode.col < effectiveCols) {
                if (!(newSource && newSource.row === targetNode.row && newSource.col === targetNode.col)) {
                    newTarget = targetNode;
                    initialGrid[targetNode.row][targetNode.col] = CELL_TYPE.TARGET;
                }
            }
            setSourceNode(newSource);
            setTargetNode(newTarget);
        }
    }, [numRows, numCols, sourceNode, targetNode, isSolvingRef, isGeneratingRef]);

   
    const handleCellInteraction = useCallback((row, col, isDragging) => {
        if (isSolvingRef.current || isGeneratingRef.current) return;
        if ((currentMode === MODE.SET_SOURCE || currentMode === MODE.SET_TARGET) && isDragging) return;

        clearPath(false);

        switch (currentMode) {
            case MODE.SET_SOURCE:
                updateCellState(row, col, CELL_TYPE.SOURCE);
                break;
            case MODE.SET_TARGET:
                updateCellState(row, col, CELL_TYPE.TARGET);
                break;
            case MODE.ADD_WALL:
                updateCellState(row, col, CELL_TYPE.WALL);
                break;
            case MODE.REMOVE_WALL:
                updateCellState(row, col, CELL_TYPE.EMPTY);
                break;
            default:
                break;
        }
    }, [currentMode, updateCellState, clearPath, isSolvingRef, isGeneratingRef]);

   

   
    useEffect(() => {
        const savedTheme = localStorage.getItem('mazeTheme') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('mazeTheme', newTheme);
    };

   
    useEffect(() => {
        createGrid();
    }, []);   

   
    useEffect(() => {
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!isSolvingRef.current && !isGeneratingRef.current) createGrid();
            }, 250);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [createGrid, isSolvingRef, isGeneratingRef]);

   
    const solveMazeWrapper = useCallback(async () => {
        if (isSolvingRef.current || isGeneratingRef.current) {
            showMessage("Process already running.", "warning");
            return null;
        }
        if (!sourceNode || !targetNode) {
            showMessage("Set source and target.", "error");
            return null;
        }

        setControlsDisabled(true);
        clearPath(false);
        showMessage(`Solving with ${selectedAlgorithm.toUpperCase()}...`, "info");

        let result;
        const startTime = performance.now();

        const algorithmProps = {
            grid: JSON.parse(JSON.stringify(grid)),
            sourceNode,
            targetNode,
            numRows,
            numCols,
            animateVisited: async (r, c, type) => {
                if (animationDelay > 0) {
                    setGrid(prev => {
                        const newGrid = prev.map(rowArr => [...rowArr]);
                        if ((sourceNode && r === sourceNode.row && c === sourceNode.col) || (targetNode && r === targetNode.row && c === targetNode.col)) return prev;
                        newGrid[r][c] = (type === CELL_TYPE.VISITED || type === CELL_TYPE.VISITED_B) ? (type === CELL_TYPE.VISITED ? CELL_TYPE.VISITING : CELL_TYPE.VISITING_B) : CELL_TYPE.VISITING;
                        return newGrid;
                    });
                    await new Promise(resolve => setTimeout(resolve, animationDelay * 0.6));
                    setGrid(prev => {
                        const newGrid = prev.map(rowArr => [...rowArr]);
                        if ((sourceNode && r === sourceNode.row && c === sourceNode.col) || (targetNode && r === targetNode.row && c === targetNode.col)) return prev;
                        newGrid[r][c] = type;
                        return newGrid;
                    });
                    await new Promise(resolve => setTimeout(resolve, animationDelay * 0.4));
                } else {
                    setGrid(prev => {
                        const newGrid = prev.map(rowArr => [...rowArr]);
                        if ((sourceNode && r === sourceNode.row && c === sourceNode.col) || (targetNode && r === targetNode.row && c === targetNode.col)) return prev;
                        newGrid[r][c] = type;
                        return newGrid;
                    });
                }
            },
            isSolvingRef: isSolvingRef,
            updateGridInstantly: (r, c, type) => {
                setGrid(prev => {
                    const newGrid = prev.map(rowArr => [...rowArr]);
                    newGrid[r][c] = type;
                    return newGrid;
                });
            }
        };

        try {
            switch (selectedAlgorithm) {
                case 'bfs': result = await bfs(algorithmProps); break;
                case 'dfs': result = await dfs(algorithmProps); break;
                case 'dijkstra': result = await dijkstra(algorithmProps); break;
                case 'astar': result = await aStar(algorithmProps); break;
                case 'greedy': result = await greedyBFS(algorithmProps); break;
                case 'bidirectional': result = await bidirectionalSearch(algorithmProps); break;
                default: showMessage("Algorithm not implemented.", "error"); setControlsDisabled(false); return null;
            }
        } catch (error) {
            console.error("Algorithm error:", error);
            showMessage("An error occurred during solving.", "error");
            setControlsDisabled(false);
            return null;
        }

        const endTime = performance.now();
        if (result) result.timeTaken = parseFloat((endTime - startTime).toFixed(2));

        if (result && result.pathFound) {
            if (animationDelay > 0) {
                for (const node of result.path) {
                    if ((sourceNode && node.row === sourceNode.row && node.col === sourceNode.col) || (targetNode && node.row === targetNode.row && node.col === targetNode.col)) continue;
                    setGrid(prev => {
                        const newGrid = prev.map(rowArr => [...rowArr]);
                        newGrid[node.row][node.col] = CELL_TYPE.PATH;
                        return newGrid;
                    });
                    await new Promise(resolve => setTimeout(resolve, animationDelay));
                }
            } else {
                setGrid(prev => {
                    const newGrid = prev.map(rowArr => [...rowArr]);
                    for (const node of result.path) {
                        if ((sourceNode && node.row === sourceNode.row && node.col === sourceNode.col) || (targetNode && node.row === targetNode.row && node.col === targetNode.col)) continue;
                        newGrid[node.row][node.col] = CELL_TYPE.PATH;
                    }
                    return newGrid;
                });
            }
            showMessage(`Path found by ${selectedAlgorithm.toUpperCase()}! Length: ${result.path.length - 1}. Explored ${result.visitedCount} cells. Time: ${result.timeTaken}ms.`, "success");
        } else if (result) {
            showMessage(`${selectedAlgorithm.toUpperCase()}: No path found. Explored ${result.visitedCount} cells. Time: ${result.timeTaken}ms.`, "warning");
        } else {
            showMessage(`${selectedAlgorithm.toUpperCase()}: No path found.`, "warning");
        }

        setControlsDisabled(false);
        return result;
    }, [sourceNode, targetNode, selectedAlgorithm, grid, animationDelay, numRows, numCols, showMessage, clearPath, setControlsDisabled, isSolvingRef, isGeneratingRef]);

   
    const handleGenerateMaze = useCallback(async () => {
        if (isSolvingRef.current || isGeneratingRef.current) {
            showMessage("Process already running.", "warning");
            return;
        }
        setControlsDisabled(true);
        showMessage("Generating maze using Kruskal...", "info");

        let newRows = numRows;
        let newCols = numCols;

        if (newRows % 2 === 0) newRows++;
        if (newCols % 2 === 0) newCols++;
        setNumRows(newRows);
        setNumCols(newCols);

        const initialGridForGeneration = [];
        for (let r = 0; r < newRows; r++) {
            const rowArray = [];
            for (let c = 0; c < newCols; c++) {
                rowArray.push(CELL_TYPE.WALL);
            }
            initialGridForGeneration.push(rowArray);
        }
        setGrid(initialGridForGeneration);

        setSourceNode(null);
        setTargetNode(null);

        const genAnimationDelayFraction = 0.1;
        const currentGenDelay = animationDelay * genAnimationDelayFraction;

        try {
            await generateMazeKruskal({
                grid: JSON.parse(JSON.stringify(initialGridForGeneration)),
                numRows: newRows,
                numCols: newCols,
                animationDelay: currentGenDelay,
                updateCell: (r, c, type) => {
                    setGrid(prev => {
                        const newGrid = prev.map(rowArr => [...rowArr]);
                        newGrid[r][c] = type;
                        return newGrid;
                    });
                },
                isGeneratingRef: isGeneratingRef
            });
            showMessage("Maze generated! Set source and target.", "success");
        } catch (error) {
            console.error("Maze generation error:", error);
            showMessage("An error occurred during maze generation.", "error");
        } finally {
            setControlsDisabled(false);
        }
    }, [numRows, numCols, animationDelay, showMessage, setControlsDisabled, isSolvingRef, isGeneratingRef]);

   
    return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar
                numRows={numRows}
                setNumRows={setNumRows}
                numCols={numCols}
                setNumCols={setNumCols}
                createGrid={() => {
                    const r = numRows;
                    const c = numCols;
                    if (r < 5 || c < 5 || r > 101 || c > 101) {
                        showMessage("Grid size: 5x5 to 101x101.", "error");
                        return;
                    }
                    createGrid(true);
                    showMessage("Grid size set. Draw or generate a maze.", "info");
                }}
                generateMaze={handleGenerateMaze}
                clearPath={() => clearPath(true)}
                clearAll={() => { createGrid(true); showMessage("Grid cleared.", "info"); }}
                theme={theme}
                toggleTheme={toggleTheme}
                isControlsDisabled={isSolving || isGenerating}
            />
            <Controls
                currentMode={currentMode}
                setCurrentMode={setCurrentMode}
                animationDelay={animationDelay}
                setAnimationDelay={setAnimationDelay}
                MAX_ANIMATION_SLIDER_VALUE={MAX_ANIMATION_SLIDER_VALUE}
                selectedAlgorithm={selectedAlgorithm}
                setSelectedAlgorithm={setSelectedAlgorithm}
                solveMaze={solveMazeWrapper}
                isControlsDisabled={isSolving || isGenerating}
            />
            <MessageArea message={message} />
            <MazeGrid
                grid={grid}
                numRows={numRows}
                numCols={numCols}
                handleCellInteraction={handleCellInteraction}
                isMouseDownRef={isMouseDown}
                isSolving={isSolving}
                isGenerating={isGenerating}
            />
        </div>
    );
}

export default App;