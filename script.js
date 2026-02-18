// ===================================
// DSA VISUALIZER INFINITY - SCRIPT
// Professional-Grade JavaScript Architecture
// ===================================

// === Global State Management ===
const state = {
    // Data
    array: [],
    graph: { nodes: [], edges: [] },
    
    // Execution State
    isRunning: false,
    isPaused: false,
    isStepping: false,
    shouldStop: false,
    isBenchmark: false,
    selfTestRunning: false,
    comparisonRunning: false,
    comparisonCancelRequested: false,
    
    // Configuration
    size: 50,
    speed: 50,
    dataProfile: 'random',
    theme: 'dark',
    soundEnabled: true,
    interviewMode: false,
    highQuality: true,
    
    // Current Selection
    category: 'sorting',
    algorithm: 'bubble',
    activeTab: 'overview',
    
    // Analytics
    comparisons: 0,
    swaps: 0,
    operations: 0,
    accesses: 0,
    startTime: 0,
    
    // Quiz
    quizCorrect: 0,
    quizAttempted: 0,
    
    // Canvas
    canvas: null,
    ctx: null,
    
    // Graph interaction
    selectedNode: null,
    firstNodeForEdge: null,
    graphToolMode: 'drag',
    isDirected: false,
    isWeighted: false,
    
    // Tree
    treeRoot: null
};

const STORAGE_KEYS = {
    theme: 'dsa_visualizer_theme',
    sound: 'dsa_visualizer_sound',
    mode: 'dsa_visualizer_mode',
    quality: 'dsa_visualizer_quality',
    dataProfile: 'dsa_visualizer_data_profile',
    category: 'dsa_visualizer_category',
    algorithm: 'dsa_visualizer_algorithm',
    tab: 'dsa_visualizer_tab'
};

const DATA_PROFILES = new Set(['random', 'nearly', 'reversed', 'few-unique', 'wave']);
const CATEGORY_SET = new Set(['sorting', 'searching', 'graphs', 'trees', 'dp', 'strings', 'geometry', 'advanced']);
const PANEL_TAB_SET = new Set(['overview', 'complexity', 'code', 'quiz', 'tests']);

function safeStorageGet(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeStorageSet(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        // Ignore storage failures (private mode / restricted storage).
    }
}

function getCssVar(name, fallback = '') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

// === DOM Elements ===
const elements = {
    // Controls
    categorySelector: document.getElementById('categorySelector'),
    sizeSlider: document.getElementById('sizeSlider'),
    speedSlider: document.getElementById('speedSlider'),
    dataProfileSelect: document.getElementById('dataProfileSelect'),
    sizeValue: document.getElementById('sizeValue'),
    speedValue: document.getElementById('speedValue'),
    
    generateBtn: document.getElementById('generateBtn'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    stepBtn: document.getElementById('stepBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    themeToggle: document.getElementById('themeToggle'),
    soundToggle: document.getElementById('soundToggle'),
    modeToggle: document.getElementById('modeToggle'),
    qualityToggle: document.getElementById('qualityToggle'),
    selfTestBtn: document.getElementById('selfTestBtn'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    algoSearch: document.getElementById('algoSearch'),
    clearAlgoSearch: document.getElementById('clearAlgoSearch'),
    algoSearchMeta: document.getElementById('algoSearchMeta'),
    algoButtons: document.querySelectorAll('.algo-btn'),
    algoCategories: document.querySelectorAll('.algo-category'),
    sidebarHandle: document.getElementById('sidebarHandle'),
    panelHandle: document.getElementById('panelHandle'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    
    // Analytics
    comparisons: document.getElementById('comparisons'),
    swaps: document.getElementById('swaps'),
    operations: document.getElementById('operations'),
    accesses: document.getElementById('accesses'),
    executionTime: document.getElementById('executionTime'),
    complexity: document.getElementById('complexity'),
    
    // Visualization
    canvas: document.getElementById('visualizationCanvas'),
    graphContainer: document.getElementById('graphContainer'),
    treeContainer: document.getElementById('treeContainer'),
    dpTable: document.getElementById('dpTable'),
    
    // Step Indicator
    stepIndicator: document.getElementById('stepIndicator'),
    stepProgress: document.getElementById('stepProgress'),
    stepText: document.getElementById('stepText'),
    
    // Right Panel
    rightPanel: document.getElementById('rightPanel'),
    panelToggle: document.getElementById('panelToggle'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Learning Content
    algoTitle: document.getElementById('algoTitle'),
    algoMeta: document.getElementById('algoMeta'),
    algoDescription: document.getElementById('algoDescription'),
    algoSteps: document.getElementById('algoSteps'),
    algoUseCases: document.getElementById('algoUseCases'),
    
    bestCase: document.getElementById('bestCase'),
    avgCase: document.getElementById('avgCase'),
    worstCase: document.getElementById('worstCase'),
    spaceCase: document.getElementById('spaceCase'),
    perfChar: document.getElementById('perfChar'),
    edgeCases: document.getElementById('edgeCases'),
    
    codeImplementation: document.getElementById('codeImplementation'),
    pseudocode: document.getElementById('pseudocode'),
    copyCodeBtn: document.getElementById('copyCodeBtn'),
    
    // Quiz
    quizQuestion: document.getElementById('quizQuestion'),
    quizOptions: document.querySelectorAll('.quiz-option'),
    quizFeedback: document.getElementById('quizFeedback'),
    nextQuizBtn: document.getElementById('nextQuizBtn'),
    quizCorrect: document.getElementById('quizCorrect'),
    quizAttempted: document.getElementById('quizAttempted'),
    quizAccuracy: document.getElementById('quizAccuracy'),

    // Self Tests
    selfTestRunBtn: document.getElementById('selfTestRunBtn'),
    selfTestStatus: document.getElementById('selfTestStatus'),
    selfTestResults: document.getElementById('selfTestResults'),
    selfTestPass: document.getElementById('selfTestPass'),
    selfTestFail: document.getElementById('selfTestFail'),
    selfTestTime: document.getElementById('selfTestTime'),
    
    // Comparison
    comparisonBtn: document.getElementById('comparisonBtn'),
    comparisonModal: document.getElementById('comparisonModal'),
    modalClose: document.querySelector('.modal-close'),
    runComparisonBtn: document.getElementById('runComparisonBtn'),
    comparisonStatus: document.getElementById('comparisonStatus'),
    comparisonProgressBar: document.getElementById('comparisonProgressBar'),
    comparisonProfile: document.getElementById('comparisonProfile'),
    comparisonRounds: document.getElementById('comparisonRounds'),
    comp1Comparisons: document.getElementById('comp1Comparisons'),
    comp2Comparisons: document.getElementById('comp2Comparisons'),
    comp1Swaps: document.getElementById('comp1Swaps'),
    comp2Swaps: document.getElementById('comp2Swaps'),
    comp1Ops: document.getElementById('comp1Ops'),
    comp2Ops: document.getElementById('comp2Ops'),
    comp1Accesses: document.getElementById('comp1Accesses'),
    comp2Accesses: document.getElementById('comp2Accesses'),
    comp1AvgTime: document.getElementById('comp1AvgTime'),
    comp2AvgTime: document.getElementById('comp2AvgTime'),
    comp1MedianTime: document.getElementById('comp1MedianTime'),
    comp2MedianTime: document.getElementById('comp2MedianTime'),
    comp1BestTime: document.getElementById('comp1BestTime'),
    comp2BestTime: document.getElementById('comp2BestTime'),
    compWinner: document.getElementById('compWinner'),
    
    // Graph Tools
    graphTools: document.getElementById('graphTools'),
    addNodeBtn: document.getElementById('addNodeBtn'),
    addEdgeBtn: document.getElementById('addEdgeBtn'),
    removeNodeBtn: document.getElementById('removeNodeBtn'),
    clearGraphBtn: document.getElementById('clearGraphBtn'),
    directedGraph: document.getElementById('directedGraph'),
    weightedGraph: document.getElementById('weightedGraph')
};

const CRITICAL_ELEMENT_KEYS = [
    'categorySelector', 'sizeSlider', 'speedSlider',
    'generateBtn', 'startBtn', 'pauseBtn', 'stepBtn', 'resetBtn',
    'themeToggle', 'soundToggle', 'modeToggle', 'qualityToggle',
    'canvas', 'sidebar', 'rightPanel',
    'tabButtons', 'tabContents',
    'comparisonBtn', 'comparisonModal', 'runComparisonBtn'
];

function validateCriticalElements() {
    const missing = CRITICAL_ELEMENT_KEYS.filter(key => {
        const value = elements[key];
        if (NodeList.prototype.isPrototypeOf(value)) {
            return value.length === 0;
        }
        return !value;
    });

    if (missing.length === 0) {
        return true;
    }

    console.error('Missing critical DOM elements:', missing.join(', '));
    const fallbackStatus = document.getElementById('stepText');
    if (fallbackStatus) {
        fallbackStatus.textContent = `Initialization failed: missing UI elements (${missing.slice(0, 4).join(', ')})`;
    }
    return false;
}

const COPY_BUTTON_DEFAULT = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" stroke="currentColor" stroke-width="1.5"/><path d="M2 10V2H10" stroke="currentColor" stroke-width="1.5"/></svg> Copy';
const COPY_BUTTON_SUCCESS = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 3" stroke="currentColor" stroke-width="2"/></svg> Copied!';
const COPY_BUTTON_ERROR = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="2"/></svg> Copy Failed';
let copyFeedbackTimer = null;

const graphAlgorithms = new Set([
    'bfs', 'dfs', 'bidibfs', 'dijkstra', 'astar', 'bellman', 'floyd', 'kruskal',
    'prim', 'topo', 'unionfind', 'graphcolor', 'components'
]);

const treeAlgorithms = new Set([
    'bst', 'avl', 'heaptree', 'inorder', 'preorder', 'postorder', 'levelorder'
]);

const dpTableAlgorithms = new Set([
    'fibonacci', 'knapsack', 'lcs', 'editdist', 'matrixchain', 'coinchange', 'lis', 'kadane', 'subsetsum', 'floyd'
]);

function isGraphAlgorithm(algo = state.algorithm) {
    return graphAlgorithms.has(algo);
}

function isTreeAlgorithm(algo = state.algorithm) {
    return treeAlgorithms.has(algo);
}

function isDPTableAlgorithm(algo = state.algorithm) {
    return dpTableAlgorithms.has(algo);
}

function getVisualizationMode(algo = state.algorithm) {
    if (isGraphAlgorithm(algo) && algo !== 'floyd') return 'graph';
    if (isTreeAlgorithm(algo)) return 'tree';
    if (isDPTableAlgorithm(algo) || state.category === 'dp') return 'dp';
    return 'canvas';
}

function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function isSidebarCollapsed() {
    return elements.sidebar.classList.contains('collapsed');
}

function isPanelCollapsed() {
    return elements.rightPanel.classList.contains('collapsed');
}

function updateDrawerLayout() {
    let sidebarCollapsed = isSidebarCollapsed();
    let panelCollapsed = isPanelCollapsed();

    if (state.interviewMode && !panelCollapsed) {
        elements.rightPanel.classList.add('collapsed');
        panelCollapsed = true;
    }

    if (isMobileViewport() && !sidebarCollapsed && !panelCollapsed) {
        elements.rightPanel.classList.add('collapsed');
        panelCollapsed = true;
    }

    if (elements.sidebarToggle) {
        elements.sidebarToggle.setAttribute('aria-expanded', String(!sidebarCollapsed));
    }
    if (elements.panelToggle) {
        elements.panelToggle.setAttribute('aria-expanded', String(!panelCollapsed));
    }

    if (elements.sidebarHandle) {
        elements.sidebarHandle.classList.toggle('hidden', !sidebarCollapsed);
    }
    if (elements.panelHandle) {
        const canOpenPanel = !state.interviewMode;
        elements.panelHandle.classList.toggle('hidden', !panelCollapsed || !canOpenPanel);
    }

    const showBackdrop = isMobileViewport()
        && ((!sidebarCollapsed && panelCollapsed) || (sidebarCollapsed && !panelCollapsed));
    if (elements.drawerBackdrop) {
        elements.drawerBackdrop.classList.toggle('hidden', !showBackdrop);
    }
    document.body.classList.toggle('drawer-open', showBackdrop);
}

function toggleSidebar(forceCollapsed = null) {
    const currentlyCollapsed = isSidebarCollapsed();
    const shouldCollapse = forceCollapsed === null ? !currentlyCollapsed : !!forceCollapsed;
    elements.sidebar.classList.toggle('collapsed', shouldCollapse);

    if (!shouldCollapse && isMobileViewport()) {
        elements.rightPanel.classList.add('collapsed');
    }
    updateDrawerLayout();
}

function togglePanel(forceCollapsed = null) {
    const currentlyCollapsed = isPanelCollapsed();
    const shouldCollapse = forceCollapsed === null ? !currentlyCollapsed : !!forceCollapsed;

    if (!shouldCollapse && state.interviewMode) {
        return;
    }

    elements.rightPanel.classList.toggle('collapsed', shouldCollapse);
    if (!shouldCollapse && isMobileViewport()) {
        elements.sidebar.classList.add('collapsed');
    }
    updateDrawerLayout();
}

function updateVisibleAlgorithmList(autoSelect = false) {
    const query = (elements.algoSearch?.value || '').trim().toLowerCase();
    let firstVisibleBtn = null;
    let visibleCount = 0;
    let totalInCategory = 0;

    elements.algoCategories.forEach(category => {
        const isCurrentCategory = category.dataset.category === state.category;
        category.classList.toggle('hidden', !isCurrentCategory);

        const buttons = category.querySelectorAll('.algo-btn');
        if (isCurrentCategory) {
            totalInCategory = buttons.length;
        }

        buttons.forEach(btn => {
            const haystack = `${btn.textContent} ${btn.dataset.algo}`.toLowerCase();
            const matches = !query || haystack.includes(query);
            const shouldShow = isCurrentCategory && matches;

            btn.classList.toggle('hidden', !shouldShow);
            if (shouldShow && !firstVisibleBtn) {
                firstVisibleBtn = btn;
            }
            if (shouldShow) {
                visibleCount++;
            }
        });
    });

    if (elements.clearAlgoSearch) {
        elements.clearAlgoSearch.classList.toggle('hidden', !query);
    }
    if (elements.algoSearchMeta) {
        if (query) {
            elements.algoSearchMeta.textContent = visibleCount > 0
                ? `${visibleCount} of ${totalInCategory} algorithms match "${query}"`
                : `No matches for "${query}" in this category`;
        } else {
            elements.algoSearchMeta.textContent = `Showing all ${totalInCategory} algorithms in this category`;
        }
        elements.algoSearchMeta.classList.toggle('empty', query && visibleCount === 0);
    }

    if (!autoSelect) return;

    const activeVisible = Array.from(elements.algoButtons).find(btn =>
        btn.classList.contains('active') && !btn.classList.contains('hidden')
    );

    if (!activeVisible && firstVisibleBtn) {
        firstVisibleBtn.click();
    } else if (!firstVisibleBtn && query) {
        updateStep(`No algorithms match "${query}" in ${state.category}`);
    }
}

function syncNavbarHeight() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const height = Math.ceil(navbar.getBoundingClientRect().height);
    if (height > 0) {
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
}

function sanitizeCategory(value) {
    return CATEGORY_SET.has(value) ? value : 'sorting';
}

function sanitizePanelTab(value) {
    return PANEL_TAB_SET.has(value) ? value : 'overview';
}

function applyCategoryAccent(category = state.category) {
    const nextCategory = sanitizeCategory(category);
    document.documentElement.setAttribute('data-category-accent', nextCategory);
}

function getFirstAlgorithmForCategory(category) {
    const matched = Array.from(elements.algoButtons).find(btn =>
        btn.closest('.algo-category')?.dataset.category === category
    );
    return matched?.dataset.algo || 'bubble';
}

function syncActiveAlgorithmButton() {
    let activeButton = Array.from(elements.algoButtons).find(btn =>
        btn.dataset.algo === state.algorithm
        && btn.closest('.algo-category')?.dataset.category === state.category
    );

    if (!activeButton) {
        state.algorithm = getFirstAlgorithmForCategory(state.category);
        activeButton = Array.from(elements.algoButtons).find(btn => btn.dataset.algo === state.algorithm);
    }

    if (activeButton) {
        elements.algoButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        safeStorageSet(STORAGE_KEYS.algorithm, state.algorithm);
    }
}

function switchPanelTab(tabId, persist = true) {
    if (!tabId) return;
    const nextTab = sanitizePanelTab(tabId);

    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === nextTab);
    });

    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.dataset.tab === nextTab);
    });

    state.activeTab = nextTab;
    if (persist) {
        safeStorageSet(STORAGE_KEYS.tab, nextTab);
    }
}

function applyTheme(theme, persist = true) {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    state.theme = nextTheme;
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (persist) {
        safeStorageSet(STORAGE_KEYS.theme, nextTheme);
    }
}

function initializePreferences() {
    const storedTheme = safeStorageGet(STORAGE_KEYS.theme);
    const prefersLight = window.matchMedia
        && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = storedTheme || (prefersLight ? 'light' : 'dark');
    applyTheme(initialTheme, false);

    const storedSound = safeStorageGet(STORAGE_KEYS.sound);
    state.soundEnabled = storedSound === null ? true : storedSound === 'on';

    const storedMode = safeStorageGet(STORAGE_KEYS.mode);
    state.interviewMode = storedMode === 'interview';

    const storedQuality = safeStorageGet(STORAGE_KEYS.quality);
    state.highQuality = storedQuality === null ? true : storedQuality === 'high';

    const storedProfile = safeStorageGet(STORAGE_KEYS.dataProfile);
    state.dataProfile = DATA_PROFILES.has(storedProfile) ? storedProfile : 'random';

    const storedCategory = safeStorageGet(STORAGE_KEYS.category);
    state.category = sanitizeCategory(storedCategory || state.category);

    const storedAlgorithm = safeStorageGet(STORAGE_KEYS.algorithm);
    if (storedAlgorithm && Object.prototype.hasOwnProperty.call(algorithmDB, storedAlgorithm)) {
        state.algorithm = storedAlgorithm;
    }

    const storedTab = safeStorageGet(STORAGE_KEYS.tab);
    state.activeTab = sanitizePanelTab(storedTab || state.activeTab);
}

function syncPreferenceControls() {
    if (elements.themeToggle) {
        elements.themeToggle.setAttribute('aria-pressed', state.theme === 'light' ? 'true' : 'false');
    }

    if (elements.soundToggle) {
        elements.soundToggle.classList.toggle('active', state.soundEnabled);
        elements.soundToggle.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
    }

    if (elements.modeToggle) {
        elements.modeToggle.classList.toggle('active', state.interviewMode);
        elements.modeToggle.setAttribute('aria-pressed', state.interviewMode ? 'true' : 'false');
        const modeLabel = elements.modeToggle.querySelector('.toggle-label');
        if (modeLabel) {
            modeLabel.textContent = state.interviewMode ? 'Interview' : 'Beginner';
        }
    }

    if (elements.qualityToggle) {
        elements.qualityToggle.classList.toggle('active', state.highQuality);
        elements.qualityToggle.setAttribute('aria-pressed', state.highQuality ? 'true' : 'false');
        const qualityLabel = elements.qualityToggle.querySelector('.toggle-label');
        if (qualityLabel) {
            qualityLabel.textContent = state.highQuality ? 'High' : 'Low';
        }
    }

    if (elements.dataProfileSelect) {
        elements.dataProfileSelect.value = state.dataProfile;
    }

    if (elements.comparisonProfile) {
        elements.comparisonProfile.value = state.dataProfile;
    }

    if (elements.categorySelector) {
        elements.categorySelector.value = state.category;
    }

    if (elements.rightPanel && state.interviewMode) {
        elements.rightPanel.classList.add('collapsed');
    }
}

function setCopyButtonState(status = 'default') {
    if (!elements.copyCodeBtn) return;

    if (copyFeedbackTimer) {
        clearTimeout(copyFeedbackTimer);
        copyFeedbackTimer = null;
    }

    if (status === 'success') {
        elements.copyCodeBtn.innerHTML = COPY_BUTTON_SUCCESS;
    } else if (status === 'error') {
        elements.copyCodeBtn.innerHTML = COPY_BUTTON_ERROR;
    } else {
        elements.copyCodeBtn.innerHTML = COPY_BUTTON_DEFAULT;
    }

    if (status !== 'default') {
        copyFeedbackTimer = setTimeout(() => {
            elements.copyCodeBtn.innerHTML = COPY_BUTTON_DEFAULT;
            copyFeedbackTimer = null;
        }, 2200);
    }
}

async function copyTextToClipboard(text) {
    if (!text) return false;

    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback to execCommand below.
        }
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);
        return copied;
    } catch (error) {
        return false;
    }
}

function clearVisualizationStates() {
    state.array.forEach(item => {
        item.state = 'default';
    });
    state.graph.nodes.forEach(node => {
        node.state = 'default';
        node.distance = Infinity;
        node.visited = false;
        node.color = null;
    });
    state.graph.edges.forEach(edge => {
        edge.state = 'default';
    });
}

