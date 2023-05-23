import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Centerline Labeling Utility

Based on this [Centerline labeling](https://observablehq.com/@veltman/centerline-labeling) by [Noah Veltman](https://observablehq.com/@veltman), but structured so you can easily import and use it yourself.
`
)}

function _2(md){return(
md`## Example`
)}

function _place(radio,places){return(
radio({
  options: places.features.map(f => f.properties.name),
  value: "California"
})
)}

function _4(places,place,d3,width,svg,renderCenterlineLabel,computeCenterlineLabel)
{
  // Rescale to fit at the current screen width

  const height = 400;
  const feature = places.features.find(f => f.properties.name === place);

  const projection = d3
    .geoIdentity()
    .fitExtent([[5, 5], [width - 5, height - 5]], feature);

  const computeOuterRing = (projection, feature) => {
    const s = projection.scale(),
      t = projection.translate();

    return feature.geometry.coordinates[0][0]
      .slice(1)
      .map(point => [s * point[0] + t[0], s * point[1] + t[1]]);
  };

  const background = d3.geoPath().projection(projection)(feature);

  return svg`<svg width=${width} height=${height}>
    <path d="${background}" stroke="#444" fill="#f9f9f9"/>
   ${renderCenterlineLabel(
     computeCenterlineLabel({
       label: place,
       polygon: computeOuterRing(projection, feature)
     })
   )}

  </svg>`;
}


function _places(d3){return(
d3.json(
  "https://gist.githubusercontent.com/veltman/644f16a90259a20a88b036ef189d71fd/raw/d2f0a027bfc9b63ca223b509bd2cfe0cf5d138c2/places.geojson"
)
)}

function _6(md){return(
md`## API`
)}

function _computeCenterlineLabel(getPointsAlongPolyline,computeVoronoi,computeEdges,computeNodes,computeTraversal,computeCenterline,computeMeasurements,computeMaxFontSize){return(
({
  label,
  polygon,
  numPerimeterPoints = 20, // 10 - 200
  measurementStep = 5, // 1 - 25
  offset = 0.5, // 0 - 1
  simplification = 10, // 0.1 - 50
  strategy = "medium"
  // strategy can be one of:
  //
  //   "longest" - Just take the longest one"
  //   "medium" - Care a little about straightness
  //   "high" - Care a lot about straightness
} = {}) => {
  const simplifiedPolygon = getPointsAlongPolyline(polygon, numPerimeterPoints);
  const voronoi = computeVoronoi(simplifiedPolygon);
  const edges = computeEdges(voronoi, polygon);
  const nodes = computeNodes(edges);
  const traversal = computeTraversal(nodes, strategy);
  const centerline = computeCenterline(traversal, simplification);
  const measurements = computeMeasurements(
    simplifiedPolygon,
    centerline,
    offset,
    measurementStep
  );
  const maxFontSize = computeMaxFontSize(label, measurements, measurementStep);

  return { simplifiedPolygon, centerline, offset, label, maxFontSize };
}
)}

function _renderCenterlineLabel(DOM,svg){return(
({ centerline, offset, maxFontSize, label }) => {
  const { id, href } = DOM.uid("centerline"); // necessary for Firefox
  return svg`
    <path d=${centerline} id="${id}" stroke="none" fill="none" />
    <text class="label" dy="0.35em" fill="#444" style="font-size: ${maxFontSize}px;">
      <textPath xlink:href="${href}" startOffset="${100 *
    offset}%" text-anchor="middle">${label}</textPath>
    </text>
  `;
}
)}

function _styles(html,css){return(
html`<style>${css}</style>`
)}

function _css(){return(
`
.label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-weight: 500;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`
)}

function _11(md){return(
md`## Core Algrithm Code`
)}

function _computeOuterRing(){return(
(projection, feature) => {
  const s = projection.scale(),
    t = projection.translate();

  return feature.geometry.coordinates[0][0]
    .slice(1)
    .map(point => [s * point[0] + t[0], s * point[1] + t[1]]);
}
)}

