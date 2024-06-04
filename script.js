const submit_btn = document.querySelector('#submit_btn');

let edges = [];
let rumournodes = [];

const createForms = (totalEdges) => {
    const edgeCollection = document.querySelector('#input-container');
    edgeCollection.innerHTML = ''; 
    for (let i = 1; i <= totalEdges; i++) {
        let sp = document.createElement('span');
        let ip = document.createElement('input');
        ip.id = `e${i}`;
        ip.type = "text";
        ip.placeholder = `Enter the edge no. ${i}`;
        
        ip.classList.add('edge-input');
        sp.classList.add('edge-container'); 
        sp.append(ip);
        
        edgeCollection.append(sp); 
    }
    const expectedHeight = totalEdges * 12; 

    edgeCollection.style.minHeight = `${expectedHeight}px`;

    const edgeSubmit = document.createElement('button');
    edgeSubmit.textContent = 'Submit';
    edgeSubmit.id = 'final_submit';

    edgeSubmit.classList.add('edge-submit-btn');

    edgeCollection.append(edgeSubmit);
};


const submitEdges = () => {
    const totalEdges = document.querySelector('#edge-input').value;
    const errorMessage = document.querySelector('#error-message');
    if (!totalEdges || isNaN(totalEdges)) {
        if (errorMessage) {
            errorMessage.textContent = 'Please enter a valid number of edges.';
            errorMessage.style.display = 'block';
        }
        return;
    }
    createForms(Number(totalEdges));
    edges = [];
    const edgeSub = document.querySelector('#final_submit');
    edgeSub.addEventListener('click', () => {
        for (let i = 1; i <= totalEdges; i++) {
            let val = document.querySelector(`#e${i}`).value.trim();
            let edge = val.split(' ');
            if (edge.length === 2 && !isNaN(edge[0]) && !isNaN(edge[1])) {
                edges.push(edge.map(Number));
            } else {
                if (errorMessage) {
                    errorMessage.textContent = `Please enter valid values for edge no. ${i}.`;
                    errorMessage.style.display = 'block';
                }
                return;
            }
        }
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        document.querySelector("#graph-container").innerHTML = "";
        visualizeGraph(); 
        rumourspread();
    });
};

const edge_submission = () => {
    submit_btn.addEventListener('click', submitEdges);
}


edge_submission();


const rumourfetching = () => {
    const rumourinput = document.querySelector('#rumourinp');
    rumournodes = [];
    let temp = rumourinput.value.trim();
    let nodes = temp.split(' ');
    rumournodes = nodes.map(Number);
    document.querySelector("#graph-container").innerHTML = "";
    visualizeGraph(); 
}


const rumourspread = () => {
    const rumourContainer = document.querySelector('#rumourinput');
    if (!rumourContainer) {
        console.error("Rumour container not found!");
        return;
    }
    rumourContainer.style.display = 'block';
    rumourContainer.style.marginBottom = '20px';
    const rumourbtn = document.querySelector('#Rumourbtn');
    rumourbtn.addEventListener('click', ()=>{
        rumourfetching();
        viewResults();
    });
}

const visualizeGraph = () => {
    // Derive nodes from edges
    const nodes = [...new Set(edges.flat())].map(id => ({ id: id - 1 }));

    // Prepare edges in the format D3.js expects
    const links = edges.map(([source, target]) => ({ source: source - 1, target: target - 1 }));

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
        .attr("fill", d => {
            if (rumournodes.length > 0) {
              return rumournodes.includes(d.id+1) ? "red" : "rgb(98, 9, 176)";
            } else {
              return "rgb(98, 9, 176)";
            }
          })
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
};

const permute = (nums) => {
    let results = [];

    if (nums.length === 0) return [];
    if (nums.length === 1) return [nums];

    for (let i = 0; i < nums.length; i++) {
        const currentNum = nums[i];
        const remainingNums = nums.slice(0, i).concat(nums.slice(i + 1));
        const remainingNumsPermuted = permute(remainingNums);

        for (let j = 0; j < remainingNumsPermuted.length; j++) {
            const permutedArray = [currentNum].concat(remainingNumsPermuted[j]);
            results.push(permutedArray);
        }
    }
    return results;
};

const generatePermutations = ()=>{
    let allPermutations = permute(rumournodes);

    let map = new Map();

    allPermutations.forEach(perm =>{
        let f = perm[0];
        if(!map.has(f)){
            map.set(f, []);
        }
        map.get(f).push(perm);
    });

    return map;
};

const generateEdges = ()=>{
    const rumourSet = new Set(rumournodes);

    const allrumourEdges = new Set();

    edges.forEach((edge)=>{
        const [a, b] = edge;

        if(rumourSet.has(a) && rumourSet.has(b)){
            const edge1 = `${a},${b}`;
            const edge2 = `${b},${a}`;

            allrumourEdges.add(edge1);
            allrumourEdges.add(edge2);
        }
    });

    const result = Array.from(allrumourEdges).map(edge => edge.split(',').map(Number));
    return result;
};

const bfs_distance = (start, end, adjList) =>{
    let distance = 0;

    const vis = new Set();
    let queue = [];

    vis.add(start);
    queue.push(start);
    while(queue.length>0){
        let size = queue.length;
        for(let i=0; i<size; i++){
            let node = queue.shift();

            if(node === end){
                return distance;
            }

            let neighbours = adjList.get(node) || [];
            neighbours.forEach((nx)=>{
                if(!vis.has(nx)){
                    queue.push(nx);
                    vis.add(nx);
                }
            });
            distance++;
        }
    }

    return -1;
};

const countPP = (key, value, adjList, rumouredges)=>{
    let count = 0;

    value.forEach((perm)=>{
        rumouredges.forEach((edge)=>{
            let f = edge[0];
            let s = edge[1];
            
            let a = bfs_distance(key, f, adjList);
            let b = bfs_distance(key, s, adjList);
            if(a!==-1 && b!==-1 && a < b && perm.indexOf(f) < perm.indexOf(s)){
                count++;
            }else if(a!==-1 && b!==-1 && a < b && perm.indexOf(f) >= perm.indexOf(s)){
                return 0;
            }
        });
    })
    
    return count;
    
};

const adjacencyList = ()=>{
    let graph = new Map();

    edges.forEach((edge)=>{
        const [a, b] = edge;

        if(!graph.has(a)){
            graph.set(a, []);
        }
        graph.get(a).push(b);

        if(!graph.has(b)){
            graph.set(b, []);
        }
        graph.get(b).push(a);
    });

    return graph;
};

const permittedPermutation = ()=>{
    const map = generatePermutations();
    const rumouredges = generateEdges();
    const adjList = adjacencyList();
    
    let result = new Map();
    map.forEach((value, key)=>{
        let count = countPP(key, value, adjList, rumouredges);
        result.set(key, count);
    });

    let ans = [];
    let maxi=0;
    result.forEach((value, key)=>{
        if(maxi < value){
            maxi = value;
            ans = [];
            ans.push(key);
        }else if(maxi === value){
            ans.push(key);
        }
    })

    return ans;
};

const viewResults = ()=>{
    let sourceNodes = permittedPermutation();
    let result_section = document.querySelector('#source');
    let result = "";

    for(let i=0; i<sourceNodes.length-1; i++){
        result += sourceNodes[i] + ',';
    }
    result += sourceNodes[sourceNodes.length-1];
    result_section.textContent = result;
    result_section.style.color = 'red';
};