// === Algorithm Database ===
const algorithmDB = {
    bubble: {
        name: 'Bubble Sort',
        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
        steps: [
            'Compare adjacent elements',
            'Swap if they are in wrong order',
            'Repeat for all elements',
            'Continue until no swaps needed'
        ],
        useCases: [
            'Educational purposes',
            'Small datasets',
            'Nearly sorted data'
        ],
        complexity: {
            best: 'O(n)',
            average: 'O(n^2)',
            worst: 'O(n^2)',
            space: 'O(1)'
        },
        characteristics: [
            '<strong>Stability:</strong> Stable',
            '<strong>In-Place:</strong> Yes',
            '<strong>Adaptive:</strong> Yes',
            '<strong>Online:</strong> No'
        ],
        edgeCases: [
            'Already sorted array',
            'Reverse sorted array',
            'Array with duplicates',
            'Single element array'
        ],
        code: `function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
    
    return arr;
}`,
        pseudocode: `procedure bubbleSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n-1 do
        swapped = false
        for j = 0 to n-i-2 do
            if A[j] > A[j+1] then
                swap(A[j], A[j+1])
                swapped = true
            end if
        end for
        if not swapped then
            break
        end if
    end for
end procedure`
    },
    
    selection: {
        name: 'Selection Sort',
        description: 'Selection Sort divides the input into a sorted and unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and moves it to the sorted region.',
        steps: [
            'Find minimum element in unsorted array',
            'Swap it with first unsorted element',
            'Move boundary of sorted array',
            'Repeat until array is sorted'
        ],
        useCases: [
            'Small datasets',
            'Memory-constrained environments',
            'When writes are expensive'
        ],
        complexity: {
            best: 'O(n^2)',
            average: 'O(n^2)',
            worst: 'O(n^2)',
            space: 'O(1)'
        },
        characteristics: [
            '<strong>Stability:</strong> Unstable',
            '<strong>In-Place:</strong> Yes',
            '<strong>Adaptive:</strong> No',
            '<strong>Online:</strong> No'
        ],
        edgeCases: [
            'Already sorted array',
            'All elements same',
            'Large arrays',
            'Small arrays'
        ],
        code: `function selectionSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    
    return arr;
}`,
        pseudocode: `procedure selectionSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n-2 do
        minIdx = i
        for j = i+1 to n-1 do
            if A[j] < A[minIdx] then
                minIdx = j
            end if
        end for
        if minIdx != i then
            swap(A[i], A[minIdx])
        end if
    end for
end procedure`
    },
    
    insertion: {
        name: 'Insertion Sort',
        description: 'Insertion Sort builds the final sorted array one item at a time. It picks elements from the unsorted part and places them at the correct position in the sorted part.',
        steps: [
            'Start from second element',
            'Compare with elements before it',
            'Shift larger elements to right',
            'Insert element at correct position'
        ],
        useCases: [
            'Small datasets',
            'Nearly sorted data',
            'Online sorting (streaming data)',
            'Building sorted list incrementally'
        ],
        complexity: {
            best: 'O(n)',
            average: 'O(n^2)',
            worst: 'O(n^2)',
            space: 'O(1)'
        },
        characteristics: [
            '<strong>Stability:</strong> Stable',
            '<strong>In-Place:</strong> Yes',
            '<strong>Adaptive:</strong> Yes',
            '<strong>Online:</strong> Yes'
        ],
        edgeCases: [
            'Already sorted array',
            'Reverse sorted array',
            'Few unique elements',
            'Large number of duplicates'
        ],
        code: `function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    
    return arr;
}`,
        pseudocode: `procedure insertionSort(A: list of sortable items)
    for i = 1 to length(A)-1 do
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key do
            A[j+1] = A[j]
            j = j - 1
        end while
        A[j+1] = key
    end for
end procedure`
    },
    
    merge: {
        name: 'Merge Sort',
        description: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves.',
        steps: [
            'Divide array into two halves',
            'Recursively sort each half',
            'Merge the sorted halves',
            'Combine results'
        ],
        useCases: [
            'Large datasets',
            'Linked lists',
            'External sorting',
            'Stable sorting required'
        ],
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            space: 'O(n)'
        },
        characteristics: [
            '<strong>Stability:</strong> Stable',
            '<strong>In-Place:</strong> No',
            '<strong>Adaptive:</strong> No',
            '<strong>Online:</strong> No'
        ],
        edgeCases: [
            'Already sorted',
            'Reverse sorted',
            'All duplicates',
            'Large arrays'
        ],
        code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,
        pseudocode: `procedure mergeSort(A: list of sortable items)
    if length(A) <= 1 then
        return A
    end if
    
    mid = length(A) / 2
    left = mergeSort(A[0...mid-1])
    right = mergeSort(A[mid...end])
    
    return merge(left, right)
end procedure`
    },
    
    quick: {
        name: 'Quick Sort',
        description: 'Quick Sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
        steps: [
            'Choose a pivot element',
            'Partition array around pivot',
            'Recursively sort left partition',
            'Recursively sort right partition'
        ],
        useCases: [
            'General purpose sorting',
            'Large datasets',
            'In-memory sorting',
            'Cache-efficient sorting'
        ],
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n^2)',
            space: 'O(log n)'
        },
        characteristics: [
            '<strong>Stability:</strong> Unstable',
            '<strong>In-Place:</strong> Yes',
            '<strong>Adaptive:</strong> No',
            '<strong>Online:</strong> No'
        ],
        edgeCases: [
            'Already sorted (bad pivot)',
            'All elements equal',
            'Few unique elements',
            'Small arrays'
        ],
        code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
        pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        pi = partition(A, low, high)
        quickSort(A, low, pi-1)
        quickSort(A, pi+1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot = A[high]
    i = low - 1
    for j = low to high-1 do
        if A[j] < pivot then
            i = i + 1
            swap(A[i], A[j])
        end if
    end for
    swap(A[i+1], A[high])
    return i + 1
end procedure`
    },
    
    heap: {
        name: 'Heap Sort',
        description: 'Heap Sort uses a binary heap data structure to sort elements. It builds a max heap and repeatedly extracts the maximum element.',
        steps: [
            'Build a max heap from array',
            'Swap root with last element',
            'Reduce heap size by 1',
            'Heapify root and repeat'
        ],
        useCases: [
            'Priority queue implementation',
            'When consistent O(n log n) needed',
            'Memory-constrained environments'
        ],
        complexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            space: 'O(1)'
        },
        characteristics: [
            '<strong>Stability:</strong> Unstable',
            '<strong>In-Place:</strong> Yes',
            '<strong>Adaptive:</strong> No',
            '<strong>Online:</strong> No'
        ],
        edgeCases: [
            'Already sorted',
            'All elements equal',
            'Few unique elements'
        ],
        code: `function heapSort(arr) {
    const n = arr.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}`,
        pseudocode: `procedure heapSort(A)
    n = length(A)
    
    for i = n/2 - 1 down to 0 do
        heapify(A, n, i)
    end for
    
    for i = n-1 down to 1 do
        swap(A[0], A[i])
        heapify(A, i, 0)
    end for
end procedure`
    },
    
    counting: {
        name: 'Counting Sort',
        description: 'Counting Sort is a non-comparison sorting algorithm that counts occurrences of each element and uses arithmetic to determine positions.',
        complexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)' },
        steps: ['Count occurrences', 'Calculate cumulative count', 'Place elements', 'Output sorted array'],
        useCases: ['Small range of integers', 'When k is small', 'Stable sorting needed'],
        code: `function countingSort(arr) {
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    const output = new Array(arr.length);
    
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
    
    return output;
}`
    },
    
    radix: {
        name: 'Radix Sort',
        description: 'Radix Sort processes digits from least significant to most significant, using counting sort as a subroutine.',
        complexity: { best: 'O(d*(n+k))', average: 'O(d*(n+k))', worst: 'O(d*(n+k))', space: 'O(n+k)' },
        steps: ['Sort by least significant digit', 'Move to next digit', 'Repeat until most significant', 'Array is sorted'],
        useCases: ['Fixed-length integers', 'String sorting', 'When range is large'],
        code: `function radixSort(arr) {
    const max = Math.max(...arr);
    let exp = 1;
    
    while (Math.floor(max / exp) > 0) {
        countingSortByDigit(arr, exp);
        exp *= 10;
    }
    
    return arr;
}`
    },
    
    shell: {
        name: 'Shell Sort',
        description: 'Shell Sort is an optimization of insertion sort that allows exchange of items that are far apart, using gap sequences.',
        complexity: { best: 'O(n log n)', average: 'O(n^1.5)', worst: 'O(n^2)', space: 'O(1)' },
        steps: ['Start with large gap', 'Sort elements at gap intervals', 'Reduce gap', 'Repeat until gap is 1'],
        useCases: ['Medium-sized datasets', 'When quick sort overhead too high', 'Embedded systems'],
        code: `function shellSort(arr) {
    const n = arr.length;
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;
            
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            
            arr[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    
    return arr;
}`
    },
    
    timsort: {
        name: 'TimSort',
        description: 'TimSort is a hybrid sorting algorithm derived from merge sort and insertion sort, used in Python and Java.',
        complexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        steps: ['Sort small runs with insertion', 'Merge runs intelligently', 'Use galloping mode', 'Optimize for real data'],
        useCases: ['Real-world data', 'Python/Java standard sort', 'Nearly sorted data'],
        code: `// Simplified TimSort concept
function timSort(arr) {
    const minRun = 32;
    const n = arr.length;
    
    // Sort individual runs
    for (let i = 0; i < n; i += minRun) {
        insertionSort(arr, i, Math.min(i + minRun - 1, n - 1));
    }
    
    // Merge runs
    let size = minRun;
    while (size < n) {
        for (let start = 0; start < n; start += size * 2) {
            const mid = start + size - 1;
            const end = Math.min(start + size * 2 - 1, n - 1);
            if (mid < end) {
                merge(arr, start, mid, end);
            }
        }
        size *= 2;
    }
    
    return arr;
}`
    },

    cocktail: {
        name: 'Cocktail Shaker Sort',
        description: 'Cocktail Shaker Sort is a bi-directional bubble sort variant that scans forward then backward each pass.',
        complexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
        steps: ['Forward pass bubbles largest to end', 'Backward pass bubbles smallest to start', 'Shrink unsorted bounds', 'Repeat until no swaps'],
        useCases: ['Nearly sorted data', 'Educational bidirectional sorting', 'Arrays with small disorder'],
        code: `function cocktailShakerSort(arr) {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
        swapped = false;
        end--;
        
        for (let i = end; i > start; i--) {
            if (arr[i - 1] > arr[i]) {
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                swapped = true;
            }
        }
        start++;
    }
    
    return arr;
}`
    },

    bucket: {
        name: 'Bucket Sort',
        description: 'Bucket Sort distributes elements into value-range buckets, sorts each bucket, and concatenates results.',
        complexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n^2)', space: 'O(n+k)' },
        steps: ['Create buckets by value range', 'Scatter elements into buckets', 'Sort each bucket', 'Merge buckets in order'],
        useCases: ['Uniformly distributed numeric data', 'Floating-point normalization', 'Linear-time average sorting'],
        characteristics: [
            '<strong>Type:</strong> Distribution-based',
            '<strong>Stability:</strong> Stable if bucket sort is stable',
            '<strong>Best with:</strong> Near-uniform values'
        ],
        code: `function bucketSort(arr, bucketCount = 10) {
    if (arr.length <= 1) return arr;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const buckets = Array.from({ length: bucketCount }, () => []);
    
    for (const value of arr) {
        const normalized = (value - min) / Math.max(1, max - min);
        const idx = Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
        buckets[idx].push(value);
    }
    
    return buckets
        .map(bucket => bucket.sort((a, b) => a - b))
        .flat();
}`,
        pseudocode: `procedure bucketSort(A)
    if length(A) <= 1 then return A
    create k empty buckets
    scatter each value into bucket by normalized range
    sort each bucket
    concatenate buckets
end procedure`
    },
    
    // Searching algorithms
    linear: {
        name: 'Linear Search',
        description: 'Linear Search sequentially checks each element until the target is found or the list ends.',
        complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        steps: ['Start from first element', 'Compare with target', 'Move to next if not found', 'Return index or -1'],
        useCases: ['Unsorted data', 'Small datasets', 'Single search operation'],
        code: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`
    },
    
    binary: {
        name: 'Binary Search',
        description: 'Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
        complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        steps: ['Find middle element', 'Compare with target', 'Eliminate half of search space', 'Repeat until found'],
        useCases: ['Sorted data', 'Large datasets', 'Repeated searches'],
        code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
    },
    
    jump: {
        name: 'Jump Search',
        description: 'Jump Search works on sorted arrays by jumping ahead by fixed steps and then performing linear search in the block.',
        complexity: { best: 'O(1)', average: 'O(sqrt(n))', worst: 'O(sqrt(n))', space: 'O(1)' },
        steps: ['Jump by sqrt(n) steps', 'Find block containing element', 'Linear search in block', 'Return result'],
        useCases: ['Sorted data', 'Better than linear, simpler than binary', 'Sequential access preferred'],
        code: `function jumpSearch(arr, target) {
    const n = arr.length;
    const jump = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    while (arr[Math.min(jump, n) - 1] < target) {
        prev = jump;
        jump += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev === Math.min(jump, n)) return -1;
    }
    
    if (arr[prev] === target) return prev;
    return -1;
}`
    },
    
    exponential: {
        name: 'Exponential Search',
        description: 'Exponential Search finds the range where element may be present and performs binary search in that range.',
        complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        steps: ['Find range [2^i-1, 2^i]', 'Use binary search in range', 'Return result'],
        useCases: ['Unbounded/infinite arrays', 'Better than binary for front-heavy searches'],
        code: `function exponentialSearch(arr, target) {
    if (arr[0] === target) return 0;
    
    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        i *= 2;
    }
    
    return binarySearch(arr, target, i / 2, Math.min(i, arr.length - 1));
}`
    },
    
    interpolation: {
        name: 'Interpolation Search',
        description: 'Interpolation Search is an improved variant of binary search for uniformly distributed sorted arrays.',
        complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
        steps: ['Calculate probable position', 'Check if found', 'Adjust search range', 'Repeat'],
        useCases: ['Uniformly distributed data', 'Large sorted arrays', 'Better than binary for uniform data'],
        code: `function interpolationSearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            if (arr[low] === target) return low;
            return -1;
        }
        
        const pos = low + Math.floor(
            ((target - arr[low]) * (high - low)) / 
            (arr[high] - arr[low])
        );
        
        if (arr[pos] === target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    
    return -1;
}`
    },

    ternary: {
        name: 'Ternary Search',
        description: 'Ternary Search divides a sorted search space into three parts using two midpoints each iteration.',
        complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        steps: ['Pick two midpoints', 'Compare target with both mids', 'Discard two-thirds of range', 'Repeat until found'],
        useCases: ['Ordered arrays', 'Unimodal optimization concepts', 'Interview practice'],
        code: `function ternarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const third = Math.floor((right - left) / 3);
        const mid1 = left + third;
        const mid2 = right - third;
        
        if (arr[mid1] === target) return mid1;
        if (arr[mid2] === target) return mid2;
        
        if (target < arr[mid1]) {
            right = mid1 - 1;
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
        } else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }
    
    return -1;
}`
    },

    fibsearch: {
        name: 'Fibonacci Search',
        description: 'Fibonacci Search locates an item in a sorted array by splitting ranges using Fibonacci numbers instead of halving.',
        complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
        steps: ['Build smallest Fibonacci number >= n', 'Probe using fib offsets', 'Shrink range by Fibonacci decomposition', 'Verify final candidate'],
        useCases: ['Sorted arrays', 'Memory-latency sensitive search', 'Alternative to binary search'],
        characteristics: [
            '<strong>Requirement:</strong> Sorted data',
            '<strong>Probe strategy:</strong> Fibonacci intervals',
            '<strong>Comparison count:</strong> Logarithmic'
        ],
        code: `function fibonacciSearch(arr, target) {
    let fibMm2 = 0;
    let fibMm1 = 1;
    let fibM = fibMm1 + fibMm2;
    
    while (fibM < arr.length) {
        fibMm2 = fibMm1;
        fibMm1 = fibM;
        fibM = fibMm1 + fibMm2;
    }
    
    let offset = -1;
    while (fibM > 1) {
        const i = Math.min(offset + fibMm2, arr.length - 1);
        if (arr[i] < target) {
            fibM = fibMm1;
            fibMm1 = fibMm2;
            fibMm2 = fibM - fibMm1;
            offset = i;
        } else if (arr[i] > target) {
            fibM = fibMm2;
            fibMm1 = fibMm1 - fibMm2;
            fibMm2 = fibM - fibMm1;
        } else {
            return i;
        }
    }
    
    if (fibMm1 && arr[offset + 1] === target) return offset + 1;
    return -1;
}`,
        pseudocode: `procedure fibonacciSearch(A, target)
    build fib numbers until fibM >= n
    offset = -1
    while fibM > 1 do
        i = min(offset + fibMm2, n-1)
        compare A[i] with target and reduce fib window
    end while
    check last candidate
end procedure`
    },
    
    // Graph Algorithms
    bfs: {
        name: 'Breadth-First Search',
        description: 'BFS explores all vertices at the current depth before moving to vertices at the next depth level.',
        complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Start at root', 'Visit all neighbors', 'Move to next level', 'Repeat until all visited'],
        useCases: ['Shortest path in unweighted graph', 'Level-order traversal', 'Connected components'],
        code: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        
        for (const neighbor of graph[vertex]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return visited;
}`
    },
    
    dfs: {
        name: 'Depth-First Search',
        description: 'DFS explores as far as possible along each branch before backtracking.',
        complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Start at root', 'Explore first unvisited neighbor', 'Recursively visit', 'Backtrack when stuck'],
        useCases: ['Cycle detection', 'Topological sorting', 'Path finding'],
        code: `function dfs(graph, start, visited = new Set()) {
    visited.add(start);
    
    for (const neighbor of graph[start]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
    
    return visited;
}`
    },

    bidibfs: {
        name: 'Bidirectional BFS',
        description: 'Bidirectional BFS runs BFS simultaneously from source and target to meet in the middle, reducing explored states.',
        complexity: { best: 'O(b^(d/2))', average: 'O(b^(d/2))', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Start BFS from source and target', 'Expand smaller frontier first', 'Check frontier intersection', 'Reconstruct path'],
        useCases: ['Unweighted shortest path', 'Large sparse graphs', 'State-space search'],
        code: `function bidirectionalBFS(graph, start, goal) {
    if (start === goal) return [start];
    
    const q1 = [start], q2 = [goal];
    const parent1 = { [start]: null };
    const parent2 = { [goal]: null };
    const visited1 = new Set([start]);
    const visited2 = new Set([goal]);
    
    while (q1.length && q2.length) {
        const meet = expand(q1, visited1, visited2, parent1, graph);
        if (meet !== null) return buildPath(meet, parent1, parent2);
        const meet2 = expand(q2, visited2, visited1, parent2, graph);
        if (meet2 !== null) return buildPath(meet2, parent1, parent2);
    }
    
    return [];
}`
    },

    components: {
        name: 'Connected Components',
        description: 'Connected Components identifies disjoint groups of vertices where each pair is connected by a path.',
        complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Mark all nodes unvisited', 'Run BFS/DFS from each unvisited node', 'Label reached nodes as one component', 'Repeat until all visited'],
        useCases: ['Network segmentation', 'Cluster discovery', 'Graph partition pre-processing'],
        characteristics: [
            '<strong>Works on:</strong> Undirected graphs (weak components for directed)',
            '<strong>Traversal:</strong> BFS or DFS',
            '<strong>Output:</strong> Component labels and counts'
        ],
        code: `function connectedComponents(graph) {
    const visited = new Set();
    const components = [];
    
    for (const node of graph.nodes) {
        if (visited.has(node.id)) continue;
        const queue = [node.id];
        const component = [];
        visited.add(node.id);
        
        while (queue.length) {
            const current = queue.shift();
            component.push(current);
            for (const edge of graph.edges) {
                const neighbor =
                    edge.from === current ? edge.to :
                    edge.to === current ? edge.from : null;
                if (neighbor !== null && !visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        components.push(component);
    }
    
    return components;
}`,
        pseudocode: `procedure connectedComponents(G)
    visited = empty set
    for each vertex v in G do
        if v not visited then
            run BFS/DFS from v
            mark all reached as one component
        end if
    end for
end procedure`
    },
    
    dijkstra: {
        name: "Dijkstra's Algorithm",
        description: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph.",
        complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
        steps: ['Initialize distances', 'Pick minimum distance vertex', 'Update neighbor distances', 'Repeat until all visited'],
        useCases: ['GPS navigation', 'Network routing', 'Shortest path problems'],
        code: `function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const pq = [[start, 0]];
    
    for (let node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0;
    
    while (pq.length > 0) {
        const [current, dist] = pq.shift();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        for (let [neighbor, weight] of graph[current]) {
            const newDist = dist + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                pq.push([neighbor, newDist]);
            }
        }
    }
    
    return distances;
}`
    },
    
    astar: {
        name: 'A* Pathfinding',
        description: 'A* is an informed search algorithm that finds the shortest path using heuristics.',
        complexity: { best: 'O(E)', average: 'O(b^d)', worst: 'O(b^d)', space: 'O(b^d)' },
        steps: ['Use f(n) = g(n) + h(n)', 'Pick lowest f score', 'Expand node', 'Update neighbors'],
        useCases: ['Game pathfinding', 'Robot navigation', 'Map routing'],
        code: `function astar(graph, start, goal, heuristic) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = { [start]: 0 };
    const fScore = { [start]: heuristic(start, goal) };
    
    while (openSet.length > 0) {
        const current = openSet.reduce((a, b) => 
            fScore[a] < fScore[b] ? a : b
        );
        
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }
        
        openSet.splice(openSet.indexOf(current), 1);
        
        for (let neighbor of graph[current]) {
            const tentativeGScore = gScore[current] + 1;
            
            if (tentativeGScore < (gScore[neighbor] || Infinity)) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    
    return null;
}`
    },
    
    bellman: {
        name: 'Bellman-Ford Algorithm',
        description: 'Bellman-Ford computes shortest paths from a single source vertex to all other vertices, even with negative edge weights.',
        complexity: { best: 'O(VE)', average: 'O(VE)', worst: 'O(VE)', space: 'O(V)' },
        steps: ['Initialize distances', 'Relax all edges V-1 times', 'Check for negative cycles', 'Return distances'],
        useCases: ['Graphs with negative weights', 'Detect negative cycles', 'Currency arbitrage'],
        code: `function bellmanFord(graph, start) {
    const V = graph.nodes.length;
    const distances = new Array(V).fill(Infinity);
    distances[start] = 0;
    
    for (let i = 0; i < V - 1; i++) {
        for (const edge of graph.edges) {
            if (distances[edge.from] + edge.weight < distances[edge.to]) {
                distances[edge.to] = distances[edge.from] + edge.weight;
            }
        }
    }
    
    for (const edge of graph.edges) {
        if (distances[edge.from] + edge.weight < distances[edge.to]) {
            return null;
        }
    }
    
    return distances;
}`
    },
    
    floyd: {
        name: 'Floyd-Warshall Algorithm',
        description: 'Floyd-Warshall finds shortest paths between all pairs of vertices in a weighted graph.',
        complexity: { best: 'O(V^3)', average: 'O(V^3)', worst: 'O(V^3)', space: 'O(V^2)' },
        steps: ['Create distance matrix', 'Consider each vertex as intermediate', 'Update shortest paths', 'Return all-pairs distances'],
        useCases: ['All-pairs shortest path', 'Dense graphs', 'Transitive closure'],
        code: `function floydWarshall(graph) {
    const V = graph.nodes.length;
    const dist = Array(V).fill(null).map(() => Array(V).fill(Infinity));
    
    for (let i = 0; i < V; i++) dist[i][i] = 0;
    for (const edge of graph.edges) {
        dist[edge.from][edge.to] = edge.weight;
    }
    
    for (let k = 0; k < V; k++) {
        for (let i = 0; i < V; i++) {
            for (let j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    return dist;
}`
    },
    
    kruskal: {
        name: "Kruskal's MST",
        description: "Kruskal's algorithm finds a minimum spanning tree by sorting edges and adding them if they don't create a cycle.",
        complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' },
        steps: ['Sort edges by weight', 'Use Union-Find', 'Add edge if no cycle', 'Repeat until V-1 edges'],
        useCases: ['Network design', 'Clustering', 'Minimum cost connection'],
        code: `function kruskal(graph) {
    const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    const parent = Array(graph.nodes.length).fill(null).map((_, i) => i);
    const mst = [];
    
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    function union(x, y) {
        parent[find(x)] = find(y);
    }
    
    for (const edge of edges) {
        if (find(edge.from) !== find(edge.to)) {
            union(edge.from, edge.to);
            mst.push(edge);
        }
    }
    
    return mst;
}`
    },
    
    prim: {
        name: "Prim's MST",
        description: "Prim's algorithm builds a minimum spanning tree by growing it from a starting vertex.",
        complexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)', space: 'O(V)' },
        steps: ['Start with any vertex', 'Add minimum edge to tree', 'Mark vertex as visited', 'Repeat until all vertices included'],
        useCases: ['Dense graphs', 'Network design', 'Minimum cost spanning tree'],
        code: `function prim(graph, start = 0) {
    const V = graph.nodes.length;
    const visited = new Set([start]);
    const mst = [];
    
    while (visited.size < V) {
        let minEdge = null;
        let minWeight = Infinity;
        
        for (const edge of graph.edges) {
            if ((visited.has(edge.from) && !visited.has(edge.to)) ||
                (visited.has(edge.to) && !visited.has(edge.from))) {
                if (edge.weight < minWeight) {
                    minWeight = edge.weight;
                    minEdge = edge;
                }
            }
        }
        
        if (minEdge) {
            mst.push(minEdge);
            visited.add(minEdge.from);
            visited.add(minEdge.to);
        } else {
            break;
        }
    }
    
    return mst;
}`
    },
    
    topo: {
        name: 'Topological Sort',
        description: 'Topological Sort orders vertices in a directed acyclic graph such that for every edge u->v, u comes before v.',
        complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Calculate in-degrees', 'Add zero in-degree vertices to queue', 'Process and reduce in-degrees', 'Repeat until complete'],
        useCases: ['Task scheduling', 'Build systems', 'Course prerequisites'],
        code: `function topologicalSort(graph) {
    const V = graph.nodes.length;
    const inDegree = new Array(V).fill(0);
    const result = [];
    
    for (const edge of graph.edges) {
        inDegree[edge.to]++;
    }
    
    const queue = [];
    for (let i = 0; i < V; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const edge of graph.edges) {
            if (edge.from === node) {
                inDegree[edge.to]--;
                if (inDegree[edge.to] === 0) {
                    queue.push(edge.to);
                }
            }
        }
    }
    
    return result.length === V ? result : null;
}`
    },
    
    unionfind: {
        name: 'Union-Find (Disjoint Set)',
        description: 'Union-Find maintains a collection of disjoint sets and supports efficient union and find operations.',
        complexity: { best: 'O(alpha(n))', average: 'O(alpha(n))', worst: 'O(alpha(n))', space: 'O(n)' },
        steps: ['Initialize parent array', 'Find with path compression', 'Union by rank', 'Query connectivity'],
        useCases: ["Kruskal's algorithm", 'Connected components', 'Network connectivity'],
        code: `class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(null).map((_, i) => i);
        this.rank = Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
}`
    },
    
    // Tree Algorithms
    bst: {
        name: 'Binary Search Tree',
        description: 'A BST is a binary tree where left child < parent < right child.',
        complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(n)' },
        steps: ['Compare with root', 'Go left if smaller', 'Go right if larger', 'Insert/search recursively'],
        useCases: ['Dynamic sorting', 'Dictionary implementation', 'Database indexing'],
        code: `class BST {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
    
    insert(value) {
        if (value < this.value) {
            if (this.left === null) {
                this.left = new BST(value);
            } else {
                this.left.insert(value);
            }
        } else {
            if (this.right === null) {
                this.right = new BST(value);
            } else {
                this.right.insert(value);
            }
        }
    }
    
    search(value) {
        if (value === this.value) return true;
        if (value < this.value) {
            return this.left ? this.left.search(value) : false;
        }
        return this.right ? this.right.search(value) : false;
    }
}`
    },
    
    inorder: {
        name: 'Inorder Traversal',
        description: 'Inorder traversal visits nodes in left-root-right order.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
        steps: ['Visit left subtree', 'Visit root', 'Visit right subtree', 'Recursively apply'],
        useCases: ['Get sorted order from BST', 'Expression tree evaluation'],
        code: `function inorder(node) {
    if (node === null) return;
    inorder(node.left);
    console.log(node.value);
    inorder(node.right);
}`
    },
    
    preorder: {
        name: 'Preorder Traversal',
        description: 'Preorder traversal visits nodes in root-left-right order.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
        steps: ['Visit root', 'Visit left subtree', 'Visit right subtree', 'Recursively apply'],
        useCases: ['Copy tree', 'Prefix expression evaluation', 'Tree serialization'],
        code: `function preorder(node) {
    if (node === null) return;
    console.log(node.value);
    preorder(node.left);
    preorder(node.right);
}`
    },
    
    postorder: {
        name: 'Postorder Traversal',
        description: 'Postorder traversal visits nodes in left-right-root order.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
        steps: ['Visit left subtree', 'Visit right subtree', 'Visit root', 'Recursively apply'],
        useCases: ['Delete tree', 'Postfix expression evaluation', 'Tree cleanup'],
        code: `function postorder(node) {
    if (node === null) return;
    postorder(node.left);
    postorder(node.right);
    console.log(node.value);
}`
    },
    
    levelorder: {
        name: 'Level Order Traversal',
        description: 'Level order traversal visits nodes level by level from left to right.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(w)' },
        steps: ['Use queue', 'Enqueue root', 'Dequeue and visit', 'Enqueue children'],
        useCases: ['Level-wise processing', 'Find width of tree', 'Zigzag traversal'],
        code: `function levelOrder(root) {
    if (!root) return;
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node.value);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
}`
    },
    
    avl: {
        name: 'AVL Tree',
        description: 'AVL Tree is a self-balancing binary search tree where heights of left and right subtrees differ by at most 1.',
        complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
        steps: ['Insert like BST', 'Update heights', 'Check balance factor', 'Perform rotations if needed'],
        useCases: ['Frequent insertions/deletions', 'Guaranteed O(log n) operations', 'Database indexing'],
        code: `class AVLTree {
    insert(node, value) {
        if (!node) return new AVLNode(value);
        
        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node;
        }
        
        node.height = 1 + Math.max(
            this.getHeight(node.left), 
            this.getHeight(node.right)
        );
        
        const balance = this.getBalance(node);
        
        if (balance > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }
        if (balance < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }
        if (balance > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        if (balance < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }
        
        return node;
    }
}`
    },
    
    heaptree: {
        name: 'Heap Tree',
        description: 'A Heap is a complete binary tree that satisfies the heap property: parent is greater (max-heap) or smaller (min-heap) than children.',
        complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
        steps: ['Insert at end', 'Bubble up to maintain heap property', 'Extract from root', 'Bubble down to restore heap'],
        useCases: ['Priority queue', 'Heap sort', 'K-th largest element'],
        code: `class MinHeap {
    insert(value) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }
    
    bubbleUp(i) {
        while (i > 0 && this.heap[parent(i)] > this.heap[i]) {
            [this.heap[i], this.heap[parent(i)]] = 
                [this.heap[parent(i)], this.heap[i]];
            i = parent(i);
        }
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }
}`
    },
    
    trie: {
        name: 'Trie (Prefix Tree)',
        description: 'A Trie is a tree-like data structure that stores strings and allows for fast prefix-based searches.',
        complexity: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(ALPHABET_SIZE * N * M)' },
        steps: ['Insert character by character', 'Mark end of word', 'Search by following edges', 'Check prefix existence'],
        useCases: ['Autocomplete', 'Spell checker', 'IP routing', 'Dictionary'],
        code: `class Trie {
    constructor() {
        this.root = { children: {}, isEnd: false };
    }
    
    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = { children: {}, isEnd: false };
            }
            node = node.children[char];
        }
        node.isEnd = true;
    }
    
    search(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isEnd;
    }
}`
    },
    // === Dynamic Programming Algorithms ===
    
    fibonacci: {
        name: 'Fibonacci Sequence',
        description: 'Fibonacci computes the sequence where each number is the sum of the two preceding ones using dynamic programming.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
        steps: ['Initialize F(0)=0, F(1)=1', 'For each i, compute F(i)=F(i-1)+F(i-2)', 'Store results in DP table', 'Return F(n)'],
        useCases: ['Teaching DP basics', 'Sequence generation', 'Algorithm optimization'],
        characteristics: [
            '<strong>Method:</strong> Bottom-up DP',
            '<strong>Optimization:</strong> Space can be O(1)',
            '<strong>Recurrence:</strong> F(n) = F(n-1) + F(n-2)'
        ],
        code: `function fibonacci(n) {
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`
    },
    
    knapsack: {
        name: '0/1 Knapsack',
        description: '0/1 Knapsack finds the maximum value that can be put in a knapsack of given capacity, where items cannot be broken.',
        complexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)', space: 'O(nW)' },
        steps: ['Create DP table [n+1][W+1]', 'For each item and weight', 'Choose max of include/exclude', 'Return dp[n][W]'],
        useCases: ['Resource allocation', 'Budget optimization', 'Cargo loading'],
        characteristics: [
            '<strong>Type:</strong> Optimization problem',
            '<strong>Constraint:</strong> Items cannot be split',
            '<strong>DP Table:</strong> 2D array'
        ],
        code: `function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill(null)
        .map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}`
    },
    
    lcs: {
        name: 'Longest Common Subsequence',
        description: 'LCS finds the longest subsequence common to two sequences, where elements need not be consecutive.',
        complexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' },
        steps: ['Create DP table [m+1][n+1]', 'If characters match, add 1', 'Else take max of neighbors', 'Backtrack to find sequence'],
        useCases: ['Diff tools', 'DNA sequence alignment', 'Version control', 'Plagiarism detection'],
        characteristics: [
            '<strong>Type:</strong> String matching',
            '<strong>Output:</strong> Length and sequence',
            '<strong>Variants:</strong> LCS distance, diff'
        ],
        code: `function lcs(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null)
        .map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}`
    },
    
    editdist: {
        name: 'Edit Distance',
        description: 'Edit Distance (Levenshtein) finds minimum operations (insert, delete, replace) to convert one string to another.',
        complexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)', space: 'O(mn)' },
        steps: ['Initialize base cases', 'For each cell, compute min of insert/delete/replace', 'Store in DP table', 'Return dp[m][n]'],
        useCases: ['Spell checker', 'DNA analysis', 'Natural language processing', 'Fuzzy search'],
        characteristics: [
            '<strong>Operations:</strong> Insert, Delete, Replace',
            '<strong>Also known as:</strong> Levenshtein distance',
            '<strong>Space optimization:</strong> Can use O(n)'
        ],
        code: `function editDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill(null)
        .map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],     // Delete
                    dp[i][j - 1],     // Insert
                    dp[i - 1][j - 1]  // Replace
                );
            }
        }
    }
    
    return dp[m][n];
}`
    },
    
    matrixchain: {
        name: 'Matrix Chain Multiplication',
        description: 'Matrix Chain Multiplication finds the optimal way to multiply a chain of matrices to minimize operations.',
        complexity: { best: 'O(n^3)', average: 'O(n^3)', worst: 'O(n^3)', space: 'O(n^2)' },
        steps: ['Try all possible splits', 'Calculate cost for each split', 'Store minimum in DP table', 'Reconstruct optimal order'],
        useCases: ['Compiler optimization', 'Graphics pipelines', 'Scientific computing'],
        characteristics: [
            '<strong>Problem:</strong> Optimal parenthesization',
            '<strong>Optimization:</strong> Minimize scalar multiplications',
            '<strong>Classic DP:</strong> Interval DP pattern'
        ],
        code: `function matrixChainOrder(dims) {
    const n = dims.length - 1;
    const dp = Array(n).fill(null)
        .map(() => Array(n).fill(0));
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i < n - len + 1; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + 
                    dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    
    return dp[0][n - 1];
}`
    },

    coinchange: {
        name: 'Coin Change (Minimum Coins)',
        description: 'Coin Change finds the minimum number of coins needed to make a target amount using unlimited coin supply.',
        complexity: { best: 'O(amount)', average: 'O(amount * coins)', worst: 'O(amount * coins)', space: 'O(amount)' },
        steps: ['Initialize dp[0]=0 and others Infinity', 'For each amount, try all coins', 'Relax minimum transitions', 'Read dp[target]'],
        useCases: ['Currency systems', 'Optimization with unlimited choices', 'Dynamic programming interview problem'],
        characteristics: [
            '<strong>Type:</strong> Unbounded knapsack variant',
            '<strong>Transition:</strong> dp[a] = min(dp[a], 1 + dp[a-coin])',
            '<strong>Unreachable states:</strong> Remain Infinity'
        ],
        code: `function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let a = 1; a <= amount; a++) {
        for (const coin of coins) {
            if (coin <= a) {
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}`
    },

    lis: {
        name: 'Longest Increasing Subsequence',
        description: 'LIS finds the longest subsequence where each next value is strictly greater than the previous one.',
        complexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(n)' },
        steps: ['Initialize dp[i]=1 for all i', 'Try extending subsequences from j<i', 'Track predecessor for reconstruction', 'Return max dp value'],
        useCases: ['Trend analysis', 'Sequence optimization', 'Foundational DP training'],
        characteristics: [
            '<strong>Type:</strong> Sequence dynamic programming',
            '<strong>Variant:</strong> O(n log n) optimization exists',
            '<strong>Output:</strong> Length and one valid subsequence'
        ],
        code: `function longestIncreasingSubsequence(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);
    let bestLen = 1;
    let bestIdx = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                prev[i] = j;
            }
        }
        if (dp[i] > bestLen) {
            bestLen = dp[i];
            bestIdx = i;
        }
    }
    
    const sequence = [];
    while (bestIdx !== -1) {
        sequence.push(nums[bestIdx]);
        bestIdx = prev[bestIdx];
    }
    
    return { length: bestLen, sequence: sequence.reverse() };
}`,
        pseudocode: `procedure LIS(A)
    dp[i] = 1 for all i
    prev[i] = -1
    for i = 0 to n-1 do
        for j = 0 to i-1 do
            if A[j] < A[i] and dp[j] + 1 > dp[i] then
                dp[i] = dp[j] + 1
                prev[i] = j
            end if
        end for
    end for
    reconstruct best sequence from prev
end procedure`
    },

    kadane: {
        name: 'Maximum Subarray (Kadane\'s Algorithm)',
        description: 'Kadane\'s algorithm finds the contiguous subarray with the largest sum in linear time by tracking the best sum ending at each index.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
        steps: ['Initialize current and best with first element', 'For each value, choose extend vs restart', 'Update global best', 'Return max sum with range'],
        useCases: ['Profit/loss window analysis', 'Signal processing', 'Streaming analytics', 'Interview DP optimization'],
        characteristics: [
            '<strong>Type:</strong> Greedy + dynamic programming insight',
            '<strong>Optimal:</strong> Linear scan over array',
            '<strong>Output:</strong> Maximum sum and subarray bounds'
        ],
        code: `function kadane(nums) {
    if (!nums.length) return { maxSum: 0, start: -1, end: -1 };

    let bestSum = nums[0];
    let currentSum = nums[0];
    let bestStart = 0;
    let bestEnd = 0;
    let currentStart = 0;

    for (let i = 1; i < nums.length; i++) {
        if (currentSum + nums[i] < nums[i]) {
            currentSum = nums[i];
            currentStart = i;
        } else {
            currentSum += nums[i];
        }

        if (currentSum > bestSum) {
            bestSum = currentSum;
            bestStart = currentStart;
            bestEnd = i;
        }
    }

    return { maxSum: bestSum, start: bestStart, end: bestEnd };
}`,
        pseudocode: `procedure kadane(A)
    if A is empty then return 0
    current = A[0]
    best = A[0]
    for i = 1 to n-1 do
        current = max(A[i], current + A[i])
        best = max(best, current)
    end for
    return best
end procedure`
    },
    
    // === String Algorithms ===
    
    kmp: {
        name: 'KMP Pattern Matching',
        description: 'Knuth-Morris-Pratt algorithm efficiently searches for a pattern in text using a failure function to avoid redundant comparisons.',
        complexity: { best: 'O(n+m)', average: 'O(n+m)', worst: 'O(n+m)', space: 'O(m)' },
        steps: ['Build LPS (failure function) array', 'Match pattern with text', 'Use LPS to skip characters', 'Report all matches'],
        useCases: ['Text editors', 'DNA sequence search', 'Log file analysis', 'String matching'],
        characteristics: [
            '<strong>Preprocessing:</strong> O(m) to build LPS',
            '<strong>Searching:</strong> O(n) single pass',
            '<strong>No backtracking:</strong> In text'
        ],
        code: `function kmpSearch(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    const lps = computeLPS(pattern);
    
    const matches = [];
    let i = 0, j = 0;
    
    while (i < n) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        if (j === m) {
            matches.push(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return matches;
}`
    },
    
    rabinkarp: {
        name: 'Rabin-Karp Algorithm',
        description: 'Rabin-Karp uses hashing to find pattern matches in text, efficiently handling multiple pattern searches.',
        complexity: { best: 'O(n+m)', average: 'O(n+m)', worst: 'O(nm)', space: 'O(1)' },
        steps: ['Compute hash of pattern', 'Slide window over text', 'Compare hashes', 'Verify on hash match'],
        useCases: ['Plagiarism detection', 'Multiple pattern search', 'Document comparison'],
        characteristics: [
            '<strong>Rolling hash:</strong> Efficient window sliding',
            '<strong>Hash collisions:</strong> Need verification',
            '<strong>Multiple patterns:</strong> Very efficient'
        ],
        code: `function rabinKarp(text, pattern) {
    const d = 256;
    const q = 101;
    const m = pattern.length;
    const n = text.length;
    
    let patternHash = 0;
    let textHash = 0;
    let h = 1;
    
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    for (let i = 0; i < m; i++) {
        patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
        textHash = (d * textHash + text.charCodeAt(i)) % q;
    }
    
    const matches = [];
    
    for (let i = 0; i <= n - m; i++) {
        if (patternHash === textHash) {
            if (text.substr(i, m) === pattern) {
                matches.push(i);
            }
        }
        
        if (i < n - m) {
            textHash = (d * (textHash - text.charCodeAt(i) * h) + 
                       text.charCodeAt(i + m)) % q;
            if (textHash < 0) textHash += q;
        }
    }
    
    return matches;
}`
    },

    zalgo: {
        name: 'Z Algorithm',
        description: 'The Z algorithm computes a Z-array where Z[i] is the longest substring starting at i that matches the prefix.',
        complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
        steps: ['Build combined string pattern + sentinel + text', 'Maintain [L, R] Z-box', 'Reuse previous matches inside box', 'Report full-pattern Z matches'],
        useCases: ['Fast pattern matching', 'String periodicity checks', 'Prefix function alternatives'],
        characteristics: [
            '<strong>Linear time:</strong> Strict O(n)',
            '<strong>Core idea:</strong> Reuse prefix matches with Z-box',
            '<strong>Output:</strong> All pattern occurrences'
        ],
        code: `function zSearch(text, pattern) {
    const combined = pattern + '$' + text;
    const z = new Array(combined.length).fill(0);
    let left = 0, right = 0;
    const matches = [];
    
    for (let i = 1; i < combined.length; i++) {
        if (i <= right) {
            z[i] = Math.min(right - i + 1, z[i - left]);
        }
        while (i + z[i] < combined.length && combined[z[i]] === combined[i + z[i]]) {
            z[i]++;
        }
        if (i + z[i] - 1 > right) {
            left = i;
            right = i + z[i] - 1;
        }
        if (z[i] === pattern.length) {
            matches.push(i - pattern.length - 1);
        }
    }
    
    return matches;
}`
    },

    boyermoore: {
        name: 'Boyer-Moore (Bad Character)',
        description: 'Boyer-Moore matches from right to left and shifts the pattern aggressively using mismatch information.',
        complexity: { best: 'O(n/m)', average: 'O(n)', worst: 'O(nm)', space: 'O(alphabet)' },
        steps: ['Precompute last occurrence table', 'Align pattern window on text', 'Scan right-to-left', 'Shift by bad-character rule'],
        useCases: ['Large text search', 'Editor find operations', 'Log scanning pipelines'],
        characteristics: [
            '<strong>Heuristic:</strong> Bad-character shift',
            '<strong>Direction:</strong> Right-to-left compare',
            '<strong>Practical:</strong> Often fast on natural text'
        ],
        code: `function boyerMooreBadChar(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    const last = {};
    
    for (let i = 0; i < m; i++) {
        last[pattern[i]] = i;
    }
    
    const matches = [];
    let shift = 0;
    
    while (shift <= n - m) {
        let j = m - 1;
        while (j >= 0 && pattern[j] === text[shift + j]) {
            j--;
        }
        
        if (j < 0) {
            matches.push(shift);
            shift += shift + m < n ? m - (last[text[shift + m]] ?? -1) : 1;
        } else {
            const bad = text[shift + j];
            shift += Math.max(1, j - (last[bad] ?? -1));
        }
    }
    
    return matches;
}`,
        pseudocode: `procedure boyerMooreBadChar(text, pattern)
    build last occurrence map for pattern
    shift = 0
    while shift <= n-m do
        scan j from m-1 down to 0 while chars match
        if full match then record shift and move pattern
        else shift by max(1, j - last[text[shift+j]])
    end while
end procedure`
    },
    
    triesearch: {
        name: 'Trie Search',
        description: 'Trie (Prefix Tree) search efficiently finds words and prefixes in a dictionary with character-by-character traversal.',
        complexity: { best: 'O(m)', average: 'O(m)', worst: 'O(m)', space: 'O(ALPHABET_SIZE * N * M)' },
        steps: ['Traverse from root', 'Follow character edges', 'Check end-of-word marker', 'Return found/not found'],
        useCases: ['Autocomplete', 'Dictionary', 'IP routing', 'Spell checker'],
        characteristics: [
            '<strong>Search time:</strong> O(m) where m is word length',
            '<strong>Prefix queries:</strong> Very efficient',
            '<strong>Space trade-off:</strong> High memory usage'
        ],
        code: `function trieSearch(trie, word) {
    let node = trie.root;
    
    for (const char of word) {
        if (!node.children[char]) {
            return false;
        }
        node = node.children[char];
    }
    
    return node.isEndOfWord;
}`
    },
    
    // === Computational Geometry ===
    
    convexhull: {
        name: 'Convex Hull (Graham Scan)',
        description: 'Graham Scan finds the smallest convex polygon containing all points by sorting by polar angle and using a stack.',
        complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        steps: ['Find bottom-most point', 'Sort by polar angle', 'Use stack to maintain hull', 'Check for left turns'],
        useCases: ['Computer graphics', 'Pattern recognition', 'Geographic information systems', 'Collision detection'],
        characteristics: [
            '<strong>Output:</strong> Convex polygon',
            '<strong>Optimal:</strong> O(n log n) is optimal',
            '<strong>Robust:</strong> Handles collinear points'
        ],
        code: `function convexHull(points) {
    points.sort((a, b) => a.y - b.y || a.x - b.x);
    const pivot = points[0];
    
    points.slice(1).sort((a, b) => {
        const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
        const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
        return angleA - angleB;
    });
    
    const hull = [points[0], points[1]];
    
    for (let i = 2; i < points.length; i++) {
        while (hull.length > 1 && 
               ccw(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
            hull.pop();
        }
        hull.push(points[i]);
    }
    
    return hull;
}`
    },
    
    lineintersect: {
        name: 'Line Intersection',
        description: 'Line Intersection detects if and where two line segments intersect using parametric equations.',
        complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
        steps: ['Calculate line parameters', 'Solve intersection equations', 'Check if point is on both segments', 'Return intersection point'],
        useCases: ['CAD systems', 'Computer graphics', 'Map overlay', 'Collision detection'],
        characteristics: [
            '<strong>Geometry:</strong> Parametric line representation',
            '<strong>Edge cases:</strong> Parallel, collinear lines',
            '<strong>Precision:</strong> Floating-point considerations'
        ],
        code: `function lineIntersection(line1, line2) {
    const {x1, y1, x2, y2} = line1;
    const {x3, y3, x4, y4} = line2;
    
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    if (Math.abs(denom) < 1e-10) return null;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    
    return null;
}`
    },

    closestpair: {
        name: 'Closest Pair of Points',
        description: 'Closest Pair finds two points with minimum Euclidean distance (visualized with brute-force scanning).',
        complexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
        steps: ['Generate or load points', 'Check every pair distance', 'Track minimum pair', 'Return closest pair and distance'],
        useCases: ['Clustering initialization', 'Spatial analytics', 'Collision pre-checks'],
        characteristics: [
            '<strong>Metric:</strong> Euclidean distance',
            '<strong>Exact brute force:</strong> O(n^2)',
            '<strong>Optimized divide-conquer:</strong> O(n log n)'
        ],
        code: `function closestPairBrute(points) {
    let best = { i: -1, j: -1, dist: Infinity };
    
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < best.dist) {
                best = { i, j, dist };
            }
        }
    }
    
    return best;
}`,
        pseudocode: `procedure closestPair(points)
    best = Infinity
    for i = 0 to n-1 do
        for j = i+1 to n-1 do
            d = distance(points[i], points[j])
            if d < best then update best pair
        end for
    end for
    return best pair
