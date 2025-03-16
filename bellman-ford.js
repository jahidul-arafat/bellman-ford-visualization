// Default graph data based on the image
const defaultNodes = [
    { id: "a", label: "a" },
    { id: "b", label: "b" },
    { id: "c", label: "c" },
    { id: "d", label: "d" },
    { id: "e", label: "e" }
];

const defaultEdges = [
    { id: "a-b", from: "a", to: "b", label: "5", arrows: "to" },
    { id: "a-c", from: "a", to: "c", label: "-3", arrows: "to" },
    { id: "d-b", from: "d", to: "b", label: "2", arrows: "to" },
    { id: "c-d", from: "c", to: "d", label: "3", arrows: "to" },
    { id: "b-e", from: "b", to: "e", label: "-4", arrows: "to" },
    { id: "e-d", from: "e", to: "d", label: "1", arrows: "to" }
];

const defaultEdgeOrder = ["a-b", "a-c", "d-b", "c-d", "b-e", "e-d"];

// Pre-computed Bellman-Ford steps for the default graph
const defaultAlgorithmSteps = [];

// Initialize the default steps based on the Bellman-Ford algorithm
function initializeDefaultSteps() {
    // Clear previous steps
    defaultAlgorithmSteps.length = 0;

    // Initialize step 0 - setup
    defaultAlgorithmSteps.push({
        pass: 0,
        edge: null,
        description: "Initialize distances: d[a] = 0, all other distances = ∞",
        distances: {
            "a": 0,
            "b": Infinity,
            "c": Infinity,
            "d": Infinity,
            "e": Infinity
        },
        predecessor: {
            "a": null,
            "b": null,
            "c": null,
            "d": null,
            "e": null
        },
        relaxedEdge: null,
        relaxationDetails: "Initialization: Set distance to source node 'a' as 0, all others as infinity.",
        tableEntry: {
            pass: 0,
            edge: "Init",
            action: "Initialize distances",
            distances: "d[a] = 0, d[b] = ∞, d[c] = ∞, d[d] = ∞, d[e] = ∞"
        }
    });

    // Run Bellman-Ford algorithm
    const distances = { "a": 0, "b": Infinity, "c": Infinity, "d": Infinity, "e": Infinity };
    const predecessor = { "a": null, "b": null, "c": null, "d": null, "e": null };

    // Add this line here
    console.log(`[DEBUG] Bellman-Ford requires ${defaultNodes.length - 1} passes for a graph with ${defaultNodes.length} nodes`);

    // |V|-1 passes
    for (let pass = 1; pass <= defaultNodes.length - 1; pass++) {
        // For each edge in the specified order
        for (let edgeIndex = 0; edgeIndex < defaultEdgeOrder.length; edgeIndex++) {
            const edgeId = defaultEdgeOrder[edgeIndex];
            const edge = defaultEdges.find(e => e.id === edgeId);

            if (!edge) continue;

            const u = edge.from;
            const v = edge.to;
            const weight = parseInt(edge.label);

            // Current distances
            const oldDistances = { ...distances };

            // Relaxation step details
            let relaxationDetails = "";
            let action = "No change";

            // Try to relax the edge
            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                // Edge can be relaxed
                distances[v] = distances[u] + weight;
                predecessor[v] = u;

                relaxationDetails = `Relax edge (${u}, ${v}): d[${v}] = d[${u}] + w(${u},${v}) = ${distances[u]} + ${weight} = ${distances[v]}`;
                action = `Updated d[${v}] = ${distances[v]}`;
            } else if (distances[u] === Infinity) {
                relaxationDetails = `Cannot relax edge (${u}, ${v}) because d[${u}] = ∞`;
            } else {
                relaxationDetails = `No need to relax edge (${u}, ${v}): d[${v}] = ${distances[v]}, d[${u}] + w(${u},${v}) = ${distances[u]} + ${weight} = ${distances[u] + weight}`;
            }

            // Add step
            defaultAlgorithmSteps.push({
                pass: pass,
                edge: edgeId,
                description: `Pass ${pass}, Edge (${u}, ${v}): ${relaxationDetails}`,
                distances: { ...distances },
                predecessor: { ...predecessor },
                relaxedEdge: action !== "No change" ? edgeId : null,
                relaxationDetails: relaxationDetails,
                tableEntry: {
                    pass: pass,
                    edge: `(${u}, ${v})`,
                    action: action,
                    distances: formatDistances(distances)
                }
            });
        }
    }

    // Check for negative cycles (one more pass)
    let hasNegativeCycle = false;
    let negativeCycleEdge = null;

    for (let edgeIndex = 0; edgeIndex < defaultEdgeOrder.length; edgeIndex++) {
        const edgeId = defaultEdgeOrder[edgeIndex];
        const edge = defaultEdges.find(e => e.id === edgeId);

        if (!edge) continue;

        const u = edge.from;
        const v = edge.to;
        const weight = parseInt(edge.label);

        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
            hasNegativeCycle = true;
            negativeCycleEdge = edgeId;
            break;
        }
    }

    // Add final step - negative cycle check
    defaultAlgorithmSteps.push({
        pass: defaultNodes.length,
        edge: null,
        description: hasNegativeCycle ?
            "Negative cycle detected! The graph contains a negative weight cycle." :
            "No negative cycles detected. The algorithm has found all shortest paths from the source.",
        distances: { ...distances },
        predecessor: { ...predecessor },
        relaxedEdge: null,
        relaxationDetails: hasNegativeCycle ?
            `A negative cycle was detected during the verification pass. This means there is no shortest path for at least some vertices.` :
            `The algorithm has successfully computed all shortest paths from the source vertex 'a'.`,
        tableEntry: {
            pass: defaultNodes.length,
            edge: "Check",
            action: hasNegativeCycle ? "Negative cycle detected!" : "No negative cycles found",
            distances: formatDistances(distances)
        },
        hasNegativeCycle: hasNegativeCycle,
        negativeCycleEdge: negativeCycleEdge
    });
}

