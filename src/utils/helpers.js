import { CELL_TYPE } from './constants';   

export function sleep(ms) {   
    return new Promise(resolve => setTimeout(resolve, ms));   
}

export function heuristic(nodeA, nodeB) {   
   
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);   
}

export function getCellClass(type) {   
    switch (type) {
        case CELL_TYPE.EMPTY: return 'cell-empty';   
        case CELL_TYPE.WALL: return 'cell-wall';   
        case CELL_TYPE.SOURCE: return 'cell-source';   
        case CELL_TYPE.TARGET: return 'cell-target';   
        case CELL_TYPE.VISITED: return 'cell-visited';   
        case CELL_TYPE.VISITING: return 'cell-visiting';   
        case CELL_TYPE.PATH: return 'cell-path';   
        case CELL_TYPE.VISITED_B: return 'cell-visited-b';   
        case CELL_TYPE.VISITING_B: return 'cell-visiting-b';   
        default: return '';   
    }
}