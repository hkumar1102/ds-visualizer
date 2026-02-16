const fs = require('fs');

function fail(message) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
}

function getMatches(regex, source, mapper = m => m[1]) {
    return [...source.matchAll(regex)].map(mapper);
}

function assertSetSubset(subset, superset, label) {
    const missing = [...subset].filter(item => !superset.has(item));
    if (missing.length > 0) {
        fail(`${label} missing: ${missing.join(', ')}`);
    }
}

function assertSetEquality(a, b, labelA, labelB) {
    const missingInB = [...a].filter(item => !b.has(item));
    const missingInA = [...b].filter(item => !a.has(item));
    if (missingInB.length > 0) {
        fail(`${labelA} present but missing in ${labelB}: ${missingInB.join(', ')}`);
    }
    if (missingInA.length > 0) {
        fail(`${labelB} present but missing in ${labelA}: ${missingInA.join(', ')}`);
    }
}

function run() {
    const html = fs.readFileSync('index.html', 'utf8');
    const js = fs.readFileSync('script.js', 'utf8');

    const uiAlgorithms = new Set(getMatches(/data-algo="([a-z0-9]+)"/g, html));
    const tabButtons = new Set(getMatches(/class="tab-btn(?: active)?" data-tab="([a-z]+)"/g, html));
    const tabContents = new Set(getMatches(/class="tab-content(?: active)?" data-tab="([a-z]+)"/g, html));
    const idRefs = new Set(getMatches(/getElementById\('([^']+)'\)/g, js));
    const missingIdRefs = [...idRefs].filter(id => !new RegExp(`id="${id}"`).test(html));

    const algorithmDbBlock = js.match(/const algorithmDB = \{([\s\S]*?)\n\};/);
    if (!algorithmDbBlock) {
        fail('Could not parse algorithmDB block.');
    }
    const dbAlgorithms = new Set(
        algorithmDbBlock
            ? getMatches(/\n\s{4}([a-z0-9]+):\s*\{/g, algorithmDbBlock[1])
            : []
    );

    const executeBlock = js.match(/async function executeAlgorithm\(\) \{([\s\S]*?)\n\}/);
    if (!executeBlock) {
        fail('Could not parse executeAlgorithm block.');
    }
    const executeCases = new Set(
        executeBlock ? getMatches(/case '([a-z0-9]+)'/g, executeBlock[1]) : []
    );

    const compareSelectBlock = html.match(/<select id="algo1Select"[\s\S]*?<\/select>/);
    if (!compareSelectBlock) {
        fail('Could not parse comparison select options.');
    }
    const compareOptions = new Set(
        compareSelectBlock ? getMatches(/<option value="([a-z0-9]+)"/g, compareSelectBlock[0]) : []
    );

    const compareRunnerBlock = js.match(
        /async function runAlgorithmForComparison\(algo, data, options = \{\}\) \{([\s\S]*?)\n\}/
    );
    if (!compareRunnerBlock) {
        fail('Could not parse runAlgorithmForComparison block.');
    }
    const compareCases = new Set(
        compareRunnerBlock ? getMatches(/case '([a-z0-9]+)'/g, compareRunnerBlock[1]) : []
    );

    assertSetEquality(uiAlgorithms, dbAlgorithms, 'UI algorithms', 'algorithmDB keys');
    assertSetSubset(uiAlgorithms, executeCases, 'executeAlgorithm switch');
    assertSetEquality(compareOptions, compareCases, 'comparison options', 'comparison switch');
    assertSetEquality(tabButtons, tabContents, 'tab buttons', 'tab contents');

    if (missingIdRefs.length > 0) {
        fail(`Missing IDs referenced in script.js: ${missingIdRefs.join(', ')}`);
    }

    if (!process.exitCode) {
        console.log('PASS: Mapping and integrity checks succeeded.');
        console.log(`- algorithms: ${uiAlgorithms.size}`);
        console.log(`- tabs: ${tabButtons.size}`);
        console.log(`- id refs: ${idRefs.size}`);
    }
}

run();