// Helper function to format distances for display
function formatDistances(distances) {
    let result = "";
    for (const [node, distance] of Object.entries(distances)) {
        result += `d[${node}] = ${distance === Infinity ? "∞" : distance}, `;
    }
    return result.slice(0, -2); // Remove trailing comma and space
}

// Network options
const options = {
    nodes: {
        shape: "circle",
        size: 30,
        font: {
            size: 16,
            color: "#ffffff"
        },
        borderWidth: 2,
        shadow: true,
        color: {
            background: "#666666",
            border: "#444444"
        }
    },
    edges: {
        width: 2,
        font: {
            size: 14,
            align: "middle"
        },
        shadow: true
    },
    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -3000,
            centralGravity: 0.3,
            springLength: 150
        },
        stabilization: {
            iterations: 250
        }
    },
    interaction: {
        dragNodes: true,
        dragView: true,
        zoomView: true
    },
    manipulation: {
        enabled: false
    }
};

// Update function - may be causing performance issues
function updateVisualization() {
    console.log(`[DEBUG] Updating visualization for step ${currentStep}`);
    const stepData = algorithmSteps[currentStep];

    if (!stepData) {
        console.error(`[ERROR] No step data for step ${currentStep}`);
        return;
    }

    // Update counters and descriptions
    if (stepData.pass === 0) {
        passCounter.textContent = "Init";
        edgeCounter.textContent = "Init";
    } else if (stepData.edge === null) {
        passCounter.textContent = stepData.pass;
        edgeCounter.textContent = "Check";
    } else {
        passCounter.textContent = stepData.pass;
        const edge = defaultEdges.find(e => e.id === stepData.edge);
        edgeCounter.textContent = edge ? `(${edge.from}, ${edge.to})` : stepData.edge;
    }

    stepDescription.textContent = stepData.description;

    console.log(`[DEBUG] Clearing and updating algorithm graph`);
    // Clear previous data
    algorithmData.nodes.clear();
    algorithmData.edges.clear();

    // Add all nodes to the graph
    console.log(`[DEBUG] Adding ${defaultNodes.length} nodes to the graph`);
    defaultNodes.forEach(node => {
        const newNode = { ...node };

        // Highlight the source node
        if (node.id === "a") {
            newNode.color = { background: "#4CAF50", border: "#2E7D32" };
        }

        // Add distance label to the node
        const distance = stepData.distances[node.id];
        newNode.label = `${node.id}\n${distance === Infinity ? "∞" : distance}`;

        algorithmData.nodes.add(newNode);
    });

    // Add all edges to the graph
    console.log(`[DEBUG] Adding ${defaultEdges.length} edges to the graph`);
    defaultEdges.forEach(edge => {
        const newEdge = { ...edge };

        // Highlight the relaxed edge if any
        if (stepData.relaxedEdge === edge.id) {
            newEdge.color = { color: "#4CAF50", highlight: "#45a049" };
            newEdge.width = 3;
        }

        // Highlight the negative cycle edge if any
        if (stepData.hasNegativeCycle && stepData.negativeCycleEdge === edge.id) {
            newEdge.color = { color: "#f44336", highlight: "#d32f2f" };
            newEdge.width = 3;
        }

        algorithmData.edges.add(newEdge);
    });

    // Update distances panel
    console.log(`[DEBUG] Updating distances panel`);
    let distancesHtml = "<table><tr><th>Node</th><th>Distance</th><th>Path</th></tr>";

    Object.keys(stepData.distances).forEach(node => {
        const distance = stepData.distances[node];
        let path = "";

        // Construct the path
        if (node === "a") {
            path = "a";
        } else if (distance === Infinity) {
            path = "No path";
        } else {
            // Trace back through predecessors - this could cause issues if there's a cycle in the predecessor graph
            console.log(`[DEBUG] Constructing path for node ${node}`);
            let current = node;
            const pathNodes = [current];
            let safetyCounter = 0; // Prevent infinite loops

            while (stepData.predecessor[current] !== null && safetyCounter < 100) {
                current = stepData.predecessor[current];
                pathNodes.unshift(current);
                safetyCounter++;

                if (safetyCounter >= 99) {
                    console.error(`[ERROR] Possible cycle in predecessor path for node ${node}`);
                }
            }

            path = pathNodes.join(" → ");
        }

        distancesHtml += `<tr>
                  <td>${node}</td>
                  <td>${distance === Infinity ? '<span class="infinity">∞</span>' : distance}</td>
                  <td>${path}</td>
              </tr>`;
    });

    distancesHtml += "</table>";
    distancesContent.innerHTML = distancesHtml;

    // Update relaxation details
    relaxationDetails.innerHTML = `<div class="relaxation-details">${stepData.relaxationDetails}</div>`;

    // Update table
    console.log(`[DEBUG] Updating algorithm steps table`);
    if (stepData.tableEntry) {
        // Check if row already exists
        const existingRows = algorithmStepsTable.querySelectorAll("tr");
        let rowExists = false;

        existingRows.forEach(row => {
            if (row.cells[0].textContent == stepData.tableEntry.pass &&
                row.cells[1].textContent == stepData.tableEntry.edge) {
                rowExists = true;
            }
        });

        if (!rowExists) {
            const row = document.createElement("tr");

            row.innerHTML = `
                      <td>${stepData.tableEntry.pass}</td>
                      <td>${stepData.tableEntry.edge}</td>
                      <td>${stepData.tableEntry.action}</td>
                      <td>${stepData.tableEntry.distances}</td>
                  `;

            // Highlight rows with updates
            if (stepData.tableEntry.action.includes("Updated")) {
                row.classList.add("relaxed-edge");
            }

            // Highlight the negative cycle row
            if (stepData.tableEntry.action.includes("Negative cycle")) {
                row.classList.add("negative-cycle");
            }

            algorithmStepsTable.appendChild(row);
        }
    }

    // Update button states
    prevButton.disabled = currentStep === 0;
    nextButton.disabled = currentStep === algorithmSteps.length - 1;

    console.log(`[DEBUG] Visualization update complete for step ${currentStep}`);
}

