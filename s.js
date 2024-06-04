const submit_btn = document.querySelector('#submit_btn');
let edges = [];

const createForms = (totalEdges) => {
    const edgeCollection = document.querySelector('#input-container');
    edgeCollection.innerHTML = ''; // Clear previous inputs
    for (let i = 1; i <= totalEdges; i++) {
        let sp = document.createElement('span');
        let ip = document.createElement('input');
        ip.id = `e${i}`;
        ip.type = "text";
        ip.placeholder = `Enter the edge no. ${i}`;
        
        sp.style.display = 'flex';
        sp.style.flexDirection = 'row';
        sp.append(ip);
        
        edgeCollection.append(sp); 
    }

    const edgeSubmit = document.createElement('button');
    edgeSubmit.textContent = 'Submit';
    edgeSubmit.id = 'final_submit';

    edgeCollection.append(edgeSubmit);
};

const submitEdges = () => {
    const totalEdges = document.querySelector('#edge-input').value;
    if (!totalEdges || isNaN(totalEdges)) {
        document.querySelector('#error-message').textContent = 'Please enter a valid number of edges.';
        document.querySelector('#error-message').style.display = 'block';
        return;
    }
    createForms(Number(totalEdges));
    edges = []; // Reset edges array
    const edgeSub = document.querySelector('#final_submit');
    edgeSub.addEventListener('click', ()=>{
        for (let i = 1; i <= totalEdges; i++) {
            let val = document.querySelector(`#e${i}`).value.trim();
            let edge = val.split(' ');
            if (edge.length === 2 && !isNaN(edge[0]) && !isNaN(edge[1])) {
                edges.push(edge.map(Number));
            } else {
                document.querySelector('#error-message').textContent = `Please enter valid values for edge no. ${i}.`;
                document.querySelector('#error-message').style.display = 'block';
                return;
            }
        }
        document.querySelector('#error-message').style.display = 'none';
        visualizeGraph();
    })

};

// Function to visualize the graph
function visualizeGraph() {
    // Example edges array: [[source, target], [source, target], ...]
    /*
    const edges = [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 3],
        [3, 4],
        [0, 4]
    ];*/

    // Derive nodes from edges
    const nodes = [...new Set(edges.flat())].map(id => ({ id }));

    // Prepare edges in the format D3.js expects
    const links = edges.map(([source, target]) => ({ source, target }));

    // Set the dimensions and margins of the graph
    const width = 800;
    const height = 600;

    // Append the SVG object to the graph-container div
    const svg = d3.select("#graph-container").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add a group for the links
    const linkGroup = svg.append("g")
        .attr("class", "links");

    // Add a group for the nodes
    const nodeGroup = svg.append("g")
        .attr("class", "nodes");

    // Initialize the simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw the links (edges)
    const link = linkGroup.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    // Draw the nodes
    const node = nodeGroup.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    // Add labels to the nodes
    const labels = nodeGroup.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", -12) // Position the label slightly above the node
        .attr("text-anchor", "middle") // Center the text horizontally
        .text(d => d.id + 1); // Add 1 to convert zero-based index to one-based index

    // Update the positions of the nodes, links, and labels on each tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    // Functions to handle dragging of nodes
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

// Initialize the edge submission
const edge_submission = () => {
    submit_btn.addEventListener('click', submitEdges);
}

edge_submission();