function _computeVoronoi(d3){return(
polygon => {
  const [x0, x1] = d3.extent(polygon.map(d => d[0]));
  const [y0, y1] = d3.extent(polygon.map(d => d[1]));
  const v = d3.voronoi().extent([[x0 - 1, y0 - 1], [x1 + 1, y1 + 1]]);
  return v(polygon).edges;
}
)}

function _computeEdges(d3,findClosestPolygonIntersection,distanceBetween){return(
(voronoi, polygon) =>
  voronoi
    .filter(edge => {
      if (edge && edge.right) {
        const inside = edge.map(point => d3.polygonContains(polygon, point));
        if (inside[0] === inside[1]) {
          return inside[0];
        }
        if (inside[1]) {
          edge.reverse();
        }
        return true;
      }
      return false;
    })
    .map(([start, end] = []) => {
      const { intersection, distance } = findClosestPolygonIntersection(
        start,
        end,
        polygon
      );

      if (intersection) {
        intersection.clipped = true;
      }

      // Each edge has a starting point, a clipped end point, and an original end point
      const edge = [start, intersection || end];
      edge.distance = intersection ? distance : distanceBetween(start, end);

      return edge;
    })
)}

function _computeNodes(){return(
edges => {
  const nodes = [];

  edges.forEach(edge => {
    edge.forEach((node, i) => {
      if (!i || !node.clipped) {
        const match = nodes.find(d => d === node);
        if (match) {
          return (node.id = match.id);
        }
      }
      node.id = nodes.length.toString();
      node.links = {};
      nodes.push(node);
    });
    edge[0].links[edge[1].id] = edge.distance;
    edge[1].links[edge[0].id] = edge.distance;
  });

  return nodes;
}
)}

function _computeTraversal(Graph,fitnessFunction){return(
function computeTraversal(nodes, strategy) {
  const perimeterNodes = nodes.filter(d => d.clipped);
  const graph = new Graph();
  nodes.forEach(node => graph.addNode(node.id, node.links));

  let totalBest;

  for (let i = 0; i < perimeterNodes.length; i++) {
    const start = perimeterNodes[i];
    const longestShortestPath = perimeterNodes
      .slice(i + 1)
      .reduce((nodeBest, node) => {
        const path = graph.path(node.id, start.id, { cost: true });
        if (path && (!nodeBest || path.cost > nodeBest.cost)) {
          return path;
        }
        return nodeBest;
      }, null);

    if (longestShortestPath && longestShortestPath.path) {
      longestShortestPath.path = longestShortestPath.path.map(id => nodes[+id]);
      longestShortestPath.cost = fitnessFunction(
        longestShortestPath.path,
        longestShortestPath.cost,
        strategy
      );
      if (!totalBest || longestShortestPath.cost > totalBest.cost) {
        totalBest = longestShortestPath;
      }
    }
  }

  return totalBest.path;
}
)}

function _computeFlip(){return(
simplifiedLine => {
  const [[x0, y0], [x1, y1]] = [
    simplifiedLine[0],
    simplifiedLine[simplifiedLine.length - 1]
  ];
  const tangent = Math.atan2(y1 - y0, x1 - x0);
  return Math.abs(tangent) > Math.PI / 2;
}
)}

function _computeCenterline(simplify,computeFlip,d3){return(
(path, simplification) => {
  const simplifiedLine = simplify(path, simplification);
  const flipText = computeFlip(simplifiedLine);

  return d3.line().curve(d3.curveBasis)(
    flipText ? simplifiedLine.slice(0).reverse() : simplifiedLine
  );
}
)}

