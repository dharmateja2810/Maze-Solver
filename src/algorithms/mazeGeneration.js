import { CELL_TYPE } from '../utils/constants';
import { sleep } from '../utils/helpers';

const dsuParent = {};

function dsuInitializeCell(r, c) {
    const key = `${r},${c}`;
    dsuParent[key] = key;
}

function dsuFind(itemKey) {
    if (dsuParent[itemKey] === itemKey) return itemKey;
    dsuParent[itemKey] = dsuFind(dsuParent[itemKey]); 
    return dsuParent[itemKey];
}

function dsuUnion(key1, key2) {
    const root1 = dsuFind(key1);
    const root2 = dsuFind(key2);
    if (root1 !== root2) {
        dsuParent[root2] = root1;
        return true;
    }
    return false;
}


export async function generateMazeKruskal({ grid, numRows, numCols, animationDelay, updateCell, isGeneratingRef }) {

    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            if (r % 2 === 1 && c % 2 === 1) { 
                grid[r][c] = CELL_TYPE.EMPTY;
                dsuInitializeCell(r, c);
            } else {
                grid[r][c] = CELL_TYPE.WALL;
            }
            updateCell(r, c, grid[r][c]); 
        }
    }

    const walls = [];
    for (let r = 1; r < numRows; r += 1) {
        for (let c = 1; c < numCols; c += 1) {
            if (r % 2 === 1 && c % 2 === 0) { 
                if (c - 1 >= 0 && c + 1 < numCols)
                    walls.push({ r, c, cell1: { r, c: c - 1 }, cell2: { r, c: c + 1 } });
            } else if (r % 2 === 0 && c % 2 === 1) { 
                if (r - 1 >= 0 && r + 1 < numRows)
                    walls.push({ r, c, cell1: { r: r - 1, c }, cell2: { r: r + 1, c } });
            }
        }
    }


    walls.sort(() => Math.random() - 0.5);

    for (const wall of walls) {
        if (!isGeneratingRef.current) return; 

        const key1 = `${wall.cell1.r},${wall.cell1.c}`;
        const key2 = `${wall.cell2.r},${wall.cell2.c}`;

        if (dsuUnion(key1, key2)) {
            grid[wall.r][wall.c] = CELL_TYPE.EMPTY; 
            updateCell(wall.r, wall.c, CELL_TYPE.EMPTY); 
            if (animationDelay > 0) await sleep(animationDelay);
        }
    }
}