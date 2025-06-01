# Maze Solver

A React-based web application for generating, customizing, and solving mazes interactively. Users can generate mazes using Kruskal's algorithm, manually draw walls, set source and target nodes, and visualize pathfinding algorithms such as BFS, DFS, Dijkstra, A*, Greedy BFS, and Bidirectional Search.

## Features

- **Maze Generation**: Generate random mazes using Kruskal's algorithm with customizable grid sizes (5x5 to 101x101).
- **Interactive Grid**: Click or drag to set source/target nodes, add/remove walls, and clear paths.
- **Pathfinding Algorithms**:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A* Search
  - Greedy Best-First Search
  - Bidirectional Search
- **Animations**: Visualize algorithm steps with adjustable animation speed.
- **Responsive Design**: Supports mouse and touch interactions for desktop and mobile devices.
- **Theme Support**: Toggle between light and dark themes, with preferences saved in local storage.
- **Grid Resizing**: Adjust maze dimensions dynamically with debounced window resizing.
- **Error Handling**: Displays informative messages for invalid actions (e.g., missing source/target).

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- A modern web browser (Chrome, Firefox, Safari, etc.)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dharmateja28/Maze-Solver.git
   cd Maze-Solver
   ```

2. **Install Dependencies**:
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Start the Development Server**:
   Using npm:
   ```bash
   npm start
   ```
   Or using yarn:
   ```bash
   yarn start
   ```
   The app will be available at `http://localhost:3000`.

## Usage

1. **Generate a Maze**:
   - Click the "Generate Maze" button in the navbar to create a random maze using Kruskal's algorithm.
   - Adjust the grid size using the row and column inputs in the navbar (minimum 5x5, maximum 101x101).

2. **Customize the Maze**:
   - Use the control panel to select modes:
     - **Set Source**: Click a cell to place the source node (green).
     - **Set Target**: Click a cell to place the target node (red).
     - **Add Wall**: Click or drag to add walls (black).
     - **Remove Wall**: Click or drag to remove walls, reverting to empty cells (white).
   - Touch controls are supported for mobile devices.

3. **Solve the Maze**:
   - Select an algorithm from the dropdown (e.g., BFS, A*).
   - Adjust the animation speed using the slider (0 for instant, up to 200ms delay per step).
   - Click "Solve" to visualize the pathfinding process.
   - The app displays the path length, number of explored cells, and time taken upon completion.

4. **Additional Controls**:
   - **Clear Path**: Remove visited cells and paths, keeping walls, source, and target.
   - **Clear All**: Reset the grid to empty, removing all walls, source, and target.
   - **Toggle Theme**: Switch between light and dark modes via the navbar.
     
## Technologies Used
- **React**: Front-end framework for building the UI.
- **JavaScript (ES6+)**: Core logic for maze generation and pathfinding.
- **Tailwind CSS**: Styling for responsive and themed UI (assumed based on class names).
- **HTML5/CSS3**: Structure and styling of the application.
- 
## Contributing
Contributions are Welcome!