function _computeMaxFontSize(computeBbox){return(
(label, measurements, measurementStep) => {
  const bbox = computeBbox(label);
  const widthPerPixel = bbox.width / 100;
  const aspectRatio = bbox.width / bbox.height;
  let ceiling = Infinity,
    maxWidth = 0;

  measurements.forEach((pair, i) => {
    pair.forEach(measurement => {
      ceiling = Math.min(measurement.distance, ceiling);
    });
    maxWidth = Math.max(
      maxWidth,
      2 * Math.min(i * measurementStep, ceiling * aspectRatio)
    );
  });

  return maxWidth / widthPerPixel;
}
)}

function _computeMeasurements(DOM,d3,tangentAt,findClosestPolygonIntersection,rotatePoint,width){return(
(polygon, centerline, offset, measurementStep) => {
  const svg = DOM.svg(1, 1);

  const path = d3
    .select(svg)
    .append("path")
    .attr("d", centerline)
    .node();

  const length = path.getTotalLength();

  const measurements = [];

  for (
    let halfwidth = 0;
    halfwidth < Math.min(length * offset, length * (1 - offset));
    halfwidth += measurementStep
  ) {
    measurements.push(
      [length * offset + halfwidth, length * offset - halfwidth]
        .map(l => {
          const { x, y } = path.getPointAtLength(l),
            tangent = tangentAt(path, l);

          const perpendiculars = [tangent - Math.PI / 2, tangent + Math.PI / 2]
            .map(angle =>
              findClosestPolygonIntersection(
                [x, y],
                rotatePoint([x + width, y], angle, [x, y]),
                polygon
              )
            )
            .filter(d => d.intersection)
            .sort((a, b) => a.distance - b.distance);

          if (!perpendiculars.length) {
            return null;
          }

          const { intersection, distance } = perpendiculars[0];

          const line = [
            intersection,
            [2 * x - intersection[0], 2 * y - intersection[1]]
          ];

          line.distance = distance;

          return line;
        })
        .filter(d => d)
    );
  }

  return measurements;
}
)}

function _computeBbox(DOM,d3){return(
label => {
  const svg = DOM.svg(1, 1);

  const text = d3
    .select(svg)
    .append("text")
    .attr("class", "label")
    .style("font-size", "100px")
    .text(label)
    .node();
  document.body.appendChild(svg);
  const boundingBox = text.getBBox();
  document.body.removeChild(svg);
  return boundingBox;
}
)}

function _22(md){return(
md`## Helper Code`
)}

function _fitnessFunction(distanceBetween){return(
function fitnessFunction(path, length, strategy) {
  let fitness = length;
  if (strategy !== "longest") {
    const sinuosity = length / distanceBetween(path[0], path[path.length - 1]);

    // divide the length by some power of the sinuosity
    // these choices are arbitrary, play with them!
    fitness /= Math.pow(sinuosity, strategy === "medium" ? 2 : 4);
  }
  return fitness;
}
)}

function _findClosestPolygonIntersection(findIntersection,distanceBetween){return(
function findClosestPolygonIntersection(start, end, polygon) {
  return polygon.reduce((best, point, i) => {
      const intersection = findIntersection(start, end, point, polygon[i + 1] || polygon[0]);
      if (intersection) {
        const distance = distanceBetween(start, intersection);
        if (!best.distance || distance < best.distance) {
          return { intersection, distance };
        }
      }
      return best;
  }, {});
}
)}

function _getPointsAlongPolyline(distanceBetween,d3){return(
function getPointsAlongPolyline(polyline, count) {
  const distances = polyline.map((p, i) =>
    distanceBetween(p, polyline[i + 1] || polyline[0])
  );
  const totalLength = d3.sum(distances);
  const step = totalLength / count;
  let traversed = 0;
  let next = step / 2;

  const done = polyline.reduce((arr, point, i) => {
    while (next < traversed + distances[i]) {
      let a = point,
        b = polyline[i + 1] || polyline[0],
        pct = (next - traversed) / distances[i];
      arr.push([a[0] + (b[0] - a[0]) * pct, a[1] + (b[1] - a[1]) * pct]);
      next += step;
    }
    traversed += distances[i];
    return arr;
  }, []);
  return done;
}
)}