end procedure`
    },
    
    // === NP-Hard Problems ===
    
    tsp: {
        name: 'Traveling Salesman (Heuristic)',
        description: 'TSP finds the shortest route visiting all cities exactly once using Nearest Neighbor heuristic approximation.',
        complexity: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(n)' },
        steps: ['Start at any city', 'Visit nearest unvisited city', 'Mark as visited', 'Return to start'],
        useCases: ['Route optimization', 'Circuit board drilling', 'Logistics', 'DNA sequencing'],
        characteristics: [
            '<strong>Problem:</strong> NP-Hard',
            '<strong>Heuristic:</strong> Nearest Neighbor (greedy)',
            '<strong>Approximation:</strong> Not optimal but fast',
            '<strong>Exact:</strong> O(n!) brute force'
        ],
        code: `function tspNearestNeighbor(cities) {
    const visited = new Set([0]);
    const tour = [0];
    let totalDistance = 0;
    
    while (tour.length < cities.length) {
        const current = tour[tour.length - 1];
        let nearest = -1;
        let minDist = Infinity;
        
        for (let i = 0; i < cities.length; i++) {
            if (!visited.has(i)) {
                const dist = distance(cities[current], cities[i]);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            }
        }
        
        visited.add(nearest);
        tour.push(nearest);
        totalDistance += minDist;
    }
    
    totalDistance += distance(cities[tour[tour.length - 1]], cities[tour[0]]);
    return { tour, totalDistance };
}`
    },
    
    graphcolor: {
        name: 'Graph Coloring',
        description: 'Graph Coloring assigns colors to vertices so no adjacent vertices share the same color, using greedy heuristic.',
        complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
        steps: ['Pick a vertex', 'Check adjacent colors', 'Assign lowest available color', 'Repeat for all vertices'],
        useCases: ['Register allocation', 'Scheduling', 'Map coloring', 'Frequency assignment'],
        characteristics: [
            '<strong>Problem:</strong> NP-Complete (optimal)',
            '<strong>Heuristic:</strong> Greedy coloring',
            '<strong>Chromatic number:</strong> Minimum colors needed',
            '<strong>Four color theorem:</strong> Planar graphs need <=4'
        ],
        code: `function graphColoring(graph) {
    const colors = new Array(graph.nodes.length).fill(-1);
    colors[0] = 0;
    
    for (let i = 1; i < graph.nodes.length; i++) {
        const available = new Set(
            Array(graph.nodes.length).keys()
        );
        
        for (const edge of graph.edges) {
            if (edge.from === i && colors[edge.to] !== -1) {
                available.delete(colors[edge.to]);
            }
        }
        
        colors[i] = Math.min(...available);
    }
    
    return colors;
}`
    },

    subsetsum: {
        name: 'Subset Sum (DP)',
        description: 'Subset Sum determines whether any subset of numbers can exactly reach a target sum using dynamic programming.',
        complexity: { best: 'O(n*sum)', average: 'O(n*sum)', worst: 'O(n*sum)', space: 'O(n*sum)' },
        steps: ['Initialize dp[i][0] = true', 'Decide include/exclude for each number', 'Fill boolean DP table', 'Read dp[n][target]'],
        useCases: ['Partition problems', 'Resource feasibility checks', 'NP-complete problem intuition'],
        characteristics: [
            '<strong>Problem class:</strong> NP-Complete (decision)',
            '<strong>DP form:</strong> Pseudo-polynomial',
            '<strong>Transition:</strong> dp[i][s] = dp[i-1][s] || dp[i-1][s-a[i]]'
        ],
        code: `function subsetSum(nums, target) {
    const n = nums.length;
    const dp = Array(n + 1).fill(null).map(() => Array(target + 1).fill(false));
    
    for (let i = 0; i <= n; i++) dp[i][0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let sum = 1; sum <= target; sum++) {
            dp[i][sum] = dp[i - 1][sum];
            if (sum >= nums[i - 1]) {
                dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
            }
        }
    }
    
    return dp[n][target];
}`
    },
    
    nqueens: {
        name: 'N-Queens Problem',
        description: 'N-Queens places N chess queens on an NxN board so no two queens attack each other using backtracking.',
        complexity: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)', space: 'O(N^2)' },
        steps: ['Place queen in column', 'Check if position safe', 'Recurse to next column', 'Backtrack if stuck'],
        useCases: ['Constraint satisfaction', 'Backtracking demonstration', 'Chess problems', 'Puzzle solving'],
        characteristics: [
            '<strong>Problem:</strong> Classic backtracking',
            '<strong>Constraints:</strong> No row, column, diagonal attacks',
            '<strong>Solutions:</strong> Multiple valid solutions',
            '<strong>Optimization:</strong> Branch and bound possible'
        ],
        code: `function solveNQueens(n) {
    const board = Array(n).fill(null).map(() => Array(n).fill(0));
    const solution = [];
    
    function solve(col) {
        if (col >= n) return true;
        
        for (let row = 0; row < n; row++) {
            if (isSafe(board, row, col, n)) {
                board[row][col] = 1;
                solution.push({row, col});
                
                if (solve(col + 1)) return true;
                
                board[row][col] = 0;
                solution.pop();
            }
        }
        
        return false;
    }
    
    solve(0);
    return solution;
}`
    }
};

// === Initialization ===
function init() {
    if (!validateCriticalElements()) {
        return;
    }

    initializePreferences();
    syncPreferenceControls();
    applyCategoryAccent(state.category);

    syncActiveAlgorithmButton();
    if (elements.categorySelector) {
        elements.categorySelector.value = state.category;
    }
    switchPanelTab(state.activeTab, false);

    if (isMobileViewport()) {
        elements.sidebar.classList.add('collapsed');
        elements.rightPanel.classList.add('collapsed');
    }

    setCopyButtonState('default');
    state.canvas = elements.canvas;
    state.ctx = state.canvas.getContext('2d');

    syncNavbarHeight();
    resizeCanvas();
    setupEventListeners();
    setupAudioUnlock();
    updateDrawerLayout();
    updateVisibleAlgorithmList(true);
    showVisualizationContainer();
    prepareDataForCurrentAlgorithm(true);
    updateAlgorithmInfo();
    updateAnalytics();
    loadQuiz();
    setSelfTestStatus('Idle. Run tests to verify algorithm integrity.', 'idle');
    updateSelfTestSummary(0, 0, 0);
    setComparisonStatus('Ready. Choose algorithms and run benchmark.', 'idle');
    setComparisonProgress(0);

    window.addEventListener('resize', () => {
        syncNavbarHeight();
        resizeCanvas();
        updateDrawerLayout();
    });

    if (window.ResizeObserver) {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const navbarObserver = new ResizeObserver(() => {
                syncNavbarHeight();
                resizeCanvas();
                updateDrawerLayout();
            });
            navbarObserver.observe(navbar);
        }
    }
}

// === Canvas Management ===
function resizeCanvas() {
    const container = elements.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const styles = getComputedStyle(container);
    const horizontalPadding =
        parseFloat(styles.paddingLeft || '0') + parseFloat(styles.paddingRight || '0');
    const verticalPadding =
        parseFloat(styles.paddingTop || '0') + parseFloat(styles.paddingBottom || '0');

    state.canvas.width = Math.max(220, Math.floor(rect.width - horizontalPadding));
    state.canvas.height = Math.max(180, Math.floor(rect.height - verticalPadding));
    
    const mode = getVisualizationMode();
    if (mode === 'canvas') {
        if (state.category === 'sorting' || state.category === 'searching') {
            drawArray();
        } else {
            state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        }
    } else if (mode === 'graph') {
        drawGraph();
    } else if (mode === 'tree') {
        drawTree();
    }
}

// === Array Generation ===
function clampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return min;
    return Math.min(max, Math.max(min, numeric));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateArrayValues(size, profile = state.dataProfile) {
    const n = clampNumber(parseInt(size, 10) || 50, 2, 400);
    const normalizedProfile = DATA_PROFILES.has(profile) ? profile : 'random';

    if (normalizedProfile === 'few-unique') {
        const pool = [8, 16, 24, 32, 40, 48, 56, 64];
        return Array.from({ length: n }, () => pool[randomInt(0, pool.length - 1)]);
    }

    if (normalizedProfile === 'reversed') {
        return Array.from({ length: n }, () => randomInt(1, 240)).sort((a, b) => b - a);
    }

    if (normalizedProfile === 'nearly') {
        const values = Array.from({ length: n }, () => randomInt(1, 240)).sort((a, b) => a - b);
        const swapCount = Math.max(1, Math.floor(n * 0.08));
        for (let i = 0; i < swapCount; i++) {
            const a = randomInt(0, n - 2);
            const b = Math.min(n - 1, a + randomInt(1, Math.max(1, Math.floor(n * 0.05))));
            [values[a], values[b]] = [values[b], values[a]];
        }
        return values;
    }

    if (normalizedProfile === 'wave') {
        const values = Array.from({ length: n }, (_, idx) => {
            const base = randomInt(12, 180);
            const waveBoost = Math.sin((idx / Math.max(1, n - 1)) * Math.PI * 6) * 42;
            return Math.max(1, Math.round(base + waveBoost));
        });
        return values;
    }

    return Array.from({ length: n }, () => randomInt(1, 240));
}

function generateArray() {
    const values = generateArrayValues(state.size, state.dataProfile);
    state.array = values.map(value => ({
        value,
        state: 'default'
    }));
    
    resetAnalytics();
    drawArray();
}

// === Graph Generation ===
function generateGraph() {
    const numNodes = Math.min(12, Math.max(5, Math.floor(state.size / 10)));
    state.graph = { nodes: [], edges: [] };
    state.firstNodeForEdge = null;
    state.selectedNode = null;
    state.graphToolMode = 'drag';
    elements.addEdgeBtn?.classList.remove('selected-tool');
    elements.removeNodeBtn?.classList.remove('selected-tool');
    
    const container = elements.graphContainer;
    const width = container.clientWidth || elements.canvas.parentElement.clientWidth || 900;
    const height = container.clientHeight || elements.canvas.parentElement.clientHeight || 520;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // Create nodes in circular layout
    for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        state.graph.nodes.push({
            id: i,
            x: x,
            y: y,
            state: 'default',
            distance: Infinity,
            visited: false,
            color: null
        });
    }
    
    const addEdge = (from, to, weight = Math.floor(Math.random() * 20) + 1) => {
        const exists = state.graph.edges.some(e =>
            (e.from === from && e.to === to) ||
            (!state.isDirected && e.from === to && e.to === from)
        );
        if (!exists) {
            state.graph.edges.push({
                from,
                to,
                weight,
                state: 'default'
            });
        }
    };

    // Build a connected backbone first to keep graph algorithms meaningful.
    for (let i = 0; i < numNodes - 1; i++) {
        addEdge(i, i + 1);
    }
    addEdge(numNodes - 1, 0);
    
    // Add random extra edges.
    const targetEdges = Math.floor(numNodes * 1.8);
    let guard = 0;
    while (state.graph.edges.length < targetEdges && guard < 500) {
        guard++;
        const from = Math.floor(Math.random() * numNodes);
        let to = Math.floor(Math.random() * numNodes);
        while (to === from) {
            to = Math.floor(Math.random() * numNodes);
        }
        addEdge(from, to);
    }
    
    resetAnalytics();
    drawGraph();
}

// === Tree Generation ===
function generateTree() {
    const numNodes = Math.min(15, Math.max(7, Math.floor(state.size / 10)));
    const values = Array.from({ length: numNodes }, (_, i) => i * 10 + 10);
    
    // Shuffle for interesting tree
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    
    state.treeRoot = null;
    
    values.forEach(val => {
        state.treeRoot = insertBST(state.treeRoot, val);
    });
    
    resetAnalytics();
    drawTree();
}

function buildFloydPreviewMatrix(maxNodes = 8) {
    const nodeCount = Math.max(4, Math.min(maxNodes, state.graph.nodes.length || 6));
    const dist = Array.from({ length: nodeCount }, () => new Array(nodeCount).fill(Infinity));

    for (let i = 0; i < nodeCount; i++) {
        dist[i][i] = 0;
    }

    if (state.graph.edges.length > 0) {
        state.graph.edges.forEach(edge => {
            if (edge.from >= nodeCount || edge.to >= nodeCount) return;
            const weight = Number.isFinite(edge.weight) ? edge.weight : 1;
            dist[edge.from][edge.to] = Math.min(dist[edge.from][edge.to], weight);
            if (!state.isDirected) {
                dist[edge.to][edge.from] = Math.min(dist[edge.to][edge.from], weight);
            }
        });
    } else {
        const sampleEdges = [
            [0, 1, 3],
            [0, 2, 8],
            [1, 2, 2],
            [1, 3, 5],
            [2, 3, 1]
        ];
        sampleEdges.forEach(([from, to, weight]) => {
            if (from >= nodeCount || to >= nodeCount) return;
            dist[from][to] = weight;
            dist[to][from] = weight;
        });
    }

    return dist;
}

function renderDPPreview() {
    switch (state.algorithm) {
        case 'fibonacci':
            drawDPTable([[0, 1, 1, 2, 3, 5, 8, 13]], ['Fibonacci Preview']);
            break;
        case 'knapsack':
            drawDPTable(
                [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 3, 3, 3, 3],
                    [0, 0, 3, 4, 4, 7],
                    [0, 0, 3, 4, 5, 7]
                ],
                ['Knapsack Preview']
            );
            break;
        case 'lcs':
            drawDPTable(
                [
                    [0, 0, 0, 0],
                    [0, 1, 1, 1],
                    [0, 1, 1, 2],
                    [0, 1, 2, 2]
                ],
                ['LCS Preview']
            );
            break;
        case 'editdist':
            drawDPTable(
                [
                    [0, 1, 2, 3],
                    [1, 0, 1, 2],
                    [2, 1, 1, 2],
                    [3, 2, 2, 1]
                ],
                ['Edit Distance Preview']
            );
            break;
        case 'matrixchain':
            drawDPTable(
                [
                    [0, 24000, 14000, 26000],
                    [0, 0, 6000, 12000],
                    [0, 0, 0, 9000],
                    [0, 0, 0, 0]
                ],
                ['Matrix Chain Preview']
            );
            break;
        case 'coinchange':
            drawDPTable([[0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2]], ['Coin Change Preview']);
            break;
        case 'lis':
            drawDPTable(
                [
                    [10, 22, 9, 33, 21, 50, 41, 60],
                    [1, 2, 1, 3, 2, 4, 4, 5]
                ],
                ['Values', 'LIS Lengths Preview']
            );
            break;
        case 'kadane':
            drawDPTable(
                [
                    [-2, 1, -3, 4, -1, 2, 1, -5, 4],
                    [-2, 1, -2, 4, 3, 5, 6, 1, 5],
                    [-2, 1, 1, 4, 4, 5, 6, 6, 6]
                ],
                ['Values', 'Current Max Ending Here', 'Best Max So Far']
            );
            break;
        case 'subsetsum':
            drawDPTable(
                [
                    [1, 0, 0, 0, 0, 0, 0],
                    [1, 0, 0, 1, 0, 0, 0],
                    [1, 0, 1, 1, 0, 1, 0],
                    [1, 0, 1, 1, 0, 1, 1]
                ],
                ['Subset Sum Preview']
            );
            break;
        case 'floyd':
            drawDPTable(buildFloydPreviewMatrix(), ['Floyd-Warshall Preview']);
            break;
        default:
            elements.dpTable.innerHTML = '';
            break;
    }
}

function renderTriePreview() {
    const root = { children: {}, isEnd: false, char: 'ROOT', state: 'default', x: 0, y: 0 };
    const previewWords = ['CAT', 'CAR', 'DOG'];

    previewWords.forEach(word => {
        let node = root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = {
                    children: {},
                    isEnd: false,
                    char,
                    state: 'default',
                    x: 0,
                    y: 0
                };
            }
            node = node.children[char];
        }
        node.isEnd = true;
        node.state = 'visited';
    });

    drawTrie(root);
}

function renderStringPreview() {
    if (state.algorithm === 'triesearch') {
        const root = {
            char: 'ROOT',
            state: 'default',
            isEnd: false,
            x: 0,
            y: 0,
            children: {
                C: {
                    char: 'C',
                    state: 'visited',
                    isEnd: false,
                    x: 0,
                    y: 0,
                    children: {
                        O: {
                            char: 'O',
                            state: 'visited',
                            isEnd: false,
                            x: 0,
                            y: 0,
                            children: {
                                D: {
                                    char: 'D',
                                    state: 'visited',
                                    isEnd: true,
                                    x: 0,
                                    y: 0,
                                    children: {}
                                }
                            }
                        }
                    }
                }
            }
        };
        drawTrie(root);
        return;
    }

    if (state.algorithm === 'zalgo') {
        drawStringMatchingState('AABCAABXAABCAABY', 'AAB', 0, 0, [0, 8], 4, 'Z Algorithm Preview');
        return;
    }

    let previewPattern = 'ABAB';
    let previewText = 'ABABDABACDABABCABAB';

    if (state.algorithm === 'rabinkarp') {
        previewPattern = 'ABCD';
        previewText = 'ABCCDDAEFGABCD';
    } else if (state.algorithm === 'boyermoore') {
        previewPattern = 'ABCAB';
        previewText = 'AABACAABCABAXABCAB';
    }

    drawStringMatchingState(previewText, previewPattern, 0, 0, [], 3, 'Pattern Matching Preview');
}

function renderGeometryPreview() {
    if (state.algorithm === 'lineintersect') {
        drawLines([
            { x1: 120, y1: 90, x2: 430, y2: 300, state: 'default' },
            { x1: 110, y1: 320, x2: 430, y2: 90, state: 'current' },
            { x1: 220, y1: 60, x2: 250, y2: 350, state: 'visited' }
        ], [{ x: 251, y: 180 }]);
        return;
    }

    if (state.algorithm === 'closestpair') {
        const points = [
            { x: 90, y: 120, state: 'default' },
            { x: 148, y: 168, state: 'default' },
            { x: 164, y: 178, state: 'sorted' },
            { x: 250, y: 102, state: 'default' },
            { x: 330, y: 220, state: 'default' },
            { x: 395, y: 146, state: 'current' },
            { x: 430, y: 256, state: 'default' },
            { x: 212, y: 286, state: 'default' }
        ];
        drawClosestPairState(points, [points[1], points[2]], [points[2], points[5]]);
        return;
    }

    const points = Array.from({ length: 10 }, () => ({
        x: Math.random() * (state.canvas.width - 120) + 60,
        y: Math.random() * (state.canvas.height - 120) + 60,
        state: 'default'
    }));
    const hull = [points[0], points[3], points[6], points[8]].filter(Boolean);
    hull.forEach(point => {
        point.state = 'sorted';
    });
    drawPoints(points, hull);
}

function renderAdvancedPreview() {
    if (state.algorithm === 'nqueens') {
        const n = 8;
        const board = Array.from({ length: n }, () => Array(n).fill(0));
        drawChessboard(board, []);
        return;
    }

    if (state.algorithm === 'tsp') {
        const cityCount = 8;
        const cities = Array.from({ length: cityCount }, (_, id) => ({
            id,
            x: Math.random() * (state.canvas.width - 140) + 70,
            y: Math.random() * (state.canvas.height - 140) + 70,
            state: 'default'
        }));
        cities[0].state = 'current';
        drawTSP(cities, []);
    }
}

function prepareDataForCurrentAlgorithm(forceGenerate = false) {
    if (isGraphAlgorithm()) {
        if (forceGenerate || state.graph.nodes.length === 0) {
            generateGraph();
        } else {
            clearVisualizationStates();
            drawGraph();
        }

        if (state.algorithm === 'floyd') {
            renderDPPreview();
        }
        return;
    }

    if (isTreeAlgorithm()) {
        if (forceGenerate || !state.treeRoot) {
            generateTree();
        } else {
            drawTree();
            resetAnalytics();
        }
        return;
    }

    if (isDPTableAlgorithm()) {
        renderDPPreview();
        resetAnalytics();
        return;
    }

    if (state.category === 'sorting' || state.category === 'searching') {
        if (forceGenerate || state.array.length === 0) {
            generateArray();
        } else {
            clearVisualizationStates();
            drawArray();
            resetAnalytics();
        }
        return;
    }

    if (state.algorithm === 'trie') {
        renderTriePreview();
        resetAnalytics();
        return;
    }

    if (state.category === 'strings') {
        renderStringPreview();
        resetAnalytics();
        return;
    }

    if (state.category === 'geometry') {
        renderGeometryPreview();
        resetAnalytics();
        return;
    }

    if (state.category === 'advanced') {
        renderAdvancedPreview();
        resetAnalytics();
        return;
    }

    resetAnalytics();
}

function redrawCurrentVisualization() {
    const mode = getVisualizationMode();

    if (mode === 'graph') {
        drawGraph();
        return;
    }

    if (mode === 'tree') {
        drawTree();
        return;
    }

    if (mode === 'dp') {
        if (!state.isRunning) {
            renderDPPreview();
        }
        return;
    }

    if (state.category === 'sorting' || state.category === 'searching') {
        drawArray();
        return;
    }

    if (state.algorithm === 'trie') {
        renderTriePreview();
        return;
    }

    if (state.category === 'strings') {
        renderStringPreview();
        return;
    }

    if (state.category === 'geometry') {
        renderGeometryPreview();
        return;
    }

    if (state.category === 'advanced') {
        renderAdvancedPreview();
    }
}

function insertBST(node, value) {
    if (node === null) {
        return {
            value: value,
            left: null,
            right: null,
            state: 'default',
            x: 0,
            y: 0
        };
    }
    
    if (value < node.value) {
        node.left = insertBST(node.left, value);
    } else {
        node.right = insertBST(node.right, value);
    }
    
    return node;
}

// === Array Visualization ===
function drawArray() {
    if (state.isBenchmark) return;

    const ctx = state.ctx;
    const canvas = state.canvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!state.array.length) return;
    
    const barWidth = canvas.width / state.array.length;
    const maxValue = Math.max(...state.array.map(item => item.value));
    const heightScale = canvas.height / maxValue;
    
    state.array.forEach((item, index) => {
        const barHeight = item.value * heightScale * 0.9;
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        // Draw bar
        ctx.fillStyle = getBarColor(item.state);
        
        if (state.highQuality) {
            const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
            gradient.addColorStop(0, getBarColor(item.state));
            gradient.addColorStop(1, adjustColor(getBarColor(item.state), -20));
            ctx.fillStyle = gradient;
        }
        
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        
        // Draw value (for smaller arrays)
        if (state.array.length <= 50 && canvas.width > 600) {
            ctx.fillStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-secondary').trim();
            ctx.font = '10px var(--font-mono)';
            ctx.textAlign = 'center';
            ctx.fillText(item.value, x + barWidth / 2, canvas.height - 5);
        }
    });
}

function getBarColor(state) {
    const colors = {
        default: getCssVar('--viz-default'),
        compare: getCssVar('--viz-compare'),
        swap: getCssVar('--viz-swap'),
        sorted: getCssVar('--viz-sorted'),
        current: getCssVar('--viz-current'),
        pivot: getCssVar('--viz-pivot')
    };
    
    return colors[state] || colors.default;
}

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// === Graph Visualization ===
function drawGraph() {
    const container = elements.graphContainer;
    container.innerHTML = '';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    container.appendChild(svg);

    const edgePalette = {
        default: getCssVar('--border-color', 'rgba(148, 163, 184, 0.35)'),
        active: getCssVar('--primary', '#3b82f6'),
        mst: getCssVar('--success', '#22c55e'),
        rejected: getCssVar('--danger', '#ef4444')
    };
    
    // Draw edges first
    state.graph.edges.forEach(edge => {
        const fromNode = state.graph.nodes[edge.from];
        const toNode = state.graph.nodes[edge.to];
        if (!fromNode || !toNode) return;

        const stroke = edgePalette[edge.state] || edgePalette.default;
        const edgeWidth = edge.state === 'mst' ? 4 : edge.state === 'active' ? 3 : 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', edgeWidth.toString());
        if (edge.state === 'rejected') {
            line.setAttribute('stroke-dasharray', '6 4');
        }
        svg.appendChild(line);
        
        // Draw weight if weighted
        if (state.isWeighted) {
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const labelColor = getCssVar('--text-primary', '#e5e7eb');
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('fill', labelColor);
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', '700');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edge.weight;
            svg.appendChild(text);
        }
        
        // Draw arrow for directed graphs
        if (state.isDirected) {
            const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
            const arrowSize = 10;
            const arrowX = toNode.x - 30 * Math.cos(angle);
            const arrowY = toNode.y - 30 * Math.sin(angle);
            
            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const p1x = arrowX;
            const p1y = arrowY;
            const p2x = arrowX - arrowSize * Math.cos(angle - Math.PI / 6);
            const p2y = arrowY - arrowSize * Math.sin(angle - Math.PI / 6);
            const p3x = arrowX - arrowSize * Math.cos(angle + Math.PI / 6);
            const p3y = arrowY - arrowSize * Math.sin(angle + Math.PI / 6);
            
            arrow.setAttribute('points', `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`);
            arrow.setAttribute('fill', stroke);
            svg.appendChild(arrow);
        }
    });
    
    // Draw nodes
    state.graph.nodes.forEach((node, index) => {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'graph-node';
        nodeDiv.style.left = `${node.x - 25}px`;
        nodeDiv.style.top = `${node.y - 25}px`;
        nodeDiv.textContent = node.id;
        nodeDiv.style.cursor = state.graphToolMode === 'drag' ? 'move' : 'pointer';

        if (node.color) {
            nodeDiv.style.background = node.color;
        }
        
        if (node.state === 'visiting') {
            nodeDiv.classList.add('visiting');
        } else if (node.state === 'visited') {
            nodeDiv.classList.add('visited');
        } else if (node.state === 'current' || state.firstNodeForEdge === index) {
            nodeDiv.classList.add('current');
        }
        
        // Add distance label for path algorithms
        if (Number.isFinite(node.distance)) {
            const distLabel = document.createElement('div');
            distLabel.style.position = 'absolute';
            distLabel.style.top = '-20px';
            distLabel.style.fontSize = '10px';
            distLabel.style.color = getCssVar('--success', '#22c55e');
            distLabel.style.fontWeight = '700';
            distLabel.textContent = node.distance;
            nodeDiv.appendChild(distLabel);
        }
        
        nodeDiv.addEventListener('pointerdown', (e) => handleNodeMouseDown(e, index));
        
        container.appendChild(nodeDiv);
    });
}

function setGraphToolMode(mode) {
    state.graphToolMode = mode;
    state.firstNodeForEdge = null;

    const activeClass = 'selected-tool';
    elements.addEdgeBtn?.classList.remove(activeClass);
    elements.removeNodeBtn?.classList.remove(activeClass);

    if (mode === 'add-edge') {
        elements.addEdgeBtn?.classList.add(activeClass);
        updateStep('Add Edge mode: tap two nodes to connect');
    } else if (mode === 'remove-node') {
        elements.removeNodeBtn?.classList.add(activeClass);
        updateStep('Remove Node mode: tap a node to delete');
    } else {
        updateStep('Drag mode: move nodes to reposition graph');
    }

    drawGraph();
}

function removeGraphNode(nodeIndex) {
    state.graph.nodes.splice(nodeIndex, 1);
    state.graph.edges = state.graph.edges
        .filter(edge => edge.from !== nodeIndex && edge.to !== nodeIndex)
        .map(edge => ({
            ...edge,
            from: edge.from > nodeIndex ? edge.from - 1 : edge.from,
            to: edge.to > nodeIndex ? edge.to - 1 : edge.to
        }));

    state.graph.nodes.forEach((node, idx) => {
        node.id = idx;
    });
}

function addGraphEdge(from, to) {
    const exists = state.graph.edges.some(edge =>
        (edge.from === from && edge.to === to) ||
        (!state.isDirected && edge.from === to && edge.to === from)
    );
    if (exists) return false;

    state.graph.edges.push({
        from,
        to,
        weight: Math.floor(Math.random() * 20) + 1,
        state: 'default'
    });
    return true;
}

function handleNodeMouseDown(e, nodeIndex) {
    if (state.isRunning) return;
    e.preventDefault();

    if (state.graphToolMode === 'remove-node') {
        removeGraphNode(nodeIndex);
        resetAnalytics();
        updateStep(`Removed node ${nodeIndex}`);
        drawGraph();
        return;
    }

    if (state.graphToolMode === 'add-edge') {
        if (state.firstNodeForEdge === null) {
            state.firstNodeForEdge = nodeIndex;
            updateStep(`Select destination node for edge from ${nodeIndex}`);
        } else {
            if (state.firstNodeForEdge === nodeIndex) {
                state.firstNodeForEdge = null;
                updateStep('Edge creation canceled');
            } else {
                const added = addGraphEdge(state.firstNodeForEdge, nodeIndex);
                if (added) {
                    updateStep(`Added edge ${state.firstNodeForEdge} -> ${nodeIndex}`);
                } else {
                    updateStep('Edge already exists');
                }
                state.firstNodeForEdge = null;
            }
        }
        drawGraph();
        return;
    }

    state.selectedNode = nodeIndex;
    const node = state.graph.nodes[nodeIndex];
    const shiftX = e.clientX - node.x;
    const shiftY = e.clientY - node.y;
    const pointerId = e.pointerId;

    function moveAt(pageX, pageY) {
        const container = elements.graphContainer;
        const rect = container.getBoundingClientRect();

        node.x = Math.max(25, Math.min(rect.width - 25, pageX - rect.left - shiftX));
        node.y = Math.max(25, Math.min(rect.height - 25, pageY - rect.top - shiftY));
        clearVisualizationStates();
        state.firstNodeForEdge = null;
        state.selectedNode = nodeIndex;
        node.state = 'current';
        updateStep(`Repositioning node ${nodeIndex}`);
        drawGraph();
    }
    
    function onPointerMove(ev) {
        if (ev.pointerId !== pointerId) return;
        moveAt(ev.clientX, ev.clientY);
    }
    
    document.addEventListener('pointermove', onPointerMove);
    
    document.addEventListener('pointerup', function onPointerUp(ev) {
        if (ev.pointerId !== pointerId) return;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        node.state = 'default';
        clearVisualizationStates();
        drawGraph();
        state.selectedNode = null;
    }, { once: true });
}

// === Tree Visualization ===
function drawTree() {
    const container = elements.treeContainer;
    container.innerHTML = '';
    
    if (!state.treeRoot) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    container.appendChild(svg);
    
    // Calculate positions
    calculateTreePositions(state.treeRoot, width / 2, 50, width / 4);
    
    // Draw edges
    drawTreeEdges(svg, state.treeRoot);
    
    // Draw nodes
    drawTreeNodes(container, state.treeRoot);
}

function calculateTreePositions(node, x, y, offset) {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
        calculateTreePositions(node.left, x - offset, y + 80, offset / 2);
    }
    if (node.right) {
        calculateTreePositions(node.right, x + offset, y + 80, offset / 2);
    }
}

function drawTreeEdges(svg, node) {
    if (!node) return;
    const edgeColor = getCssVar('--border-color', 'rgba(148,163,184,0.3)');
    const activeEdgeColor = getCssVar('--primary', '#3b82f6');
    
    if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        line.setAttribute('stroke', node.left.state === 'active' ? activeEdgeColor : edgeColor);
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        
        drawTreeEdges(svg, node.left);
    }
    
    if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        line.setAttribute('stroke', node.right.state === 'active' ? activeEdgeColor : edgeColor);
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
        
        drawTreeEdges(svg, node.right);
    }
}

function drawTreeNodes(container, node) {
    if (!node) return;
    
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'tree-node';
    nodeDiv.style.left = `${node.x - 22.5}px`;
    nodeDiv.style.top = `${node.y - 22.5}px`;
    nodeDiv.textContent = node.value;
    
    if (node.state === 'current') {
        nodeDiv.classList.add('current');
    } else if (node.state === 'visited') {
        nodeDiv.classList.add('visited');
    }
    
    container.appendChild(nodeDiv);
    
    drawTreeNodes(container, node.left);
    drawTreeNodes(container, node.right);
}

// === Delay Function for Animation ===
async function delay() {
    if (state.isBenchmark) {
        return Promise.resolve();
    }

    if (state.shouldStop) {
        throw new Error('Stopped');
    }
    
    while (state.isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (state.shouldStop) throw new Error('Stopped');
    }
    
    if (state.isStepping) {
        state.isPaused = true;
        state.isStepping = false;
    }
    
    const speed = parseInt(state.speed);
    const delayTime = Math.max(1, 101 - speed) * 5;
    
    return new Promise(resolve => setTimeout(resolve, delayTime));
}

// === Sorting Algorithms ===
async function bubbleSort() {
    const arr = state.array;
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            arr[j].state = 'compare';
            arr[j + 1].state = 'compare';
            
            updateStep(`Comparing ${arr[j].value} and ${arr[j + 1].value}`);
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();
            
            if (arr[j].value > arr[j + 1].value) {
                arr[j].state = 'swap';
                arr[j + 1].state = 'swap';
                drawArray();
                await delay();
                
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                state.swaps++;
                swapped = true;
                
                playSound(arr[j].value);
            }
            
            arr[j].state = 'default';
            arr[j + 1].state = 'default';
        }
        
        arr[n - i - 1].state = 'sorted';
        
        if (!swapped) {
            for (let k = 0; k < n - i - 1; k++) {
                arr[k].state = 'sorted';
            }
            break;
        }
    }
    
    arr[0].state = 'sorted';
    drawArray();
    updateStep('Sorting complete!');
}

async function selectionSort() {
    const arr = state.array;
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        arr[i].state = 'current';
        
        for (let j = i + 1; j < n; j++) {
            arr[j].state = 'compare';
            
            updateStep(`Finding minimum in unsorted portion`);
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();
            
            if (arr[j].value < arr[minIdx].value) {
                if (minIdx !== i) arr[minIdx].state = 'default';
                minIdx = j;
                arr[minIdx].state = 'pivot';
            } else {
                arr[j].state = 'default';
            }
        }
        
        if (minIdx !== i) {
            arr[i].state = 'swap';
            arr[minIdx].state = 'swap';
            drawArray();
            await delay();
            
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            state.swaps++;
            playSound(arr[i].value);
        }
        
        arr[i].state = 'sorted';
        if (minIdx !== i) arr[minIdx].state = 'default';
        
        state.operations++;
        updateAnalytics();
    }
    
    arr[n - 1].state = 'sorted';
    drawArray();
    updateStep('Sorting complete!');
}

async function insertionSort() {
    const arr = state.array;
    const n = arr.length;
    
    arr[0].state = 'sorted';
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        key.state = 'current';
        let j = i - 1;
        
        updateStep(`Inserting ${key.value} into sorted portion`);
        drawArray();
        await delay();
        
        while (j >= 0 && arr[j].value > key.value) {
            arr[j].state = 'compare';
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();
            
            arr[j + 1] = arr[j];
            arr[j].state = 'sorted';
            j--;
            state.swaps++;
        }
        
        if (j >= 0) {
            arr[j].state = 'compare';
            state.comparisons++;
            drawArray();
            await delay();
            arr[j].state = 'sorted';
        }
        
        arr[j + 1] = key;
        arr[j + 1].state = 'sorted';
        
        playSound(key.value);
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();
    }
    
    updateStep('Sorting complete!');
}

async function mergeSort(start = 0, end = state.array.length - 1) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    
    updateStep(`Dividing array: [${start}...${mid}] and [${mid + 1}...${end}]`);
    for (let i = start; i <= end; i++) {
        if (state.array[i].state !== 'sorted') {
            state.array[i].state = i <= mid ? 'compare' : 'pivot';
        }
    }
    drawArray();
    await delay();
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const left = [];
    const right = [];
    
    for (let i = start; i <= mid; i++) {
        left.push({ ...state.array[i] });
    }
    for (let i = mid + 1; i <= end; i++) {
        right.push({ ...state.array[i] });
    }
    
    let i = 0, j = 0, k = start;
    
    updateStep(`Merging subarrays [${start}...${mid}] and [${mid + 1}...${end}]`);
    
    while (i < left.length && j < right.length) {
        state.comparisons++;
        
        if (left[i].value <= right[j].value) {
            state.array[k] = { ...left[i], state: 'current' };
            i++;
        } else {
            state.array[k] = { ...right[j], state: 'current' };
            j++;
        }
        
        playSound(state.array[k].value);
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();
        
        state.array[k].state = 'sorted';
        k++;
    }
    
    while (i < left.length) {
        state.array[k] = { ...left[i], state: 'sorted' };
        i++;
        k++;
        state.operations++;
        drawArray();
        await delay();
    }
    
    while (j < right.length) {
        state.array[k] = { ...right[j], state: 'sorted' };
        j++;
        k++;
        state.operations++;
        drawArray();
        await delay();
    }
    
    updateAnalytics();
}

async function quickSort(low = 0, high = state.array.length - 1) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    } else if (low === high) {
        state.array[low].state = 'sorted';
        drawArray();
    }
}

async function partition(low, high) {
    const pivot = state.array[high];
    pivot.state = 'pivot';
    
    updateStep(`Pivot: ${pivot.value}, partitioning...`);
    drawArray();
    await delay();
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        state.array[j].state = 'compare';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (state.array[j].value < pivot.value) {
            i++;
            
            if (i !== j) {
                state.array[i].state = 'swap';
                state.array[j].state = 'swap';
                drawArray();
                await delay();
                
                [state.array[i], state.array[j]] = [state.array[j], state.array[i]];
                state.swaps++;
                playSound(state.array[i].value);
            }
            
            if (i < high) state.array[i].state = 'default';
        }
        
        if (j < high) state.array[j].state = 'default';
        state.operations++;
        updateAnalytics();
    }
    
    i++;
    state.array[i].state = 'swap';
    state.array[high].state = 'swap';
    drawArray();
    await delay();
    
    [state.array[i], state.array[high]] = [state.array[high], state.array[i]];
    state.swaps++;
    playSound(state.array[i].value);
    
    state.array[i].state = 'sorted';
    drawArray();
    
    return i;
}

async function heapSort() {
    const n = state.array.length;
    
    updateStep('Building max heap...');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        state.array[0].state = 'swap';
        state.array[i].state = 'swap';
        
        updateStep(`Swapping root with last element`);
        drawArray();
        await delay();
        
        [state.array[0], state.array[i]] = [state.array[i], state.array[0]];
        state.swaps++;
        playSound(state.array[i].value);
        
        state.array[i].state = 'sorted';
        state.array[0].state = 'default';
        
        await heapify(i, 0);
        
        state.operations++;
        updateAnalytics();
    }
    
    state.array[0].state = 'sorted';
    drawArray();
    updateStep('Sorting complete!');
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (i < state.array.length) state.array[i].state = 'current';
    if (left < n && left < state.array.length) state.array[left].state = 'compare';
    if (right < n && right < state.array.length) state.array[right].state = 'compare';
    
    drawArray();
    await delay();
    
    if (left < n) {
        state.comparisons++;
        if (state.array[left].value > state.array[largest].value) {
            largest = left;
        }
    }
    
    if (right < n) {
        state.comparisons++;
        if (state.array[right].value > state.array[largest].value) {
            largest = right;
        }
    }
    
    if (largest !== i) {
        state.array[i].state = 'swap';
        state.array[largest].state = 'swap';
        drawArray();
        await delay();
        
        [state.array[i], state.array[largest]] = [state.array[largest], state.array[i]];
        state.swaps++;
        
        state.array[i].state = 'default';
        state.array[largest].state = 'default';
        
        await heapify(n, largest);
    } else {
        if (i < state.array.length) state.array[i].state = 'default';
        if (left < n && left < state.array.length) state.array[left].state = 'default';
        if (right < n && right < state.array.length) state.array[right].state = 'default';
    }
    
    updateAnalytics();
}

async function countingSort() {
    const arr = state.array;
    const max = Math.max(...arr.map(item => item.value));
    const count = new Array(max + 1).fill(0);
    const output = new Array(arr.length);
    
    updateStep('Counting occurrences...');
    for (let i = 0; i < arr.length; i++) {
        arr[i].state = 'compare';
        count[arr[i].value]++;
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();
        arr[i].state = 'default';
    }
    
    updateStep('Building cumulative count...');
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
        state.operations++;
        updateAnalytics();
        await delay();
    }
    
    updateStep('Placing elements in sorted order...');
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i].state = 'current';
        const value = arr[i].value;
        output[count[value] - 1] = { ...arr[i] };
        count[value]--;
        
        state.operations++;
        playSound(value);
        updateAnalytics();
        drawArray();
        await delay();
        arr[i].state = 'default';
    }
    
    for (let i = 0; i < arr.length; i++) {
        arr[i] = { ...output[i], state: 'sorted' };
        drawArray();
        await delay();
    }
    
    updateStep('Sorting complete!');
}

async function radixSort() {
    const arr = state.array;
    const max = Math.max(...arr.map(item => item.value));
    let exp = 1;
    
    while (Math.floor(max / exp) > 0) {
        updateStep(`Sorting by digit at position ${Math.log10(exp)}`);
        await countingSortByDigit(exp);
        exp *= 10;
    }
    
    for (let i = 0; i < arr.length; i++) {
        arr[i].state = 'sorted';
    }
    drawArray();
    updateStep('Sorting complete!');
}

async function countingSortByDigit(exp) {
    const arr = state.array;
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i].value / exp) % 10;
        count[digit]++;
        arr[i].state = 'compare';
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();
        arr[i].state = 'default';
    }
    
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i].value / exp) % 10;
        arr[i].state = 'current';
        output[count[digit] - 1] = { ...arr[i] };
        count[digit]--;
        
        playSound(arr[i].value);
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();
    }
    
    for (let i = 0; i < n; i++) {
        arr[i] = { ...output[i], state: 'default' };
        drawArray();
        await delay();
    }
}

async function shellSort() {
    const arr = state.array;
    const n = arr.length;
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        updateStep(`Gap: ${gap}`);
        
        for (let i = gap; i < n; i++) {
            const temp = { ...arr[i] };
            arr[i].state = 'current';
            let j = i;
            
            while (j >= gap && arr[j - gap].value > temp.value) {
                arr[j - gap].state = 'compare';
                arr[j].state = 'swap';
                
                state.comparisons++;
                updateAnalytics();
                drawArray();
                await delay();
                
                arr[j] = { ...arr[j - gap] };
                arr[j - gap].state = 'default';
                j -= gap;
                state.swaps++;
            }
            
            arr[j] = { ...temp, state: 'default' };
            playSound(temp.value);
            state.operations++;
            updateAnalytics();
            drawArray();
            await delay();
        }
        
        gap = Math.floor(gap / 2);
    }
    
    for (let i = 0; i < n; i++) {
        arr[i].state = 'sorted';
    }
    drawArray();
    updateStep('Sorting complete!');
}

async function timSort() {
    const arr = state.array;
    const n = arr.length;
    const minRun = Math.min(32, n);
    
    updateStep('Sorting individual runs with insertion sort...');
    for (let i = 0; i < n; i += minRun) {
        const end = Math.min(i + minRun - 1, n - 1);
        await insertionSortRange(i, end);
    }
    
    let size = minRun;
    while (size < n) {
        updateStep(`Merging runs of size ${size}...`);
        
        for (let start = 0; start < n; start += size * 2) {
            const mid = start + size - 1;
            const end = Math.min(start + size * 2 - 1, n - 1);
            
            if (mid < end) {
                await merge(start, mid, end);
            }
        }
        
        size *= 2;
    }
    
    for (let i = 0; i < n; i++) {
        arr[i].state = 'sorted';
    }
    drawArray();
    updateStep('Sorting complete!');
}

async function insertionSortRange(start, end) {
    const arr = state.array;
    
    for (let i = start + 1; i <= end; i++) {
        const temp = { ...arr[i] };
        let j = i - 1;
        
        while (j >= start && arr[j].value > temp.value) {
            arr[j + 1] = { ...arr[j] };
            j--;
            state.swaps++;
        }
        
        arr[j + 1] = { ...temp };
        state.operations++;
    }
}

async function cocktailSort() {
    const arr = state.array;
    const n = arr.length;
    if (!n) return;

    let start = 0;
    let end = n - 1;
    let swapped = true;

    while (swapped) {
        swapped = false;
        updateStep(`Cocktail forward pass: ${start} -> ${end}`);

        for (let i = start; i < end; i++) {
            arr[i].state = 'compare';
            arr[i + 1].state = 'compare';
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();

            if (arr[i].value > arr[i + 1].value) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                arr[i].state = 'swap';
                arr[i + 1].state = 'swap';
                state.swaps++;
                state.operations++;
                swapped = true;
                playSound(arr[i].value);
                updateStep(`Swapped ${arr[i + 1].value} and ${arr[i].value}`);
                updateAnalytics();
                drawArray();
                await delay();
            }

            arr[i].state = 'default';
            arr[i + 1].state = 'default';
        }

        if (!swapped) break;
        end--;

        swapped = false;
        updateStep(`Cocktail backward pass: ${end} -> ${start}`);

        for (let i = end; i > start; i--) {
            arr[i - 1].state = 'compare';
            arr[i].state = 'compare';
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();

            if (arr[i - 1].value > arr[i].value) {
                [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                arr[i - 1].state = 'swap';
                arr[i].state = 'swap';
                state.swaps++;
                state.operations++;
                swapped = true;
                playSound(arr[i - 1].value);
                updateStep(`Swapped ${arr[i].value} and ${arr[i - 1].value}`);
                updateAnalytics();
                drawArray();
                await delay();
            }

            arr[i - 1].state = 'default';
            arr[i].state = 'default';
        }

        start++;
    }

    arr.forEach(item => {
        item.state = 'sorted';
    });
    drawArray();
    updateStep('Cocktail Shaker Sort complete!');
}

async function bucketSort() {
    const arr = state.array;
    const n = arr.length;
    if (n <= 1) {
        if (n === 1) arr[0].state = 'sorted';
        drawArray();
        updateStep('Bucket Sort complete!');
        return;
    }

    const values = arr.map(item => item.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const bucketCount = Math.max(4, Math.min(12, Math.floor(Math.sqrt(n)) + 3));
    const buckets = Array.from({ length: bucketCount }, () => []);
    const range = Math.max(1, maxVal - minVal + 1);

    updateStep(`Bucket Sort: ${bucketCount} buckets over range [${minVal}, ${maxVal}]`);
    drawArray();
    await delay();

    for (let i = 0; i < n; i++) {
        arr[i].state = 'current';
        const normalized = (arr[i].value - minVal) / range;
        const bucketIndex = Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
        buckets[bucketIndex].push({ ...arr[i], state: 'default' });

        state.operations++;
        updateStep(`Placed ${arr[i].value} into bucket ${bucketIndex + 1}`);
        updateAnalytics();
        drawArray();
        await delay();
        arr[i].state = 'default';
    }

    for (let b = 0; b < bucketCount; b++) {
        const bucket = buckets[b];
        if (bucket.length === 0) continue;

        updateStep(`Sorting bucket ${b + 1}/${bucketCount} (${bucket.length} element${bucket.length > 1 ? 's' : ''})`);
        for (let i = 1; i < bucket.length; i++) {
            const key = { ...bucket[i] };
            let j = i - 1;

            while (j >= 0 && bucket[j].value > key.value) {
                state.comparisons++;
                bucket[j + 1] = bucket[j];
                j--;
                state.swaps++;
                state.operations++;
            }

            if (j >= 0) {
                state.comparisons++;
            }

            bucket[j + 1] = key;
            state.operations++;
            updateAnalytics();
        }
        await delay();
    }

    let writeIndex = 0;
    for (let b = 0; b < bucketCount; b++) {
        for (const item of buckets[b]) {
            arr[writeIndex] = { ...item, state: 'current' };
            state.operations++;
            state.swaps++;
            playSound(arr[writeIndex].value);
            updateStep(`Writing ${arr[writeIndex].value} at index ${writeIndex}`);
            updateAnalytics();
            drawArray();
            await delay();
            arr[writeIndex].state = 'sorted';
            writeIndex++;
        }
    }

    arr.forEach(item => {
        item.state = 'sorted';
    });
    drawArray();
    updateStep('Bucket Sort complete!');
}

// === Searching Algorithms ===
async function linearSearch() {
    const arr = state.array;
    if (!arr.length) return;
    
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    updateStep(`Searching for ${target}...`);
    
    for (let i = 0; i < arr.length; i++) {
        arr[i].state = 'compare';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (arr[i].value === target) {
            arr[i].state = 'sorted';
            playSound(arr[i].value);
            updateStep(`Found ${target} at index ${i}!`);
            drawArray();
            return;
        }
        
        arr[i].state = 'default';
    }
    
    updateStep(`${target} not found`);
}

async function binarySearch() {
    const arr = state.array.map(item => ({ ...item }));
    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();
    
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    updateStep(`Searching for ${target} in sorted array...`);
    
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        for (let i = left; i <= right; i++) {
            arr[i].state = 'compare';
        }
        arr[mid].state = 'current';
        
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (arr[mid].value === target) {
            arr[mid].state = 'sorted';
            playSound(arr[mid].value);
            updateStep(`Found ${target} at index ${mid}!`);
            drawArray();
            return;
        } else if (arr[mid].value < target) {
            for (let i = left; i <= mid; i++) {
                arr[i].state = 'default';
            }
            left = mid + 1;
            updateStep(`${target} > ${arr[mid].value}, searching right half`);
        } else {
            for (let i = mid; i <= right; i++) {
                arr[i].state = 'default';
            }
            right = mid - 1;
            updateStep(`${target} < ${arr[mid].value}, searching left half`);
        }
        
        drawArray();
        await delay();
    }
    
    updateStep(`${target} not found`);
}

async function jumpSearch() {
    const arr = state.array.map(item => ({ ...item }));
    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();
    
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    const n = arr.length;
    const jump = Math.floor(Math.sqrt(n));
    
    updateStep(`Searching for ${target} with jump size ${jump}...`);
    
    let prev = 0;
    let curr = 0;
    
    while (curr < n && arr[Math.min(curr, n - 1)].value < target) {
        prev = curr;
        curr += jump;
        
        const checkIdx = Math.min(curr, n - 1);
        arr[checkIdx].state = 'current';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        arr[checkIdx].state = 'default';
    }
    
    updateStep(`Linear search in block [${prev}, ${Math.min(curr, n - 1)}]`);
    
    for (let i = prev; i < Math.min(curr, n); i++) {
        arr[i].state = 'compare';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (arr[i].value === target) {
            arr[i].state = 'sorted';
            playSound(arr[i].value);
            updateStep(`Found ${target} at index ${i}!`);
            drawArray();
            return;
        }
        
        arr[i].state = 'default';
    }
    
    updateStep(`${target} not found`);
}

async function exponentialSearch() {
    const arr = state.array.map(item => ({ ...item }));
    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();
    
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    updateStep(`Searching for ${target}...`);
    
    if (arr[0].value === target) {
        arr[0].state = 'sorted';
        updateStep(`Found ${target} at index 0!`);
        drawArray();
        return;
    }
    
    let i = 1;
    while (i < arr.length && arr[i].value <= target) {
        arr[i].state = 'current';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        arr[i].state = 'default';
        i *= 2;
    }
    
    const left = Math.floor(i / 2);
    const right = Math.min(i, arr.length - 1);
    
    updateStep(`Binary search in range [${left}, ${right}]`);
    await binarySearchRange(left, right, target);
}

async function binarySearchRange(left, right, target) {
    const arr = state.array;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        arr[mid].state = 'current';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (arr[mid].value === target) {
            arr[mid].state = 'sorted';
            playSound(arr[mid].value);
            updateStep(`Found ${target} at index ${mid}!`);
            drawArray();
            return;
        } else if (arr[mid].value < target) {
            arr[mid].state = 'default';
            left = mid + 1;
        } else {
            arr[mid].state = 'default';
            right = mid - 1;
        }
    }
    
    updateStep(`${target} not found`);
}

async function interpolationSearch() {
    const arr = state.array.map(item => ({ ...item }));
    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();
    
    const target = arr[Math.floor(Math.random() * arr.length)].value;
    updateStep(`Searching for ${target} using interpolation...`);
    
    let low = 0;
    let high = arr.length - 1;
    
    while (low <= high && target >= arr[low].value && target <= arr[high].value) {
        if (low === high) {
            arr[low].state = 'current';
            state.comparisons++;
            updateAnalytics();
            drawArray();
            await delay();
            
            if (arr[low].value === target) {
                arr[low].state = 'sorted';
                playSound(arr[low].value);
                updateStep(`Found ${target} at index ${low}!`);
                drawArray();
            } else {
                updateStep(`${target} not found`);
            }
            return;
        }
        
        const pos = low + Math.floor(
            ((target - arr[low].value) * (high - low)) /
            (arr[high].value - arr[low].value)
        );
        
        const clampedPos = Math.max(low, Math.min(high, pos));
        
        arr[clampedPos].state = 'current';
        state.comparisons++;
        updateAnalytics();
        drawArray();
        await delay();
        
        if (arr[clampedPos].value === target) {
            arr[clampedPos].state = 'sorted';
            playSound(arr[clampedPos].value);
            updateStep(`Found ${target} at index ${clampedPos}!`);
            drawArray();
            return;
        }
        
        if (arr[clampedPos].value < target) {
            arr[clampedPos].state = 'default';
            low = clampedPos + 1;
        } else {
            arr[clampedPos].state = 'default';
            high = clampedPos - 1;
        }
    }
    
    updateStep(`${target} not found`);
}

async function ternarySearch() {
    const arr = state.array.map(item => ({ ...item }));
    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();

    const target = arr[Math.floor(Math.random() * arr.length)].value;
    updateStep(`Ternary search for ${target} in sorted array`);

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const third = Math.floor((right - left) / 3);
        const mid1 = left + third;
        const mid2 = right - third;

        for (let i = left; i <= right; i++) {
            if (arr[i].state !== 'sorted') arr[i].state = 'compare';
        }
        arr[mid1].state = 'current';
        arr[mid2].state = 'pivot';
        state.comparisons += 2;
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();

        if (arr[mid1].value === target) {
            arr[mid1].state = 'sorted';
            playSound(arr[mid1].value);
            updateStep(`Found ${target} at index ${mid1}`);
            drawArray();
            return;
        }

        if (arr[mid2].value === target) {
            arr[mid2].state = 'sorted';
            playSound(arr[mid2].value);
            updateStep(`Found ${target} at index ${mid2}`);
            drawArray();
            return;
        }

        if (target < arr[mid1].value) {
            for (let i = mid1; i <= right; i++) arr[i].state = 'default';
            right = mid1 - 1;
            updateStep(`${target} < ${arr[mid1].value}, search left third`);
        } else if (target > arr[mid2].value) {
            for (let i = left; i <= mid2; i++) arr[i].state = 'default';
            left = mid2 + 1;
            updateStep(`${target} > ${arr[mid2].value}, search right third`);
        } else {
            for (let i = left; i <= mid1; i++) arr[i].state = 'default';
            for (let i = mid2; i <= right; i++) arr[i].state = 'default';
            left = mid1 + 1;
            right = mid2 - 1;
            updateStep(`${target} is between mids, search middle third`);
        }

        drawArray();
        await delay();
    }

    updateStep(`${target} not found`);
}

async function fibonacciSearch() {
    const arr = state.array.map(item => ({ ...item }));
    if (!arr.length) {
        updateStep('Array is empty. Generate data first.');
        return;
    }

    arr.sort((a, b) => a.value - b.value);
    state.array = arr;
    drawArray();
    await delay();

    const target = arr[Math.floor(Math.random() * arr.length)].value;
    const n = arr.length;

    let fibMm2 = 0;
    let fibMm1 = 1;
    let fibM = fibMm1 + fibMm2;

    while (fibM < n) {
        fibMm2 = fibMm1;
        fibMm1 = fibM;
        fibM = fibMm1 + fibMm2;
    }

    let offset = -1;
    updateStep(`Fibonacci Search for ${target} (fib window ${fibM})`);

    while (fibM > 1) {
        const probe = Math.min(offset + fibMm2, n - 1);
        const left = Math.max(0, offset + 1);
        const right = Math.min(n - 1, offset + fibM);

        arr.forEach(item => {
            if (item.state !== 'sorted') item.state = 'default';
        });
        for (let i = left; i <= right; i++) {
            arr[i].state = 'compare';
        }
        arr[probe].state = 'current';

        state.comparisons++;
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();

        if (arr[probe].value < target) {
            for (let i = left; i <= probe; i++) {
                if (arr[i].state !== 'sorted') arr[i].state = 'default';
            }
            updateStep(`${target} > ${arr[probe].value}, move right`);
            fibM = fibMm1;
            fibMm1 = fibMm2;
            fibMm2 = fibM - fibMm1;
            offset = probe;
        } else if (arr[probe].value > target) {
            for (let i = probe; i <= right; i++) {
                if (arr[i].state !== 'sorted') arr[i].state = 'default';
            }
            updateStep(`${target} < ${arr[probe].value}, shrink left`);
            fibM = fibMm2;
            fibMm1 = fibMm1 - fibMm2;
            fibMm2 = fibM - fibMm1;
        } else {
            arr[probe].state = 'sorted';
            playSound(arr[probe].value);
            drawArray();
            updateStep(`Found ${target} at index ${probe}`);
            return;
        }

        updateAnalytics();
        drawArray();
        await delay();
    }

    const candidate = offset + 1;
    if (fibMm1 && candidate < n) {
        arr.forEach(item => {
            if (item.state !== 'sorted') item.state = 'default';
        });
        arr[candidate].state = 'current';
        state.comparisons++;
        state.operations++;
        updateAnalytics();
        drawArray();
        await delay();

        if (arr[candidate].value === target) {
            arr[candidate].state = 'sorted';
            playSound(arr[candidate].value);
            drawArray();
            updateStep(`Found ${target} at index ${candidate}`);
            return;
        }
    }

    updateStep(`${target} not found`);
}

// === Graph Algorithms ===
function resetGraphStates(clearColors = false) {
    state.graph.nodes.forEach(node => {
        node.state = 'default';
        node.distance = Infinity;
        node.visited = false;
        if (clearColors) node.color = null;
    });
    state.graph.edges.forEach(edge => {
        edge.state = 'default';
    });
}

function getIncidentEdges(nodeId) {
    if (state.isDirected) {
        return state.graph.edges.filter(edge => edge.from === nodeId);
    }
    return state.graph.edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
}

function getNeighborFromEdge(edge, nodeId) {
    if (edge.from === nodeId) return edge.to;
    return edge.from;
}

async function breadthFirstSearch() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }
    resetGraphStates();
    
    const startNode = 0;
    const queue = [startNode];
    const visited = new Set([startNode]);
    
    state.graph.nodes[startNode].state = 'current';
    updateStep(`Starting BFS from node ${startNode}`);
    drawGraph();
    await delay();
    
    while (queue.length > 0) {
        const current = queue.shift();
        const currentNode = state.graph.nodes[current];
        
        currentNode.state = 'visiting';
        updateStep(`Visiting node ${current}`);
        drawGraph();
        await delay();
        
        // Get neighbors
        const neighbors = state.graph.edges
            .filter(e => e.from === current || (!state.isDirected && e.to === current))
            .map(e => e.from === current ? e.to : e.from);
        
        for (const neighborId of neighbors) {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push(neighborId);
                
                state.graph.nodes[neighborId].state = 'current';
                
                // Highlight edge
                const edge = state.graph.edges.find(e => 
                    (e.from === current && e.to === neighborId) ||
                    (!state.isDirected && e.from === neighborId && e.to === current)
                );
                if (edge) edge.state = 'active';
                
                updateStep(`Found unvisited neighbor ${neighborId}`);
                state.operations++;
                updateAnalytics();
                drawGraph();
                await delay();
                
                if (edge) edge.state = 'default';
            }
        }
        
        currentNode.state = 'visited';
        state.operations++;
        updateAnalytics();
        drawGraph();
    }
    
    updateStep('BFS Complete!');
}

async function depthFirstSearch() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }
    resetGraphStates();
    
    const startNode = 0;
    const visited = new Set();
    
    await dfsRecursive(startNode, visited);
    updateStep('DFS Complete!');
}

async function dfsRecursive(nodeId, visited) {
    visited.add(nodeId);
    const node = state.graph.nodes[nodeId];
    
    node.state = 'current';
    updateStep(`Visiting node ${nodeId}`);
    state.operations++;
    updateAnalytics();
    drawGraph();
    await delay();
    
    // Get neighbors
    const neighbors = state.graph.edges
        .filter(e => e.from === nodeId || (!state.isDirected && e.to === nodeId))
        .map(e => e.from === nodeId ? e.to : e.from);
    
    for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
            // Highlight edge
            const edge = state.graph.edges.find(e => 
                (e.from === nodeId && e.to === neighborId) ||
                (!state.isDirected && e.from === neighborId && e.to === nodeId)
            );
            if (edge) edge.state = 'active';
            
            updateStep(`Exploring neighbor ${neighborId}`);
            drawGraph();
            await delay();
            
            await dfsRecursive(neighborId, visited);
            
            if (edge) edge.state = 'default';
        }
    }
    
    node.state = 'visited';
    drawGraph();
}

async function bidirectionalBFS() {
    if (state.graph.nodes.length < 2) {
        updateStep('Need at least two nodes for bidirectional BFS.');
        return;
    }

    resetGraphStates();
    const start = 0;
    const goal = state.graph.nodes.length - 1;

    if (start === goal) {
        state.graph.nodes[start].state = 'sorted';
        drawGraph();
        updateStep('Start and goal are the same node.');
        return;
    }

    const queueStart = [start];
    const queueGoal = [goal];
    const visitedStart = new Set([start]);
    const visitedGoal = new Set([goal]);
    const parentStart = { [start]: null };
    const parentGoal = { [goal]: null };

    const getNeighborsUndirected = (nodeId) => {
        const neighbors = [];
        for (const edge of state.graph.edges) {
            if (edge.from === nodeId) neighbors.push(edge.to);
            else if (edge.to === nodeId) neighbors.push(edge.from);
        }
        return neighbors;
    };

    const setFrontierState = (nodes, type) => {
        nodes.forEach(nodeId => {
            const node = state.graph.nodes[nodeId];
            if (node.state !== 'sorted') {
                node.state = type;
            }
        });
    };

    let meetingNode = null;
    setFrontierState(queueStart, 'current');
    setFrontierState(queueGoal, 'compare');
    updateStep(`Bidirectional BFS from ${start} to ${goal}`);
    drawGraph();
    await delay();

    const expandFrontier = async (queue, visitedSelf, visitedOther, parentMap, label) => {
        if (!queue.length) return null;
        const levelSize = queue.length;

        for (let idx = 0; idx < levelSize; idx++) {
            const nodeId = queue.shift();
            state.graph.nodes[nodeId].state = 'visiting';
            updateStep(`${label} frontier exploring node ${nodeId}`);
            state.operations++;
            updateAnalytics();
            drawGraph();
            await delay();

            for (const neighbor of getNeighborsUndirected(nodeId)) {
                state.comparisons++;
                if (visitedSelf.has(neighbor)) continue;

                parentMap[neighbor] = nodeId;
                visitedSelf.add(neighbor);
                queue.push(neighbor);

                const edge = state.graph.edges.find(e =>
                    (e.from === nodeId && e.to === neighbor) ||
                    (e.from === neighbor && e.to === nodeId)
                );
                if (edge) edge.state = 'active';

                if (visitedOther.has(neighbor)) {
                    if (edge) edge.state = 'mst';
                    state.graph.nodes[neighbor].state = 'current';
                    drawGraph();
                    await delay();
                    return neighbor;
                }

                state.graph.nodes[neighbor].state = label === 'Forward' ? 'current' : 'compare';
                state.operations++;
                updateAnalytics();
                drawGraph();
                await delay();

                if (edge) edge.state = 'default';
            }

            state.graph.nodes[nodeId].state = 'visited';
        }
        return null;
    };

    while (queueStart.length && queueGoal.length && meetingNode === null) {
        meetingNode = await expandFrontier(
            queueStart,
            visitedStart,
            visitedGoal,
            parentStart,
            'Forward'
        );
        if (meetingNode !== null) break;

        meetingNode = await expandFrontier(
            queueGoal,
            visitedGoal,
            visitedStart,
            parentGoal,
            'Backward'
        );
    }

    if (meetingNode === null) {
        updateStep(`No path found between ${start} and ${goal}`);
        drawGraph();
        return;
    }

    const pathPrefix = [];
    let cursor = meetingNode;
    while (cursor !== null) {
        pathPrefix.push(cursor);
        cursor = parentStart[cursor] ?? null;
    }
    pathPrefix.reverse();

    const pathSuffix = [];
    cursor = parentGoal[meetingNode] ?? null;
    while (cursor !== null) {
        pathSuffix.push(cursor);
        cursor = parentGoal[cursor] ?? null;
    }

    const fullPath = [...pathPrefix, ...pathSuffix];
    fullPath.forEach(nodeId => {
        state.graph.nodes[nodeId].state = 'visited';
    });
    for (let i = 0; i < fullPath.length - 1; i++) {
        const a = fullPath[i];
        const b = fullPath[i + 1];
        const edge = state.graph.edges.find(e =>
            (e.from === a && e.to === b) || (e.from === b && e.to === a)
        );
        if (edge) edge.state = 'mst';
    }

    state.operations += fullPath.length;
    updateAnalytics();
    drawGraph();
    updateStep(`Bidirectional BFS complete. Path: ${fullPath.join(' -> ')}`);
}

async function dijkstraAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }
    resetGraphStates();
    
    const startNode = 0;
    const distances = new Array(state.graph.nodes.length).fill(Infinity);
    const visited = new Set();
    
    distances[startNode] = 0;
    state.graph.nodes[startNode].distance = 0;
    
    updateStep(`Starting Dijkstra from node ${startNode}`);
    drawGraph();
    await delay();
    
    while (visited.size < state.graph.nodes.length) {
        // Find minimum distance unvisited node
        let minDist = Infinity;
        let current = -1;
        
        for (let i = 0; i < state.graph.nodes.length; i++) {
            if (!visited.has(i) && distances[i] < minDist) {
                minDist = distances[i];
                current = i;
            }
        }
        
        if (current === -1 || minDist === Infinity) break;
        
        visited.add(current);
        const currentNode = state.graph.nodes[current];
        currentNode.state = 'current';
        
        updateStep(`Processing node ${current} (distance: ${distances[current]})`);
        state.operations++;
        updateAnalytics();
        drawGraph();
        await delay();
        
        // Update neighbors
        const edges = state.graph.edges.filter(e => 
            e.from === current || (!state.isDirected && e.to === current)
        );
        
        for (const edge of edges) {
            const neighborId = edge.from === current ? edge.to : edge.from;
            
            if (!visited.has(neighborId)) {
                const newDist = distances[current] + edge.weight;
                
                edge.state = 'active';
                state.graph.nodes[neighborId].state = 'visiting';
                
                updateStep(`Checking edge to node ${neighborId} (weight: ${edge.weight})`);
                state.comparisons++;
                updateAnalytics();
                drawGraph();
                await delay();
                
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    state.graph.nodes[neighborId].distance = newDist;
                    updateStep(`Updated distance to node ${neighborId}: ${newDist}`);
                    drawGraph();
                    await delay();
                }
                
                edge.state = 'default';
                if (state.graph.nodes[neighborId].state === 'visiting') {
                    state.graph.nodes[neighborId].state = 'default';
                }
            }
        }
        
        currentNode.state = 'visited';
        drawGraph();
    }
    
    updateStep('Dijkstra Complete!');
}

async function astarPathfinding() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }
    resetGraphStates();
    
    const startNode = 0;
    const goalNode = state.graph.nodes.length - 1;
    
    // Manhattan distance heuristic
    const heuristic = (a, b) => {
        const nodeA = state.graph.nodes[a];
        const nodeB = state.graph.nodes[b];
        return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    };
    
    const openSet = new Set([startNode]);
    const cameFrom = new Map();
    const gScore = new Array(state.graph.nodes.length).fill(Infinity);
    const fScore = new Array(state.graph.nodes.length).fill(Infinity);
    
    gScore[startNode] = 0;
    fScore[startNode] = heuristic(startNode, goalNode);
    
    updateStep(`A* from node ${startNode} to ${goalNode}`);
    state.graph.nodes[startNode].state = 'current';
    state.graph.nodes[goalNode].state = 'visiting';
    drawGraph();
    await delay();
    
    while (openSet.size > 0) {
        // Find node in openSet with lowest fScore
        let current = -1;
        let lowestF = Infinity;
        
        for (const node of openSet) {
            if (fScore[node] < lowestF) {
                lowestF = fScore[node];
                current = node;
            }
        }
        
        if (current === goalNode) {
            // Reconstruct path
            const path = [current];
            while (cameFrom.has(current)) {
                current = cameFrom.get(current);
                path.unshift(current);
            }
            
            updateStep(`Path found: ${path.join(' -> ')}`);
            
            // Highlight path
            for (let i = 0; i < path.length - 1; i++) {
                const edge = state.graph.edges.find(e => 
                    (e.from === path[i] && e.to === path[i + 1]) ||
                    (!state.isDirected && e.from === path[i + 1] && e.to === path[i])
                );
                if (edge) edge.state = 'active';
            }
            
            drawGraph();
            return;
        }
        
        openSet.delete(current);
        const currentNode = state.graph.nodes[current];
        currentNode.state = 'current';
        
        updateStep(`Exploring node ${current} (f=${fScore[current].toFixed(1)})`);
        state.operations++;
        updateAnalytics();
        drawGraph();
        await delay();
        
        // Check neighbors
        const edges = state.graph.edges.filter(e => 
            e.from === current || (!state.isDirected && e.to === current)
        );
        
        for (const edge of edges) {
            const neighborId = edge.from === current ? edge.to : edge.from;
            const tentativeGScore = gScore[current] + edge.weight;
            
            if (tentativeGScore < gScore[neighborId]) {
                cameFrom.set(neighborId, current);
                gScore[neighborId] = tentativeGScore;
                fScore[neighborId] = gScore[neighborId] + heuristic(neighborId, goalNode);
                
                if (!openSet.has(neighborId)) {
                    openSet.add(neighborId);
                    state.graph.nodes[neighborId].state = 'visiting';
                }
                
                edge.state = 'active';
                updateStep(`Updated node ${neighborId} (g=${gScore[neighborId].toFixed(1)}, f=${fScore[neighborId].toFixed(1)})`);
                drawGraph();
                await delay();
                edge.state = 'default';
            }
        }
        
        currentNode.state = 'visited';
        drawGraph();
    }
    
    updateStep('No path found!');
}

async function bellmanFordAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates();
    const n = state.graph.nodes.length;
    const distances = new Array(n).fill(Infinity);
    const parents = new Array(n).fill(-1);
    const startNode = 0;
    distances[startNode] = 0;
    state.graph.nodes[startNode].distance = 0;
    state.graph.nodes[startNode].state = 'current';

    const relaxEdges = [];
    state.graph.edges.forEach(edge => {
        relaxEdges.push({ from: edge.from, to: edge.to, weight: edge.weight, edgeRef: edge });
        if (!state.isDirected) {
            relaxEdges.push({ from: edge.to, to: edge.from, weight: edge.weight, edgeRef: edge });
        }
    });

    updateStep(`Bellman-Ford from node ${startNode}`);
    drawGraph();
    await delay();

    for (let pass = 1; pass <= n - 1; pass++) {
        let updated = false;
        updateStep(`Relaxation pass ${pass}/${n - 1}`);

        for (const edge of relaxEdges) {
            if (distances[edge.from] === Infinity) continue;

            edge.edgeRef.state = 'active';
            state.graph.nodes[edge.from].state = 'current';
            state.graph.nodes[edge.to].state = 'visiting';

            const newDistance = distances[edge.from] + edge.weight;
            state.comparisons++;

            if (newDistance < distances[edge.to]) {
                distances[edge.to] = newDistance;
                parents[edge.to] = edge.from;
                state.graph.nodes[edge.to].distance = newDistance;
                state.operations++;
                updated = true;
                updateStep(`Updated d(${edge.to}) = ${newDistance} via ${edge.from}`);
            } else {
                updateStep(`No update for node ${edge.to}`);
            }

            updateAnalytics();
            drawGraph();
            await delay();

            edge.edgeRef.state = 'default';
            state.graph.nodes[edge.from].state = 'default';
            if (state.graph.nodes[edge.to].state === 'visiting') {
                state.graph.nodes[edge.to].state = 'default';
            }
        }

        if (!updated) break;
    }

    let hasNegativeCycle = false;
    for (const edge of relaxEdges) {
        if (distances[edge.from] !== Infinity && distances[edge.from] + edge.weight < distances[edge.to]) {
            hasNegativeCycle = true;
            edge.edgeRef.state = 'rejected';
        }
    }

    if (hasNegativeCycle) {
        updateStep('Negative cycle detected. Shortest paths are undefined.');
    } else {
        state.graph.nodes.forEach((node, idx) => {
            if (distances[idx] !== Infinity) {
                node.state = 'visited';
            }
        });
        updateStep('Bellman-Ford complete!');
    }

    updateAnalytics();
    drawGraph();
}

async function floydWarshallAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    const n = Math.min(8, state.graph.nodes.length);
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

    for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
    }

    state.graph.edges.forEach(edge => {
        if (edge.from >= n || edge.to >= n) return;
        dist[edge.from][edge.to] = Math.min(dist[edge.from][edge.to], edge.weight);
        if (!state.isDirected) {
            dist[edge.to][edge.from] = Math.min(dist[edge.to][edge.from], edge.weight);
        }
    });

    updateStep(`Floyd-Warshall: initialized ${n}x${n} matrix`);
    drawDPTable(dist, ['All-Pairs Shortest Paths']);
    await delay();

    for (let k = 0; k < n; k++) {
        updateStep(`Using node ${k} as intermediate`);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] === Infinity || dist[k][j] === Infinity) continue;
                state.comparisons++;

                const throughK = dist[i][k] + dist[k][j];
                let improved = false;
                if (throughK < dist[i][j]) {
                    dist[i][j] = throughK;
                    state.operations++;
                    improved = true;
                }

                updateAnalytics();
                if (improved || ((i + j + k) % 3 === 0)) {
                    drawDPTable(dist, ['All-Pairs Shortest Paths'], i * n + j);
                    await delay();
                }
            }
        }
    }

    updateStep('Floyd-Warshall complete!');
    drawDPTable(dist, ['All-Pairs Shortest Paths']);
}

async function kruskalAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates();
    const n = state.graph.nodes.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    const sortedEdges = [...state.graph.edges].sort((a, b) => a.weight - b.weight);
    let mstWeight = 0;
    let edgeCount = 0;

    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };

    const union = (a, b) => {
        const rootA = find(a);
        const rootB = find(b);
        if (rootA === rootB) return false;

        if (rank[rootA] < rank[rootB]) {
            parent[rootA] = rootB;
        } else if (rank[rootA] > rank[rootB]) {
            parent[rootB] = rootA;
        } else {
            parent[rootB] = rootA;
            rank[rootA]++;
        }
        return true;
    };

    updateStep('Kruskal: sorting edges by weight');
    drawGraph();
    await delay();

    for (const edge of sortedEdges) {
        edge.state = 'active';
        state.graph.nodes[edge.from].state = 'current';
        state.graph.nodes[edge.to].state = 'current';
        state.comparisons++;
        updateAnalytics();
        drawGraph();
        await delay();

        if (union(edge.from, edge.to)) {
            edge.state = 'mst';
            state.graph.nodes[edge.from].state = 'visited';
            state.graph.nodes[edge.to].state = 'visited';
            mstWeight += edge.weight;
            edgeCount++;
            state.operations++;
            updateStep(`Accepted edge ${edge.from}-${edge.to} (w=${edge.weight})`);
        } else {
            edge.state = 'rejected';
            updateStep(`Rejected edge ${edge.from}-${edge.to} (cycle)`);
        }

        updateAnalytics();
        drawGraph();
        await delay();

        if (edgeCount === n - 1) break;
    }

    if (edgeCount === n - 1) {
        updateStep(`Kruskal complete! MST cost = ${mstWeight}`);
    } else {
        updateStep('Kruskal complete: graph is disconnected, minimum spanning forest shown');
    }
    drawGraph();
}

async function primAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates();
    const n = state.graph.nodes.length;
    const inMST = new Set([0]);
    let mstWeight = 0;
    state.graph.nodes[0].state = 'current';

    updateStep('Prim: growing MST from node 0');
    drawGraph();
    await delay();

    while (inMST.size < n) {
        let bestEdge = null;
        let bestWeight = Infinity;

        for (const edge of state.graph.edges) {
            const fromIn = inMST.has(edge.from);
            const toIn = inMST.has(edge.to);
            if (fromIn === toIn) continue;

            state.comparisons++;
            if (edge.weight < bestWeight) {
                bestWeight = edge.weight;
                bestEdge = edge;
            }
        }

        if (!bestEdge) break;

        bestEdge.state = 'mst';
        const nextNode = inMST.has(bestEdge.from) ? bestEdge.to : bestEdge.from;
        inMST.add(nextNode);
        mstWeight += bestEdge.weight;

        state.graph.nodes[nextNode].state = 'current';
        state.operations++;
        updateStep(`Added node ${nextNode} via edge weight ${bestEdge.weight}`);
        updateAnalytics();
        drawGraph();
        await delay();

        state.graph.nodes[nextNode].state = 'visited';
    }

    if (inMST.size === n) {
        updateStep(`Prim complete! MST cost = ${mstWeight}`);
    } else {
        updateStep('Prim stopped early: graph is disconnected');
    }
    drawGraph();
}

async function topologicalSortAlgorithm() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates();
    const n = state.graph.nodes.length;
    const edgeMap = new Map();

    // Build a DAG orientation based on node id to avoid cycles from random graphs.
    state.graph.edges.forEach(edge => {
        const from = Math.min(edge.from, edge.to);
        const to = Math.max(edge.from, edge.to);
        const key = `${from}-${to}`;
        if (!edgeMap.has(key)) {
            edgeMap.set(key, { from, to, edgeRef: edge });
        }
    });

    const dagEdges = [...edgeMap.values()];
    const indegree = new Array(n).fill(0);
    dagEdges.forEach(edge => {
        indegree[edge.to]++;
    });

    const queue = [];
    indegree.forEach((deg, nodeId) => {
        if (deg === 0) queue.push(nodeId);
    });

    const order = [];
    updateStep('Topological Sort (on acyclic orientation)');
    drawGraph();
    await delay();

    while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        state.graph.nodes[node].state = 'visited';
        updateStep(`Processing node ${node}`);
        state.operations++;
        updateAnalytics();
        drawGraph();
        await delay();

        for (const edge of dagEdges) {
            if (edge.from !== node) continue;
            edge.edgeRef.state = 'active';
            indegree[edge.to]--;
            state.comparisons++;
            if (indegree[edge.to] === 0) {
                queue.push(edge.to);
                state.graph.nodes[edge.to].state = 'current';
            }
            updateAnalytics();
            drawGraph();
            await delay();
            edge.edgeRef.state = 'default';
        }
    }

    if (order.length === n) {
        updateStep(`Topological order: ${order.join(' -> ')}`);
    } else {
        updateStep('Topological sort incomplete: cycle detected');
    }
    drawGraph();
}

async function unionFindVisualization() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates(true);
    const n = state.graph.nodes.length;
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    const palette = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };

    const union = (a, b) => {
        const rootA = find(a);
        const rootB = find(b);
        if (rootA === rootB) return false;

        if (rank[rootA] < rank[rootB]) {
            parent[rootA] = rootB;
        } else if (rank[rootA] > rank[rootB]) {
            parent[rootB] = rootA;
        } else {
            parent[rootB] = rootA;
            rank[rootA]++;
        }
        return true;
    };

    const recolorComponents = () => {
        state.graph.nodes.forEach((node, idx) => {
            const component = find(idx);
            node.color = palette[component % palette.length];
            node.state = 'visited';
        });
    };

    updateStep('Union-Find: path compression + union by rank');
    drawGraph();
    await delay();

    for (const edge of state.graph.edges) {
        edge.state = 'active';
        state.graph.nodes[edge.from].state = 'current';
        state.graph.nodes[edge.to].state = 'current';
        state.comparisons++;
        updateStep(`Union(${edge.from}, ${edge.to})`);
        updateAnalytics();
        drawGraph();
        await delay();

        if (union(edge.from, edge.to)) {
            edge.state = 'mst';
            state.operations++;
        } else {
            edge.state = 'rejected';
        }

        recolorComponents();
        updateAnalytics();
        drawGraph();
        await delay();
    }

    const components = new Set(parent.map((_, idx) => find(idx))).size;
    updateStep(`Union-Find complete! Components: ${components}`);
    drawGraph();
}

async function connectedComponentsVisualization() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates(true);
    const n = state.graph.nodes.length;
    const visited = new Array(n).fill(false);
    const components = [];
    const palette = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'];

    updateStep('Connected Components: BFS over unvisited nodes');
    drawGraph();
    await delay();

    for (let start = 0; start < n; start++) {
        if (visited[start]) continue;

        const queue = [start];
        const component = [];
        const color = palette[components.length % palette.length];
        visited[start] = true;
        state.graph.nodes[start].color = color;

        while (queue.length > 0) {
            const current = queue.shift();
            const currentNode = state.graph.nodes[current];
            currentNode.state = 'current';
            currentNode.color = color;
            component.push(current);

            updateStep(`Component ${components.length + 1}: visiting node ${current}`);
            state.operations++;
            updateAnalytics();
            drawGraph();
            await delay();

            for (const edge of state.graph.edges) {
                if (edge.from !== current && edge.to !== current) continue;
                const neighbor = edge.from === current ? edge.to : edge.from;

                edge.state = 'active';
                state.comparisons++;

                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                    state.graph.nodes[neighbor].state = 'current';
                    state.graph.nodes[neighbor].color = color;
                }

                updateAnalytics();
                drawGraph();
                await delay();

                edge.state = 'default';
            }

            currentNode.state = 'visited';
            currentNode.color = color;
        }

        components.push(component);
        updateStep(`Completed component ${components.length}: { ${component.join(', ')} }`);
        drawGraph();
        await delay();
    }

    state.graph.edges.forEach(edge => {
        edge.state = 'default';
    });

    const summary = components
        .map((component, index) => `C${index + 1}(${component.length})`)
        .join(', ');
    updateStep(`Connected Components complete! Found ${components.length}: ${summary}`);
    drawGraph();
}

// === Tree Algorithms ===
async function binarySearchTree() {
    if (!state.treeRoot) {
        updateStep('Tree is empty. Generate a tree first.');
        return;
    }
    clearTreeStates(state.treeRoot);
    
    const searchValue = state.treeRoot.value + 10;
    updateStep(`Searching for value ${searchValue} in BST...`);
    
    await searchBST(state.treeRoot, searchValue);
}

async function searchBST(node, target) {
    if (!node) {
        updateStep(`Value ${target} not found in tree`);
        return false;
    }
    
    node.state = 'current';
    updateStep(`Comparing ${target} with ${node.value}`);
    state.comparisons++;
    updateAnalytics();
    drawTree();
    await delay();
    
    if (node.value === target) {
        updateStep(`Found ${target}!`);
        playSound(node.value);
        drawTree();
        return true;
    }
    
    node.state = 'visited';
    
    if (target < node.value) {
        updateStep(`${target} < ${node.value}, going left`);
        drawTree();
        await delay();
        return await searchBST(node.left, target);
    } else {
        updateStep(`${target} > ${node.value}, going right`);
        drawTree();
        await delay();
        return await searchBST(node.right, target);
    }
}

function clearTreeStates(node) {
    if (!node) return;
    node.state = 'default';
    clearTreeStates(node.left);
    clearTreeStates(node.right);
}

function avlHeight(node) {
    return node ? node.height : 0;
}

function avlUpdateHeight(node) {
    node.height = Math.max(avlHeight(node.left), avlHeight(node.right)) + 1;
}

function avlBalance(node) {
    return node ? avlHeight(node.left) - avlHeight(node.right) : 0;
}

function avlRotateRight(y) {
    const x = y.left;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    avlUpdateHeight(y);
    avlUpdateHeight(x);
    return x;
}

function avlRotateLeft(x) {
    const y = x.right;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    avlUpdateHeight(x);
    avlUpdateHeight(y);
    return y;
}

async function avlInsert(node, value) {
    if (!node) {
        return {
            value,
            left: null,
            right: null,
            height: 1,
            state: 'current',
            x: 0,
            y: 0
        };
    }

    node.state = 'current';
    state.comparisons++;
    updateStep(`AVL compare ${value} with ${node.value}`);
    updateAnalytics();
    drawTree();
    await delay();

    if (value < node.value) {
        node.left = await avlInsert(node.left, value);
    } else if (value > node.value) {
        node.right = await avlInsert(node.right, value);
    } else {
        node.state = 'visited';
        return node;
    }

    avlUpdateHeight(node);
    const balance = avlBalance(node);

    if (balance > 1 && value < node.left.value) {
        updateStep(`Right rotate at node ${node.value} (LL case)`);
        state.operations++;
        node = avlRotateRight(node);
        drawTree();
        await delay();
    } else if (balance < -1 && value > node.right.value) {
        updateStep(`Left rotate at node ${node.value} (RR case)`);
        state.operations++;
        node = avlRotateLeft(node);
        drawTree();
        await delay();
    } else if (balance > 1 && value > node.left.value) {
        updateStep(`Left-Right rotate at node ${node.value} (LR case)`);
        state.operations += 2;
        node.left = avlRotateLeft(node.left);
        node = avlRotateRight(node);
        drawTree();
        await delay();
    } else if (balance < -1 && value < node.right.value) {
        updateStep(`Right-Left rotate at node ${node.value} (RL case)`);
        state.operations += 2;
        node.right = avlRotateRight(node.right);
        node = avlRotateLeft(node);
        drawTree();
        await delay();
    }

    node.state = 'visited';
    updateAnalytics();
    return node;
}

async function avlTreeVisualization() {
    const nodeCount = Math.min(12, Math.max(6, Math.floor(state.size / 10)));
    const values = [];
    while (values.length < nodeCount) {
        const candidate = Math.floor(Math.random() * 90) + 10;
        if (!values.includes(candidate)) values.push(candidate);
    }

    state.treeRoot = null;
    updateStep(`AVL Tree: inserting ${nodeCount} values`);
    drawTree();
    await delay();

    for (const value of values) {
        clearTreeStates(state.treeRoot);
        updateStep(`Insert ${value}`);
        state.treeRoot = await avlInsert(state.treeRoot, value);
        clearTreeStates(state.treeRoot);
        if (state.treeRoot) state.treeRoot.state = 'current';
        drawTree();
        playSound(value);
        await delay();
        clearTreeStates(state.treeRoot);
    }

    if (state.treeRoot) state.treeRoot.state = 'visited';
    drawTree();
    updateStep('AVL Tree complete! Balanced structure constructed.');
}

function heapArrayToTree(heap, index = 0, highlights = {}) {
    if (index >= heap.length) return null;
    return {
        value: heap[index],
        left: heapArrayToTree(heap, 2 * index + 1, highlights),
        right: heapArrayToTree(heap, 2 * index + 2, highlights),
        state: highlights[index] || 'default',
        x: 0,
        y: 0
    };
}

async function heapTreeVisualization() {
    const nodeCount = Math.min(14, Math.max(7, Math.floor(state.size / 10)));
    const values = Array.from({ length: nodeCount }, () => Math.floor(Math.random() * 90) + 10);
    const heap = [];

    updateStep(`Heap Tree: building max-heap with ${nodeCount} values`);
    await delay();

    for (const value of values) {
        heap.push(value);
        let idx = heap.length - 1;

        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            state.comparisons++;
            updateStep(`Compare child ${heap[idx]} with parent ${heap[parent]}`);
            state.treeRoot = heapArrayToTree(heap, 0, { [idx]: 'current', [parent]: 'compare' });
            updateAnalytics();
            drawTree();
            await delay();

            if (heap[parent] >= heap[idx]) break;

            [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
            state.swaps++;
            state.operations++;
            playSound(heap[parent]);
            updateStep(`Swap to maintain max-heap property`);
            state.treeRoot = heapArrayToTree(heap, 0, { [idx]: 'swap', [parent]: 'swap' });
            updateAnalytics();
            drawTree();
            await delay();
            idx = parent;
        }

        state.treeRoot = heapArrayToTree(heap);
        drawTree();
        await delay();
    }

    state.treeRoot = heapArrayToTree(heap);
    clearTreeStates(state.treeRoot);
    if (state.treeRoot) state.treeRoot.state = 'visited';
    drawTree();
    updateStep('Heap Tree complete! Max-heap constructed.');
}

async function trieVisualization() {
    const words = ['DATA', 'DASH', 'DART', 'TREE', 'TRIE', 'TRIAL', 'ALGO', 'ALGORITHM'];
    const trie = { children: {}, isEnd: false, char: 'ROOT', state: 'default', x: 0, y: 0 };

    updateStep('Trie: inserting words character by character');
    drawTrie(trie);
    await delay();

    for (const word of words) {
        let node = trie;
        updateStep(`Insert "${word}"`);

        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = {
                    children: {},
                    isEnd: false,
                    char,
                    state: 'default',
                    x: 0,
                    y: 0
                };
            }

            node.children[char].state = 'current';
            state.operations++;
            updateAnalytics();
            drawTrie(trie);
            await delay();
            node.children[char].state = 'visited';
            node = node.children[char];
        }

        node.isEnd = true;
        playSound(65);
        drawTrie(trie);
        await delay();
        resetTrieColors(trie);
    }

    updateStep('Trie complete! Words indexed for prefix search.');
    drawTrie(trie);
}

async function inorderTraversal() {
    if (!state.treeRoot) {
        updateStep('Tree is empty. Generate a tree first.');
        return;
    }
    clearTreeStates(state.treeRoot);
    
    const result = [];
    updateStep('Starting inorder traversal (Left -> Root -> Right)');
    await inorderHelper(state.treeRoot, result);
    updateStep(`Inorder: ${result.join(', ')}`);
}

async function inorderHelper(node, result) {
    if (!node) return;
    
    await inorderHelper(node.left, result);
    
    node.state = 'current';
    result.push(node.value);
    updateStep(`Visiting node ${node.value}`);
    playSound(node.value);
    state.operations++;
    updateAnalytics();
    drawTree();
    await delay();
    
    node.state = 'visited';
    
    await inorderHelper(node.right, result);
}

async function preorderTraversal() {
    if (!state.treeRoot) {
        updateStep('Tree is empty. Generate a tree first.');
        return;
    }
    clearTreeStates(state.treeRoot);
    
    const result = [];
    updateStep('Starting preorder traversal (Root -> Left -> Right)');
    await preorderHelper(state.treeRoot, result);
    updateStep(`Preorder: ${result.join(', ')}`);
}

async function preorderHelper(node, result) {
    if (!node) return;
    
    node.state = 'current';
    result.push(node.value);
    updateStep(`Visiting node ${node.value}`);
    playSound(node.value);
    state.operations++;
    updateAnalytics();
    drawTree();
    await delay();
    
    node.state = 'visited';
    
    await preorderHelper(node.left, result);
    await preorderHelper(node.right, result);
}

async function postorderTraversal() {
    if (!state.treeRoot) {
        updateStep('Tree is empty. Generate a tree first.');
        return;
    }
    clearTreeStates(state.treeRoot);
    
    const result = [];
    updateStep('Starting postorder traversal (Left -> Right -> Root)');
    await postorderHelper(state.treeRoot, result);
    updateStep(`Postorder: ${result.join(', ')}`);
}

async function postorderHelper(node, result) {
    if (!node) return;
    
    await postorderHelper(node.left, result);
    await postorderHelper(node.right, result);
    
    node.state = 'current';
    result.push(node.value);
    updateStep(`Visiting node ${node.value}`);
    playSound(node.value);
    state.operations++;
    updateAnalytics();
    drawTree();
    await delay();
    
    node.state = 'visited';
}

async function levelOrderTraversal() {
    if (!state.treeRoot) {
        updateStep('Tree is empty. Generate a tree first.');
        return;
    }
    clearTreeStates(state.treeRoot);
    
    const result = [];
    const queue = [state.treeRoot];
    
    updateStep('Starting level order traversal (BFS)');
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        node.state = 'current';
        result.push(node.value);
        updateStep(`Visiting node ${node.value}`);
        playSound(node.value);
        state.operations++;
        updateAnalytics();
        drawTree();
        await delay();
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        
        node.state = 'visited';
    }
    
    updateStep(`Level Order: ${result.join(', ')}`);
}

// === Dynamic Programming Algorithms ===

async function fibonacciVisualization() {
    const n = Math.min(20, Math.max(10, Math.floor(state.size / 10)));
    
    updateStep(`Computing Fibonacci sequence up to F(${n})`);
    
    // Create DP table
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    
    // Visualize DP table
    drawDPTable([dp], ['Fibonacci']);
    await delay();
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        
        updateStep(`F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`);
        state.operations++;
        updateAnalytics();
        
        drawDPTable([dp], ['Fibonacci'], i);
        playSound(Math.min(dp[i] % 100, 80));
        await delay();
    }
    
    updateStep(`Fibonacci Complete! F(${n}) = ${dp[n]}`);
}

async function knapsackVisualization() {
    const n = 8; // Number of items
    const capacity = 50;
    
    // Generate random items
    const weights = Array.from({ length: n }, () => Math.floor(Math.random() * 15) + 5);
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 10);
    
    updateStep(`0/1 Knapsack: ${n} items, capacity ${capacity}`);
    
    // Create DP table
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    // Display items
    let itemsInfo = 'Items:\n';
    for (let i = 0; i < n; i++) {
        itemsInfo += `Item ${i+1}: Weight=${weights[i]}, Value=${values[i]}\n`;
    }
    updateStep(itemsInfo);
    await delay();
    
    drawDPTable(dp, ['0/1 Knapsack']);
    await delay();
    
    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            state.comparisons++;
            
            if (weights[i - 1] <= w) {
                // Can include item
                const includeValue = values[i - 1] + dp[i - 1][w - weights[i - 1]];
                const excludeValue = dp[i - 1][w];
                
                dp[i][w] = Math.max(includeValue, excludeValue);
                
                updateStep(`Item ${i}, Weight ${w}: Include(${includeValue}) vs Exclude(${excludeValue}) = ${dp[i][w]}`);
            } else {
                // Cannot include item
                dp[i][w] = dp[i - 1][w];
                updateStep(`Item ${i}, Weight ${w}: Too heavy, skip = ${dp[i][w]}`);
            }
            
            state.operations++;
            updateAnalytics();
            drawDPTable(dp, ['0/1 Knapsack'], i * capacity + w);
            await delay();
        }
    }
    
    updateStep(`Knapsack Complete! Max value: ${dp[n][capacity]}`);
}

async function lcsVisualization() {
    const str1 = "AGGTAB";
    const str2 = "GXTXAYB";
    
    const m = str1.length;
    const n = str2.length;
    
    updateStep(`LCS of "${str1}" and "${str2}"`);
    
    // Create DP table
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    drawDPTable(dp, [`LCS: ${str1} vs ${str2}`]);
    await delay();
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            state.comparisons++;
            
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                updateStep(`Match: ${str1[i-1]} = ${str2[j-1]}, LCS length = ${dp[i][j]}`);
                playSound(60 + dp[i][j] * 5);
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                updateStep(`No match: ${str1[i-1]} != ${str2[j-1]}, take max = ${dp[i][j]}`);
            }
            
            state.operations++;
            updateAnalytics();
            drawDPTable(dp, [`LCS: ${str1} vs ${str2}`], i * n + j);
            await delay();
        }
    }
    
    // Backtrack to find LCS
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            lcs = str1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    updateStep(`LCS Complete! Length: ${dp[m][n]}, Sequence: "${lcs}"`);
}

async function editDistanceVisualization() {
    const str1 = "SUNDAY";
    const str2 = "SATURDAY";
    
    const m = str1.length;
    const n = str2.length;
    
    updateStep(`Edit Distance between "${str1}" and "${str2}"`);
    
    // Create DP table
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Initialize base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    drawDPTable(dp, [`Edit Distance: ${str1} -> ${str2}`]);
    await delay();
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            state.comparisons++;
            
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                updateStep(`Match: ${str1[i-1]} = ${str2[j-1]}, no operation needed`);
            } else {
                const replace = dp[i - 1][j - 1] + 1;
                const insert = dp[i][j - 1] + 1;
                const remove = dp[i - 1][j] + 1;
                
                dp[i][j] = Math.min(replace, insert, remove);
                
                let operation = 'Replace';
                if (dp[i][j] === insert) operation = 'Insert';
                if (dp[i][j] === remove) operation = 'Delete';
                
                updateStep(`${str1[i-1]} != ${str2[j-1]}, ${operation}, distance = ${dp[i][j]}`);
            }
            
            state.operations++;
            updateAnalytics();
            drawDPTable(dp, [`Edit Distance: ${str1} -> ${str2}`], i * n + j);
            await delay();
        }
    }
    
    updateStep(`Edit Distance Complete! Minimum operations: ${dp[m][n]}`);
}

async function matrixChainVisualization() {
    const dims = [10, 20, 30, 40, 30]; // Matrix dimensions
    const n = dims.length - 1;
    
    updateStep(`Matrix Chain Multiplication: ${n} matrices`);
    
    let info = 'Matrices:\n';
    for (let i = 0; i < n; i++) {
        info += `M${i+1}: ${dims[i]}x${dims[i+1]}\n`;
    }
    updateStep(info);
    await delay();
    
    // Create DP tables
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    const bracket = Array(n).fill(null).map(() => Array(n).fill(0));
    
    drawDPTable(dp, ['Min Multiplications']);
    await delay();
    
    // Fill DP table
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i < n - len + 1; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                
                state.comparisons++;
                updateStep(`Chain [${i+1}..${j+1}], split at ${k+1}: cost = ${cost}`);
                
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    bracket[i][j] = k;
                }
                
                state.operations++;
                updateAnalytics();
                drawDPTable(dp, ['Min Multiplications'], i * n + j);
                await delay();
            }
        }
    }
    
    updateStep(`Matrix Chain Complete! Minimum operations: ${dp[0][n-1]}`);
}

async function coinChangeVisualization() {
    const baseCoins = [1, 2, 5, 10];
    const randomCoin = Math.max(3, Math.floor(Math.random() * 9) + 2);
    const coins = [...new Set([...baseCoins, randomCoin])].sort((a, b) => a - b);
    const amount = Math.min(48, Math.max(18, Math.floor(state.size / 3)));
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    updateStep(`Coin Change: coins [${coins.join(', ')}], target ${amount}`);
    drawDPTable([dp], [`Min coins for amount ${amount}`], 0);
    await delay();

    for (let a = 1; a <= amount; a++) {
        let bestCoin = null;
        for (const coin of coins) {
            state.comparisons++;
            if (coin > a || !Number.isFinite(dp[a - coin])) continue;

            const candidate = dp[a - coin] + 1;
            if (candidate < dp[a]) {
                dp[a] = candidate;
                bestCoin = coin;
            }
        }

        state.operations++;
        updateAnalytics();
        drawDPTable([dp], [`Min coins for amount ${amount}`], a);
        if (bestCoin !== null) {
            updateStep(`Amount ${a}: use coin ${bestCoin}, min coins = ${dp[a]}`);
        } else {
            updateStep(`Amount ${a}: currently unreachable`);
        }
        await delay();
    }

    if (Number.isFinite(dp[amount])) {
        updateStep(`Coin Change complete! Minimum coins for ${amount} is ${dp[amount]}`);
    } else {
        updateStep(`Coin Change complete! ${amount} cannot be formed with [${coins.join(', ')}]`);
    }
}

async function lisVisualization() {
    const n = Math.min(12, Math.max(8, Math.floor(state.size / 8)));
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1);

    updateStep(`LIS: sequence [${values.join(', ')}]`);
    drawDPTable([values, dp], ['Values', 'LIS Length']);
    await delay();

    let bestLen = 1;
    let bestIdx = 0;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            state.comparisons++;
            if (values[j] < values[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                prev[i] = j;
                updateStep(`Extend at i=${i} (${values[i]}) from j=${j} (${values[j]}): dp[${i}] = ${dp[i]}`);
            } else {
                updateStep(`Check j=${j} -> i=${i}: no better extension`);
            }

            state.operations++;
            updateAnalytics();
            drawDPTable([values, dp], ['Values', 'LIS Length'], n + i);
            await delay();
        }

        if (dp[i] > bestLen) {
            bestLen = dp[i];
            bestIdx = i;
            playSound(45 + bestLen * 5);
        }
    }

    const sequence = [];
    let trace = bestIdx;
    while (trace !== -1) {
        sequence.push(values[trace]);
        trace = prev[trace];
    }
    sequence.reverse();

    const prevDisplay = prev.map(index => (index === -1 ? '-' : index));
    drawDPTable([values, dp, prevDisplay], ['Values', 'LIS Length', 'Prev Index'], 2 * n + bestIdx);
    updateStep(`LIS complete! Length ${bestLen}, sequence: ${sequence.join(' -> ')}`);
}

async function kadaneVisualization() {
    const n = Math.min(18, Math.max(9, Math.floor(state.size / 7)));
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 31) - 15);

    let currentSum = values[0];
    let bestSum = values[0];
    let bestStart = 0;
    let bestEnd = 0;
    let currentStart = 0;

    const currentRow = new Array(n).fill('-');
    const bestRow = new Array(n).fill('-');
    currentRow[0] = currentSum;
    bestRow[0] = bestSum;

    updateStep(`Kadane: values [${values.join(', ')}]`);
    drawDPTable([values, currentRow, bestRow], ['Values', 'Current Sum', 'Best Sum'], n);
    await delay();

    for (let i = 1; i < n; i++) {
        const extend = currentSum + values[i];
        const restart = values[i];
        state.comparisons++;

        if (restart > extend) {
            currentSum = restart;
            currentStart = i;
            updateStep(`i=${i}: restart at ${values[i]} (better than extend ${extend})`);
        } else {
            currentSum = extend;
            updateStep(`i=${i}: extend subarray, current=${currentSum}`);
        }

        if (currentSum > bestSum) {
            bestSum = currentSum;
            bestStart = currentStart;
            bestEnd = i;
            playSound(40 + Math.min(60, Math.abs(bestSum)));
            updateStep(`New best sum ${bestSum} for range [${bestStart}, ${bestEnd}]`);
        }

        currentRow[i] = currentSum;
        bestRow[i] = bestSum;
        state.operations += 2;
        updateAnalytics();
        drawDPTable([values, currentRow, bestRow], ['Values', 'Current Sum', 'Best Sum'], n + i);
        await delay();
    }

    const bestSubarray = values.slice(bestStart, bestEnd + 1);
    updateStep(`Kadane complete! Max sum ${bestSum}, subarray: [${bestSubarray.join(', ')}]`);
}

// === String Algorithms ===

function drawStringMatchingState(
    text,
    pattern,
    windowStart = -1,
    matchedPrefix = 0,
    matches = [],
    probeIndex = -1,
    title = 'String Matching'
) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getCssVar('--surface', '#1e293b');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const maxLen = Math.max(text.length, pattern.length, 1);
    const cellWidth = Math.max(18, Math.min(34, Math.floor((canvas.width - 60) / maxLen)));
    const charBoxWidth = Math.max(16, cellWidth - 2);
    const totalWidth = charBoxWidth * maxLen;
    const originX = Math.floor((canvas.width - totalWidth) / 2);
    const patternY = 72;
    const textY = 168;

    const textPrimary = getCssVar('--text-primary', '#e2e8f0');
    const borderColor = getCssVar('--border-color', 'rgba(148,163,184,0.25)');
    const primaryLight = getCssVar('--primary-light', 'rgba(14,165,233,0.15)');
    const successLight = getCssVar('--success-light', 'rgba(34,197,94,0.16)');
    const warningLight = getCssVar('--warning-light', 'rgba(245,158,11,0.16)');

    const drawHeader = (label, y) => {
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label, originX, y);
    };

    const isFullMatchAt = (index) =>
        matches.some(start => index >= start && index < start + pattern.length);

    drawHeader(title, 36);
    drawHeader('Pattern', patternY - 14);
    drawHeader('Text', textY - 14);

    for (let i = 0; i < pattern.length; i++) {
        const x = originX + i * charBoxWidth;
        let fill = getCssVar('--bg-primary', '#0f172a');
        if (i < matchedPrefix) fill = successLight;

        ctx.fillStyle = fill;
        ctx.fillRect(x, patternY, charBoxWidth - 1, 34);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, patternY, charBoxWidth - 1, 34);

        ctx.fillStyle = textPrimary;
        ctx.font = '600 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pattern[i], x + (charBoxWidth - 1) / 2, patternY + 17);
    }

    for (let i = 0; i < text.length; i++) {
        const x = originX + i * charBoxWidth;
        let fill = getCssVar('--bg-primary', '#0f172a');

        if (isFullMatchAt(i)) {
            fill = successLight;
        } else if (windowStart >= 0 && i >= windowStart && i < windowStart + pattern.length) {
            fill = primaryLight;
        }

        if (probeIndex === i) {
            fill = warningLight;
        }

        ctx.fillStyle = fill;
        ctx.fillRect(x, textY, charBoxWidth - 1, 34);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, textY, charBoxWidth - 1, 34);

        ctx.fillStyle = textPrimary;
        ctx.font = '600 15px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[i], x + (charBoxWidth - 1) / 2, textY + 17);
    }
}

async function kmpPatternMatching() {
    const text = "ABABDABACDABABCABAB";
    const pattern = "ABABCABAB";
    
    updateStep(`KMP: Searching for "${pattern}" in "${text}"`);
    drawStringMatchingState(text, pattern, 0, 0, [], -1, 'KMP Pattern Matching');
    
    // Build LPS array
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;
    
    updateStep('Building LPS (Longest Prefix Suffix) array...');
    await delay();
    
    while (i < pattern.length) {
        state.comparisons++;
        
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            updateStep(`LPS[${i}] = ${len} (match at ${pattern[i]})`);
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
                updateStep(`Mismatch, fallback to LPS[${len}]`);
            } else {
                lps[i] = 0;
                i++;
            }
        }
        
        state.operations++;
        updateAnalytics();
        drawStringMatchingState(text, pattern, 0, len, [], i, 'Building LPS Array');
        await delay();
    }
    
    updateStep(`LPS array: [${lps.join(', ')}]`);
    drawStringMatchingState(text, pattern, 0, 0, [], -1, `LPS: [${lps.join(', ')}]`);
    await delay();
    
    // Search pattern in text
    i = 0;
    let j = 0;
    const matches = [];
    
    while (i < text.length) {
        state.comparisons++;
        
        if (pattern[j] === text[i]) {
            updateStep(`Match at text[${i}]=${text[i]}, pattern[${j}]=${pattern[j]}`);
            i++;
            j++;
        }
        
        if (j === pattern.length) {
            matches.push(i - j);
            updateStep(`OK Pattern found at index ${i - j}`);
            playSound(70);
            j = lps[j - 1];
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
                updateStep(`Mismatch at text[${i}], using LPS to skip`);
            } else {
                i++;
            }
        }
        
        state.operations++;
        updateAnalytics();
        drawStringMatchingState(text, pattern, i - j, j, matches, i, 'KMP Search Progress');
        await delay();
    }
    
    drawStringMatchingState(text, pattern, -1, 0, matches, -1, 'KMP Final Matches');
    updateStep(`KMP Complete! Found ${matches.length} match(es) at: ${matches.join(', ')}`);
}

async function rabinKarpPatternMatching() {
    const text = "ABCCDDAEFGABCD";
    const pattern = "ABCD";
    
    const d = 256; // Number of characters
    const q = 101; // Prime number for modulo
    
    const m = pattern.length;
    const n = text.length;
    
    updateStep(`Rabin-Karp: Searching for "${pattern}" in "${text}"`);
    
    // Calculate hash of pattern and first window
    let patternHash = 0;
    let textHash = 0;
    let h = 1;
    
    // h = d^(m-1) % q
    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    // Calculate initial hashes
    for (let i = 0; i < m; i++) {
        patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
        textHash = (d * textHash + text.charCodeAt(i)) % q;
    }
    
    updateStep(`Pattern hash: ${patternHash}`);
    drawStringMatchingState(text, pattern, 0, 0, [], -1, `Rabin-Karp hash = ${patternHash}`);
    await delay();
    
    const matches = [];
    
    // Slide pattern over text
    for (let i = 0; i <= n - m; i++) {
        state.comparisons++;
        
        updateStep(`Checking window [${i}..${i+m-1}]: "${text.substring(i, i+m)}", hash=${textHash}`);
        drawStringMatchingState(text, pattern, i, 0, matches, i, `Window hash: ${textHash}`);
        
        if (patternHash === textHash) {
            // Hash match, verify character by character
            let match = true;
            for (let j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            
            if (match) {
                matches.push(i);
                updateStep(`OK Pattern found at index ${i}`);
                playSound(70);
            } else {
                updateStep(`Hash collision at index ${i}, not a match`);
            }
        }
        
        // Calculate hash for next window
        if (i < n - m) {
            textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (textHash < 0) textHash += q;
        }
        
        state.operations++;
        updateAnalytics();
        await delay();
    }
    
    drawStringMatchingState(text, pattern, -1, 0, matches, -1, 'Rabin-Karp Final Matches');
    updateStep(`Rabin-Karp Complete! Found ${matches.length} match(es) at: ${matches.join(', ')}`);
}

async function zAlgorithmPatternMatching() {
    const text = 'AABCAABXAABCAABY';
    const pattern = 'AAB';
    const combined = `${pattern}$${text}`;
    const z = new Array(combined.length).fill(0);
    const matches = [];
    let left = 0;
    let right = 0;

    updateStep(`Z Algorithm: searching "${pattern}" inside "${text}"`);
    drawStringMatchingState(text, pattern, 0, 0, [], -1, 'Z Algorithm');
    await delay();

    for (let i = 1; i < combined.length; i++) {
        if (i <= right) {
            z[i] = Math.min(right - i + 1, z[i - left]);
        }

        while (i + z[i] < combined.length && combined[z[i]] === combined[i + z[i]]) {
            z[i]++;
            state.comparisons++;
        }

        if (i + z[i] - 1 > right) {
            left = i;
            right = i + z[i] - 1;
        }

        if (z[i] === pattern.length) {
            const matchIndex = i - pattern.length - 1;
            if (matchIndex >= 0) {
                matches.push(matchIndex);
                playSound(70);
            }
        }

        state.operations++;
        updateAnalytics();

        const textIndex = i - pattern.length - 1;
        const windowStart = textIndex >= 0 ? textIndex : 0;
        const prefixLen = Math.min(pattern.length, Math.max(0, z[i]));
        drawStringMatchingState(
            text,
            pattern,
            windowStart,
            prefixLen,
            matches,
            textIndex >= 0 ? textIndex : -1,
            `Z-box [${left}, ${right}]`
        );
        updateStep(`Z[${i}] = ${z[i]} (left=${left}, right=${right})`);
        await delay();
    }

    drawStringMatchingState(text, pattern, -1, 0, matches, -1, 'Z Algorithm Final Matches');
    updateStep(`Z Algorithm complete! Found ${matches.length} match(es) at: ${matches.join(', ')}`);
}

async function boyerMoorePatternMatching() {
    const text = 'AABACAABCABAXABCAB';
    const pattern = 'ABCAB';
    const m = pattern.length;
    const n = text.length;
    const last = {};
    const matches = [];

    updateStep(`Boyer-Moore: searching "${pattern}" in "${text}"`);
    drawStringMatchingState(text, pattern, 0, 0, [], -1, 'Boyer-Moore (Bad Character)');
    await delay();

    for (let i = 0; i < m; i++) {
        last[pattern[i]] = i;
        state.operations++;
        updateAnalytics();
        drawStringMatchingState(text, pattern, 0, i + 1, [], i, `Last['${pattern[i]}'] = ${i}`);
        await delay();
    }

    let shift = 0;
    while (shift <= n - m) {
        let j = m - 1;
        updateStep(`Align pattern at shift ${shift}`);

        while (j >= 0 && pattern[j] === text[shift + j]) {
            state.comparisons++;
            state.operations++;
            updateAnalytics();
            drawStringMatchingState(text, pattern, shift, j + 1, matches, shift + j, 'Right-to-left match');
            await delay();
            j--;
        }

        if (j >= 0) {
            state.comparisons++;
        }

        if (j < 0) {
            matches.push(shift);
            playSound(70);
            updateStep(`Match found at index ${shift}`);
            drawStringMatchingState(text, pattern, shift, m, matches, -1, 'Boyer-Moore Match');
            await delay();
            const nextChar = text[shift + m];
            shift += shift + m < n ? m - (last[nextChar] ?? -1) : 1;
        } else {
            const badChar = text[shift + j];
            const jump = Math.max(1, j - (last[badChar] ?? -1));
            updateStep(`Mismatch '${badChar}' at text[${shift + j}], shift by ${jump}`);
            state.operations++;
            updateAnalytics();
            drawStringMatchingState(text, pattern, shift, Math.max(0, j), matches, shift + j, 'Bad-character shift');
            await delay();
            shift += jump;
        }
    }

    drawStringMatchingState(text, pattern, -1, 0, matches, -1, 'Boyer-Moore Final Matches');
    updateStep(`Boyer-Moore complete! Found ${matches.length} match(es) at: ${matches.join(', ')}`);
}

function trieDepth(node) {
    const children = Object.values(node.children || {});
    if (children.length === 0) return 1;
    return 1 + Math.max(...children.map(child => trieDepth(child)));
}

function layoutTrie(node, depth, left, right, levelHeight) {
    const children = Object.values(node.children || {});
    node.x = (left + right) / 2;
    node.y = 50 + depth * levelHeight;

    if (children.length === 0) return;
    const span = (right - left) / children.length;
    children.forEach((child, idx) => {
        const childLeft = left + idx * span;
        const childRight = left + (idx + 1) * span;
        layoutTrie(child, depth + 1, childLeft, childRight, levelHeight);
    });
}

function drawTrieEdges(ctx, node) {
    const children = Object.values(node.children || {});
    const edgeColor = getCssVar('--border-color', 'rgba(148, 163, 184, 0.4)');
    children.forEach(child => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(child.x, child.y);
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        drawTrieEdges(ctx, child);
    });
}

function drawTrieNodes(ctx, node) {
    const palette = {
        default: getCssVar('--primary', '#3b82f6'),
        current: getCssVar('--warning', '#f59e0b'),
        visited: getCssVar('--success', '#22c55e')
    };
    const nodeBorder = getCssVar('--surface', '#ffffff');
    const nodeText = '#ffffff';
    const endRing = getCssVar('--success', '#22c55e');

    const radius = node.char === 'ROOT' ? 18 : 14;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = palette[node.state] || palette.default;
    ctx.fill();
    ctx.strokeStyle = nodeBorder;
    ctx.lineWidth = node.isEnd ? 4 : 2;
    ctx.stroke();

    ctx.fillStyle = nodeText;
    ctx.font = node.char === 'ROOT' ? '10px monospace' : '11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.char === 'ROOT' ? 'R' : node.char, node.x, node.y);

    if (node.isEnd) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = endRing;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    Object.values(node.children || {}).forEach(child => drawTrieNodes(ctx, child));
}

function drawTrie(root) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bg = getCssVar('--surface', '#1e293b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const depth = trieDepth(root);
    const levelHeight = depth > 1
        ? Math.max(65, (canvas.height - 100) / (depth - 1))
        : 80;
    layoutTrie(root, 0, 40, canvas.width - 40, levelHeight);

    drawTrieEdges(ctx, root);
    drawTrieNodes(ctx, root);
}

async function trieSearchVisualization() {
    const words = ['THE', 'THEIR', 'THERE', 'ANY', 'ANSWER'];
    const searchWords = ['THE', 'THESE', 'THEIR', 'THAW'];
    
    updateStep('Building Trie from dictionary...');
    
    const trie = { children: {}, isEnd: false, x: 0, y: 0, char: 'ROOT', state: 'default' };
    
    // Insert words
    for (const word of words) {
        updateStep(`Inserting: ${word}`);
        let node = trie;
        
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = { children: {}, isEnd: false, char: char, state: 'default', x: 0, y: 0 };
            }
            node.children[char].state = 'current';
            
            drawTrie(trie);
            await delay();
            
            node.children[char].state = 'visited';
            node = node.children[char];
            state.operations++;
            updateAnalytics();
        }
        
        node.isEnd = true;
        drawTrie(trie);
        await delay();
    }
    
    updateStep('Trie built! Now searching...');
    await delay();
    
    // Search words
    for (const word of searchWords) {
        updateStep(`Searching: ${word}`);
        let node = trie;
        let found = true;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            if (!node.children[char]) {
                found = false;
                updateStep(`X "${word}" not found (failed at '${char}')`);
                break;
            }
            
            node.children[char].state = 'current';
            drawTrie(trie);
            await delay();
            
            node.children[char].state = 'visited';
            node = node.children[char];
            state.comparisons++;
            updateAnalytics();
        }
        
        if (found && node.isEnd) {
            updateStep(`OK "${word}" found in dictionary!`);
            playSound(70);
        } else if (found) {
            updateStep(`X "${word}" is a prefix but not a complete word`);
        }
        
        // Reset colors
        resetTrieColors(trie);
        await delay();
    }
    
    updateStep('Trie search complete!');
}

function resetTrieColors(node) {
    if (!node) return;
    node.state = 'default';
    Object.values(node.children).forEach(child => resetTrieColors(child));
}

// === Computational Geometry ===

async function convexHullVisualization() {
    const numPoints = Math.min(15, Math.max(8, Math.floor(state.size / 15)));
    
    // Generate random points
    const points = [];
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const padding = 50;
    
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * (width - 2 * padding) + padding,
            y: Math.random() * (height - 2 * padding) + padding,
            state: 'default'
        });
    }
    
    updateStep('Graham Scan: Finding Convex Hull');
    drawPoints(points);
    await delay();
    
    // Find bottom-most point
    let bottom = 0;
    for (let i = 1; i < points.length; i++) {
        if (points[i].y > points[bottom].y || 
            (points[i].y === points[bottom].y && points[i].x < points[bottom].x)) {
            bottom = i;
        }
    }
    
    [points[0], points[bottom]] = [points[bottom], points[0]];
    points[0].state = 'pivot';
    
    updateStep('Found pivot point (bottom-most)');
    drawPoints(points);
    await delay();
    
    // Sort by polar angle
    const pivot = points[0];
    const sorted = [pivot, ...points.slice(1).sort((a, b) => {
        const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
        const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
        return angleA - angleB;
    })];
    
    updateStep('Sorted points by polar angle');
    drawPoints(sorted);
    await delay();
    
    // Graham scan
    const hull = [sorted[0], sorted[1], sorted[2]];
    
    for (let i = 3; i < sorted.length; i++) {
        sorted[i].state = 'current';
        drawPoints(sorted, hull);
        await delay();
        
        while (hull.length > 1 && ccw(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) <= 0) {
            const removed = hull.pop();
            removed.state = 'default';
            updateStep('Removing point (makes right turn)');
            state.operations++;
            updateAnalytics();
            drawPoints(sorted, hull);
            await delay();
        }
        
        hull.push(sorted[i]);
        sorted[i].state = 'sorted';
        updateStep(`Added point to hull (${hull.length} points)`);
        state.operations++;
        updateAnalytics();
        drawPoints(sorted, hull);
        await delay();
    }
    
    updateStep(`Convex Hull Complete! ${hull.length} points on hull`);
    drawPoints(sorted, hull);
}

function ccw(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function drawPoints(points, hull = null) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const primaryColor = getCssVar('--primary', '#3b82f6');
    const warningColor = getCssVar('--warning', '#f59e0b');
    const successColor = getCssVar('--success', '#22c55e');
    const dangerColor = getCssVar('--danger', '#ef4444');
    const mutedColor = getCssVar('--text-muted', '#6b7280');
    const borderColor = getCssVar('--surface', '#ffffff');

    // Draw hull polygon
    if (hull && hull.length > 2) {
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        for (let i = 1; i < hull.length; i++) {
            ctx.lineTo(hull[i].x, hull[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = getCssVar('--primary-light', 'rgba(59, 130, 246, 0.1)');
        ctx.fill();
    }
    
    // Draw points
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        
        if (point.state === 'pivot') {
            ctx.fillStyle = dangerColor;
        } else if (point.state === 'current') {
            ctx.fillStyle = warningColor;
        } else if (point.state === 'sorted') {
            ctx.fillStyle = successColor;
        } else {
            ctx.fillStyle = mutedColor;
        }
        
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

async function lineIntersectionVisualization() {
    const lines = [
        { x1: 100, y1: 100, x2: 400, y2: 300, state: 'default' },
        { x1: 100, y1: 300, x2: 400, y2: 100, state: 'default' },
        { x1: 200, y1: 50, x2: 200, y2: 350, state: 'default' },
        { x1: 50, y1: 200, x2: 450, y2: 200, state: 'default' }
    ];
    
    updateStep('Line Segment Intersection Detection');
    drawLines(lines);
    await delay();
    
    const intersections = [];
    
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            lines[i].state = 'current';
            lines[j].state = 'current';
            
            updateStep(`Checking intersection: Line ${i+1} vs Line ${j+1}`);
            state.comparisons++;
            updateAnalytics();
            drawLines(lines, intersections);
            await delay();
            
            const intersection = getLineIntersection(lines[i], lines[j]);
            
            if (intersection) {
                intersections.push(intersection);
                updateStep(`OK Intersection found at (${intersection.x.toFixed(1)}, ${intersection.y.toFixed(1)})`);
                playSound(70);
            } else {
                updateStep('X No intersection');
            }
            
            lines[i].state = 'visited';
            lines[j].state = 'visited';
            state.operations++;
            updateAnalytics();
            drawLines(lines, intersections);
            await delay();
        }
    }
    
    updateStep(`Line Intersection Complete! Found ${intersections.length} intersection(s)`);
}

function getLineIntersection(line1, line2) {
    const x1 = line1.x1, y1 = line1.y1, x2 = line1.x2, y2 = line1.y2;
    const x3 = line2.x1, y3 = line2.y1, x4 = line2.x2, y4 = line2.y2;
    
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.0001) return null;
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    
    return null;
}

function drawLines(lines, intersections = []) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const warningColor = getCssVar('--warning', '#f59e0b');
    const successColor = getCssVar('--success', '#22c55e');
    const mutedColor = getCssVar('--text-muted', '#6b7280');
    const dangerColor = getCssVar('--danger', '#ef4444');
    const borderColor = getCssVar('--surface', '#ffffff');

    // Draw lines
    lines.forEach((line, index) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        
        if (line.state === 'current') {
            ctx.strokeStyle = warningColor;
            ctx.lineWidth = 4;
        } else if (line.state === 'visited') {
            ctx.strokeStyle = successColor;
            ctx.lineWidth = 3;
        } else {
            ctx.strokeStyle = mutedColor;
            ctx.lineWidth = 2;
        }
        
        ctx.stroke();
    });
    
    // Draw intersections
    intersections.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = dangerColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function distanceBetweenPoints(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function drawClosestPairState(points, bestPair = null, probePair = null) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getCssVar('--surface', '#1e293b');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mutedColor = getCssVar('--text-muted', '#94a3b8');
    const warningColor = getCssVar('--warning', '#f59e0b');
    const successColor = getCssVar('--success', '#22c55e');
    const primaryColor = getCssVar('--primary', '#3b82f6');
    const borderColor = getCssVar('--surface', '#ffffff');
    const textColor = getCssVar('--text-primary', '#f8fafc');

    if (probePair) {
        ctx.beginPath();
        ctx.moveTo(probePair[0].x, probePair[0].y);
        ctx.lineTo(probePair[1].x, probePair[1].y);
        ctx.strokeStyle = warningColor;
        ctx.setLineDash([6, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (bestPair) {
        ctx.beginPath();
        ctx.moveTo(bestPair[0].x, bestPair[0].y);
        ctx.lineTo(bestPair[1].x, bestPair[1].y);
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        const dist = distanceBetweenPoints(bestPair[0], bestPair[1]);
        const mx = (bestPair[0].x + bestPair[1].x) / 2;
        const my = (bestPair[0].y + bestPair[1].y) / 2;
        ctx.fillStyle = textColor;
        ctx.font = '600 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`d=${dist.toFixed(2)}`, mx + 8, my - 6);
    }

    points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        if (point.state === 'current') {
            ctx.fillStyle = warningColor;
        } else if (point.state === 'sorted') {
            ctx.fillStyle = successColor;
        } else {
            ctx.fillStyle = mutedColor;
        }
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(index), point.x, point.y - 14);
    });
}

async function closestPairVisualization() {
    const numPoints = Math.min(16, Math.max(8, Math.floor(state.size / 12)));
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const padding = 60;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * (width - 2 * padding) + padding,
            y: Math.random() * (height - 2 * padding) + padding,
            state: 'default'
        });
    }

    updateStep(`Closest Pair: checking ${numPoints} points with brute force`);
    drawClosestPairState(points);
    await delay();

    let bestDist = Infinity;
    let bestPair = null;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            points.forEach(point => {
                if (point.state !== 'sorted') point.state = 'default';
            });

            points[i].state = 'current';
            points[j].state = 'current';
            const dist = distanceBetweenPoints(points[i], points[j]);

            updateStep(`Compare (${i}, ${j}) -> distance ${dist.toFixed(2)}`);
            state.comparisons++;
            state.operations++;
            updateAnalytics();
            drawClosestPairState(points, bestPair, [points[i], points[j]]);
            await delay();

            if (dist < bestDist) {
                bestDist = dist;
                bestPair = [points[i], points[j]];
                points[i].state = 'sorted';
                points[j].state = 'sorted';
                playSound(Math.max(30, Math.min(90, Math.round(130 - dist))));
                updateStep(`New closest pair: (${i}, ${j}) with distance ${bestDist.toFixed(2)}`);
                updateAnalytics();
                drawClosestPairState(points, bestPair);
                await delay();
            } else {
                points[i].state = 'default';
                points[j].state = 'default';
            }
        }
    }

    if (bestPair) {
        bestPair[0].state = 'sorted';
        bestPair[1].state = 'sorted';
    }
    drawClosestPairState(points, bestPair);
    updateStep(`Closest Pair complete! Best distance: ${bestDist.toFixed(2)}`);
}

// === NP-Hard Problems ===

async function tspHeuristicVisualization() {
    const numCities = Math.min(10, Math.max(6, Math.floor(state.size / 20)));
    
    // Generate random cities
    const cities = [];
    const width = elements.canvas.width;
    const height = elements.canvas.height;
    const padding = 80;
    
    for (let i = 0; i < numCities; i++) {
        cities.push({
            id: i,
            x: Math.random() * (width - 2 * padding) + padding,
            y: Math.random() * (height - 2 * padding) + padding,
            state: 'default'
        });
    }
    
    updateStep(`TSP: ${numCities} cities, using Nearest Neighbor heuristic`);
    drawTSP(cities, []);
    await delay();
    
    // Nearest Neighbor heuristic
    const visited = new Set();
    const tour = [0];
    visited.add(0);
    cities[0].state = 'current';
    
    let totalDistance = 0;
    
    while (tour.length < numCities) {
        const current = tour[tour.length - 1];
        let nearest = -1;
        let minDist = Infinity;
        
        updateStep(`From city ${current}, finding nearest unvisited city...`);
        
        for (let i = 0; i < numCities; i++) {
            if (!visited.has(i)) {
                const dist = distance(cities[current], cities[i]);
                state.comparisons++;
                
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            }
        }
        
        if (nearest !== -1) {
            visited.add(nearest);
            tour.push(nearest);
            totalDistance += minDist;
            
            cities[current].state = 'visited';
            cities[nearest].state = 'current';
            
            updateStep(`Moving to city ${nearest}, distance: ${minDist.toFixed(1)}`);
            playSound(50 + tour.length * 3);
        }
        
        state.operations++;
        updateAnalytics();
        drawTSP(cities, tour);
        await delay();
    }
    
    // Return to start
    const returnDist = distance(cities[tour[tour.length - 1]], cities[tour[0]]);
    totalDistance += returnDist;
    cities[tour[tour.length - 1]].state = 'visited';
    
    drawTSP(cities, tour, true);
    updateStep(`TSP Complete! Total distance: ${totalDistance.toFixed(1)}`);
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function drawTSP(cities, tour, complete = false) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const primaryColor = getCssVar('--primary', '#3b82f6');
    const warningColor = getCssVar('--warning', '#f59e0b');
    const successColor = getCssVar('--success', '#22c55e');
    const mutedColor = getCssVar('--text-muted', '#6b7280');
    const borderColor = getCssVar('--surface', '#ffffff');

    // Draw tour edges
    if (tour.length > 1) {
        ctx.beginPath();
        ctx.moveTo(cities[tour[0]].x, cities[tour[0]].y);
        
        for (let i = 1; i < tour.length; i++) {
            ctx.lineTo(cities[tour[i]].x, cities[tour[i]].y);
        }
        
        if (complete) {
            ctx.lineTo(cities[tour[0]].x, cities[tour[0]].y);
        }
        
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    // Draw cities
    cities.forEach((city, index) => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 12, 0, 2 * Math.PI);
        
        if (city.state === 'current') {
            ctx.fillStyle = warningColor;
        } else if (city.state === 'visited') {
            ctx.fillStyle = successColor;
        } else {
            ctx.fillStyle = mutedColor;
        }
        
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw city number
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index, city.x, city.y);
    });
}

async function graphColoringVisualization() {
    if (state.graph.nodes.length === 0) {
        updateStep('Graph is empty. Generate a graph first.');
        return;
    }

    resetGraphStates(true);
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
    const nodeColors = new Array(state.graph.nodes.length).fill(-1);
    
    updateStep('Graph Coloring: greedy assignment over neighboring nodes');
    drawGraph();
    await delay();
    
    for (let i = 0; i < state.graph.nodes.length; i++) {
        state.graph.nodes[i].state = 'current';
        updateStep(`Coloring node ${i}...`);
        
        // Find available colors
        const usedColors = new Set();
        
        for (const edge of state.graph.edges) {
            if (edge.from === i && nodeColors[edge.to] !== -1) {
                usedColors.add(nodeColors[edge.to]);
            }
            if (edge.to === i && nodeColors[edge.from] !== -1) {
                usedColors.add(nodeColors[edge.from]);
            }
        }
        
        // Find first available color index.
        let colorIndex = 0;
        while (usedColors.has(colorIndex)) {
            colorIndex++;
        }
        nodeColors[i] = colorIndex;

        const paletteColor = colors[colorIndex] || `hsl(${(colorIndex * 57) % 360} 78% 55%)`;
        state.graph.nodes[i].color = paletteColor;
        state.graph.nodes[i].state = 'visited';
        
        updateStep(`Node ${i} colored with color ${colorIndex + 1}`);
        state.operations++;
        updateAnalytics();
        drawGraph();
        playSound(50 + colorIndex * 10);
        await delay();
    }
    
    const numColors = new Set(nodeColors).size;
    updateStep(`Graph Coloring Complete! Used ${numColors} colors`);
    drawGraph();
}

async function subsetSumVisualization() {
    const n = Math.min(10, Math.max(6, Math.floor(state.size / 20)));
    const values = Array.from({ length: n }, () => Math.floor(Math.random() * 14) + 2);
    const total = values.reduce((sum, v) => sum + v, 0);
    const target = Math.max(10, Math.floor(total * 0.45));
    const dp = Array(n + 1).fill(null).map(() => Array(target + 1).fill(false));

    for (let i = 0; i <= n; i++) dp[i][0] = true;

    updateStep(`Subset Sum: values [${values.join(', ')}], target ${target}`);
    drawDPTable(dp.map(row => row.map(v => (v ? 1 : 0))), [`Subset Sum target = ${target}`]);
    await delay();

    for (let i = 1; i <= n; i++) {
        for (let sum = 1; sum <= target; sum++) {
            state.comparisons++;
            dp[i][sum] = dp[i - 1][sum];
            if (sum >= values[i - 1]) {
                dp[i][sum] = dp[i][sum] || dp[i - 1][sum - values[i - 1]];
            }

            state.operations++;
            updateAnalytics();
            drawDPTable(
                dp.map(row => row.map(v => (v ? 1 : 0))),
                [`Subset Sum target = ${target}`],
                i * (target + 1) + sum
            );
            updateStep(`Considering ${values[i - 1]} for sum ${sum}: ${dp[i][sum] ? 'possible' : 'not possible'}`);
            await delay();
        }
    }

    const possible = dp[n][target];
    updateStep(
        possible
            ? `Subset Sum complete! Target ${target} is achievable.`
            : `Subset Sum complete! Target ${target} is not achievable.`
    );
}

async function nQueensVisualization() {
    const n = Math.min(8, Math.max(4, Math.floor(state.size / 25)));
    
    updateStep(`N-Queens Problem: Placing ${n} queens on ${n}x${n} board`);
    
    const board = Array(n).fill(null).map(() => Array(n).fill(0));
    const solution = [];
    
    drawChessboard(board, []);
    await delay();
    
    async function solveNQueens(col) {
        if (col >= n) {
            return true;
        }
        
        for (let row = 0; row < n; row++) {
            updateStep(`Trying queen at position (${row}, ${col})`);
            
            state.comparisons++;
            updateAnalytics();
            
            if (isSafe(board, row, col, n)) {
                board[row][col] = 1;
                solution.push({ row, col });
                
                drawChessboard(board, solution);
                playSound(60 + col * 5);
                await delay();
                
                if (await solveNQueens(col + 1)) {
                    return true;
                }
                
                // Backtrack
                board[row][col] = 0;
                solution.pop();
                
                updateStep(`Backtracking from (${row}, ${col})`);
                state.operations++;
                updateAnalytics();
                drawChessboard(board, solution);
                await delay();
            }
        }
        
        return false;
    }
    
    const solved = await solveNQueens(0);
    
    if (solved) {
        updateStep(`N-Queens Complete! Solution found with ${n} queens`);
    } else {
        updateStep('No solution exists for this board size');
    }
}

function isSafe(board, row, col, n) {
    // Check row
    for (let i = 0; i < col; i++) {
        if (board[row][i] === 1) return false;
    }
    
    // Check upper diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
    }
    
    // Check lower diagonal
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
        if (board[i][j] === 1) return false;
    }
    
    return true;
}

function drawChessboard(board, queens) {
    const ctx = state.ctx;
    const canvas = state.canvas;
    const n = board.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const cellSize = Math.min(canvas.width, canvas.height) / (n + 2);
    const offsetX = (canvas.width - cellSize * n) / 2;
    const offsetY = (canvas.height - cellSize * n) / 2;
    
    const lightCell = getCssVar('--bg-tertiary', '#cbd5e1');
    const darkCell = getCssVar('--text-muted', '#64748b');
    const dangerTint = getCssVar('--danger-light', 'rgba(239, 68, 68, 0.3)');
    const queenFill = getCssVar('--viz-compare', '#fbbf24');
    const queenStroke = getCssVar('--warning', '#78350f');

    // Draw board
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const x = offsetX + j * cellSize;
            const y = offsetY + i * cellSize;
            
            ctx.fillStyle = (i + j) % 2 === 0 ? lightCell : darkCell;
            ctx.fillRect(x, y, cellSize, cellSize);
            
            // Draw attacking squares
            if (board[i][j] === 2) {
                ctx.fillStyle = dangerTint;
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    }
    
    // Draw queens
    queens.forEach(queen => {
        const x = offsetX + queen.col * cellSize + cellSize / 2;
        const y = offsetY + queen.row * cellSize + cellSize / 2;
        
        ctx.fillStyle = queenFill;
        ctx.beginPath();
        ctx.arc(x, y, cellSize / 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = queenStroke;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw crown
        ctx.fillStyle = queenStroke;
        ctx.font = `${cellSize / 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Q', x, y);
    });
}

