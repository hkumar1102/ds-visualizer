# DSA Visualizer Infinity

A no-framework, no-build-tool Data Structures and Algorithms visualizer built with plain HTML, CSS, and JavaScript.

This project is designed for:
- Learning algorithms visually
- Practicing interview concepts
- Comparing algorithm behavior and performance
- Building a strong front-end + core-CS portfolio project

## Why This Project Exists

Most algorithm demos online are static or feel disconnected from interview prep. This project tries to solve that by combining:
- visual execution,
- complexity explanation,
- code + pseudocode references,
- quiz mode,
- deterministic self-tests,
- benchmark comparison mode.

Everything runs directly in the browser using static files only.

## Tech Constraints (Strict)

- `HTML5`
- `CSS3`
- `Vanilla JavaScript (ES6+)`
- No frameworks
- No external libraries
- No CDN
- No build tools

## Current Scope

- 59 algorithms
- 8 categories
- dark and light theme support
- category-based accent theming
- mobile-responsive layout with drawer-style side panels
- comparison benchmark mode with progress + cancel support
- self-test suite for correctness checks

## Algorithm Catalog

### Sorting
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Counting Sort
- Radix Sort
- Shell Sort
- TimSort
- Cocktail Shaker Sort
- Bucket Sort

### Searching
- Linear Search
- Binary Search
- Jump Search
- Exponential Search
- Interpolation Search
- Ternary Search
- Fibonacci Search

### Graphs
- BFS
- DFS
- Dijkstra
- A* Pathfinding
- Bellman-Ford
- Floyd-Warshall
- Kruskal MST
- Prim MST
- Topological Sort
- Union-Find
- Bidirectional BFS
- Connected Components

### Trees
- Binary Search Tree
- AVL Tree
- Heap Tree
- Trie
- Inorder Traversal
- Preorder Traversal
- Postorder Traversal
- Level Order Traversal

### Dynamic Programming
- Fibonacci
- 0/1 Knapsack
- Longest Common Subsequence
- Edit Distance
- Matrix Chain Multiplication
- Coin Change (Min Coins)
- Longest Increasing Subsequence
- Maximum Subarray (Kadane)

### String Algorithms
- KMP
- Rabin-Karp
- Trie Search
- Z Algorithm
- Boyer-Moore (Bad Character Rule)

### Computational Geometry
- Convex Hull (Graham Scan)
- Line Intersection
- Closest Pair of Points

### Advanced / NP-style
- Traveling Salesman (Heuristic)
- Graph Coloring (Greedy)
- N-Queens
- Subset Sum

## Key Features

- Visual execution engine for arrays, graphs, trees, and DP tables
- Learning Center with:
  - overview
  - complexity
  - code
  - pseudocode
  - quiz
  - validation tests
- Benchmark comparison mode:
  - multiple rounds
  - dataset profile selection
  - avg/median/best time
  - operation metrics
  - cancel in-progress comparison
- Self-test mode for algorithm sanity checks
- Keyboard shortcuts for faster interaction
- LocalStorage persistence for major UI preferences

## Keyboard Shortcuts

- `Space`: start/pause current visualization
- `G`: generate new dataset/structure
- `R`: reset
- `T`: run self-tests
- `N`: next quiz question (when available)
- `Esc`: close modal / close mobile drawers

## Project Structure

```text
.
├─ index.html                          # App layout and UI markup
├─ style.css                           # Full styling, themes, responsive behavior
├─ script.js                           # State, algorithms, rendering, events, tests
├─ _headers                            # Cloudflare Pages security + cache headers
├─ wrangler.jsonc                      # Wrangler config for static asset deployment
└─ .github
   ├─ workflows
   │  └─ quality-check.yml             # CI checks
   └─ scripts
      └─ validate-mappings.js          # Structural integrity checker
```

## Run Locally

No install step is required. This is a static project.

1. Clone or download the repository.
2. Open the project folder.
3. Open `index.html` in your browser.

Optional (recommended for cleaner browser behavior):
1. Run a local static server.
2. Open `http://localhost:<port>`.

Example with Python:

```bash
python -m http.server 8080
```

## Quality Checks

### JavaScript syntax check

```bash
node --check script.js
```

### Structural integrity checks

```bash
node .github/scripts/validate-mappings.js
```

What gets validated:
- algorithm buttons in UI vs `algorithmDB`
- execute switch coverage
- comparison options coverage
- tab buttons vs tab content
- `getElementById` references vs actual HTML IDs


## Accessibility Notes

- Buttons and controls use semantic HTML.
- Tabs and status regions are present for assistive tech.
- Contrast and theme values are tuned for both light and dark modes.
- Mobile layout supports drawer toggles and escape behavior.

## Known Limitations

- Large datasets can still feel heavy on low-power devices (expected for many visual updates).
- Some advanced algorithms are heuristic demonstrations, not full industrial optimizers.
- This is a single-file script architecture, so maintainability relies on clear section boundaries.

## Future Upgrades (Roadmap)

### Near-term
- Add graph import/export (JSON)
- Add benchmark report export (JSON/CSV)
- Add per-algorithm scenario presets
- Add more deterministic seeds for repeatable demos

### Mid-term
- Add step history timeline with rewind support
- Add visual legend overlay per algorithm
- Add advanced complexity insights (actual curve fitting from runs)
- Add algorithm race mode with synchronized playback

### Long-term
- Optional plugin-style algorithm registration model
- Multi-language code snippets (still no external libs)
- Offline-first progressive web app support
- Guided interview practice tracks with scoring

## Contributing

When contributing:
- Keep everything framework-free and dependency-free.
- Preserve existing algorithm IDs (used by integrity checks).
- Run both checks before pushing:
  - `node --check script.js`
  - `node .github/scripts/validate-mappings.js`

## License

Treat this repository as all-rights-reserved by default.