function _findIntersection(){return(
function findIntersection(a1, a2, b1, b2) {
  // Adapted from https://github.com/Turfjs/turf-line-slice-at-intersection
  const uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]),
    ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]),
    uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

  if (uB !== 0) {
    const ua = uaT / uB,
      ub = ubT / uB;
    if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
      return [a1[0] + ua * (a2[0] - a1[0]), a1[1] + ua * (a2[1] - a1[1])];
    }
  }
}
)}

function _rotatePoint(){return(
function rotatePoint(point, angle, center) {

  const x2 = (point[0] - center[0]) * Math.cos(angle) - (point[1] - center[1]) * Math.sin(angle),
    y2 = (point[0] - center[0]) * Math.sin(angle) + (point[1] - center[1]) * Math.cos(angle);

  return [
    (point[0] - center[0]) * Math.cos(angle) - (point[1] - center[1]) * Math.sin(angle) + center[0],
    (point[0] - center[0]) * Math.sin(angle) + (point[1] - center[1]) * Math.cos(angle) + center[1]
  ];
}
)}

function _tangentAt(){return(
function tangentAt(el, len) {
  const [a, b] = [
    el.getPointAtLength(Math.max(len - 0.01, 0)),
    el.getPointAtLength(len + 0.01)
  ];

  return Math.atan2(b.y - a.y, b.x - a.x);
}
)}

function _distanceBetween(){return(
function distanceBetween(a, b) {
  const dx = a[0] - b[0],
    dy = a[1] - b[1];

  return Math.sqrt(dx * dx + dy * dy);
}
)}