// === DP Table Drawing Helper ===
function drawDPTable(table, labels = [], highlight = -1) {
    const container = elements.dpTable;
    container.innerHTML = '';
    
    if (!table || table.length === 0) return;
    
    const tableElement = document.createElement('table');
    tableElement.className = 'generated-dp-table';

    const normalizedRows = table.map(row => (Array.isArray(row) ? row : [row]));
    const hasRowLabels = normalizedRows.length > 1 && (
        labels.length === normalizedRows.length
        || labels.length === normalizedRows.length + 1
    );
    const captionText = hasRowLabels
        ? (labels.length === normalizedRows.length + 1 ? labels[0] : '')
        : (labels[0] || '');
    const rowLabels = hasRowLabels
        ? (labels.length === normalizedRows.length + 1 ? labels.slice(1) : labels)
        : [];

    if (captionText) {
        const caption = document.createElement('caption');
        caption.textContent = captionText;
        tableElement.appendChild(caption);
    }

    let flatCellIndex = 0;
    normalizedRows.forEach((rowCells, rowIndex) => {
        const tr = document.createElement('tr');

        if (rowLabels[rowIndex]) {
            const th = document.createElement('th');
            th.scope = 'row';
            th.className = 'dp-row-label';
            th.textContent = rowLabels[rowIndex];
            tr.appendChild(th);
        }

        rowCells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell === Infinity ? '∞' : cell;

            if (flatCellIndex === highlight) {
                td.classList.add('current');
            } else if (Number.isFinite(cell) && cell > 0) {
                td.classList.add('filled');
            }

            flatCellIndex++;
            tr.appendChild(td);
        });

        tableElement.appendChild(tr);
    });
    
    container.appendChild(tableElement);
}
// === Algorithm Execution Router ===
async function executeAlgorithm() {
    const algo = state.algorithm;
    
    try {
        switch (algo) {
            // Sorting
            case 'bubble': await bubbleSort(); break;
            case 'selection': await selectionSort(); break;
            case 'insertion': await insertionSort(); break;
            case 'merge': await mergeSort(); break;
            case 'quick': await quickSort(); break;
            case 'heap': await heapSort(); break;
            case 'counting': await countingSort(); break;
            case 'radix': await radixSort(); break;
            case 'shell': await shellSort(); break;
            case 'timsort': await timSort(); break;
            case 'cocktail': await cocktailSort(); break;
            case 'bucket': await bucketSort(); break;
            
            // Searching
            case 'linear': await linearSearch(); break;
            case 'binary': await binarySearch(); break;
            case 'jump': await jumpSearch(); break;
            case 'exponential': await exponentialSearch(); break;
            case 'interpolation': await interpolationSearch(); break;
            case 'ternary': await ternarySearch(); break;
            case 'fibsearch': await fibonacciSearch(); break;
            
            // Graph Algorithms
            case 'bfs': await breadthFirstSearch(); break;
            case 'dfs': await depthFirstSearch(); break;
            case 'bidibfs': await bidirectionalBFS(); break;
            case 'dijkstra': await dijkstraAlgorithm(); break;
            case 'astar': await astarPathfinding(); break;
            case 'bellman': await bellmanFordAlgorithm(); break;
            case 'floyd': await floydWarshallAlgorithm(); break;
            case 'kruskal': await kruskalAlgorithm(); break;
            case 'prim': await primAlgorithm(); break;
            case 'topo': await topologicalSortAlgorithm(); break;
            case 'unionfind': await unionFindVisualization(); break;
            case 'graphcolor': await graphColoringVisualization(); break;
            case 'components': await connectedComponentsVisualization(); break;
            
            // Tree Algorithms
            case 'bst': await binarySearchTree(); break;
            case 'inorder': await inorderTraversal(); break;
            case 'preorder': await preorderTraversal(); break;
            case 'postorder': await postorderTraversal(); break;
            case 'levelorder': await levelOrderTraversal(); break;
            case 'avl': await avlTreeVisualization(); break;
            case 'heaptree': await heapTreeVisualization(); break;
            case 'trie': await trieVisualization(); break;
            
            // Dynamic Programming
            case 'fibonacci': await fibonacciVisualization(); break;
            case 'knapsack': await knapsackVisualization(); break;
            case 'lcs': await lcsVisualization(); break;
            case 'editdist': await editDistanceVisualization(); break;
            case 'matrixchain': await matrixChainVisualization(); break;
            case 'coinchange': await coinChangeVisualization(); break;
            case 'lis': await lisVisualization(); break;
            case 'kadane': await kadaneVisualization(); break;
            
            // String Algorithms
            case 'kmp': await kmpPatternMatching(); break;
            case 'rabinkarp': await rabinKarpPatternMatching(); break;
            case 'zalgo': await zAlgorithmPatternMatching(); break;
            case 'boyermoore': await boyerMoorePatternMatching(); break;
            case 'triesearch': await trieSearchVisualization(); break;
            
            // Computational Geometry
            case 'convexhull': await convexHullVisualization(); break;
            case 'lineintersect': await lineIntersectionVisualization(); break;
            case 'closestpair': await closestPairVisualization(); break;
            
            // NP-Hard Problems
            case 'tsp': await tspHeuristicVisualization(); break;
            case 'subsetsum': await subsetSumVisualization(); break;
            case 'nqueens': await nQueensVisualization(); break;
            
            default:
                updateStep(`${algo} visualization coming soon!`);
        }
        
        if (!state.shouldStop) {
            playCompletionSound();
        }
    } catch (error) {
        if (error.message !== 'Stopped') {
            console.error('Algorithm execution error:', error);
        }
    }
}

