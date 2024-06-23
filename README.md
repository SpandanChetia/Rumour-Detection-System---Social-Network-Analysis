<div class="section">
    <h1>Rumor Source Detection Problem</h1>
    <img src="./img/sample.png" alt="Sample Image">
    <p>Consider a network of nodes modeled as an undirected graph \( G(V,E) \). Suppose the rumor starts at node \( v^* \) at time \( t_0 \) and has spread in the network \( G \). Assume the network is observed at some time \( t_x \) and \( N \) infected nodes are found. By definition, these \( N \) infected nodes must form a connected subgraph of \( G \). Let's denote this subgraph by \( G_N \).
    </p>
    
<p>The goal is to estimate a node \( v \) of the original source \( v^* \) based on the observation. Mathematically,</p>

<div class="code">
    \( v = \arg\max_{v \in \mathbb{P}(G)} R(v, G) \) ......(1)
</div>

<p>Where \( \mathbb{P}(G \mid v) \) is the probability of observing \( G \) under any information diffusion model assuming \( v \) is the source \( v^* \).</p>

<p>In DevabratShah’s algorithm, equation (1) is further simplified and refined as</p>

<div class="code">
    \( v = \arg\max_{v \in R(v, G)} R(v, G) \) ......(2)
</div>

<p>Where \( R(v, G) \) is the total number of distinct permitted permutations of nodes of \( G \) that begin with node \( v \in G \) and respect the graph structure of \( G \).</p>
</div>

<div class="section">
    <h2>Algorithm</h2>

<p><strong>Permutation:</strong> Given a connected Tree \( G(V,E) \) and source node \( v \in V \), consider any permutation \( \sigma: \{1,2,\ldots, V\} \) of nodes where \( \sigma(a) \) denotes the position of node \( a \in V \) in the permutation \( \sigma \).</p>

<p><strong>Permitted Permutation:</strong> A permutation \( \sigma \) is referred to as a permitted permutation for \( G(V,E) \) with source node \( v \) if:</p>

<ol>
    <li>Starting node should be \( v \), i.e., \( \sigma_v = 1 \).</li>
    <li>For any edge \( (a, b) \in E \), if \( d(v, a) < d(v, b) \), then \( \sigma(a) < \sigma(b) \).</li>
</ol>

<p>Let \( \Omega(v, G) \) be the set of all permitted permutations starting with node \( v \) and graph \( G \). Therefore, \( \Omega(v, G) = R(v, G) \ ).</p>

<p>To determine the source node, simply find the node \( v \) from \( G \) that maximizes \( R(v, G) \).</p>
</div>

<div class="section">
    <h2>Example</h2>

<img src="./img/example.png" alt="Example Image">

<p><strong>Edges:</strong> (1,2), (2,3), (2,4), (2,1), (3,2), (4,2)</p>
<p>V={1, 2, 3, 4, 5, 6, 7, 8, 9, 10}</p>
<p>V<sub>n</sub>={1, 2, 3, 4}

<p>Permutations for v=1
    {1, 2, 3, 4} PP
    {1, 2, 4, 3} PP
    {1, 3, 2, 4} X
    {1, 3, 4, 2} X
    {1, 4, 2, 3} X
    {1, 4, 3, 2} X</p>

<p>Check if permutation {1,2,3,4} is permitted:</p>

<div class="code">
    <!-- Example of permitted permutation -->
    For (1,2) edge, \( d(1,1) < d(1,2) \) and \( \sigma(1) < \sigma(2) \)<br>
    For (2,3) edge, \( d(1,2) < d(1,3) \) and \( \sigma(2) < \sigma(3) \)<br>
    For (2,4) edge, \( d(1,2) < d(1,4) \) and \( \sigma(2) < \sigma(4) \)<br>
    For (2,1) edge, \( d(1,2) \not\leq d(1,1) \)<br>
    For (3,2) edge, \( d(1,3) \not\leq d(1,2) \)<br>
    For (4,2) edge, \( d(1,4) \not\leq d(1,2) \)<br>
    Therefore, {1,2,3,4} is a permitted permutation
</div>

<p>Repeat similar checks for other permutations starting from node \( v = 1 \), and compute \( R(v, G) \) for \( v = 2, 3, 4 \).</p>

<p>At the end, the source node \( v \) with the highest \( R(v, G) \) value is considered as the estimated rumor source.</p>
</div>