function _Graph()
{
  // Observable-compatible stub of Alberto Restifo's node-dijsktra
  // https://github.com/albertorestifo/node-dijkstra
  class Queue {

    /**
     * Creates a new empty priority queue
     */
    constructor() {
      // The `keys` set is used to greatly improve the speed at which we can
      // check the presence of a value in the queue
      this.keys = new Set();
      this.queue = [];
    }

    /**
     * Sort the queue to have the least expensive node to visit on top
     *
     * @private
     */
    sort() {
      this.queue.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Sets a priority for a key in the queue.
     * Inserts it in the queue if it does not already exists.
     *
     * @param {any}     key       Key to update or insert
     * @param {number}  value     Priority of the key
     * @return {number} Size of the queue
     */
    set(key, value) {
      const priority = Number(value);
      if (isNaN(priority)) throw new TypeError('"priority" must be a number');

      if (!this.keys.has(key)) {
        // Insert a new entry if the key is not already in the queue
        this.keys.add(key);
        this.queue.push({ key, priority });
      } else {
        // Update the priority of an existing key
        this.queue.map((element) => {
          if (element.key === key) {
            Object.assign(element, { priority });
          }

          return element;
        });
      }

      this.sort();
      return this.queue.length;
    }

    /**
     * The next method is used to dequeue a key:
     * It removes the first element from the queue and returns it
     *
     * @return {object} First priority queue entry
     */
    next() {
      const element = this.queue.shift();

      // Remove the key from the `_keys` set
      this.keys.delete(element.key);

      return element;
    }

    /**
     * @return {boolean} `true` when the queue is empty
     */
    isEmpty() {
      return Boolean(this.queue.length === 0);
    }

    /**
     * Check if the queue has a key in it
     *
     * @param {any} key   Key to lookup
     * @return {boolean}
     */
    has(key) {
      return this.keys.has(key);
    }

    /**
     * Get the element in the queue with the specified key
     *
     * @param {any} key   Key to lookup
     * @return {object}
     */
    get(key) {
      return this.queue.find(element => element.key === key);
    }

  }

  class Graph {
    /**
     * Creates a new Graph, optionally initializing it a nodes graph representation.
     *
     * A graph representation is an object that has as keys the name of the point and as values
     * the points reacheable from that node, with the cost to get there:
     *
     *     {
     *       node (Number|String): {
     *         neighbor (Number|String): cost (Number),
     *         ...,
     *       },
     *     }
     *
     * In alternative to an object, you can pass a `Map` of `Map`. This will
     * allow you to specify numbers as keys.
     *
     * @param {Objec|Map} [graph] - Initial graph definition
     * @example
     *
     * const route = new Graph();
     *
     * // Pre-populated graph
     * const route = new Graph({
     *   A: { B: 1 },
     *   B: { A: 1, C: 2, D: 4 },
     * });
     *
     * // Passing a Map
     * const g = new Map()
     *
     * const a = new Map()
     * a.set('B', 1)
     *
     * const b = new Map()
     * b.set('A', 1)
     * b.set('C', 2)
     * b.set('D', 4)
     *
     * g.set('A', a)
     * g.set('B', b)
     *
     * const route = new Graph(g)
     */
    constructor(graph) {
      if (graph instanceof Map) {
        validateDeep(graph);
        this.graph = graph;
      } else if (graph) {
        this.graph = toDeepMap(graph);
      } else {
        this.graph = new Map();
      }
    }

    /**
     * Adds a node to the graph
     *
     * @param {string} name      - Name of the node
     * @param {Object|Map} neighbors - Neighbouring nodes and cost to reach them
     * @return {this}
     * @example
     *
     * const route = new Graph();
     *
     * route.addNode('A', { B: 1 });
     *
     * // It's possible to chain the calls
     * route
     *   .addNode('B', { A: 1 })
     *   .addNode('C', { A: 3 });
     *
     * // The neighbors can be expressed in a Map
     * const d = new Map()
     * d.set('A', 2)
     * d.set('B', 8)
     *
     * route.addNode('D', d)
     */
    addNode(name, neighbors) {
      let nodes;
      if (neighbors instanceof Map) {
        validateDeep(neighbors);
        nodes = neighbors;
      } else {
        nodes = toDeepMap(neighbors);
      }

      this.graph.set(name, nodes);

      return this;
    }

    /**
     * @deprecated since version 2.0, use `Graph#addNode` instead
     */
    addVertex(name, neighbors) {
      return this.addNode(name, neighbors);
    }

    /**
     * Removes a node and all of its references from the graph
     *
     * @param {string|number} key - Key of the node to remove from the graph
     * @return {this}
     * @example
     *
     * const route = new Graph({
     *   A: { B: 1, C: 5 },
     *   B: { A: 3 },
     *   C: { B: 2, A: 2 },
     * });
     *
     * route.removeNode('C');
     * // The graph now is:
     * // { A: { B: 1 }, B: { A: 3 } }
     */
    removeNode(key) {
      this.graph = removeDeepFromMap(this.graph, key);

      return this;
    }

    /**
     * Compute the shortest path between the specified nodes
     *
     * @param {string}  start     - Starting node
     * @param {string}  goal      - Node we want to reach
     * @param {object}  [options] - Options
     *
     * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
     * @param {boolean} [options.reverse] - Return the path in reversed order
     * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
     *
     * @return {array|object} Computed path between the nodes.
     *
     *  When `option.cost` is set to true, the returned value will be an object with shape:
     *    - `path` *(Array)*: Computed path between the nodes
     *    - `cost` *(Number)*: Cost of the path
     *
     * @example
     *
     * const route = new Graph()
     *
     * route.addNode('A', { B: 1 })
     * route.addNode('B', { A: 1, C: 2, D: 4 })
     * route.addNode('C', { B: 2, D: 1 })
     * route.addNode('D', { C: 1, B: 4 })
     *
     * route.path('A', 'D') // => ['A', 'B', 'C', 'D']
     *
     * // trimmed
     * route.path('A', 'D', { trim: true }) // => [B', 'C']
     *
     * // reversed
     * route.path('A', 'D', { reverse: true }) // => ['D', 'C', 'B', 'A']
     *
     * // include the cost
     * route.path('A', 'D', { cost: true })
     * // => {
     * //       path: [ 'A', 'B', 'C', 'D' ],
     * //       cost: 4
     * //    }
     */
    path(start, goal, options = {}) {
      // Don't run when we don't have nodes set
      if (!this.graph.size) {
        if (options.cost) return { path: null, cost: 0 };

        return null;
      }

      const explored = new Set();
      const frontier = new Queue();
      const previous = new Map();

      let path = [];
      let totalCost = 0;

      let avoid = [];
      if (options.avoid) avoid = [].concat(options.avoid);

      if (avoid.includes(start)) {
        throw new Error(`Starting node (${start}) cannot be avoided`);
      } else if (avoid.includes(goal)) {
        throw new Error(`Ending node (${goal}) cannot be avoided`);
      }

      // Add the starting point to the frontier, it will be the first node visited
      frontier.set(start, 0);

      // Run until we have visited every node in the frontier
      while (!frontier.isEmpty()) {
        // Get the node in the frontier with the lowest cost (`priority`)
        const node = frontier.next();

        // When the node with the lowest cost in the frontier in our goal node,
        // we can compute the path and exit the loop
        if (node.key === goal) {
          // Set the total cost to the current value
          totalCost = node.priority;

          let nodeKey = node.key;
          while (previous.has(nodeKey)) {
            path.push(nodeKey);
            nodeKey = previous.get(nodeKey);
          }

          break;
        }

        // Add the current node to the explored set
        explored.add(node.key);

        // Loop all the neighboring nodes
        const neighbors = this.graph.get(node.key) || new Map();
        neighbors.forEach((nCost, nNode) => {
          // If we already explored the node, or the node is to be avoided, skip it
          if (explored.has(nNode) || avoid.includes(nNode)) return null;

          // If the neighboring node is not yet in the frontier, we add it with
          // the correct cost
          if (!frontier.has(nNode)) {
            previous.set(nNode, node.key);
            return frontier.set(nNode, node.priority + nCost);
          }

          const frontierPriority = frontier.get(nNode).priority;
          const nodeCost = node.priority + nCost;

          // Otherwise we only update the cost of this node in the frontier when
          // it's below what's currently set
          if (nodeCost < frontierPriority) {
            previous.set(nNode, node.key);
            return frontier.set(nNode, nodeCost);
          }

          return null;
        });
      }

      // Return null when no path can be found
      if (!path.length) {
        if (options.cost) return { path: null, cost: 0 };

        return null;
      }

      // From now on, keep in mind that `path` is populated in reverse order,
      // from destination to origin

      // Remove the first value (the goal node) if we want a trimmed result
      if (options.trim) {
        path.shift();
      } else {
        // Add the origin waypoint at the end of the array
        path = path.concat([start]);
      }

      // Reverse the path if we don't want it reversed, so the result will be
      // from `start` to `goal`
      if (!options.reverse) {
        path = path.reverse();
      }

      // Return an object if we also want the cost
      if (options.cost) {
        return {
          path,
          cost: totalCost,
        };
      }

      return path;
    }

    /**
     * @deprecated since version 2.0, use `Graph#path` instead
     */
    shortestPath(...args) {
      return this.path(...args);
    }

  }

  function validateDeep(map) {
    if (!(map instanceof Map)) {
      throw new Error(`Invalid graph: Expected Map instead found ${typeof map}`);
    }

    map.forEach((value, key) => {
      if (typeof value === 'object' && value instanceof Map) {
        validateDeep(value);
        return;
      }

      if (typeof value !== 'number' || value <= 0) {
        throw new Error(`Values must be numbers greater than 0. Found value ${value} at ${key}`);
      }
    });
  }

  function toDeepMap(source) {
    const map = new Map();
    const keys = Object.keys(source);

    keys.forEach((key) => {
      const val = source[key];

      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        return map.set(key, toDeepMap(val));
      }

      if (!isValidNode(val)) {
        throw new Error(`Could not add node at key "${key}", make sure it's a valid node`, val);
      }

      return map.set(key, Number(val));
    });

    return map;
  }

  function isValidNode(val) {
    const cost = Number(val);

    if (isNaN(cost) || cost <= 0) {
      return false;
    }

    return true;
  }

  function removeDeepFromMap(map, key) {
    const newMap = new Map();

    for (const [aKey, val] of map) {
      if (aKey !== key && val instanceof Map) {
        newMap.set(aKey, removeDeepFromMap(val, key));
      } else if (aKey !== key) {
        newMap.set(aKey, val);
      }
    }

    return newMap;
  }

  return Graph;
}