// === Analytics ===
function resetAnalytics(keepTimer = false) {
    state.comparisons = 0;
    state.swaps = 0;
    state.operations = 0;
    state.accesses = 0;
    if (!keepTimer) {
        state.startTime = 0;
    }
    updateAnalytics();
}

function updateAnalytics() {
    if (state.isBenchmark) return;

    const estimatedAccesses = state.comparisons * 2 + state.swaps * 2 + state.operations;
    state.accesses = Math.max(state.accesses, estimatedAccesses);

    elements.comparisons.textContent = state.comparisons;
    elements.swaps.textContent = state.swaps;
    elements.operations.textContent = state.operations;
    elements.accesses.textContent = state.accesses;
    
    if (state.startTime > 0) {
        const elapsed = Date.now() - state.startTime;
        elements.executionTime.textContent = `${elapsed}ms`;
    } else {
        elements.executionTime.textContent = '0ms';
    }
    
    const algoData = algorithmDB[state.algorithm];
    if (algoData && algoData.complexity) {
        elements.complexity.textContent = algoData.complexity.average || algoData.complexity.worst;
    }
}

function updateStep(text, progress = null) {
    elements.stepText.textContent = text;
    
    if (progress !== null) {
        const bounded = clampNumber(progress, 0, 100);
        elements.stepProgress.style.width = `${bounded}%`;
    } else if (!state.isRunning && !state.selfTestRunning) {
        elements.stepProgress.style.width = '0%';
    }
}

