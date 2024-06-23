
<h1>Rumor Source Detection Problem</h1>
<img src="./img/sample.png" alt="Sample Image">

> [!WARNING]\
> Don't insert values of rumour affected nodes where the nodes belong to different communities/components of the graph network.

> [!NOTE]\
> Rumour affected nodes should belong to the same component/community of nodes as given in the sample below.

<p>Consider a network of nodes modeled as an undirected graph <i>G(V,E)</i>. Suppose the rumor starts at node <i>v*</i> at time <i>t<sub>0</sub></i> and has spread in the network <i>G</i>. Assume the network is observed at some time <i>t<sub>x</sub></i> and <i>N</i> infected nodes are found. By definition, these <i>N</i> infected nodes must form a connected subgraph of <i>G</i>. Let's denote this subgraph by <i>G<sub>N</sub></i>.
</p>
    
<p>The goal is to estimate a node <i>v</i> of the original source <i>v*</i> based on the observation. Mathematically,</p>

<div class="code">
    <i>v</i> = argmax<sub><i>v</i> ∈ <i>P(G)</i></sub> <i>R(v, G)</i> ......(1)
</div>

<p>Where <i>P(G | v)</i> is the probability of observing <i>G</i> under any information diffusion model assuming <i>v</i> is the source <i>v*</i>.</p>

<p>In DevabratShah’s algorithm, equation (1) is further simplified and refined as</p>

<div class="code">
    <i>v</i> = argmax<sub><i>v</i> ∈ <i>R(v, G)</i></sub> <i>R(v, G)</i> ......(2)
</div>

<p>Where <i>R(v, G)</i> is the total number of distinct permitted permutations of nodes of <i>G</i> that begin with node <i>v ∈ G</i> and respect the graph structure of <i>G</i>.</p>

<div class="section">
    <h2>Algorithm</h2>

<p><strong>Permutation:</strong> Given a connected Tree <i>G(V,E)</i> and source node <i>v ∈ V</i>, consider any permutation <i>σ: {1, 2, ..., V}</i> of nodes where <i>σ(a)</i> denotes the position of node <i>a ∈ V</i> in the permutation <i>σ</i>.</p>

<p><strong>Permitted Permutation:</strong> A permutation <i>σ</i> is referred to as a permitted permutation for <i>G(V,E)</i> with source node <i>v</i> if:</p>

<ol>
    <li>Starting node should be <i>v</i>, i.e., <i>σ<sub>v</sub> = 1</i>.</li>
    <li>For any edge <i>(a, b) ∈ E</i>, if <i>d(v, a) < d(v, b)</i>, then <i>σ(a) < σ(b)</i>.</li>
</ol>

<p>Let <i>Ω(v, G)</i> be the set of all permitted permutations starting with node <i>v</i> and graph <i>G</i>. Therefore, <i>Ω(v, G) = R(v, G)</i>.</p>

<p>To determine the source node, simply find the node <i>v</i> from <i>G</i> that maximizes <i>R(v, G)</i>.</p>
</div>

<div class="section">
    <h2>Example</h2>

<img src="./img/example.png" alt="Example Image">

<p><strong>Edges:</strong> (1, 2), (2, 3), (2, 4), (2, 1), (3, 2), (4, 2)</p>
<p><i>V</i> = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}</p>
<p><i>V<sub>n</sub></i> = {1, 2, 3, 4}</p>

<p>Permutations for <i>v = 1</i></p>
{1, 2, 3, 4}   PP<br>
{1, 2, 4, 3}   PP<br>
{1, 3, 2, 4}   X<br>
{1, 3, 4, 2}   X<br>
{1, 4, 2, 3}   X<br>
{1, 4, 3, 2}   X</p>

<p>Check if permutation {1, 2, 3, 4} is permitted:</p>

<div class="code">
    <!-- Example of permitted permutation -->
    For (1, 2) edge, <i>d(1, 1) &lt; d(1, 2)</i> and <i>σ(1) &lt; σ(2)</i><br>
    For (2, 3) edge, <i>d(1, 2) &lt; d(1, 3)</i> and <i>σ(2) &lt; σ(3)</i><br>
    For (2, 4) edge, <i>d(1, 2) &lt; d(1, 4)</i> and <i>σ(2) &lt; σ(4)</i><br>
    For (2, 1) edge, <i>d(1, 2) &not;&le; d(1, 1)</i><br>
    For (3, 2) edge, <i>d(1, 3) &not;&le; d(1, 2)</i><br>
    For (4, 2) edge, <i>d(1, 4) &not;&le; d(1, 2)</i><br>
    Therefore, {1, 2, 3, 4} is a permitted permutation
</div>

<p>Repeat similar checks for other permutations starting from node <i>v = 1</i>, and compute <i>R(v, G)</i> for <i>v = 2, 3, 4</i>.</p>

<p>At the end, the source node <i>v</i> with the highest <i>R(v, G)</i> value is considered as the estimated rumor source.</p>
</div>