function _simplify(simplifyJS){return(
function simplify(points, simplification) {
  // Convert from [x, y] to { x, y } and back for simplify-js
  return simplifyJS(
    points.map(p => ({ x: p[0], y: p[1] })),
    simplification
  ).map(p => [p.x, p.y]);
}
)}

function _32(md){return(
md`## Imports`
)}

function _simplifyJS(require){return(
require("simplify-js")
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof place")).define("viewof place", ["radio","places"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer()).define(["places","place","d3","width","svg","renderCenterlineLabel","computeCenterlineLabel"], _4);
  main.variable(observer("places")).define("places", ["d3"], _places);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("computeCenterlineLabel")).define("computeCenterlineLabel", ["getPointsAlongPolyline","computeVoronoi","computeEdges","computeNodes","computeTraversal","computeCenterline","computeMeasurements","computeMaxFontSize"], _computeCenterlineLabel);
  main.variable(observer("renderCenterlineLabel")).define("renderCenterlineLabel", ["DOM","svg"], _renderCenterlineLabel);
  main.variable(observer("styles")).define("styles", ["html","css"], _styles);
  main.variable(observer("css")).define("css", _css);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("computeOuterRing")).define("computeOuterRing", _computeOuterRing);
  main.variable(observer("computeVoronoi")).define("computeVoronoi", ["d3"], _computeVoronoi);
  main.variable(observer("computeEdges")).define("computeEdges", ["d3","findClosestPolygonIntersection","distanceBetween"], _computeEdges);
  main.variable(observer("computeNodes")).define("computeNodes", _computeNodes);
  main.variable(observer("computeTraversal")).define("computeTraversal", ["Graph","fitnessFunction"], _computeTraversal);
  main.variable(observer("computeFlip")).define("computeFlip", _computeFlip);
  main.variable(observer("computeCenterline")).define("computeCenterline", ["simplify","computeFlip","d3"], _computeCenterline);
  main.variable(observer("computeMaxFontSize")).define("computeMaxFontSize", ["computeBbox"], _computeMaxFontSize);
  main.variable(observer("computeMeasurements")).define("computeMeasurements", ["DOM","d3","tangentAt","findClosestPolygonIntersection","rotatePoint","width"], _computeMeasurements);
  main.variable(observer("computeBbox")).define("computeBbox", ["DOM","d3"], _computeBbox);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("fitnessFunction")).define("fitnessFunction", ["distanceBetween"], _fitnessFunction);
  main.variable(observer("findClosestPolygonIntersection")).define("findClosestPolygonIntersection", ["findIntersection","distanceBetween"], _findClosestPolygonIntersection);
  main.variable(observer("getPointsAlongPolyline")).define("getPointsAlongPolyline", ["distanceBetween","d3"], _getPointsAlongPolyline);
  main.variable(observer("findIntersection")).define("findIntersection", _findIntersection);
  main.variable(observer("rotatePoint")).define("rotatePoint", _rotatePoint);
  main.variable(observer("tangentAt")).define("tangentAt", _tangentAt);
  main.variable(observer("distanceBetween")).define("distanceBetween", _distanceBetween);
  main.variable(observer("Graph")).define("Graph", _Graph);
  main.variable(observer("simplify")).define("simplify", ["simplifyJS"], _simplify);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("simplifyJS")).define("simplifyJS", ["require"], _simplifyJS);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  return main;
}