// === Sound System ===
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioContext = (() => {
    if (!AudioContextClass) return null;
    try {
        return new AudioContextClass();
    } catch (error) {
        return null;
    }
})();

function resumeAudioContextIfNeeded() {
    if (!audioContext || audioContext.state !== 'suspended') return;
    audioContext.resume().catch(() => {
        // Resume can fail before a trusted user gesture.
    });
}

function setupAudioUnlock() {
    if (!audioContext) return;
    const unlock = () => resumeAudioContextIfNeeded();
    document.addEventListener('pointerdown', unlock, { once: true, passive: true });
    document.addEventListener('keydown', unlock, { once: true });
}

function playSound(value) {
    if (state.isBenchmark || !state.soundEnabled || !audioContext) return;
    resumeAudioContextIfNeeded();
    if (audioContext.state !== 'running') return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequency = 200 + value * 5;
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCompletionSound() {
    if (!state.soundEnabled || !audioContext) return;
    resumeAudioContextIfNeeded();
    if (audioContext.state !== 'running') return;
    
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 100);
    });
}

// === Algorithm Info Updates ===
const categoryLabels = {
    sorting: 'Sorting',
    searching: 'Searching',
    graphs: 'Graphs',
    trees: 'Trees',
    dp: 'Dynamic Programming',
    strings: 'String Algorithms',
    geometry: 'Computational Geometry',
    advanced: 'Advanced / NP'
};

const categoryEdgeCases = {
    sorting: [
        'Already sorted input',
        'Reverse sorted input',
        'Duplicate-heavy values',
        'Empty and single-element arrays'
    ],
    searching: [
        'Target absent from input',
        'Target at first or last index',
        'Repeated target values',
        'Empty input / pattern longer than source'
    ],
    graphs: [
        'Disconnected components',
        'Cycles and back-edges',
        'Self-loops / parallel edges',
        'Weighted edge corner cases'
    ],
    trees: [
        'Empty tree and single node tree',
        'Skewed/unbalanced depth',
        'Duplicate key handling',
        'Traversal on sparse branches'
    ],
    dp: [
        'Base-case initialization',
        'Impossible / unreachable states',
        'Large memory footprint tables',
        'Off-by-one indexing boundaries'
    ],
    strings: [
        'Empty text or empty pattern',
        'Pattern larger than text',
        'Overlapping pattern matches',
        'Repeated-character inputs'
    ],
    geometry: [
        'Collinear points',
        'Near-parallel / overlapping lines',
        'Precision and floating-point drift',
        'Degenerate shapes'
    ],
    advanced: [
        'No feasible solution instances',
        'Large search-space explosion',
        'Heuristic quality tradeoffs',
        'Constraint conflict cases'
    ]
};

const categoryCharacteristics = {
    sorting: [
        '<strong>Paradigm:</strong> Comparison / distribution-based sorting',
        '<strong>Goal:</strong> Order values non-decreasing',
        '<strong>Stability:</strong> Depends on algorithm variant',
        '<strong>Tradeoff:</strong> Time vs memory vs stability'
    ],
    searching: [
        '<strong>Paradigm:</strong> Lookup over ordered/unordered data',
        '<strong>Precondition:</strong> Some methods require sorted input',
        '<strong>Output:</strong> Index/location or not found',
        '<strong>Tradeoff:</strong> Preprocessing vs query speed'
    ],
    graphs: [
        '<strong>Representation:</strong> Usually adjacency list/matrix',
        '<strong>Traversal:</strong> BFS/DFS frontier expansion',
        '<strong>Path problems:</strong> May require non-negative weights',
        '<strong>Tradeoff:</strong> Accuracy, speed, and memory'
    ],
    trees: [
        '<strong>Structure:</strong> Hierarchical node relationships',
        '<strong>Traversal:</strong> DFS/BFS tree walks',
        '<strong>Balance:</strong> Performance tied to tree height',
        '<strong>Operations:</strong> Search/insert/delete semantics vary'
    ],
    dp: [
        '<strong>Paradigm:</strong> Optimal substructure + overlap reuse',
        '<strong>State design:</strong> Critical for correctness',
        '<strong>Transition:</strong> Build from solved subproblems',
        '<strong>Tradeoff:</strong> Faster runtime for extra memory'
    ],
    strings: [
        '<strong>Goal:</strong> Efficient pattern / structure matching',
        '<strong>Preprocessing:</strong> Prefix tables or hashes',
        '<strong>Output:</strong> Match indices / existence',
        '<strong>Tradeoff:</strong> Precompute cost vs query speed'
    ],
    geometry: [
        '<strong>Domain:</strong> Planar coordinates and intersections',
        '<strong>Precision:</strong> Floating-point tolerance matters',
        '<strong>Complexity:</strong> Often input-size and ordering dependent',
        '<strong>Tradeoff:</strong> Robustness vs implementation complexity'
    ],
    advanced: [
        '<strong>Problem class:</strong> Often NP-hard/NP-complete',
        '<strong>Approach:</strong> Exact search or approximation/heuristic',
        '<strong>Scale:</strong> Practical methods balance quality and time',
        '<strong>Verification:</strong> Constraint validity is essential'
    ]
};

const algoCategoryMap = new Map(
    Array.from(elements.algoButtons).map(btn => [
        btn.dataset.algo,
        btn.closest('.algo-category')?.dataset.category || 'sorting'
    ])
);

function getAlgorithmCategory(algo = state.algorithm) {
    return algoCategoryMap.get(algo) || state.category;
}

function getCategoryLabel(category) {
    return categoryLabels[category] || category;
}

function toProcedureName(algo, displayName) {
    const source = (displayName || algo || 'algorithm').toLowerCase();
    return source
        .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[^a-z]+/, '')
        .replace(/[^a-z0-9]/g, '')
        || 'algorithm';
}

function buildFallbackPseudocode(algo, algoData, category) {
    const procedureName = toProcedureName(algo, algoData?.name);
    const steps = Array.isArray(algoData?.steps) ? algoData.steps : [];
    const lines = [`procedure ${procedureName}(input)`];

    if (steps.length > 0) {
        steps.forEach((step, index) => {
            lines.push(`    step ${index + 1}: ${step}`);
        });
    } else {
        lines.push(`    // apply ${getCategoryLabel(category).toLowerCase()} strategy`);
        lines.push('    // update state and continue until completion');
    }

    lines.push('end procedure');
    return lines.join('\n');
}

function getAlgorithmMetaPills(algoData, category) {
    const complexity = algoData?.complexity || {};
    const average = complexity.average || complexity.worst || '-';
    const space = complexity.space || '-';
    const pills = [
        `Category: ${getCategoryLabel(category)}`,
        `Average: ${average}`,
        `Space: ${space}`
    ];

    if (Array.isArray(algoData?.steps) && algoData.steps.length > 0) {
        pills.push(`Steps: ${algoData.steps.length}`);
    }

    return pills;
}

function updateAlgorithmInfo() {
    const algoData = algorithmDB[state.algorithm];
    const category = getAlgorithmCategory(state.algorithm);
    
    if (!algoData) {
        elements.algoTitle.textContent = state.algorithm.charAt(0).toUpperCase() + state.algorithm.slice(1);
        if (elements.algoMeta) {
            elements.algoMeta.innerHTML = '';
        }
        elements.algoDescription.textContent = 'Algorithm visualization coming soon!';
        elements.algoSteps.innerHTML = '<li>Step-by-step walkthrough will be added soon.</li>';
        elements.algoUseCases.innerHTML = '<li>Use-case notes will be added soon.</li>';
        elements.bestCase.textContent = '-';
        elements.avgCase.textContent = '-';
        elements.worstCase.textContent = '-';
        elements.spaceCase.textContent = '-';
        elements.perfChar.innerHTML = '<li>No performance notes available yet.</li>';
        elements.edgeCases.innerHTML = '<li>No edge cases documented yet.</li>';
        elements.codeImplementation.textContent = '// Implementation not available yet.';
        elements.pseudocode.textContent = 'Pseudocode not available yet.';
        return;
    }
    
    elements.algoTitle.textContent = algoData.name;
    if (elements.algoMeta) {
        const pills = getAlgorithmMetaPills(algoData, category);
        elements.algoMeta.innerHTML = pills.map(label => `<span class="meta-pill">${label}</span>`).join('');
    }
    elements.algoDescription.textContent = algoData.description;
    
    elements.algoSteps.innerHTML = (algoData.steps && algoData.steps.length)
        ? algoData.steps.map(step => `<li>${step}</li>`).join('')
        : '<li>Step-by-step walkthrough is not available for this algorithm yet.</li>';
    elements.algoUseCases.innerHTML = (algoData.useCases && algoData.useCases.length)
        ? algoData.useCases.map(uc => `<li>${uc}</li>`).join('')
        : '<li>Use-case notes are not available for this algorithm yet.</li>';
    
    if (algoData.complexity && typeof algoData.complexity === 'object') {
        const complexity = algoData.complexity;
        elements.bestCase.textContent = complexity.best || '-';
        elements.avgCase.textContent = complexity.average || complexity.worst || '-';
        elements.worstCase.textContent = complexity.worst || '-';
        elements.spaceCase.textContent = complexity.space || '-';
    } else {
        elements.bestCase.textContent = '-';
        elements.avgCase.textContent = '-';
        elements.worstCase.textContent = '-';
        elements.spaceCase.textContent = '-';
    }
    
    const perfFallback = [...(categoryCharacteristics[category] || ['General performance notes vary by implementation.'])];
    if (algoData.complexity && (algoData.complexity.average || algoData.complexity.worst)) {
        const avgComplexity = algoData.complexity.average || algoData.complexity.worst;
        perfFallback.unshift(`<strong>Typical runtime:</strong> ${avgComplexity}`);
    }

    const perfNotes = (algoData.characteristics && algoData.characteristics.length)
        ? algoData.characteristics
        : perfFallback;
    const edgeNotes = (algoData.edgeCases && algoData.edgeCases.length)
        ? algoData.edgeCases
        : categoryEdgeCases[category] || ['Consider empty input and boundary conditions.'];

    elements.perfChar.innerHTML = perfNotes.map(note => `<li>${note}</li>`).join('');
    elements.edgeCases.innerHTML = edgeNotes.map(note => `<li>${note}</li>`).join('');
    elements.codeImplementation.textContent = algoData.code || '// Implementation not available yet.';
    elements.pseudocode.textContent = algoData.pseudocode
        || buildFallbackPseudocode(state.algorithm, algoData, category);
}

