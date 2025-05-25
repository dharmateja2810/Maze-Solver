import { CELL_TYPE } from '../utils/constants';
import { sleep, heuristic } from '../utils/helpers';

const drSolve = [-1, 1, 0, 0];
const dcSolve = [0, 0, -1, 1];

 
export async function bfs({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const q = [{ ...sourceNode, dist: 0 }];
    const visited = Array(numRows).fill(null).map(() => Array(numCols).fill(false));
    const parentMap = new Map();
    let visitedCount = 0;

    visited[sourceNode.row][sourceNode.col] = true;

    while (q.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 
        const curr = q.shift();

        if (curr.row === targetNode.row && curr.col === targetNode.col) {
            await animateVisited(curr.row, curr.col, CELL_TYPE.TARGET);
            const path = [];
            let pCurr = { ...targetNode };
            while (pCurr) {
                path.unshift({ ...pCurr });
                pCurr = parentMap.get(`${pCurr.row},${pCurr.col}`);
            }
            return { pathFound: true, path, visitedCount };
        }

        for (let i = 0; i < 4; i++) {
            const nextR = curr.row + drSolve[i];
            const nextC = curr.col + dcSolve[i];

            if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && !visited[nextR][nextC] && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                visited[nextR][nextC] = true;
                visitedCount++;
                parentMap.set(`${nextR},${nextC}`, { row: curr.row, col: curr.col });
                q.push({ row: nextR, col: nextC, dist: curr.dist + 1 });
                await animateVisited(nextR, nextC, CELL_TYPE.VISITED);
            }
        }
    }
    return { pathFound: false, path: [], visitedCount };
}

 
export async function dfs({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const stack = [{ ...sourceNode }];
    const visited = Array(numRows).fill(null).map(() => Array(numCols).fill(false));
    const parentMap = new Map();
    let visitedCount = 0;

    while (stack.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 
        const curr = stack.pop();

        if (visited[curr.row][curr.col]) continue;
        visited[curr.row][curr.col] = true;
        visitedCount++;

        await animateVisited(curr.row, curr.col, CELL_TYPE.VISITED);

        if (curr.row === targetNode.row && curr.col === targetNode.col) {
            await animateVisited(curr.row, curr.col, CELL_TYPE.TARGET);
            const path = [];
            let pCurr = { ...targetNode };
            while (pCurr) {
                path.unshift({ ...pCurr });
                pCurr = parentMap.get(`${pCurr.row},${pCurr.col}`);
            }
            return { pathFound: true, path, visitedCount };
        }

        for (let i = 3; i >= 0; i--) {
            const nextR = curr.row + drSolve[i];
            const nextC = curr.col + dcSolve[i];

            if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && !visited[nextR][nextC] && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                parentMap.set(`${nextR},${nextC}`, { row: curr.row, col: curr.col });
                stack.push({ row: nextR, col: nextC });
            }
        }
    }
    return { pathFound: false, path: [], visitedCount };
}

 
export async function dijkstra({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const dist = Array(numRows).fill(null).map(() => Array(numCols).fill(Infinity));
    const parentMap = new Map();
    const pq = [{ ...sourceNode, cost: 0 }]; 
    let visitedCount = 0;

    dist[sourceNode.row][sourceNode.col] = 0;

    while (pq.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 
        pq.sort((a, b) => a.cost - b.cost); 
        const curr = pq.shift();

 
        if (curr.cost > dist[curr.row][curr.col] && !(curr.row === sourceNode.row && curr.col === sourceNode.col)) continue;

        if (!((curr.row === sourceNode.row && curr.col === sourceNode.col) || (curr.row === targetNode.row && curr.col === targetNode.col))) {
            visitedCount++;
            await animateVisited(curr.row, curr.col, CELL_TYPE.VISITED);
        }

        if (curr.row === targetNode.row && curr.col === targetNode.col) {
            await animateVisited(curr.row, curr.col, CELL_TYPE.TARGET);
            const path = [];
            let pCurr = { ...targetNode };
            while (pCurr) {
                path.unshift({ ...pCurr });
                pCurr = parentMap.get(`${pCurr.row},${pCurr.col}`);
            }
            return { pathFound: true, path, visitedCount };
        }

        for (let i = 0; i < 4; i++) {
            const nextR = curr.row + drSolve[i];
            const nextC = curr.col + dcSolve[i];

            if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                const newCost = dist[curr.row][curr.col] + 1;
                if (newCost < dist[nextR][nextC]) {
                    dist[nextR][nextC] = newCost;
                    parentMap.set(`${nextR},${nextC}`, { row: curr.row, col: curr.col });
                    pq.push({ row: nextR, col: nextC, cost: newCost });
                }
            }
        }
    }
    return { pathFound: false, path: [], visitedCount };
}

 
export async function greedyBFS({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const pq = [{ ...sourceNode, h: heuristic(sourceNode, targetNode) }];
    const visited = Array(numRows).fill(null).map(() => Array(numCols).fill(false));
    const parentMap = new Map();
    let visitedCount = 0;

    visited[sourceNode.row][sourceNode.col] = true;

    while (pq.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 
        pq.sort((a, b) => a.h - b.h);
        const curr = pq.shift();

        visitedCount++;
        await animateVisited(curr.row, curr.col, CELL_TYPE.VISITED);

        if (curr.row === targetNode.row && curr.col === targetNode.col) {
            await animateVisited(curr.row, curr.col, CELL_TYPE.TARGET);
            const path = [];
            let pCurr = { ...targetNode };
            while (pCurr) {
                path.unshift({ ...pCurr });
                pCurr = parentMap.get(`${pCurr.row},${pCurr.col}`);
            }
            return { pathFound: true, path, visitedCount };
        }

        for (let i = 0; i < 4; i++) {
            const nextR = curr.row + drSolve[i];
            const nextC = curr.col + dcSolve[i];

            if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && !visited[nextR][nextC] && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                visited[nextR][nextC] = true;
                parentMap.set(`${nextR},${nextC}`, { row: curr.row, col: curr.col });
                pq.push({ row: nextR, col: nextC, h: heuristic({ row: nextR, col: nextC }, targetNode) });
            }
        }
    }
    return { pathFound: false, path: [], visitedCount };
}

 
export async function aStar({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const openSet = [{ ...sourceNode, g: 0, f: heuristic(sourceNode, targetNode) }];
    const cameFrom = new Map();
    const gScore = Array(numRows).fill(null).map(() => Array(numCols).fill(Infinity)); 
    let visitedCount = 0;

    gScore[sourceNode.row][sourceNode.col] = 0;

    while (openSet.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 
        openSet.sort((a, b) => a.f - b.f); 
        const current = openSet.shift();

        visitedCount++;
        await animateVisited(current.row, current.col, CELL_TYPE.VISITED);

        if (current.row === targetNode.row && current.col === targetNode.col) {
            await animateVisited(current.row, current.col, CELL_TYPE.TARGET);
            const path = [];
            let pCurr = { ...targetNode };
            while (pCurr) {
                path.unshift({ ...pCurr });
                pCurr = cameFrom.get(`${pCurr.row},${pCurr.col}`);
            }
            return { pathFound: true, path, visitedCount };
        }

        for (let i = 0; i < 4; i++) {
            const nextR = current.row + drSolve[i];
            const nextC = current.col + dcSolve[i];

            if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                const tentativeGScore = gScore[current.row][current.col] + 1;

                if (tentativeGScore < gScore[nextR][nextC]) {
                    cameFrom.set(`${nextR},${nextC}`, { row: current.row, col: current.col });
                    gScore[nextR][nextC] = tentativeGScore;
                    const fScore = tentativeGScore + heuristic({ row: nextR, col: nextC }, targetNode);

                    if (!openSet.find(node => node.row === nextR && node.col === nextC)) {
                        openSet.push({ row: nextR, col: nextC, g: tentativeGScore, f: fScore });
                    }
                }
            }
        }
    }
    return { pathFound: false, path: [], visitedCount };
}

 
export async function bidirectionalSearch({ grid, sourceNode, targetNode, numRows, numCols, animateVisited, isSolvingRef }) {
    const qS = [{ ...sourceNode, dist: 0 }]; 
    const qT = [{ ...targetNode, dist: 0 }]; 

 
    const visitedS = Array(numRows).fill(null).map(() => Array(numCols).fill(null));
    const visitedT = Array(numRows).fill(null).map(() => Array(numCols).fill(null));
    let visitedCount = 0;
    let meetingNode = null;

    visitedS[sourceNode.row][sourceNode.col] = { dist: 0, parent: null };
    visitedT[targetNode.row][targetNode.col] = { dist: 0, parent: null };

    while (qS.length > 0 && qT.length > 0) {
        if (!isSolvingRef.current) return { pathFound: false, path: [], visitedCount }; 

 
        if (qS.length > 0) {
            const currS = qS.shift();
            visitedCount++;
            await animateVisited(currS.row, currS.col, CELL_TYPE.VISITED);

            if (visitedT[currS.row][currS.col] !== null) { 
                meetingNode = currS;
                break;
            }

            for (let i = 0; i < 4; i++) {
                const nextR = currS.row + drSolve[i];
                const nextC = currS.col + dcSolve[i];

                if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && visitedS[nextR][nextC] === null && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                    visitedS[nextR][nextC] = { dist: currS.dist + 1, parent: { row: currS.row, col: currS.col } };
                    qS.push({ row: nextR, col: nextC, dist: currS.dist + 1 });
                }
            }
        }

 
        if (qT.length > 0) {
            const currT = qT.shift();
            visitedCount++;
            await animateVisited(currT.row, currT.col, CELL_TYPE.VISITED_B); 

            if (visitedS[currT.row][currT.col] !== null) { 
                meetingNode = currT;
                break;
            }

            for (let i = 0; i < 4; i++) {
                const nextR = currT.row + drSolve[i];
                const nextC = currT.col + dcSolve[i];

                if (nextR >= 0 && nextR < numRows && nextC >= 0 && nextC < numCols && visitedT[nextR][nextC] === null && grid[nextR][nextC] !== CELL_TYPE.WALL) {
                    visitedT[nextR][nextC] = { dist: currT.dist + 1, parent: { row: currT.row, col: currT.col } };
                    qT.push({ row: nextR, col: nextC, dist: currT.dist + 1 });
                }
            }
        }
    }

    if (meetingNode) {
        const path = [];
        let temp = { ...meetingNode };
 
        while (temp) {
            path.unshift(temp);
            if (!visitedS[temp.row][temp.col]) break; 
            temp = visitedS[temp.row][temp.col].parent;
        }
 
        temp = visitedT[meetingNode.row][meetingNode.col].parent;
        while (temp) {
 
            if (!(temp.row === meetingNode.row && temp.col === meetingNode.col)) {
                path.push(temp);
            }
            if (!visitedT[temp.row][temp.col]) break; 
            temp = visitedT[temp.row][temp.col].parent;
        }
        return { pathFound: true, path, visitedCount };
    }
    return { pathFound: false, path: [], visitedCount };
}