// Function to update the source node selector
function updateSourceNodeSelect() {
    // Clear current options
    sourceNodeSelect.innerHTML = "";

    // Get all nodes from the custom graph
    const nodes = customData.nodes.get();

    // Sort nodes by label
    nodes.sort((a, b) => a.id.localeCompare(b.id));

    // Add options for each node
    nodes.forEach(node => {
        const option = document.createElement("option");
        option.value = node.id;
        option.textContent = node.label;
        sourceNodeSelect.appendChild(option);
    });
}

// Function to update the edge relaxation order display
function updateEdgeRelaxationOrderDisplay() {
    if (customEdgeOrder.length === 0) {
        edgeRelaxationOrderDisplay.textContent = "No edges defined yet";
        return;
    }

    const edgeTexts = customEdgeOrder.map(edgeId => {
        const edge = customData.edges.get(edgeId);
        return edge ? `(${edge.from}, ${edge.to})` : edgeId;
    });

    edgeRelaxationOrderDisplay.textContent = edgeTexts.join(", ");
}

// Bellman-Ford implementation for custom graphs
function runBellmanFordAlgorithm(sourceNodeId, nodes, edges, edgeOrder) {
    console.log(`[DEBUG] Bellman-Ford algorithm started with source: ${sourceNodeId}`);
    console.time('Bellman-Ford Algorithm');

    // Initialize distances and predecessors
    const distances = {};
    const predecessor = {};

    nodes.forEach(node => {
        distances[node.id] = node.id === sourceNodeId ? 0 : Infinity;
        predecessor[node.id] = null;
    });

    console.log(`[DEBUG] Initialized distances:`, distances);

    console.log(`[DEBUG] Bellman-Ford requires ${nodes.length - 1} passes for a graph with ${nodes.length} nodes`);

    // |V|-1 passes
    for (let pass = 1; pass <= nodes.length -1 ; pass++) {
        console.log(`[DEBUG] Starting pass ${pass}/${nodes.length -1}`);
        console.time(`Pass ${pass}`);
        let relaxed = false;

        // For each edge in the specified order
        for (let edgeIndex = 0; edgeIndex < edgeOrder.length; edgeIndex++) {
            const edgeId = edgeOrder[edgeIndex];
            const edge = edges.find(e => e.id === edgeId);

            if (!edge) {
                console.warn(`[WARN] Edge ${edgeId} not found in edges list`);
                continue;
            }

            const u = edge.from;
            const v = edge.to;
            const weight = parseInt(edge.label);

            // Try to relax the edge
            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                // Edge can be relaxed
                console.log(`[DEBUG] Relaxing edge ${u}->${v} with weight ${weight}`);
                distances[v] = distances[u] + weight;
                predecessor[v] = u;
                relaxed = true;
            }
        }

        console.timeEnd(`Pass ${pass}`);

        // If no edges were relaxed in this pass, we can stop early
        if (!relaxed) {
            console.log(`[DEBUG] No edges relaxed in pass ${pass}, stopping early`);
            break;
        }
    }

    // Check for negative cycles (one more pass)
    console.log(`[DEBUG] Checking for negative cycles`);
    let hasNegativeCycle = false;
    let negativeCycle = [];

    for (let edgeIndex = 0; edgeIndex < edgeOrder.length; edgeIndex++) {
        const edgeId = edgeOrder[edgeIndex];
        const edge = edges.find(e => e.id === edgeId);

        if (!edge) continue;

        const u = edge.from;
        const v = edge.to;
        const weight = parseInt(edge.label);

        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
            console.log(`[DEBUG] Negative cycle detected at edge ${u}->${v}`);
            hasNegativeCycle = true;

            // Try to find the negative cycle
            let current = v;
            const visited = new Set();

            console.log(`[DEBUG] Tracing negative cycle starting from ${v}`);
            while (current && !visited.has(current)) {
                visited.add(current);
                negativeCycle.unshift(current);
                current = predecessor[current];

                // If we've reached the source or a node that's already in the cycle
                if (current === sourceNodeId || (negativeCycle.includes(current) && negativeCycle[0] !== current)) {
                    break;
                }

                // Safety check to prevent infinite loops
                if (negativeCycle.length > nodes.length * 2) {
                    console.error(`[ERROR] Possible infinite loop in negative cycle detection`);
                    break;
                }
            }

            // Ensure we have a complete cycle
            if (current && negativeCycle.includes(current)) {
                const startIndex = negativeCycle.indexOf(current);
                negativeCycle = negativeCycle.slice(startIndex);
            }

            console.log(`[DEBUG] Negative cycle found: ${negativeCycle.join(' -> ')}`);
            break;
        }
    }

    console.timeEnd('Bellman-Ford Algorithm');
    console.log(`[DEBUG] Algorithm completed with distances:`, distances);

    return {
        distances,
        predecessor,
        hasNegativeCycle,
        negativeCycle
    };
}