// === Quiz System ===
const quizQuestions = [
    {
        algo: 'bubble',
        question: 'What is the best-case time complexity of Bubble Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
        correct: 0
    },
    {
        algo: 'bubble',
        question: 'Is Bubble Sort a stable sorting algorithm?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on implementation'],
        correct: 0
    },
    {
        algo: 'merge',
        question: 'What is the space complexity of Merge Sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correct: 2
    },
    {
        algo: 'quick',
        question: 'What is the worst-case time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'],
        correct: 2
    },
    {
        algo: 'binary',
        question: 'Binary Search requires the array to be:',
        options: ['Sorted', 'Unsorted', 'Reversed', 'Random'],
        correct: 0
    },
    {
        algo: 'bfs',
        question: 'BFS uses which data structure?',
        options: ['Stack', 'Queue', 'Heap', 'Array'],
        correct: 1
    },
    {
        algo: 'dfs',
        question: 'DFS can be implemented using:',
        options: ['Queue only', 'Stack or recursion', 'Heap', 'Array only'],
        correct: 1
    },
    {
        algo: 'cocktail',
        question: 'Cocktail Shaker Sort differs from Bubble Sort mainly because it:',
        options: ['Scans in both directions', 'Uses recursion', 'Is non-comparison', 'Requires extra arrays'],
        correct: 0
    },
    {
        algo: 'ternary',
        question: 'Ternary Search requires the input array to be:',
        options: ['Sorted', 'Random', 'Hashable', 'Unique only'],
        correct: 0
    },
    {
        algo: 'bidibfs',
        question: 'Bidirectional BFS improves speed by:',
        options: ['Searching from source and target simultaneously', 'Using edge weights', 'Using recursion only', 'Skipping visited checks'],
        correct: 0
    },
    {
        algo: 'coinchange',
        question: 'In min-coin DP, unreachable states are initialized as:',
        options: ['Infinity', '0', '-1', '1'],
        correct: 0
    },
    {
        algo: 'zalgo',
        question: 'Z[i] in the Z algorithm represents:',
        options: ['Longest prefix match starting at i', 'Hash at index i', 'Suffix length ending at i', 'Character frequency at i'],
        correct: 0
    },
    {
        algo: 'subsetsum',
        question: 'Subset Sum DP table usually stores:',
        options: ['Boolean reachability states', 'Only indices', 'Edge weights', 'Heap priorities'],
        correct: 0
    },
    {
        algo: 'bucket',
        question: 'Bucket Sort performs best when input values are:',
        options: ['Roughly uniformly distributed', 'Reverse sorted only', 'All distinct powers of two', 'Only negative integers'],
        correct: 0
    },
    {
        algo: 'fibsearch',
        question: 'Fibonacci Search requires the input array to be:',
        options: ['Sorted', 'Unique only', 'Hash-mapped', 'Binary tree ordered'],
        correct: 0
    },
    {
        algo: 'components',
        question: 'Connected Components on an undirected graph is typically solved by:',
        options: ['Repeated BFS/DFS from unvisited nodes', 'Single edge relaxation pass', 'Heap sort on node ids', 'Matrix determinant'],
        correct: 0
    },
    {
        algo: 'lis',
        question: 'In O(n^2) LIS DP, dp[i] usually represents:',
        options: ['Length of LIS ending at index i', 'Number of increasing pairs before i', 'Minimum value up to i', 'Prefix sum up to i'],
        correct: 0
    },
    {
        algo: 'kadane',
        question: 'Kadane\'s algorithm tracks:',
        options: ['Best subarray sum ending at each position', 'All subset sums', 'Only positive numbers', 'Two sorted halves'],
        correct: 0
    },
    {
        algo: 'boyermoore',
        question: 'Boyer-Moore (bad character rule) compares pattern characters:',
        options: ['From right to left', 'From left to right', 'Randomly', 'In parallel halves'],
        correct: 0
    },
    {
        algo: 'closestpair',
        question: 'The brute-force closest pair algorithm checks:',
        options: ['All point pairs', 'Only neighboring points by x', 'Only hull points', 'Random point subsets'],
        correct: 0
    }
];

let currentQuiz = null;

function loadQuiz() {
    const relevantQuestions = quizQuestions.filter(q => q.algo === state.algorithm);
    
    if (relevantQuestions.length === 0) {
        currentQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    } else {
        currentQuiz = relevantQuestions[Math.floor(Math.random() * relevantQuestions.length)];
    }
    
    elements.quizQuestion.textContent = currentQuiz.question;
    
    const optionButtons = document.querySelectorAll('.quiz-option');
    optionButtons.forEach((btn, idx) => {
        btn.textContent = currentQuiz.options[idx];
        btn.className = 'quiz-option';
        btn.disabled = false;
        btn.onclick = () => checkQuizAnswer(idx);
    });
    
    elements.quizFeedback.classList.add('hidden');
    elements.nextQuizBtn.classList.add('hidden');
}

function checkQuizAnswer(selected) {
    const optionButtons = document.querySelectorAll('.quiz-option');
    const correct = currentQuiz.correct;
    
    state.quizAttempted++;
    
    optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correct) {
            btn.classList.add('correct');
        } else if (idx === selected) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === correct) {
        state.quizCorrect++;
        elements.quizFeedback.textContent = 'Correct! Well done.';
        elements.quizFeedback.className = 'quiz-feedback correct';
    } else {
        elements.quizFeedback.textContent = `Incorrect. The correct answer is: ${currentQuiz.options[correct]}`;
        elements.quizFeedback.className = 'quiz-feedback incorrect';
    }
    
    elements.quizFeedback.classList.remove('hidden');
    elements.nextQuizBtn.classList.remove('hidden');
    
    updateQuizStats();
}

function updateQuizStats() {
    elements.quizCorrect.textContent = state.quizCorrect;
    elements.quizAttempted.textContent = state.quizAttempted;
    
    const accuracy = state.quizAttempted > 0
        ? Math.round((state.quizCorrect / state.quizAttempted) * 100)
        : 0;
    
    elements.quizAccuracy.textContent = `${accuracy}%`;
}

// === Self-Test System ===
function setSelfTestStatus(text, tone = 'idle') {
    if (!elements.selfTestStatus) return;
    elements.selfTestStatus.textContent = text;
    elements.selfTestStatus.className = `self-test-status ${tone}`;
}

function renderSelfTestResults(results) {
    if (!elements.selfTestResults) return;
    elements.selfTestResults.innerHTML = '';

    results.forEach(result => {
        const li = document.createElement('li');
        li.className = `self-test-item ${result.passed ? 'pass' : 'fail'}`;

        const name = document.createElement('span');
        name.className = 'self-test-name';
        name.textContent = result.name;

        const detail = document.createElement('span');
        detail.className = 'self-test-detail';
        detail.textContent = result.detail;

        li.appendChild(name);
        li.appendChild(detail);
        elements.selfTestResults.appendChild(li);
    });
}

function updateSelfTestSummary(passed, failed, elapsedMs) {
    if (elements.selfTestPass) {
        elements.selfTestPass.textContent = String(passed);
    }
    if (elements.selfTestFail) {
        elements.selfTestFail.textContent = String(failed);
    }
    if (elements.selfTestTime) {
        elements.selfTestTime.textContent = `${elapsedMs}ms`;
    }
}

function isSortedAscending(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) return false;
    }
    return true;
}

function sameMultiset(a, b) {
    if (a.length !== b.length) return false;
    const freq = new Map();
    a.forEach(value => freq.set(value, (freq.get(value) || 0) + 1));
    for (const value of b) {
        if (!freq.has(value)) return false;
        const next = freq.get(value) - 1;
        if (next === 0) freq.delete(value);
        else freq.set(value, next);
    }
    return freq.size === 0;
}

function expect(condition, message) {
    if (!condition) throw new Error(message);
}

function expectEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message} (expected ${expected}, got ${actual})`);
    }
}

function expectArrayEqual(actual, expected, message) {
    if (actual.length !== expected.length) {
        throw new Error(`${message} (length mismatch ${actual.length} vs ${expected.length})`);
    }
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) {
            throw new Error(`${message} (diff at index ${i}: ${actual[i]} vs ${expected[i]})`);
        }
    }
}

function linearSearchPure(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

function binarySearchPure(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

function jumpSearchPure(arr, target) {
    const n = arr.length;
    const step = Math.max(1, Math.floor(Math.sqrt(n)));
    let prev = 0;
    let curr = step;

    while (prev < n && arr[Math.min(curr, n) - 1] < target) {
        prev = curr;
        curr += step;
        if (prev >= n) return -1;
    }

    for (let i = prev; i < Math.min(curr, n); i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}

function exponentialSearchPure(arr, target) {
    if (!arr.length) return -1;
    if (arr[0] === target) return 0;

    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        i *= 2;
    }

    let left = Math.floor(i / 2);
    let right = Math.min(i, arr.length - 1);
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

function interpolationSearchPure(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (arr[high] === arr[low]) {
            return arr[low] === target ? low : -1;
        }

        const pos = low + Math.floor(
            ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
        );
        const probe = Math.max(low, Math.min(high, pos));

        if (arr[probe] === target) return probe;
        if (arr[probe] < target) low = probe + 1;
        else high = probe - 1;
    }

    return -1;
}

function ternarySearchPure(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const third = Math.floor((right - left) / 3);
        const mid1 = left + third;
        const mid2 = right - third;

        if (arr[mid1] === target) return mid1;
        if (arr[mid2] === target) return mid2;

        if (target < arr[mid1]) right = mid1 - 1;
        else if (target > arr[mid2]) left = mid2 + 1;
        else {
            left = mid1 + 1;
            right = mid2 - 1;
        }
    }
    return -1;
}

function fibonacciSearchPure(arr, target) {
    let fibMm2 = 0;
    let fibMm1 = 1;
    let fibM = fibMm1 + fibMm2;

    while (fibM < arr.length) {
        fibMm2 = fibMm1;
        fibMm1 = fibM;
        fibM = fibMm1 + fibMm2;
    }

    let offset = -1;
    while (fibM > 1) {
        const i = Math.min(offset + fibMm2, arr.length - 1);
        if (arr[i] < target) {
            fibM = fibMm1;
            fibMm1 = fibMm2;
            fibMm2 = fibM - fibMm1;
            offset = i;
        } else if (arr[i] > target) {
            fibM = fibMm2;
            fibMm1 = fibMm1 - fibMm2;
            fibMm2 = fibM - fibMm1;
        } else {
            return i;
        }
    }

    if (fibMm1 && arr[offset + 1] === target) return offset + 1;
    return -1;
}

function coinChangePure(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++) {
        for (const coin of coins) {
            if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        }
    }
    return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}

function lisLengthPure(nums) {
    if (!nums.length) return 0;
    const dp = new Array(nums.length).fill(1);
    let best = 1;
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}

function kadanePure(nums) {
    if (!nums.length) return { maxSum: 0, start: -1, end: -1 };

    let currentSum = nums[0];
    let bestSum = nums[0];
    let currentStart = 0;
    let bestStart = 0;
    let bestEnd = 0;

    for (let i = 1; i < nums.length; i++) {
        if (currentSum + nums[i] < nums[i]) {
            currentSum = nums[i];
            currentStart = i;
        } else {
            currentSum += nums[i];
        }

        if (currentSum > bestSum) {
            bestSum = currentSum;
            bestStart = currentStart;
            bestEnd = i;
        }
    }

    return { maxSum: bestSum, start: bestStart, end: bestEnd };
}

function subsetSumPure(nums, target) {
    const n = nums.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(false));
    for (let i = 0; i <= n; i++) dp[i][0] = true;
    for (let i = 1; i <= n; i++) {
        for (let sum = 1; sum <= target; sum++) {
            dp[i][sum] = dp[i - 1][sum];
            if (sum >= nums[i - 1]) {
                dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
            }
        }
    }
    return dp[n][target];
}

function lcsLengthPure(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

function editDistancePure(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function matrixChainPure(dims) {
    const n = dims.length - 1;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            for (let k = i; k < j; k++) {
                const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                if (cost < dp[i][j]) dp[i][j] = cost;
            }
        }
    }
    return dp[0][n - 1];
}

function knapsackPure(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}

function kmpSearchPure(text, pattern) {
    if (!pattern.length) return [];
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    for (let i = 1; i < pattern.length;) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else if (len !== 0) {
            len = lps[len - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }

    const matches = [];
    let i = 0;
    let j = 0;
    while (i < text.length) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        if (j === pattern.length) {
            matches.push(i - j);
            j = lps[j - 1];
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }
    return matches;
}

function rabinKarpPure(text, pattern) {
    if (!pattern.length || pattern.length > text.length) return [];
    const d = 256;
    const q = 101;
    const m = pattern.length;
    const n = text.length;
    let pHash = 0;
    let tHash = 0;
    let h = 1;
    const matches = [];

    for (let i = 0; i < m - 1; i++) h = (h * d) % q;
    for (let i = 0; i < m; i++) {
        pHash = (d * pHash + pattern.charCodeAt(i)) % q;
        tHash = (d * tHash + text.charCodeAt(i)) % q;
    }

    for (let i = 0; i <= n - m; i++) {
        if (pHash === tHash && text.slice(i, i + m) === pattern) {
            matches.push(i);
        }
        if (i < n - m) {
            tHash = (d * (tHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
            if (tHash < 0) tHash += q;
        }
    }
    return matches;
}

function zSearchPure(text, pattern) {
    if (!pattern.length) return [];
    const combined = `${pattern}$${text}`;
    const z = new Array(combined.length).fill(0);
    const matches = [];
    let left = 0;
    let right = 0;

    for (let i = 1; i < combined.length; i++) {
        if (i <= right) {
            z[i] = Math.min(right - i + 1, z[i - left]);
        }
        while (i + z[i] < combined.length && combined[z[i]] === combined[i + z[i]]) {
            z[i]++;
        }
        if (i + z[i] - 1 > right) {
            left = i;
            right = i + z[i] - 1;
        }
        if (z[i] === pattern.length) {
            const idx = i - pattern.length - 1;
            if (idx >= 0) matches.push(idx);
        }
    }
    return matches;
}

function boyerMooreBadCharPure(text, pattern) {
    if (!pattern.length || pattern.length > text.length) return [];
    const m = pattern.length;
    const n = text.length;
    const last = {};
    for (let i = 0; i < m; i++) last[pattern[i]] = i;

    const matches = [];
    let shift = 0;
    while (shift <= n - m) {
        let j = m - 1;
        while (j >= 0 && pattern[j] === text[shift + j]) j--;
        if (j < 0) {
            matches.push(shift);
            shift += shift + m < n ? m - (last[text[shift + m]] ?? -1) : 1;
        } else {
            shift += Math.max(1, j - (last[text[shift + j]] ?? -1));
        }
    }
    return matches;
}

function connectedComponentsCountPure(nodeCount, edges) {
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([u, v]) => {
        adj[u].push(v);
        adj[v].push(u);
    });

    const visited = new Array(nodeCount).fill(false);
    let components = 0;

    for (let start = 0; start < nodeCount; start++) {
        if (visited[start]) continue;
        components++;
        const stack = [start];
        visited[start] = true;
        while (stack.length) {
            const node = stack.pop();
            for (const next of adj[node]) {
                if (!visited[next]) {
                    visited[next] = true;
                    stack.push(next);
                }
            }
        }
    }
    return components;
}

function closestPairBrutePure(points) {
    let best = Infinity;
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
            if (d < best) best = d;
        }
    }
    return best;
}

function solveNQueensPure(n) {
    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();
    const placement = [];

    function backtrack(row) {
        if (row === n) return true;
        for (let col = 0; col < n; col++) {
            const d1 = row - col;
            const d2 = row + col;
            if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) continue;
            cols.add(col);
            diag1.add(d1);
            diag2.add(d2);
            placement.push({ row, col });
            if (backtrack(row + 1)) return true;
            placement.pop();
            cols.delete(col);
            diag1.delete(d1);
            diag2.delete(d2);
        }
        return false;
    }

    return backtrack(0) ? placement : [];
}

function tspNearestNeighborPure(cities) {
    const visited = new Set([0]);
    const tour = [0];
    let total = 0;

    while (tour.length < cities.length) {
        const current = tour[tour.length - 1];
        let best = -1;
        let bestDist = Infinity;
        for (let i = 0; i < cities.length; i++) {
            if (visited.has(i)) continue;
            const d = Math.hypot(cities[current].x - cities[i].x, cities[current].y - cities[i].y);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        }
        visited.add(best);
        tour.push(best);
        total += bestDist;
    }

    total += Math.hypot(
        cities[tour[tour.length - 1]].x - cities[tour[0]].x,
        cities[tour[tour.length - 1]].y - cities[tour[0]].y
    );

    return { tour, total };
}

function buildAdjacencyListPure(nodeCount, edges, directed = false) {
    const adj = Array.from({ length: nodeCount }, () => []);
    edges.forEach(([from, to]) => {
        if (!Number.isInteger(from) || !Number.isInteger(to)) return;
        if (from < 0 || from >= nodeCount || to < 0 || to >= nodeCount) return;
        adj[from].push(to);
        if (!directed) {
            adj[to].push(from);
        }
    });
    adj.forEach(neighbors => neighbors.sort((a, b) => a - b));
    return adj;
}

function bfsOrderPure(nodeCount, edges, start = 0, directed = false) {
    const adj = buildAdjacencyListPure(nodeCount, edges, directed);
    const visited = new Array(nodeCount).fill(false);
    const order = [];
    const queue = [start];
    visited[start] = true;

    while (queue.length) {
        const node = queue.shift();
        order.push(node);
        for (const next of adj[node]) {
            if (visited[next]) continue;
            visited[next] = true;
            queue.push(next);
        }
    }
    return order;
}

function dfsOrderPure(nodeCount, edges, start = 0, directed = false) {
    const adj = buildAdjacencyListPure(nodeCount, edges, directed);
    const visited = new Array(nodeCount).fill(false);
    const order = [];
    const stack = [start];

    while (stack.length) {
        const node = stack.pop();
        if (visited[node]) continue;
        visited[node] = true;
        order.push(node);

        for (let i = adj[node].length - 1; i >= 0; i--) {
            const next = adj[node][i];
            if (!visited[next]) stack.push(next);
        }
    }
    return order;
}

function bidirectionalDistancePure(nodeCount, edges, source, target, directed = false) {
    if (source === target) return 0;

    const adj = buildAdjacencyListPure(nodeCount, edges, directed);
    const distFromSource = new Array(nodeCount).fill(-1);
    const distFromTarget = new Array(nodeCount).fill(-1);
    const queueSource = [source];
    const queueTarget = [target];

    distFromSource[source] = 0;
    distFromTarget[target] = 0;

    const expand = (queue, ownDist, otherDist) => {
        const levelSize = queue.length;
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            for (const next of adj[node]) {
                if (ownDist[next] !== -1) continue;
                ownDist[next] = ownDist[node] + 1;
                if (otherDist[next] !== -1) {
                    return ownDist[next] + otherDist[next];
                }
                queue.push(next);
            }
        }
        return -1;
    };

    while (queueSource.length && queueTarget.length) {
        const hitFromSource = expand(queueSource, distFromSource, distFromTarget);
        if (hitFromSource !== -1) return hitFromSource;

        const hitFromTarget = expand(queueTarget, distFromTarget, distFromSource);
        if (hitFromTarget !== -1) return hitFromTarget;
    }

    return -1;
}

function dijkstraPure(nodeCount, weightedEdges, start = 0, directed = false) {
    const adj = Array.from({ length: nodeCount }, () => []);
    weightedEdges.forEach(([from, to, weight]) => {
        if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) return;
        const w = Number.isFinite(weight) ? weight : 1;
        adj[from].push({ to, weight: w });
        if (!directed) {
            adj[to].push({ to: from, weight: w });
        }
    });

    const dist = new Array(nodeCount).fill(Infinity);
    const used = new Array(nodeCount).fill(false);
    dist[start] = 0;

    for (let step = 0; step < nodeCount; step++) {
        let current = -1;
        let best = Infinity;
        for (let i = 0; i < nodeCount; i++) {
            if (!used[i] && dist[i] < best) {
                best = dist[i];
                current = i;
            }
        }
        if (current === -1) break;
        used[current] = true;

        for (const edge of adj[current]) {
            if (dist[current] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[current] + edge.weight;
            }
        }
    }

    return dist;
}

function bellmanFordPure(nodeCount, weightedEdges, start = 0, directed = false) {
    const normalizedEdges = [];
    weightedEdges.forEach(([from, to, weight]) => {
        if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) return;
        const w = Number.isFinite(weight) ? weight : 1;
        normalizedEdges.push([from, to, w]);
        if (!directed) normalizedEdges.push([to, from, w]);
    });

    const dist = new Array(nodeCount).fill(Infinity);
    dist[start] = 0;

    for (let i = 0; i < nodeCount - 1; i++) {
        let changed = false;
        for (const [from, to, weight] of normalizedEdges) {
            if (dist[from] === Infinity) continue;
            if (dist[from] + weight < dist[to]) {
                dist[to] = dist[from] + weight;
                changed = true;
            }
        }
        if (!changed) break;
    }

    let hasNegativeCycle = false;
    for (const [from, to, weight] of normalizedEdges) {
        if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
            hasNegativeCycle = true;
            break;
        }
    }

    return { dist, hasNegativeCycle };
}

function floydWarshallPure(nodeCount, weightedEdges, directed = false) {
    const dist = Array.from({ length: nodeCount }, () => new Array(nodeCount).fill(Infinity));
    for (let i = 0; i < nodeCount; i++) {
        dist[i][i] = 0;
    }

    weightedEdges.forEach(([from, to, weight]) => {
        if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) return;
        const w = Number.isFinite(weight) ? weight : 1;
        dist[from][to] = Math.min(dist[from][to], w);
        if (!directed) {
            dist[to][from] = Math.min(dist[to][from], w);
        }
    });

    for (let k = 0; k < nodeCount; k++) {
        for (let i = 0; i < nodeCount; i++) {
            for (let j = 0; j < nodeCount; j++) {
                if (dist[i][k] === Infinity || dist[k][j] === Infinity) continue;
                const throughK = dist[i][k] + dist[k][j];
                if (throughK < dist[i][j]) dist[i][j] = throughK;
            }
        }
    }

    return dist;
}

function topologicalSortPure(nodeCount, directedEdges) {
    const adj = Array.from({ length: nodeCount }, () => []);
    const indegree = new Array(nodeCount).fill(0);

    directedEdges.forEach(([from, to]) => {
        if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) return;
        adj[from].push(to);
        indegree[to]++;
    });

    const queue = [];
    for (let i = 0; i < nodeCount; i++) {
        if (indegree[i] === 0) queue.push(i);
    }
    queue.sort((a, b) => a - b);

    const order = [];
    while (queue.length) {
        const node = queue.shift();
        order.push(node);
        for (const next of adj[node]) {
            indegree[next]--;
            if (indegree[next] === 0) {
                queue.push(next);
                queue.sort((a, b) => a - b);
            }
        }
    }
    return order;
}

function mstWeightKruskalPure(nodeCount, weightedEdges) {
    const parent = Array.from({ length: nodeCount }, (_, i) => i);
    const rank = new Array(nodeCount).fill(0);
    const sortedEdges = [...weightedEdges].sort((a, b) => a[2] - b[2]);
    let total = 0;
    let used = 0;

    const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    };

    const union = (a, b) => {
        let rootA = find(a);
        let rootB = find(b);
        if (rootA === rootB) return false;

        if (rank[rootA] < rank[rootB]) {
            [rootA, rootB] = [rootB, rootA];
        }
        parent[rootB] = rootA;
        if (rank[rootA] === rank[rootB]) rank[rootA]++;
        return true;
    };

    for (const [from, to, weight] of sortedEdges) {
        if (union(from, to)) {
            total += weight;
            used++;
            if (used === nodeCount - 1) break;
        }
    }

    return used === nodeCount - 1 ? total : Infinity;
}

function mstWeightPrimPure(nodeCount, weightedEdges) {
    if (nodeCount === 0) return 0;

    const adj = Array.from({ length: nodeCount }, () => []);
    weightedEdges.forEach(([from, to, weight]) => {
        if (from < 0 || to < 0 || from >= nodeCount || to >= nodeCount) return;
        adj[from].push({ to, weight });
        adj[to].push({ to: from, weight });
    });

    const inMST = new Array(nodeCount).fill(false);
    const minEdge = new Array(nodeCount).fill(Infinity);
    minEdge[0] = 0;
    let total = 0;

    for (let i = 0; i < nodeCount; i++) {
        let node = -1;
        for (let j = 0; j < nodeCount; j++) {
            if (!inMST[j] && (node === -1 || minEdge[j] < minEdge[node])) {
                node = j;
            }
        }
        if (node === -1 || minEdge[node] === Infinity) return Infinity;
        inMST[node] = true;
        total += minEdge[node];

        for (const edge of adj[node]) {
            if (!inMST[edge.to] && edge.weight < minEdge[edge.to]) {
                minEdge[edge.to] = edge.weight;
            }
        }
    }

    return total;
}

function greedyColoringPure(nodeCount, edges) {
    const adj = buildAdjacencyListPure(nodeCount, edges, false);
    const colors = new Array(nodeCount).fill(-1);

    for (let node = 0; node < nodeCount; node++) {
        const used = new Set();
        for (const neighbor of adj[node]) {
            if (colors[neighbor] !== -1) used.add(colors[neighbor]);
        }
        let color = 0;
        while (used.has(color)) color++;
        colors[node] = color;
    }
    return colors;
}

function isValidColoringPure(edges, colors) {
    return edges.every(([from, to]) => colors[from] !== colors[to]);
}

function buildBSTPure(values) {
    const insert = (node, value) => {
        if (!node) return { value, left: null, right: null };
        if (value < node.value) node.left = insert(node.left, value);
        else node.right = insert(node.right, value);
        return node;
    };

    let root = null;
    values.forEach(value => {
        root = insert(root, value);
    });
    return root;
}

function inorderPure(node, out = []) {
    if (!node) return out;
    inorderPure(node.left, out);
    out.push(node.value);
    inorderPure(node.right, out);
    return out;
}

function preorderPure(node, out = []) {
    if (!node) return out;
    out.push(node.value);
    preorderPure(node.left, out);
    preorderPure(node.right, out);
    return out;
}

function postorderPure(node, out = []) {
    if (!node) return out;
    postorderPure(node.left, out);
    postorderPure(node.right, out);
    out.push(node.value);
    return out;
}

function levelOrderPure(node) {
    if (!node) return [];
    const queue = [node];
    const out = [];
    while (queue.length) {
        const current = queue.shift();
        out.push(current.value);
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
    }
    return out;
}

function buildTriePure(words) {
    const root = { children: Object.create(null), isEnd: false };
    for (const word of words) {
        let node = root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = { children: Object.create(null), isEnd: false };
            }
            node = node.children[char];
        }
        node.isEnd = true;
    }
    return root;
}

function trieContainsPure(root, word) {
    let node = root;
    for (const char of word) {
        if (!node.children[char]) return false;
        node = node.children[char];
    }
    return !!node.isEnd;
}

function convexHullSizePure(points) {
    if (points.length <= 1) return points.length;

    const sorted = [...points].sort((a, b) => {
        if (a.x !== b.x) return a.x - b.x;
        return a.y - b.y;
    });

    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }

    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
        const point = sorted[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }

    lower.pop();
    upper.pop();
    return lower.concat(upper).length;
}

function collectAlgorithmMetadataIssues() {
    const issues = [];
    Object.entries(algorithmDB).forEach(([id, data]) => {
        if (!data || typeof data !== 'object') {
            issues.push(`${id}: missing algorithm metadata object`);
            return;
        }

        if (!data.name || typeof data.name !== 'string') {
            issues.push(`${id}: missing display name`);
        }
        if (!data.description || typeof data.description !== 'string') {
            issues.push(`${id}: missing description`);
        }
        if (!Array.isArray(data.steps) || data.steps.length === 0) {
            issues.push(`${id}: missing steps`);
        }
        if (!Array.isArray(data.useCases) || data.useCases.length === 0) {
            issues.push(`${id}: missing use-cases`);
        }
        if (!data.complexity || typeof data.complexity !== 'object') {
            issues.push(`${id}: missing complexity block`);
        }
        if (!data.code || typeof data.code !== 'string') {
            issues.push(`${id}: missing code sample`);
        }
    });
    return issues;
}

function getSelfTestCases() {
    const baseSortData = [42, 7, 13, 99, 1, 37, 58, 18, 73, 2, 42, 16, 8, 90, 27, 11, 64, 5, 33, 21];
    const nearlySorted = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10, 12, 11, 13, 15, 14];
    const searchData = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const expectedSortedBase = [...baseSortData].sort((a, b) => a - b);
    const expectedSortedNearly = [...nearlySorted].sort((a, b) => a - b);

    const sortingChecks = [
        { algo: 'bubble', label: 'Bubble Sort output integrity', data: baseSortData },
        { algo: 'selection', label: 'Selection Sort output integrity', data: baseSortData },
        { algo: 'insertion', label: 'Insertion Sort output integrity', data: baseSortData },
        { algo: 'merge', label: 'Merge Sort output integrity', data: baseSortData },
        { algo: 'quick', label: 'Quick Sort output integrity', data: baseSortData },
        { algo: 'heap', label: 'Heap Sort output integrity', data: baseSortData },
        { algo: 'counting', label: 'Counting Sort output integrity', data: baseSortData },
        { algo: 'radix', label: 'Radix Sort output integrity', data: baseSortData },
        { algo: 'shell', label: 'Shell Sort output integrity', data: nearlySorted },
        { algo: 'timsort', label: 'TimSort output integrity', data: nearlySorted },
        { algo: 'cocktail', label: 'Cocktail Sort output integrity', data: nearlySorted },
        { algo: 'bucket', label: 'Bucket Sort output integrity', data: baseSortData }
    ];

    const tests = sortingChecks.map(check => ({
        name: `Sorting: ${check.label}`,
        run: async () => {
            const expected = check.data === baseSortData ? expectedSortedBase : expectedSortedNearly;
            const result = await runAlgorithmForComparison(check.algo, [...check.data], { returnOutput: true });
            const output = result.output || [];
            expect(isSortedAscending(output), 'Array is not sorted in ascending order');
            expect(sameMultiset(output, check.data), 'Sorted output does not preserve multiset');
            expectArrayEqual(output, expected, 'Sorted output differs from expected ordering');
            return `${check.algo} sorted ${output.length} items in ${result.time}ms`;
        }
    }));

    tests.push(
        {
            name: 'Searching: Linear Search finds target',
            run: () => {
                expectEqual(linearSearchPure(searchData, 11), 5, 'Linear Search target index mismatch');
                return 'target=11 at index 5';
            }
        },
        {
            name: 'Searching: Binary Search absent target',
            run: () => {
                expectEqual(binarySearchPure(searchData, 12), -1, 'Binary Search should return -1 for absent target');
                return 'absent target handled';
            }
        },
        {
            name: 'Searching: Jump Search finds target',
            run: () => {
                expectEqual(jumpSearchPure(searchData, 15), 7, 'Jump Search target index mismatch');
                return 'target=15 at index 7';
            }
        },
        {
            name: 'Searching: Exponential Search finds target',
            run: () => {
                expectEqual(exponentialSearchPure(searchData, 19), 9, 'Exponential Search target index mismatch');
                return 'target=19 at index 9';
            }
        },
        {
            name: 'Searching: Interpolation Search finds target',
            run: () => {
                expectEqual(interpolationSearchPure(searchData, 7), 3, 'Interpolation Search target index mismatch');
                return 'target=7 at index 3';
            }
        },
        {
            name: 'Searching: Ternary Search finds target',
            run: () => {
                expectEqual(ternarySearchPure(searchData, 17), 8, 'Ternary Search target index mismatch');
                return 'target=17 at index 8';
            }
        },
        {
            name: 'Searching: Fibonacci Search finds target',
            run: () => {
                expectEqual(fibonacciSearchPure(searchData, 13), 6, 'Fibonacci Search target index mismatch');
                return 'target=13 at index 6';
            }
        },
        {
            name: 'Graphs: BFS traversal order baseline',
            run: () => {
                const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]];
                const order = bfsOrderPure(6, edges, 0, false);
                expectArrayEqual(order, [0, 1, 2, 3, 4, 5], 'BFS traversal order mismatch');
                return `order=[${order.join(', ')}]`;
            }
        },
        {
            name: 'Graphs: DFS traversal reaches all connected nodes',
            run: () => {
                const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [4, 5]];
                const order = dfsOrderPure(6, edges, 0, false);
                expectEqual(order.length, 6, 'DFS should visit all nodes');
                expect(new Set(order).size === 6, 'DFS visited duplicate nodes');
                return `visited=${order.length}`;
            }
        },
        {
            name: 'Graphs: Bidirectional BFS shortest distance',
            run: () => {
                const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 4]];
                const distance = bidirectionalDistancePure(6, edges, 0, 4, false);
                expectEqual(distance, 3, 'Bidirectional BFS distance mismatch');
                return `distance=${distance}`;
            }
        },
        {
            name: 'Graphs: Dijkstra shortest paths',
            run: () => {
                const weighted = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5]];
                const dist = dijkstraPure(4, weighted, 0, false);
                expectEqual(dist[3], 4, 'Dijkstra distance to node 3 mismatch');
                return `dist(0->3)=${dist[3]}`;
            }
        },
        {
            name: 'Graphs: Bellman-Ford shortest paths',
            run: () => {
                const weighted = [[0, 1, 4], [0, 2, 5], [1, 2, -2], [2, 3, 3]];
                const result = bellmanFordPure(4, weighted, 0, true);
                expect(!result.hasNegativeCycle, 'Bellman-Ford falsely detected a negative cycle');
                expectEqual(result.dist[3], 5, 'Bellman-Ford distance to node 3 mismatch');
                return `dist(0->3)=${result.dist[3]}`;
            }
        },
        {
            name: 'Graphs: Floyd-Warshall all-pairs distance',
            run: () => {
                const weighted = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5]];
                const dist = floydWarshallPure(4, weighted, false);
                expectEqual(dist[0][3], 4, 'Floyd-Warshall distance mismatch');
                return `dist(0->3)=${dist[0][3]}`;
            }
        },
        {
            name: 'Graphs: Topological Sort respects edge order',
            run: () => {
                const edges = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
                const order = topologicalSortPure(6, edges);
                expectEqual(order.length, 6, 'Topological sort should include all nodes');
                const pos = new Map(order.map((node, idx) => [node, idx]));
                edges.forEach(([from, to]) => {
                    expect(pos.get(from) < pos.get(to), `Invalid topo order for edge ${from}->${to}`);
                });
                return `order=[${order.join(', ')}]`;
            }
        },
        {
            name: 'Graphs: Kruskal and Prim MST weights agree',
            run: () => {
                const weighted = [[0, 1, 4], [0, 2, 3], [1, 2, 1], [1, 3, 2], [2, 3, 4], [3, 4, 2], [4, 5, 6]];
                const kruskalWeight = mstWeightKruskalPure(6, weighted);
                const primWeight = mstWeightPrimPure(6, weighted);
                expectEqual(kruskalWeight, primWeight, 'MST weights mismatch between Kruskal and Prim');
                return `mst weight=${kruskalWeight}`;
            }
        },
        {
            name: 'Graphs: Union-Find connectivity checks',
            run: () => {
                const parent = Array.from({ length: 6 }, (_, i) => i);
                const rank = new Array(6).fill(0);

                const find = (x) => {
                    if (parent[x] !== x) parent[x] = find(parent[x]);
                    return parent[x];
                };
                const union = (a, b) => {
                    let rootA = find(a);
                    let rootB = find(b);
                    if (rootA === rootB) return;
                    if (rank[rootA] < rank[rootB]) {
                        [rootA, rootB] = [rootB, rootA];
                    }
                    parent[rootB] = rootA;
                    if (rank[rootA] === rank[rootB]) rank[rootA]++;
                };

                union(0, 1);
                union(1, 2);
                union(3, 4);
                expect(find(0) === find(2), '0 and 2 should be connected');
                expect(find(0) !== find(4), '0 and 4 should be disconnected');
                union(2, 4);
                expect(find(1) === find(3), '1 and 3 should be connected after union');
                return 'union-find connectivity validated';
            }
        },
        {
            name: 'Graphs: Greedy coloring validity',
            run: () => {
                const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]];
                const colors = greedyColoringPure(5, edges);
                expect(isValidColoringPure(edges, colors), 'Coloring contains adjacent conflict');
                return `colors=${Math.max(...colors) + 1}`;
            }
        },
        {
            name: 'Graphs: Connected Components count',
            run: () => {
                const count = connectedComponentsCountPure(7, [[0, 1], [1, 2], [3, 4], [5, 6]]);
                expectEqual(count, 3, 'Connected components count mismatch');
                return 'component count = 3';
            }
        },
        {
            name: 'Trees: BST traversal consistency',
            run: () => {
                const values = [50, 30, 70, 20, 40, 60, 80];
                const root = buildBSTPure(values);
                const inorder = inorderPure(root);
                const preorder = preorderPure(root);
                const postorder = postorderPure(root);
                const level = levelOrderPure(root);

                expectArrayEqual(inorder, [20, 30, 40, 50, 60, 70, 80], 'BST inorder mismatch');
                expectEqual(preorder.length, values.length, 'BST preorder length mismatch');
                expectEqual(postorder.length, values.length, 'BST postorder length mismatch');
                expectEqual(level.length, values.length, 'BST level-order length mismatch');
                return 'inorder/preorder/postorder/level-order validated';
            }
        },
        {
            name: 'Trees: Trie insertion and search',
            run: () => {
                const trie = buildTriePure(['cat', 'car', 'dog', 'dove']);
                expect(trieContainsPure(trie, 'cat'), 'Trie should contain "cat"');
                expect(trieContainsPure(trie, 'dog'), 'Trie should contain "dog"');
                expect(!trieContainsPure(trie, 'cow'), 'Trie should not contain "cow"');
                expect(!trieContainsPure(trie, 'do'), 'Trie should not contain prefix-only "do"');
                return 'trie contains/absent checks passed';
            }
        },
        {
            name: 'DP: Fibonacci DP value',
            run: () => {
                const f12 = (() => {
                    const dp = [0, 1];
                    for (let i = 2; i <= 12; i++) dp[i] = dp[i - 1] + dp[i - 2];
                    return dp[12];
                })();
                expectEqual(f12, 144, 'Fibonacci F(12) mismatch');
                return 'F(12)=144';
            }
        },
        {
            name: 'DP: 0/1 Knapsack optimum',
            run: () => {
                const best = knapsackPure([10, 20, 30], [60, 100, 120], 50);
                expectEqual(best, 220, 'Knapsack optimum mismatch');
                return 'max value = 220';
            }
        },
        {
            name: 'DP: Longest Common Subsequence length',
            run: () => {
                expectEqual(lcsLengthPure('AGGTAB', 'GXTXAYB'), 4, 'LCS length mismatch');
                return 'length=4';
            }
        },
        {
            name: 'DP: Edit Distance value',
            run: () => {
                expectEqual(editDistancePure('SUNDAY', 'SATURDAY'), 3, 'Edit Distance mismatch');
                return 'distance=3';
            }
        },
        {
            name: 'DP: Matrix Chain minimum multiplications',
            run: () => {
                expectEqual(matrixChainPure([10, 20, 30, 40, 30]), 30000, 'Matrix Chain result mismatch');
                return 'min cost=30000';
            }
        },
        {
            name: 'DP: Coin Change minimum coins',
            run: () => {
                expectEqual(coinChangePure([1, 3, 4], 6), 2, 'Coin Change minimum coin count mismatch');
                return 'min coins=2';
            }
        },
        {
            name: 'DP: Longest Increasing Subsequence length',
            run: () => {
                expectEqual(lisLengthPure([10, 22, 9, 33, 21, 50, 41, 60, 80]), 6, 'LIS length mismatch');
                return 'length=6';
            }
        },
        {
            name: 'DP: Kadane maximum subarray',
            run: () => {
                const values = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
                const result = kadanePure(values);
                expectEqual(result.maxSum, 6, 'Kadane max sum mismatch');
                expectArrayEqual(values.slice(result.start, result.end + 1), [4, -1, 2, 1], 'Kadane range mismatch');
                return `maxSum=${result.maxSum}, range=[${result.start},${result.end}]`;
            }
        },
        {
            name: 'DP: Subset Sum reachability',
            run: () => {
                expect(subsetSumPure([3, 34, 4, 12, 5, 2], 9), 'Subset Sum should find target 9');
                expect(!subsetSumPure([3, 34, 4, 12, 5, 2], 30), 'Subset Sum should reject target 30');
                return 'reachable/unreachable checks passed';
            }
        },
        {
            name: 'Strings: KMP match indices',
            run: () => {
                const matches = kmpSearchPure('ABABDABACDABABCABAB', 'ABABCABAB');
                expectArrayEqual(matches, [10], 'KMP matches mismatch');
                return 'matches=[10]';
            }
        },
        {
            name: 'Strings: Rabin-Karp match indices',
            run: () => {
                const matches = rabinKarpPure('ABCCDDAEFGABCD', 'ABCD');
                expectArrayEqual(matches, [10], 'Rabin-Karp matches mismatch');
                return 'matches=[10]';
            }
        },
        {
            name: 'Strings: Z Algorithm match indices',
            run: () => {
                const matches = zSearchPure('AABCAABXAABCAABY', 'AAB');
                expectArrayEqual(matches, [0, 4, 8, 12], 'Z Algorithm matches mismatch');
                return 'matches=[0,4,8,12]';
            }
        },
        {
            name: 'Strings: Boyer-Moore match indices',
            run: () => {
                const matches = boyerMooreBadCharPure('AABACAABCABAXABCAB', 'ABCAB');
                expectArrayEqual(matches, [6, 13], 'Boyer-Moore matches mismatch');
                return 'matches=[6,13]';
            }
        },
        {
            name: 'Geometry: Line Intersection coordinates',
            run: () => {
                const hit = getLineIntersection(
                    { x1: 0, y1: 0, x2: 10, y2: 10 },
                    { x1: 0, y1: 10, x2: 10, y2: 0 }
                );
                expect(!!hit, 'Line intersection expected but not found');
                expect(Math.abs(hit.x - 5) < 1e-6 && Math.abs(hit.y - 5) < 1e-6, 'Intersection point mismatch');
                return '(5.0, 5.0)';
            }
        },
        {
            name: 'Geometry: Closest Pair distance',
            run: () => {
                const d = closestPairBrutePure([
                    { x: 0, y: 0 },
                    { x: 7, y: 7 },
                    { x: 3, y: 4 },
                    { x: 3, y: 5 }
                ]);
                expect(Math.abs(d - 1) < 1e-6, 'Closest pair distance mismatch');
                return 'distance=1.00';
            }
        },
        {
            name: 'Geometry: Convex Hull point count',
            run: () => {
                const count = convexHullSizePure([
                    { x: 0, y: 0 },
                    { x: 2, y: 0 },
                    { x: 2, y: 2 },
                    { x: 0, y: 2 },
                    { x: 1, y: 1 },
                    { x: 1.2, y: 1.1 }
                ]);
                expectEqual(count, 4, 'Convex hull vertex count mismatch');
                return 'hull vertices=4';
            }
        },
        {
            name: 'Advanced: N-Queens 8x8 validity',
            run: () => {
                const solution = solveNQueensPure(8);
                expectEqual(solution.length, 8, 'N-Queens should place 8 queens');
                for (let i = 0; i < solution.length; i++) {
                    for (let j = i + 1; j < solution.length; j++) {
                        const a = solution[i];
                        const b = solution[j];
                        expect(a.col !== b.col, 'Column conflict detected');
                        expect(Math.abs(a.row - b.row) !== Math.abs(a.col - b.col), 'Diagonal conflict detected');
                    }
                }
                return '8 queens placed without conflicts';
            }
        },
        {
            name: 'Advanced: TSP heuristic produces valid closed tour',
            run: () => {
                const cities = [
                    { x: 0, y: 0 },
                    { x: 10, y: 0 },
                    { x: 10, y: 10 },
                    { x: 0, y: 10 },
                    { x: 5, y: 5 }
                ];
                const result = tspNearestNeighborPure(cities);
                expectEqual(result.tour.length, cities.length, 'TSP tour length mismatch');
                expect(Number.isFinite(result.total) && result.total > 0, 'Invalid TSP tour distance');
                return `tour length=${result.tour.length}, distance=${result.total.toFixed(2)}`;
            }
        },
        {
            name: 'Integrity: Algorithm metadata completeness',
            run: () => {
                const issues = collectAlgorithmMetadataIssues();
                expectEqual(issues.length, 0, `Algorithm metadata issues detected: ${issues.slice(0, 3).join('; ')}`);
                return `validated ${Object.keys(algorithmDB).length} algorithm descriptors`;
            }
        }
    );

    return tests;
}

function openValidationLab() {
    if (!state.interviewMode) {
        if (isPanelCollapsed()) {
            togglePanel(false);
        }
        switchPanelTab('tests');
    } else {
        updateStep('Interview mode is active. Disable it to open the Validation Lab panel.');
    }
}

async function runSelfTests() {
    if (state.selfTestRunning) {
        return;
    }

    if (state.comparisonRunning) {
        setSelfTestStatus('Stop comparison benchmark before running self-tests.', 'fail');
        updateStep('Self-tests blocked: comparison benchmark is running.');
        return;
    }

    if (state.isRunning) {
        setSelfTestStatus('Stop the active visualization before running self-tests.', 'fail');
        updateStep('Self-tests blocked: stop current visualization first.');
        return;
    }

    state.selfTestRunning = true;
    if (elements.selfTestRunBtn) elements.selfTestRunBtn.disabled = true;
    if (elements.selfTestBtn) elements.selfTestBtn.disabled = true;

    const savedControlDisabled = {
        generate: elements.generateBtn ? elements.generateBtn.disabled : false,
        start: elements.startBtn ? elements.startBtn.disabled : false,
        pause: elements.pauseBtn ? elements.pauseBtn.disabled : false,
        step: elements.stepBtn ? elements.stepBtn.disabled : false,
        reset: elements.resetBtn ? elements.resetBtn.disabled : false
    };

    if (elements.generateBtn) elements.generateBtn.disabled = true;
    if (elements.startBtn) elements.startBtn.disabled = true;
    if (elements.pauseBtn) elements.pauseBtn.disabled = true;
    if (elements.stepBtn) elements.stepBtn.disabled = true;
    if (elements.resetBtn) elements.resetBtn.disabled = true;

    const suite = getSelfTestCases();
    const results = [];
    let passed = 0;
    let failed = 0;
    const start = performance.now();

    setSelfTestStatus(`Running ${suite.length} checks...`, 'running');
    updateStep(`Self-tests running (0/${suite.length})`, 0);
    updateSelfTestSummary(0, 0, 0);
    renderSelfTestResults([
        {
            name: 'Suite running',
            passed: true,
            detail: 'Executing deterministic checks...'
        }
    ]);

    try {
        for (let i = 0; i < suite.length; i++) {
            const test = suite[i];
            setSelfTestStatus(`Running ${i + 1}/${suite.length}: ${test.name}`, 'running');
            updateStep(`Self-test ${i + 1}/${suite.length}: ${test.name}`, ((i + 1) / suite.length) * 100);

            try {
                const detail = await test.run();
                passed++;
                results.push({
                    name: test.name,
                    passed: true,
                    detail: detail || 'Passed'
                });
            } catch (error) {
                failed++;
                results.push({
                    name: test.name,
                    passed: false,
                    detail: error && error.message ? error.message : 'Unknown failure'
                });
            }
        }
    } finally {
        const elapsed = Math.round(performance.now() - start);
        updateSelfTestSummary(passed, failed, elapsed);
        renderSelfTestResults(results);

        if (failed === 0) {
            setSelfTestStatus(`All checks passed (${passed}/${suite.length}) in ${elapsed}ms.`, 'pass');
            updateStep(`Self-tests passed: ${passed}/${suite.length}`, 100);
        } else {
            setSelfTestStatus(`${failed} check(s) failed (${passed} passed) in ${elapsed}ms.`, 'fail');
            updateStep(`Self-tests found ${failed} issue(s). Open Tests tab for details.`, 100);
        }

        state.selfTestRunning = false;
        if (elements.selfTestRunBtn) elements.selfTestRunBtn.disabled = false;
        if (elements.selfTestBtn) elements.selfTestBtn.disabled = false;

        if (elements.generateBtn) elements.generateBtn.disabled = savedControlDisabled.generate;
        if (elements.startBtn) elements.startBtn.disabled = savedControlDisabled.start;
        if (elements.pauseBtn) elements.pauseBtn.disabled = savedControlDisabled.pause;
        if (elements.stepBtn) elements.stepBtn.disabled = savedControlDisabled.step;
        if (elements.resetBtn) elements.resetBtn.disabled = savedControlDisabled.reset;
    }
}

// === Event Listeners ===
function setupEventListeners() {
    // Size slider
    elements.sizeSlider.addEventListener('input', (e) => {
        state.size = Number(e.target.value);
        elements.sizeValue.textContent = state.size;
    });
    
    // Speed slider
    elements.speedSlider.addEventListener('input', (e) => {
        state.speed = Number(e.target.value);
        elements.speedValue.textContent = state.speed;
    });

    if (elements.dataProfileSelect) {
        elements.dataProfileSelect.addEventListener('change', (e) => {
            const selectedProfile = DATA_PROFILES.has(e.target.value) ? e.target.value : 'random';
            state.dataProfile = selectedProfile;
            safeStorageSet(STORAGE_KEYS.dataProfile, selectedProfile);

            if (elements.comparisonProfile) {
                elements.comparisonProfile.value = selectedProfile;
            }

            if (!state.isRunning && (state.category === 'sorting' || state.category === 'searching')) {
                prepareDataForCurrentAlgorithm(true);
            }
        });
    }
    
    // Category selector
    elements.categorySelector.addEventListener('change', (e) => {
        state.category = sanitizeCategory(e.target.value);
        state.algorithm = getFirstAlgorithmForCategory(state.category);
        safeStorageSet(STORAGE_KEYS.category, state.category);
        safeStorageSet(STORAGE_KEYS.algorithm, state.algorithm);
        applyCategoryAccent(state.category);
        syncActiveAlgorithmButton();
        updateAlgorithmInfo();
        loadQuiz();
        showVisualizationContainer();
        prepareDataForCurrentAlgorithm(true);
        updateVisibleAlgorithmList(true);
    });

    if (elements.algoSearch) {
        elements.algoSearch.addEventListener('input', () => {
            updateVisibleAlgorithmList(true);
        });
    }

    if (elements.clearAlgoSearch) {
        elements.clearAlgoSearch.addEventListener('click', () => {
            if (!elements.algoSearch) return;
            elements.algoSearch.value = '';
            updateVisibleAlgorithmList(true);
            elements.algoSearch.focus();
        });
    }
    
    // Algorithm buttons
    elements.algoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.algoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.algorithm = btn.dataset.algo;
            state.category = sanitizeCategory(btn.closest('.algo-category')?.dataset.category || state.category);
            safeStorageSet(STORAGE_KEYS.algorithm, state.algorithm);
            safeStorageSet(STORAGE_KEYS.category, state.category);
            if (elements.categorySelector) {
                elements.categorySelector.value = state.category;
            }
            applyCategoryAccent(state.category);
            updateAlgorithmInfo();
            loadQuiz();
            resetAnalytics();
            showVisualizationContainer();
            prepareDataForCurrentAlgorithm(false);

            if (isMobileViewport() && !isSidebarCollapsed()) {
                toggleSidebar(true);
            }
        });
    });
    
    // Control buttons
    elements.generateBtn.addEventListener('click', () => {
        if (state.selfTestRunning) {
            updateStep('Self-tests are running. Please wait...');
            return;
        }
        if (state.comparisonRunning) {
            updateStep('Comparison benchmark is running. Please wait...');
            return;
        }
        if (!state.isRunning) {
            prepareDataForCurrentAlgorithm(true);
        }
    });
    
    elements.startBtn.addEventListener('click', async () => {
        if (state.isRunning) return;
        if (state.selfTestRunning) {
            updateStep('Self-tests are running. Please wait...');
            return;
        }
        if (state.comparisonRunning) {
            updateStep('Comparison benchmark is running. Please wait...');
            return;
        }

        resumeAudioContextIfNeeded();
        showVisualizationContainer();
        prepareDataForCurrentAlgorithm(false);
        
        state.isRunning = true;
        state.isPaused = false;
        state.shouldStop = false;
        
        elements.startBtn.disabled = true;
        elements.pauseBtn.disabled = false;
        elements.generateBtn.disabled = true;
        
        resetAnalytics();
        state.startTime = Date.now();
        
        await executeAlgorithm();
        
        state.isRunning = false;
        elements.startBtn.disabled = false;
        elements.pauseBtn.disabled = true;
        elements.generateBtn.disabled = false;
        elements.pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="3" height="12" fill="currentColor"/><rect x="9" y="2" width="3" height="12" fill="currentColor"/></svg> Pause';
        updateAnalytics();
    });
    
    elements.pauseBtn.addEventListener('click', () => {
        state.isPaused = !state.isPaused;
        elements.pauseBtn.innerHTML = state.isPaused
            ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2L12 8L4 14V2Z" fill="currentColor"/></svg> Resume'
            : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="3" height="12" fill="currentColor"/><rect x="9" y="2" width="3" height="12" fill="currentColor"/></svg> Pause';
    });
    
    elements.stepBtn.addEventListener('click', () => {
        if (state.isRunning && state.isPaused) {
            state.isStepping = true;
            state.isPaused = false;
        }
    });
    
    elements.resetBtn.addEventListener('click', () => {
        if (state.comparisonRunning) {
            updateStep('Comparison benchmark is running. Please wait...');
            return;
        }
        state.shouldStop = true;
        state.isRunning = false;
        state.isPaused = false;
        
        elements.startBtn.disabled = false;
        elements.pauseBtn.disabled = true;
        elements.generateBtn.disabled = false;
        elements.pauseBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="2" width="3" height="12" fill="currentColor"/><rect x="9" y="2" width="3" height="12" fill="currentColor"/></svg> Pause';
        prepareDataForCurrentAlgorithm(true);
        updateStep('Ready to visualize');
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        syncPreferenceControls();
        redrawCurrentVisualization();
    });
    
    // Sound toggle
    elements.soundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        safeStorageSet(STORAGE_KEYS.sound, state.soundEnabled ? 'on' : 'off');
        syncPreferenceControls();
        if (state.soundEnabled) {
            resumeAudioContextIfNeeded();
        }
    });
    
    // Mode toggle
    elements.modeToggle.addEventListener('click', () => {
        state.interviewMode = !state.interviewMode;
        safeStorageSet(STORAGE_KEYS.mode, state.interviewMode ? 'interview' : 'beginner');
        
        if (state.interviewMode) {
            elements.rightPanel.classList.add('collapsed');
        } else if (!isMobileViewport()) {
            elements.rightPanel.classList.remove('collapsed');
        }
        syncPreferenceControls();
        updateDrawerLayout();
    });
    
    // Quality toggle
    elements.qualityToggle.addEventListener('click', () => {
        state.highQuality = !state.highQuality;
        safeStorageSet(STORAGE_KEYS.quality, state.highQuality ? 'high' : 'low');
        syncPreferenceControls();
        redrawCurrentVisualization();
    });
    
    // Sidebar toggle
    elements.sidebarToggle.addEventListener('click', () => {
        toggleSidebar();
    });
    
    // Panel toggle
    elements.panelToggle.addEventListener('click', () => {
        togglePanel();
    });

    if (elements.sidebarHandle) {
        elements.sidebarHandle.addEventListener('click', () => {
            toggleSidebar(false);
        });
    }

    if (elements.panelHandle) {
        elements.panelHandle.addEventListener('click', () => {
            togglePanel(false);
        });
    }

    if (elements.drawerBackdrop) {
        elements.drawerBackdrop.addEventListener('click', () => {
            if (!isSidebarCollapsed()) {
                toggleSidebar(true);
            }
            if (!isPanelCollapsed()) {
                togglePanel(true);
            }
        });
    }
    
    // Tab buttons
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchPanelTab(btn.dataset.tab);
        });
    });
    
    // Copy code button
    elements.copyCodeBtn.addEventListener('click', async () => {
        const code = elements.codeImplementation.textContent;
        const copied = await copyTextToClipboard(code);
        setCopyButtonState(copied ? 'success' : 'error');
    });
    
    // Quiz next button
    elements.nextQuizBtn.addEventListener('click', loadQuiz);

    if (elements.selfTestRunBtn) {
        elements.selfTestRunBtn.addEventListener('click', () => {
            openValidationLab();
            runSelfTests();
        });
    }

    if (elements.selfTestBtn) {
        elements.selfTestBtn.addEventListener('click', () => {
            openValidationLab();
            runSelfTests();
        });
    }
    
    // Comparison modal
    elements.comparisonBtn.addEventListener('click', () => {
        if (elements.comparisonProfile) {
            elements.comparisonProfile.value = state.dataProfile;
        }
        if (!state.comparisonRunning) {
            setComparisonStatus('Ready. Choose algorithms and run benchmark.', 'idle');
            setComparisonProgress(0);
        }
        elements.comparisonModal.classList.add('active');
    });
    
    elements.modalClose.addEventListener('click', () => {
        elements.comparisonModal.classList.remove('active');
    });
    
    elements.comparisonModal.addEventListener('click', (e) => {
        if (e.target === elements.comparisonModal) {
            elements.comparisonModal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        const tag = (e.target?.tagName || '').toLowerCase();
        const isTypingTarget =
            tag === 'input' ||
            tag === 'textarea' ||
            tag === 'select' ||
            tag === 'button' ||
            e.target?.isContentEditable;

        if (e.key === 'Escape' && elements.comparisonModal.classList.contains('active')) {
            elements.comparisonModal.classList.remove('active');
            return;
        }

        if (e.key === 'Escape' && isMobileViewport()) {
            let closedDrawer = false;
            if (!isSidebarCollapsed()) {
                toggleSidebar(true);
                closedDrawer = true;
            }
            if (!isPanelCollapsed()) {
                togglePanel(true);
                closedDrawer = true;
            }
            if (closedDrawer) {
                return;
            }
        }

        if (isTypingTarget) return;

        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (!state.isRunning) {
                elements.startBtn.click();
            } else {
                elements.pauseBtn.click();
            }
            return;
        }

        const key = e.key.toLowerCase();
        if (key === 'g') {
            elements.generateBtn.click();
        } else if (key === 'r') {
            elements.resetBtn.click();
        } else if (key === 't') {
            openValidationLab();
            runSelfTests();
        } else if (key === 'n' && !elements.nextQuizBtn.classList.contains('hidden')) {
            elements.nextQuizBtn.click();
        }
    });
    
    elements.runComparisonBtn.addEventListener('click', runComparison);
    
    // Graph tools
    if (elements.directedGraph) {
        elements.directedGraph.addEventListener('change', (e) => {
            state.isDirected = e.target.checked;
            if (state.graph.nodes.length) {
                generateGraph();
            } else {
                drawGraph();
            }
        });
    }

    if (elements.addEdgeBtn) {
        elements.addEdgeBtn.addEventListener('click', () => {
            const nextMode = state.graphToolMode === 'add-edge' ? 'drag' : 'add-edge';
            setGraphToolMode(nextMode);
        });
    }

    if (elements.removeNodeBtn) {
        elements.removeNodeBtn.addEventListener('click', () => {
            const nextMode = state.graphToolMode === 'remove-node' ? 'drag' : 'remove-node';
            setGraphToolMode(nextMode);
        });
    }
    
    if (elements.weightedGraph) {
        elements.weightedGraph.addEventListener('change', (e) => {
            state.isWeighted = e.target.checked;
            drawGraph();
        });
    }
    
    if (elements.addNodeBtn) {
        elements.addNodeBtn.addEventListener('click', () => {
            const container = elements.graphContainer;
            const width = Math.max(120, container.clientWidth);
            const height = Math.max(120, container.clientHeight);
            
            state.graph.nodes.push({
                id: state.graph.nodes.length,
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50,
                state: 'default',
                distance: Infinity,
                visited: false,
                color: null
            });
            
            setGraphToolMode('drag');
            updateStep(`Added node ${state.graph.nodes.length - 1}`);
            drawGraph();
        });
    }
    
    if (elements.clearGraphBtn) {
        elements.clearGraphBtn.addEventListener('click', () => {
            state.graph = { nodes: [], edges: [] };
            setGraphToolMode('drag');
            resetAnalytics();
            updateStep('Graph cleared');
            drawGraph();
        });
    }
}

// === Comparison Mode ===
function averageOf(values) {
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function medianOf(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}

function summarizeBenchmarkRuns(runs) {
    if (!runs.length) {
        return {
            comparisons: 0,
            swaps: 0,
            operations: 0,
            accesses: 0,
            avgTime: 0,
            medianTime: 0,
            bestTime: 0
        };
    }

    const comparisons = runs.map(run => run.comparisons);
    const swaps = runs.map(run => run.swaps);
    const operations = runs.map(run => run.operations);
    const accesses = runs.map(run => run.accesses);
    const times = runs.map(run => run.time);

    return {
        comparisons: Math.round(averageOf(comparisons)),
        swaps: Math.round(averageOf(swaps)),
        operations: Math.round(averageOf(operations)),
        accesses: Math.round(averageOf(accesses)),
        avgTime: Number(averageOf(times).toFixed(2)),
        medianTime: Number(medianOf(times).toFixed(2)),
        bestTime: Number(Math.min(...times).toFixed(2))
    };
}

function getComparisonWinner(algo1, algo2, summary1, summary2) {
    if (summary1.medianTime !== summary2.medianTime) {
        return summary1.medianTime < summary2.medianTime
            ? `${algorithmDB[algo1]?.name || algo1} (better median time)`
            : `${algorithmDB[algo2]?.name || algo2} (better median time)`;
    }

    if (summary1.avgTime !== summary2.avgTime) {
        return summary1.avgTime < summary2.avgTime
            ? `${algorithmDB[algo1]?.name || algo1} (better average time)`
            : `${algorithmDB[algo2]?.name || algo2} (better average time)`;
    }

    if (summary1.operations !== summary2.operations) {
        return summary1.operations < summary2.operations
            ? `${algorithmDB[algo1]?.name || algo1} (fewer operations)`
            : `${algorithmDB[algo2]?.name || algo2} (fewer operations)`;
    }

    return 'Tie (metrics are equivalent)';
}

function resetComparisonOutputs() {
    const ids = [
        'comp1Comparisons', 'comp2Comparisons',
        'comp1Swaps', 'comp2Swaps',
        'comp1Ops', 'comp2Ops',
        'comp1Accesses', 'comp2Accesses',
        'comp1AvgTime', 'comp2AvgTime',
        'comp1MedianTime', 'comp2MedianTime',
        'comp1BestTime', 'comp2BestTime'
    ];

    ids.forEach(id => {
        const cell = document.getElementById(id);
        if (cell) cell.textContent = '-';
    });
    if (elements.compWinner) {
        elements.compWinner.textContent = '-';
        elements.compWinner.classList.remove('error');
    }
}

function setComparisonStatus(message, tone = 'idle') {
    if (!elements.comparisonStatus) return;
    elements.comparisonStatus.textContent = message;
    elements.comparisonStatus.className = `comparison-status ${tone}`;
}

function setComparisonProgress(percent = 0) {
    if (!elements.comparisonProgressBar) return;
    const bounded = clampNumber(percent, 0, 100);
    elements.comparisonProgressBar.style.width = `${bounded}%`;
}

function setComparisonError(message) {
    resetComparisonOutputs();
    if (elements.compWinner) {
        elements.compWinner.textContent = `Error: ${message}`;
        elements.compWinner.classList.add('error');
    }
    const resultBox = document.getElementById('comparisonResults');
    if (resultBox) {
        resultBox.classList.remove('hidden');
    }
    setComparisonStatus(`Error: ${message}`, 'error');
    setComparisonProgress(0);
    updateStep(`Comparison error: ${message}`);
}

function isComparisonEligible(algoId) {
    return [
        'bubble', 'selection', 'insertion', 'merge', 'quick', 'heap',
        'counting', 'radix', 'shell', 'timsort', 'cocktail', 'bucket'
    ].includes(algoId);
}

async function runComparison() {
    if (state.comparisonRunning) {
        state.comparisonCancelRequested = true;
        setComparisonStatus('Cancel requested. Finishing current round...', 'cancelled');
        updateStep('Comparison cancel requested.');
        return;
    }

    if (state.isRunning) {
        setComparisonError('Stop the active visualization first.');
        return;
    }
    if (state.selfTestRunning) {
        setComparisonError('Wait for self-tests to finish.');
        return;
    }

    const algo1Select = document.getElementById('algo1Select');
    const algo2Select = document.getElementById('algo2Select');
    if (!algo1Select || !algo2Select) {
        setComparisonError('Comparison selectors are missing in the page.');
        return;
    }

    const algo1 = algo1Select.value;
    const algo2 = algo2Select.value;
    if (!isComparisonEligible(algo1) || !isComparisonEligible(algo2)) {
        setComparisonError('Only sorting algorithms are supported in comparison mode.');
        return;
    }

    const profile = DATA_PROFILES.has(elements.comparisonProfile?.value)
        ? elements.comparisonProfile.value
        : state.dataProfile;
    const rounds = Math.round(clampNumber(parseInt(elements.comparisonRounds?.value, 10) || 5, 1, 20));
    
    const algo1NameCell = document.getElementById('algo1Name');
    const algo2NameCell = document.getElementById('algo2Name');
    if (algo1NameCell) algo1NameCell.textContent = algorithmDB[algo1]?.name || algo1;
    if (algo2NameCell) algo2NameCell.textContent = algorithmDB[algo2]?.name || algo2;
    
    const comparisonResults = document.getElementById('comparisonResults');
    if (comparisonResults) {
        comparisonResults.classList.add('hidden');
    }

    resetComparisonOutputs();
    state.comparisonRunning = true;
    state.comparisonCancelRequested = false;
    elements.runComparisonBtn.disabled = false;
    elements.runComparisonBtn.textContent = 'Cancel';
    setComparisonStatus(`Running ${rounds} benchmark round(s) on "${profile}" profile...`, 'running');
    setComparisonProgress(0);
    updateStep(`Benchmark running: ${rounds} round(s), profile "${profile}"`, 0);

    try {
        const algo1Runs = [];
        const algo2Runs = [];

        for (let round = 0; round < rounds; round++) {
            if (state.comparisonCancelRequested) {
                throw new Error('Comparison canceled by user.');
            }

            setComparisonStatus(`Round ${round + 1}/${rounds}: running ${algorithmDB[algo1]?.name || algo1} vs ${algorithmDB[algo2]?.name || algo2}`, 'running');
            setComparisonProgress((round / rounds) * 100);
            updateStep(
                `Benchmark round ${round + 1}/${rounds}: ${algorithmDB[algo1]?.name || algo1} vs ${algorithmDB[algo2]?.name || algo2}`,
                ((round + 1) / rounds) * 100
            );

            const testData = generateArrayValues(state.size, profile);
            const result1 = await runAlgorithmForComparison(algo1, [...testData]);
            const result2 = await runAlgorithmForComparison(algo2, [...testData]);

            if (result1.failed || result2.failed) {
                const reason = result1.error || result2.error || 'Unknown execution failure';
                throw new Error(reason);
            }
            if (state.comparisonCancelRequested) {
                throw new Error('Comparison canceled by user.');
            }
            algo1Runs.push(result1);
            algo2Runs.push(result2);
            setComparisonProgress(((round + 1) / rounds) * 100);

            // Keep UI responsive on slower devices during multi-round benchmarks.
            await new Promise(resolve => requestAnimationFrame(resolve));
        }

        const summary1 = summarizeBenchmarkRuns(algo1Runs);
        const summary2 = summarizeBenchmarkRuns(algo2Runs);
        const winnerText = getComparisonWinner(algo1, algo2, summary1, summary2);

        if (elements.comp1Comparisons) elements.comp1Comparisons.textContent = summary1.comparisons;
        if (elements.comp2Comparisons) elements.comp2Comparisons.textContent = summary2.comparisons;
        if (elements.comp1Swaps) elements.comp1Swaps.textContent = summary1.swaps;
        if (elements.comp2Swaps) elements.comp2Swaps.textContent = summary2.swaps;
        if (elements.comp1Ops) elements.comp1Ops.textContent = summary1.operations;
        if (elements.comp2Ops) elements.comp2Ops.textContent = summary2.operations;
        if (elements.comp1Accesses) elements.comp1Accesses.textContent = summary1.accesses;
        if (elements.comp2Accesses) elements.comp2Accesses.textContent = summary2.accesses;
        if (elements.comp1AvgTime) elements.comp1AvgTime.textContent = summary1.avgTime;
        if (elements.comp2AvgTime) elements.comp2AvgTime.textContent = summary2.avgTime;
        if (elements.comp1MedianTime) elements.comp1MedianTime.textContent = summary1.medianTime;
        if (elements.comp2MedianTime) elements.comp2MedianTime.textContent = summary2.medianTime;
        if (elements.comp1BestTime) elements.comp1BestTime.textContent = summary1.bestTime;
        if (elements.comp2BestTime) elements.comp2BestTime.textContent = summary2.bestTime;
        if (elements.compWinner) {
            elements.compWinner.textContent = winnerText;
            elements.compWinner.classList.remove('error');
        }

        if (comparisonResults) {
            comparisonResults.classList.remove('hidden');
        }
        setComparisonStatus(`Benchmark complete. Winner: ${winnerText}`, 'success');
        setComparisonProgress(100);
        updateStep(`Benchmark complete. Winner: ${winnerText}`, 100);
    } catch (error) {
        console.error('Comparison failed:', error);
        const reason = error && error.message ? error.message : 'Unexpected runtime issue';
        if (reason === 'Comparison canceled by user.') {
            setComparisonStatus('Comparison canceled. You can run again anytime.', 'cancelled');
            setComparisonProgress(0);
            updateStep('Comparison canceled.');
        } else {
            setComparisonError(reason);
        }
    } finally {
        state.comparisonRunning = false;
        state.comparisonCancelRequested = false;
        elements.runComparisonBtn.disabled = false;
        elements.runComparisonBtn.textContent = 'Run Comparison';
    }
}

async function runAlgorithmForComparison(algo, data, options = {}) {
    const startTime = performance.now();
    let comparisons = 0;
    let swaps = 0;
    let operations = 0;
    let accesses = 0;
    let failed = false;
    let error = '';
    let output = [];
    
    const arr = data.map(value => ({ value, state: 'default' }));
    
    const savedArray = state.array;
    const savedComparisons = state.comparisons;
    const savedSwaps = state.swaps;
    const savedOperations = state.operations;
    const savedAccesses = state.accesses;
    const savedSpeed = state.speed;
    const savedShouldStop = state.shouldStop;
    const savedBenchmark = state.isBenchmark;
    
    state.array = arr;
    state.comparisons = 0;
    state.swaps = 0;
    state.operations = 0;
    state.accesses = 0;
    state.speed = 100;
    state.shouldStop = false;
    state.isBenchmark = true;
    
    try {
        switch (algo) {
            case 'bubble': await bubbleSort(); break;
            case 'selection': await selectionSort(); break;
            case 'insertion': await insertionSort(); break;
            case 'merge': await mergeSort(); break;
            case 'quick': await quickSort(); break;
            case 'heap': await heapSort(); break;
            case 'counting': await countingSort(); break;
            case 'radix': await radixSort(); break;
            case 'shell': await shellSort(); break;
            case 'timsort': await timSort(); break;
            case 'cocktail': await cocktailSort(); break;
            case 'bucket': await bucketSort(); break;
            default: break;
        }
    } catch (e) {
        failed = true;
        error = e && e.message ? e.message : 'Unknown algorithm failure';
    } finally {
        comparisons = state.comparisons;
        swaps = state.swaps;
        operations = state.operations;
        accesses = Math.max(state.accesses, state.comparisons * 2 + state.swaps * 2 + state.operations);
        output = state.array.map(item => item.value);

        state.array = savedArray;
        state.comparisons = savedComparisons;
        state.swaps = savedSwaps;
        state.operations = savedOperations;
        state.accesses = savedAccesses;
        state.speed = savedSpeed;
        state.shouldStop = savedShouldStop;
        state.isBenchmark = savedBenchmark;
    }
    
    const endTime = performance.now();
    
    return {
        comparisons,
        swaps,
        operations,
        accesses,
        time: Math.round(endTime - startTime),
        failed,
        error,
        output: options.returnOutput ? output : undefined
    };
}

// === Visualization Container Management ===
function showVisualizationContainer() {
    elements.canvas.classList.remove('hidden');
    elements.graphContainer.classList.add('hidden');
    elements.treeContainer.classList.add('hidden');
    elements.dpTable.classList.add('hidden');
    elements.graphTools.classList.add('hidden');

    const mode = getVisualizationMode();
    if (mode === 'graph') {
        elements.canvas.classList.add('hidden');
        elements.graphContainer.classList.remove('hidden');
        elements.graphTools.classList.remove('hidden');
    } else if (mode === 'tree') {
        elements.canvas.classList.add('hidden');
        elements.treeContainer.classList.remove('hidden');
    } else if (mode === 'dp') {
        elements.canvas.classList.add('hidden');
        elements.dpTable.classList.remove('hidden');
    }
}

// === Initialize on Load ===
document.addEventListener('DOMContentLoaded', init);