// Function to display custom results
function displayCustomResults(result, sourceNodeId) {
    console.log(`[DEBUG] Displaying custom results`);
    console.time('Display Results');

    // Show results section
    customResultsDiv.style.display = "block";

    // Clear previous results
    customResultsData.nodes.clear();
    customResultsData.edges.clear();
    customDistancesTable.innerHTML = "";

    const { distances, predecessor, hasNegativeCycle, negativeCycle } = result;

    // Add nodes to the results visualization
    console.log(`[DEBUG] Adding nodes to results visualization`);
    customData.nodes.get().forEach(node => {
        const newNode = { ...node };

        // Highlight the source node
        if (node.id === sourceNodeId) {
            newNode.color = { background: "#4CAF50", border: "#2E7D32" };
        }

        // Highlight negative cycle nodes
        if (hasNegativeCycle && negativeCycle.includes(node.id)) {
            newNode.color = { background: "#f44336", border: "#d32f2f" };
        }

        // Add distance label to the node
        const distance = distances[node.id];
        newNode.label = `${node.id}\n${distance === Infinity ? "∞" : distance}`;

        customResultsData.nodes.add(newNode);
    });

    // Add shortest path edges to the visualization
    console.log(`[DEBUG] Adding path edges to results visualization`);
    customData.nodes.get().forEach(node => {
        if (node.id !== sourceNodeId && predecessor[node.id] !== null) {
            const edgeId = `${predecessor[node.id]}-${node.id}-path`;

            // Check if the edge is part of a negative cycle
            const isInNegativeCycle = hasNegativeCycle &&
                negativeCycle.includes(node.id) &&
                negativeCycle.includes(predecessor[node.id]);

            customResultsData.edges.add({
                id: edgeId,
                from: predecessor[node.id],
                to: node.id,
                arrows: "to",
                color: isInNegativeCycle ?
                    { color: "#f44336", highlight: "#d32f2f" } :
                    { color: "#4CAF50", highlight: "#45a049" },
                width: 3,
                dashes: false
            });
        }
    });

    // Add rows to the distances table
    console.log(`[DEBUG] Building distances table`);
    Object.keys(distances).sort().forEach(node => {
        const distance = distances[node];
        let path = "";

        // Construct the path
        if (node === sourceNodeId) {
            path = sourceNodeId;
        } else if (distance === Infinity) {
            path = "No path";
        } else if (hasNegativeCycle && negativeCycle.includes(node)) {
            path = "In negative cycle";
        } else {
            // Trace back through predecessors
            let current = node;
            const pathNodes = [current];
            let safetyCounter = 0;

            while (predecessor[current] !== null && safetyCounter < 100) {
                current = predecessor[current];
                pathNodes.unshift(current);
                safetyCounter++;

                if (safetyCounter >= 99) {
                    console.error(`[ERROR] Possible cycle in path tracing for node ${node}`);
                    break;
                }
            }

            path = pathNodes.join(" → ");
        }

        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${node}</td>
      <td>${distance === Infinity ? '<span class="infinity">∞</span>' : distance}</td>
      <td>${path}</td>
    `;

        // Highlight negative cycle rows
        if (hasNegativeCycle && negativeCycle.includes(node)) {
            row.classList.add("negative-cycle");
        }

        customDistancesTable.appendChild(row);
    });

    // Display summary
    if (hasNegativeCycle) {
        customResultsSummary.innerHTML = `
      <p class="negative-cycle">Negative cycle detected! The graph contains a negative weight cycle involving nodes: ${negativeCycle.join(" → ")} → ${negativeCycle[0]}</p>
      <p>This means there is no well-defined shortest path for some vertices, as the path length can be made arbitrarily small by traversing the negative cycle repeatedly.</p>
    `;
    } else {
        customResultsSummary.innerHTML = `
      <p>The Bellman-Ford algorithm has successfully computed all shortest paths from the source vertex '${sourceNodeId}'.</p>
    `;
    }

    console.timeEnd('Display Results');
    console.log(`[DEBUG] Results display complete`);
}

// Global variables for state tracking
let currentStep = 0;
let algorithmSteps = [];
let customEdgeOrder = [];

// Global variables for DOM elements
let passCounter;
let edgeCounter;
let stepDescription;
let distancesContent;
let relaxationDetails;
let prevButton;
let nextButton;
let restartButton;
let algorithmStepsTable;
let sourceNodeSpan;
let edgeOrderSpan;
let addNodeBtn;
let removeNodeBtn;
let addEdgeBtn;
let removeEdgeBtn;
let clearGraphBtn;
let loadDefaultBtn;
let runBellmanFordBtn;
let sourceNodeSelect;
let customResultsDiv;
let customDistancesTable;
let customResultsSummary;
let edgeRelaxationOrderDisplay;
let reorderEdgesBtn;
let resetOrderBtn;
let originalData;
let algorithmData;
let customData;
let customResultsData;
let originalNetwork;
let algorithmNetwork;
let customNetwork;
let customResultsNetwork;


// Initialize app function
function initApp() {
    // Initialize the default steps
    initializeDefaultSteps();

    // Set algorithm steps
    algorithmSteps = [...defaultAlgorithmSteps];

    // Initialize custom edge order
    customEdgeOrder = [];

    // DOM Elements setup - use the global variables
    passCounter = document.getElementById("pass-counter");
    edgeCounter = document.getElementById("edge-counter");
    stepDescription = document.getElementById("step-description");
    distancesContent = document.getElementById("distances-content");
    relaxationDetails = document.getElementById("relaxation-details");
    prevButton = document.getElementById("prev-step");
    nextButton = document.getElementById("next-step");
    restartButton = document.getElementById("restart");
    algorithmStepsTable = document.getElementById("algorithm-steps").getElementsByTagName("tbody")[0];
    sourceNodeSpan = document.getElementById("source-node");
    edgeOrderSpan = document.getElementById("edge-order");

    // UI Element references for custom graph
    addNodeBtn = document.getElementById("add-node");
    removeNodeBtn = document.getElementById("remove-node");
    addEdgeBtn = document.getElementById("add-edge");
    removeEdgeBtn = document.getElementById("remove-edge");
    clearGraphBtn = document.getElementById("clear-graph");
    loadDefaultBtn = document.getElementById("load-default");
    runBellmanFordBtn = document.getElementById("run-bellman-ford");
    sourceNodeSelect = document.getElementById("source-node-select");
    customResultsDiv = document.getElementById("custom-results");
    customDistancesTable = document.getElementById("custom-distances").getElementsByTagName("tbody")[0];
    customResultsSummary = document.getElementById("custom-results-summary");
    edgeRelaxationOrderDisplay = document.getElementById("edge-relaxation-order");
    reorderEdgesBtn = document.getElementById("reorder-edges");
    resetOrderBtn = document.getElementById("reset-order");

    // Create networks for default demo
    const originalContainer = document.getElementById("original-graph");
    const algorithmContainer = document.getElementById("algorithm-graph");

    originalData = {
        nodes: new vis.DataSet(defaultNodes),
        edges: new vis.DataSet(defaultEdges)
    };

    algorithmData = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };

    originalNetwork = new vis.Network(originalContainer, originalData, options);
    algorithmNetwork = new vis.Network(algorithmContainer, algorithmData, options);

    // Create network for custom graph
    const customContainer = document.getElementById("custom-graph");
    const customResultsContainer = document.getElementById("custom-result-graph");

    customData = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };

    customResultsData = {
        nodes: new vis.DataSet([]),
        edges: new vis.DataSet([])
    };

    customNetwork = new vis.Network(customContainer, customData, options);
    customResultsNetwork = new vis.Network(customResultsContainer, customResultsData, options);


    // Event handlers
    nextButton.addEventListener("click", () => {
        console.log(`[DEBUG] Next button clicked, current step: ${currentStep}`);
        if (currentStep < algorithmSteps.length - 1) {
            currentStep++;
            console.log(`[DEBUG] Moving to step ${currentStep}`);
            updateVisualization();
        }
    });

    prevButton.addEventListener("click", () => {
        console.log(`[DEBUG] Previous button clicked, current step: ${currentStep}`);
        if (currentStep > 0) {
            currentStep--;
            console.log(`[DEBUG] Moving to step ${currentStep}`);
            updateVisualization();
        }
    });

    restartButton.addEventListener("click", () => {
        console.log(`[DEBUG] Restart button clicked`);
        currentStep = 0;
        algorithmStepsTable.innerHTML = "";
        updateVisualization();
    });

    // Add a new node to the custom graph
    addNodeBtn.addEventListener("click", () => {
        const nodeId = document.getElementById("node-id").value.trim();

        if (!nodeId) {
            alert("Please enter a node label");
            return;
        }

        // Check if node already exists
        if (customData.nodes.get(nodeId)) {
            alert(`Node '${nodeId}' already exists!`);
            return;
        }

        customData.nodes.add({
            id: nodeId,
            label: nodeId
        });

        updateSourceNodeSelect();
    });

    // Remove a node from the custom graph
    removeNodeBtn.addEventListener("click", () => {
        const nodeId = document.getElementById("node-id").value.trim();

        try {
            // First, remove any edges connected to this node
            const edges = customData.edges.get();
            const edgesToRemove = edges.filter(edge => edge.from === nodeId || edge.to === nodeId);

            edgesToRemove.forEach(edge => {
                customData.edges.remove(edge.id);

                // Also remove from custom edge order
                const index = customEdgeOrder.indexOf(edge.id);
                if (index !== -1) {
                    customEdgeOrder.splice(index, 1);
                }
            });

            // Then remove the node
            customData.nodes.remove(nodeId);
            updateSourceNodeSelect();
            updateEdgeRelaxationOrderDisplay();
        } catch (error) {
            alert(`Failed to remove node '${nodeId}': ${error.message}`);
        }
    });

    // Add an edge to the custom graph
    addEdgeBtn.addEventListener("click", () => {
        const fromNode = document.getElementById("edge-from").value.trim();
        const toNode = document.getElementById("edge-to").value.trim();
        const weight = parseInt(document.getElementById("edge-weight").value);

        if (!fromNode || !toNode) {
            alert("Please enter both source and target node labels");
            return;
        }

        // Check if nodes exist
        if (!customData.nodes.get(fromNode)) {
            alert(`Node '${fromNode}' does not exist! Please add it first.`);
            return;
        }

        if (!customData.nodes.get(toNode)) {
            alert(`Node '${toNode}' does not exist! Please add it first.`);
            return;
        }

        // Check if edge already exists
        const edgeId = `${fromNode}-${toNode}`;

        if (customData.edges.get(edgeId)) {
            alert(`Edge from '${fromNode}' to '${toNode}' already exists!`);
            return;
        }

        // Add edge
        customData.edges.add({
            id: edgeId,
            from: fromNode,
            to: toNode,
            label: weight.toString(),
            arrows: "to"
        });

        // Add to custom edge order
        customEdgeOrder.push(edgeId);
        updateEdgeRelaxationOrderDisplay();
    });

    // Remove an edge from the custom graph
    removeEdgeBtn.addEventListener("click", () => {
        const fromNode = document.getElementById("edge-from").value.trim();
        const toNode = document.getElementById("edge-to").value.trim();

        if (!fromNode || !toNode) {
            alert("Please enter both source and target node labels");
            return;
        }

        const edgeId = `${fromNode}-${toNode}`;

        try {
            if (customData.edges.get(edgeId)) {
                customData.edges.remove(edgeId);

                // Also remove from custom edge order
                const index = customEdgeOrder.indexOf(edgeId);
                if (index !== -1) {
                    customEdgeOrder.splice(index, 1);
                }

                updateEdgeRelaxationOrderDisplay();
            } else {
                alert(`Edge from '${fromNode}' to '${toNode}' does not exist!`);
            }
        } catch (error) {
            alert(`Failed to remove edge: ${error.message}`);
        }
    });

    // Auto-order edges (alphabetically by source then target)
    reorderEdgesBtn.addEventListener("click", () => {
        const edges = customData.edges.get();

        if (edges.length === 0) {
            alert("No edges to order");
            return;
        }

        // Sort edges by source node, then by target node
        edges.sort((a, b) => {
            if (a.from !== b.from) {
                return a.from.localeCompare(b.from);
            }
            return a.to.localeCompare(b.to);
        });

        // Update the custom edge order
        customEdgeOrder = edges.map(edge => edge.id);
        updateEdgeRelaxationOrderDisplay();
    });

    // Reset edge order to default (order of addition)
    resetOrderBtn.addEventListener("click", () => {
        const edges = customData.edges.get();

        if (edges.length === 0) {
            alert("No edges to order");
            return;
        }

        // Reset to original IDs order
        customEdgeOrder = edges.map(edge => edge.id);
        updateEdgeRelaxationOrderDisplay();
    });

    // Clear the custom graph
    clearGraphBtn.addEventListener("click", () => {
        customData.nodes.clear();
        customData.edges.clear();
        customResultsData.nodes.clear();
        customResultsData.edges.clear();
        customDistancesTable.innerHTML = "";
        customResultsSummary.innerHTML = "";
        customResultsDiv.style.display = "none";
        customEdgeOrder = [];
        updateSourceNodeSelect();
        updateEdgeRelaxationOrderDisplay();
    });

    // Load the default graph into the custom graph
    loadDefaultBtn.addEventListener("click", () => {
        // Clear existing data
        customData.nodes.clear();
        customData.edges.clear();

        // Add default nodes and edges
        defaultNodes.forEach(node => {
            customData.nodes.add(node);
        });

        defaultEdges.forEach(edge => {
            customData.edges.add(edge);
        });

        // Set custom edge order to default edge order
        customEdgeOrder = [...defaultEdgeOrder];

        updateSourceNodeSelect();
        updateEdgeRelaxationOrderDisplay();
    });

    // Run Bellman-Ford algorithm on the custom graph
    runBellmanFordBtn.addEventListener("click", () => {
        console.log(`[DEBUG] Run Bellman-Ford button clicked`);
        const nodes = customData.nodes.get();
        const edges = customData.edges.get();

        console.log(`[DEBUG] Running algorithm with ${nodes.length} nodes and ${edges.length} edges`);

        // Check if there are nodes
        if (nodes.length === 0) {
            alert("Please add nodes to the graph first.");
            return;
        }

        // Check if there are edges
        if (edges.length === 0) {
            alert("Please add edges to the graph first.");
            return;
        }

        // Check if all edges are in the order list
        const missingEdges = edges.filter(edge => !customEdgeOrder.includes(edge.id));
        if (missingEdges.length > 0) {
            alert("Some edges are missing from the relaxation order. Please reorder edges.");
            return;
        }

        // Get source node
        const sourceNodeId = sourceNodeSelect.value;
        console.log(`[DEBUG] Source node: ${sourceNodeId}`);

        // Run Bellman-Ford algorithm
        console.log(`[DEBUG] Starting Bellman-Ford algorithm execution`);
        const result = runBellmanFordAlgorithm(sourceNodeId, nodes, edges, customEdgeOrder);
        console.log(`[DEBUG] Algorithm complete, has negative cycle: ${result.hasNegativeCycle}`);

        // Display results
        console.log(`[DEBUG] Displaying custom results`);
        displayCustomResults(result, sourceNodeId);
    });

    // Add tab navigation
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");

            // Update active tab
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Update active content
            tabContents.forEach(content => content.classList.remove("active"));
            document.getElementById(`${tabId}-content`).classList.add("active");
        });
    });

    // Initialize visualization
    updateVisualization();

    // Initialize custom graph with default data
    loadDefaultBtn.click();

    console.log("[DEBUG] Application initialized successfully");
}

// Add initialization debugging
console.log(`[DEBUG] Starting application initialization`);
console.log(`[DEBUG] Default nodes: ${defaultNodes.length}, edges: ${defaultEdges.length}`);

// Try to catch any errors during initialization
try {
    // Initialize the app when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log(`[DEBUG] DOM fully loaded, initializing app`);
        initApp();
    });

    // Log event to indicate page is fully loaded
    window.addEventListener('load', () => {
        console.log(`[DEBUG] Page fully loaded`);
    });
} catch (error) {
    console.error(`[ERROR] Exception during initialization:`, error);
}