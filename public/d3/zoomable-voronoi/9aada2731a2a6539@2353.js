import define1 from "./d5919f39de095c9c@419.js";
import define2 from "./43a97601b98693ce@1370.js";
import define3 from "./abf5a722c906615a@2085.js";

function _1(md){return(
md`# Zoomable Voronoi Treemap
A general purpose zoomable [voronoi](https://en.wikipedia.org/wiki/Voronoi_diagram) [treemap](https://en.wikipedia.org/wiki/Treemapping) which uses [d3-voronoi-treemap](https://github.com/Kcnarf/d3-voronoi-treemap) to generate the layout.

### Features

  - Advanced automatic label placement via [Centerline Labeling Utility](https://observablehq.com/@trebor/centerline-labeling-utility), derived from [Noah Veltman](https://observablehq.com/@veltman)'s [Centerline Labeling](https://observablehq.com/@veltman/centerline-labeling).
  - Automatic hierarchical color distribution, to highlight tree structure.
  - Support for images in place of colors.
  - Node "relatedness" highlighting on hover.
  - Smooth shape transitions, based on [Noah Veltman](https://observablehq.com/@veltman)'s [Smoother polygon transitions](https://bl.ocks.org/veltman/4d1413aa5fd3bb5af1a806c146870031) algorithm.
  - Highly customizable

### Interactions
  - **Click** - zoom in one level
  - **Hover** - highlight tree structure & update the path
  - **Click** "**UP**" or **ESC** or **UP-ARROW** - zoom out one level
  - **Click on path element** - zoom to chosen path element

### Use

~~~js
import { renderChart } from "@trebor/zoomable-voronoi-treemap"
~~~

Use [renderChart](#renderChart) to render the treemap and the linked breadcrumb path. Call [renderMap](#renderMap) directly if you want just the map portion.  In both cases the **data** parameter must be a tree created with [d3-hierarchy](https://github.com/d3/d3-hierarchy#hierarchy).

### Customization

Many many different options can be passed into [renderChart](#renderChart) which will then be passed through  into [renderMap](#renderMap).  Have a look at the paramaters and their default values in [renderMap](#renderMap) to get a sense of how you can customise the chart.

### NOTE

- Be sure getId works!
`
)}

function _2(md){return(
md`## Examples

These use the bog standard flare data set with random values asigned to leaf nodes.
`
)}

async function _data(d3)
{
  let d3data;
  try {
    d3data = JSON.parse(localStorage.getItem('d3data'));
  } catch {
  }
  if (!d3data) {
    d3data = await d3.json(
        "https://raw.githubusercontent.com/d3/d3-hierarchy/master/test/data/flare.json"
    );
  }

  const defaultResult = d3.hierarchy(d3data).sum((d) => {
    return (d.children ? 0 : (d.size ?? 0.1) /*Math.random()*/);
  });
  return defaultResult;
}


function _4(md){return(
md`### Example - with default colors`
)}

function ___exampleChart(renderChart,data,width)
{
  return renderChart({
    data,
    size: { width: width - 20, height: 700 }
  });
}


function _6(md){return(
md`### Example - with images`
)}

function _sampleImages(){return(
{
  yellowCedder:
    "https://lh3.googleusercontent.com/vY5Qk4QoIO5xWgWz68Cdabgjp_M6UsXC4xWkVui7RBQZrS3FGl3mMt52EOQ8qD_QOEhuc6-VGEJj7gHq65dz78FWvH_StR7aBi0_Y4enravD4zXDmjRQkFBMlSvszhfRLJjytD0C2AnH-8r-GWvnnNceskDebnu8yiEn2x5iTzJnDzGrdax-hoycGeDa3AeDQShuUDwbzBuqSy9aM5Au3oufu6UZgcu82Jfx50bd_x_tXOcFo7pWTAi38MGP_vHeHbtzH0q-mbVxqgLWSEYiLmq2j3fX6_TfR22dE_TKf-gWgwZ-t2VLWA3Z9qDwvRl8dM75Jkw8ZHVhM73fZEKEe_nuIbCIB-FjtVDU31UBpf66u9d6MDC54aTQcizdoNysk0Afm9Y-2Yq4EKyWnwoROyadkilxhGdn9Fym7jFbrwFCuihDM6c_x6y4jCcPpOudC_6EoRGBUsZMO5SN2AUthUWthsZHkXDJoQBXjq8acX8lTltZU3tVCVTY6xi_qSOBvO2JnH8cY9K9fdXi2v2_1WRGttcFzs0ry5Q3zr2zyYFAEUaxa05Sjn5LACbJ5IJQkonYFxNQ2pBZOoca50mcBvCQNcqnezwopQi6IJbwHAKk7t_txa3SbAuyEDpNWN8vWKQcReG2j1sm1-JHVicA8-BlIFuaK7EwxIbue3zJ3lb8RI9PvZdYutGRwHKdxcU=s400-no",

  japaneseFlag:
    "https://img5.goodfon.com/wallpaper/nbig/b/e8/japan-flag-flag-of-japan-japanese-flag-japan-large-flag.jpg",
  testPattern: "https://i.ytimg.com/vi/S7SLep244ss/maxresdefault.jpg",
  lifeLogo:
    "https://lh3.googleusercontent.com/cSL7pXlnwqN2DouIEGKkBjHswHtmboVNibJqq9q27C0_Xfylp0o7ERbMO-Thn8PFYTwSJ933vCZ7_k_WiP4lGdHbTlga-UZLvDU-0Lwp1M-BiccKM-9cJBJ5VJWuM24hUQBZXKDO7CgqO-TSxnDcKH6Qyqjnaua8EKW570RP9LlxyS0jJ9J49vXfUqL2X1Fv-MunG3UDBZ_i8o4Ao_Ak50C3GVp3Wfr9Dqrew_fCQlbuzZuvhrcTlunYpmf4hhpVxugVoliN_zM490HoIk9RcJNlQ_xyo6nT9Ao6xr0LqyjysJAcrNrivyf1NMB2NrQ9lSyi2DUwRXcirVzMMrRc9NSQtYe2LpdpwkADYZ8g7K0Yaad9dF1cbRDXJ9Gxl0TvNBP3YDc3yDwG_j44YORbTE3WFiIGuGltrA7x9dUsku1PQVI1PaE4mEmsjnErlphHSlBq4xddsLCpjZJOtEMiUZmvmUSmx73ty51zAIMYK9BVTtAqDLw8HlsrseRwWJnPSL9WKfzQghQ_jMG1doYKn-Ebe7D53WbZArKiqA-Vy8OqNYJXhXKVize-xgmxHuap04Pttf26D4j76B6gAHPqKOcKxrhor-B5FqehCrqVkUgc8QmSni54p7a-NY8QRm80hBDw7TpfjUadBUi5n6CiPI4tKvxaqdNSq2RRHYt0fLfolbjBi6D1MZNxLDVDIAw=s200-no"
}
)}

function ___exampleChartWithImages(sampleImages,renderChart,data,width)
{
  const tallImageUrl = sampleImages.yellowCedder;
  const wideImageUrl = sampleImages.japaneseFlag;
  return renderChart({
    data,
    getImage: (d, i) => (i % 2 === 0 ? wideImageUrl : tallImageUrl),
    size: { width, height: 400 },
    showValueInPath: false
  });
}


function _9(md){return(
md`## Code`
)}

function _10(md){return(
md`### Renderers`
)}

function _renderChart(createDispatcher,d3,titelize,uuid,htl,html,css,renderPath,EVENT_TYPE_FOCUS_GAIN,EVENT_TYPE_HOVER_GAIN,EVENT_TYPE_HOVER_LOSE,_,renderMap,EVENT_TYPE_ENTER_TRANSITION_COMPLETE,applyTooltips){return(
function renderChart({
  data,
  dispatcher = createDispatcher(),
  colorScale = d3.scaleSequential(d3.interpolateTurbo),
  formatNumber = d3.format(",.0f"),
  getImage,
  getName = (d) => titelize(d.data.name),
  fontFamily = "Arial, Helvetica, sans-serif",
  getValue = (d) => d.value,
  showValueInPath,
  renderTooltipContent = ({ datum }) => getName(datum),
  onReady = () => {},
  tooltipOptions = {},
  ...rest
}) {
  console.log(colorScale);
  const chartUid = uuid();
  const createEventName = (name) => [name, chartUid].join(".");

  let focus = null;
  let hover = null;
  let tooltipCleanup = () => {};
  const updateSection = (section, child) => {
    while (section.firstChild) {
      section.removeChild(section.firstChild);
    }
    section.appendChild(child);
  };

  const mapSection = htl.html`<div />`;
  const pathSection = htl.html`<div />`;
  const template = html`
    <div style="display: flex; flex-direction: column; font-family: ${fontFamily};">
      <style>${css}</style>
      ${mapSection}
      ${pathSection}
    </div>`;

  const updatePath = () => {
    if (!!focus) {
      const path = renderPath({
        colorScale,
        dispatcher,
        focus,
        formatNumber,
        getImage,
        getName,
        getValue,
        hover,
        showValue: showValueInPath
      });
      updateSection(pathSection, path);
    }
  };

  dispatcher.on(createEventName(EVENT_TYPE_FOCUS_GAIN), (node) => {
    focus = node;
    updatePath();
  });
  dispatcher.on(createEventName(EVENT_TYPE_HOVER_GAIN), (node) => {
    hover = node;
    updatePath();
  });

  dispatcher.on(createEventName(EVENT_TYPE_HOVER_LOSE), () => {
    hover = null;
    _.debounce(updatePath, 100)();
  });

  const map = renderMap({
    colorScale,
    data,
    dispatcher,
    getImage,
    getName,
    getValue,
    createEventName,
    ...rest
  });

  if (!!renderTooltipContent) {
    dispatcher.on(createEventName(EVENT_TYPE_ENTER_TRANSITION_COMPLETE), () => {
      onReady();
      tooltipCleanup();
      tooltipCleanup = applyTooltips(map, {
        tooltipTargetsSelector: (selection) => selection.selectAll("g.node"),
        renderTooltipContent,
        ...tooltipOptions
      });
    });
  }
  updateSection(mapSection, map);
  return template;
}
)}

function _renderMap(d3,createDispatcher,titelize,width,EVENT_TYPE_FOCUS,DOM,establishColor,EVENT_TYPE_HOVER_GAIN,EVENT_TYPE_HOVER_LOSE,EVENT_TYPE_FOCUS_GAIN,EVENT_TYPE_FOCUS_LOSE,coordinatePolygons,nodeEnter,nodeUpdate){return(
({
  colorScale = d3.scaleSequential(d3.interpolateTurbo),
  createBaseShape = (width, height, upButtonSize, showUpButton) =>
    showUpButton
      ? [
          [0, upButtonSize],
          [upButtonSize, 0],
          [width - 1, 0],
          [width - 1, height - 1],
          [0, height - 1]
        ]
      : [
          [0, 0],
          [width - 1, 0],
          [width - 1, height - 1],
          [0, height - 1]
        ],
  backgroundColor = (d) => "black", //d?.data?.lineColor ?? "black",
  data,
  dispatcher = createDispatcher(),
  formatNumber = d3.format(",.0f"),
  getColor = (d) => {
    return d?.data?.color ?? colorScale(d.colorValue);
  },
  getId = (d) => d.data.name,
  getImage = null,
  getName = (d) => titelize(d.data.name),
  getValue = (d) => d.value,
  isEqual = (a, b) => getId(a) === getId(b),
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  onFocus = () => {},
  onHover = () => {},
  onLayoutComplete = () => {},
  phase1Duration = 600,
  phase2Duration = 250,
  showUpButton = true,
  size = { width, height: 600 },
  strokeWidthRange = [15, 1],
  strokeWidth = d3.scalePow().exponent(1.2).range(strokeWidthRange),
  upButtonSize = 100,
  minHeight = 0,
  createEventName,
  establishColorWeight = undefined
}) => {
  const [width, height] = [
    size.width - (margin.left + margin.right),
    size.height - (margin.top + margin.bottom)
  ];

  const baseShape = createBaseShape(width, height, upButtonSize, showUpButton);
  let current = null;

  const focusParent = () =>
    current.parent ? renderNode(current.parent) : null;

  dispatcher.on(EVENT_TYPE_FOCUS, renderNode);

  document.addEventListener("keyup", ({ code, key }) => {
    if (code === "ArrowUp" || code === "Escape") {
      focusParent();
    }
  });

  const svg = d3.select(
    DOM.svg(
      width + margin.left + margin.right,
      height + margin.top + margin.bottom
    )
  );
  //    .attr("viewBox", );

  svg
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("fill", backgroundColor());

  const voronoi = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (showUpButton) {
    const upButton = svg
      .append("g")
      .classed("up-button", true)
      .attr("cursor", "pointer")
      .on("click", focusParent);

    upButton
      .append("path")
      .datum([
        [0, 0],
        [0, upButtonSize],
        [upButtonSize, 0]
      ])
      .attr("d", d3.line())
      .attr("cx", upButtonSize / 2)
      .attr("cy", upButtonSize / 2)
      .attr("r", upButtonSize / 2)
      .attr("fill", "white");

    upButton
      .append("text")
      .attr("fill", backgroundColor())
      .attr("font-size", "40px")
      .attr("font-weight", "bold")
      .attr("dx", "0.1em")
      .attr("dy", "1.1em")
      .text("UP");

    upButton.append("title");
  }

  establishColor(data, establishColorWeight);
  strokeWidth.domain(d3.extent(data.descendants(), (d) => d.depth));

  const computeRelatedness = (node, score = 1, map = { dummy: 0 }) => {
    if (!map[getId(node)] && !isEqual(node, current)) {
      map[getId(node)] = score;
      computeRelatedness(node.parent, score / 2, map);

      (node.children || []).forEach((child) =>
        computeRelatedness(child, score / 2, map)
      );
    }

    return map;
  };

  const opacityFactory = (node) => {
    const relatednessMap = computeRelatedness(node);
    const opacityScale = d3
      .scalePow()
      .exponent(0.5)
      .domain(d3.extent(Object.values(relatednessMap)))
      .range([1, 0.5]);

    return (d) => {
      const relatedness = relatednessMap[getId(d)];
      return relatedness ? opacityScale(relatedness) : 1;
    };
  };

  const handleHoverEnter = (node, event) => {
    dispatcher.call(EVENT_TYPE_HOVER_GAIN, this, node);
    if (!isEqual(node, current)) {
      onHover(node, event, true);
      const nodeOpacity = opacityFactory(node);
      voronoi
        .selectAll(".node")
        .filter((d) => d.height === 0)
        .attr("opacity", nodeOpacity);
    }
  };
  const handleHoverExit = (node, event) => {
    onHover(node, event, false);
    dispatcher.call(EVENT_TYPE_HOVER_LOSE, this);
    voronoi
      .selectAll(".node")
      .filter((d) => d.height === 0)
      .attr("opacity", 1);
  };
  const handleNodeClick = (node, event) => {
    console.log(node, event);
    if (event.ctrlKey && node.data.url) {
      window.open(node.data.url, '_blank');
      return;
    }
    const target =
      node !== current
        ? node.ancestors().find((d) => d.depth === current.depth + 1)
        : node.parent;

    if (target.height >= minHeight) {
      renderNode(target);
    }
  };

  function renderNode(node) {
    if (current && isEqual(node, current)) return;
    dispatcher.call(EVENT_TYPE_FOCUS_GAIN, this, node);
    if (current) {
      dispatcher.call(EVENT_TYPE_FOCUS_LOSE, this, current);
    }

    onFocus(node);
    node.each((node) => (node.oldPolygon = node.polygon));

    if (showUpButton) {
      const upButton = svg
        .select(".up-button")
        .attr("cursor", node.depth === 0 ? "not-allowed" : "pointer");

      upButton.select("text").attr("opacity", node.depth === 0 ? 0.5 : 1);

      upButton
        .select("title")
        .text(
          node.depth === 0 ? "" : `Click to select ${getName(node.parent)}`
        );
    }

    const voronoiTreeMap = d3
      .voronoiTreemap()
      .prng(new Math.seedrandom("a seed"))
      .clip(baseShape);

    voronoiTreeMap(node);
    node.each((node) => {
      const [x0, x1] = d3.extent(node.polygon, (d) => d[0]);
      const [y0, y1] = d3.extent(node.polygon, (d) => d[1]);

      node.simplePolygon = node.polygon;
      const width = x1 - x0;
      const height = y1 - y0;
      node.polyProps = {
        centroid: d3.polygonCentroid(node.simplePolygon),
        bounds: [
          [x0, y0],
          [x1, y1]
        ],
        width,
        height,
        aspect: height / width,
        max: d3.max([width, height]),
        min: d3.min([width, height])
      };
      node.polygon = coordinatePolygons(node.oldPolygon, node.polygon);
    });

    let nodes = node.descendants().sort((a, b) => b.depth - a.depth);

    const nodeExit = (selection) => {
      selection.remove();
    };

    voronoi
      .selectAll(".node")
      .data(nodes, getId)
      .join(
        (selection) =>
          nodeEnter({
            selection,
            backgroundColor,
            current: node,
            getColor,
            getId,
            getImage,
            getName,
            handleNodeClick,
            handleHoverEnter,
            handleHoverExit,
            phase1Duration,
            phase2Duration,
            prevouse: current,
            strokeWidth,
            dispatcher,
            createEventName
          }),
        (selection) =>
          nodeUpdate({
            selection,
            current: node,
            getImage,
            getName,
            handleHoverEnter,
            handleHoverExit,
            phase1Duration,
            phase2Duration,
            strokeWidth,
            dispatcher,
            createEventName
          }),
        nodeExit
      );

    current = node;
  }

  renderNode(data);
  onLayoutComplete(svg.node());

  return svg.node();
}
)}

function _renderPath(createDispatcher,titelize,html,renderColorRamp,EVENT_TYPE_FOCUS){return(
({
  colorScale,
  dispatcher = createDispatcher(),
  focus,
  formatNumber,
  getImage,
  getName = (d) => titelize(d.data.name),
  getValue,
  showValue = true,
  hover
} = {}) => {
  const hoverPath = hover
    ? hover
        .ancestors()
        .reverse()
        .filter((d) => d.depth > focus.depth)
    : [];

  const focusPath = focus.ancestors().reverse();

  const path = [...focusPath, ...hoverPath];
  const renderElement = (node) => {
    const doneSize = node.data.doneSize ?? (node.data.isDone ? node.data.size : 0);
    const element = html`<div style="
          display: flex;
          align-items: center;
          margin: 0em 0.4em;
          cursor: ${node === focus ? "not-allowed" : "pointer"};
      ">
      <span style="display: flex; align-self: center; border-radius: 10%; overflow: hidden;">
       ${
         getImage
           ? html`<div style="background: #666; width: 10px; height: 10px;" />`
           : renderColorRamp({
               colorScale,
               colorDomain: node.colorDomain,
               width: 20,
               height: 20
             })
       }
    </span>
    <span style="margin-left: 0.3em; font-weight: bold; ">${getName(
      node
    )}</span>
    ${
      showValue
        ? `<span style="margin-left: 0.2em;">(${formatNumber(doneSize)}/${formatNumber(getValue(node))}) [${formatNumber(node.data.totalCount ?? 1)}]</span>`
        : ""
    }
    </div>`;

    element.addEventListener("click", () =>
      dispatcher.call(EVENT_TYPE_FOCUS, this, node)
    );
    return element;
  };

  return html`<div style="display: flex; margin-top: 0.5em;">${path.map(
    renderElement
  )}</div>`;
}
)}

function _renderColorRamp(DOM,d3){return(
({
  colorScale,
  colorDomain = [0, 1],
  n = 200,
  height = 20,
  width = 300
}) => {
  const canvas = DOM.canvas(n, 1);
  const context = canvas.getContext("2d");
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.imageRendering = "-moz-crisp-edges";
  canvas.style.imageRendering = "pixelated";
  const ab = d3
    .scaleLinear()
    .domain([0, n - 1])
    .range(colorDomain);

  for (let i = 0; i < n; ++i) {
    context.fillStyle = colorScale(ab(i));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}
)}

function _15(md){return(
md`### D3 Join`
)}

function _nodeEnter(Promises,d3,showLabel,appendLabel,EVENT_TYPE_ENTER_TRANSITION_COMPLETE,appendImages){return(
({
  backgroundColor,
  selection,
  current,
  getColor,
  getId,
  getImage,
  getName,
  handleNodeClick,
  handleHoverEnter,
  handleHoverExit,
  phase1Duration,
  phase2Duration,
  previouse,
  strokeWidth,
  dispatcher,
  createEventName
}) => {
  Promises.delay(previouse === null ? 0 : phase1Duration).then(
    () => {
      const all = selection.append("g").classed("node", true);
      const t = new d3.transition().duration(phase2Duration);
      const applyLabels = () => {
        all
          .filter((d) => showLabel(d, current))
          .each(function (datum, index) {
            appendLabel(d3.select(this), datum, index, getName);
          });

        all
          .filter((d) => !showLabel(d, current))
          .select(".label")
          .remove();
        dispatcher.call(EVENT_TYPE_ENTER_TRANSITION_COMPLETE, this);
      };

      t.end().then(applyLabels, applyLabels);

      if (getImage) appendImages(all, getId, getImage, createEventName);

      all
        .append("polygon")
        .classed("body", true)
        .attr("points", (d) => d.polygon)
        .attr("fill", (d) => (getImage || d.height > 0 ? "none" : getColor(d)))
        .attr("stroke", (d) => backgroundColor(d))
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 0)
        .attr("stroke-linejoin", "round")
        .attr("pointer-events", (d) => (d.height === 0 ? "fill" : "none"))
        .attr("stroke-width", (d) => strokeWidth(d.depth));

      all
        .filter((d) => d.height === 0)
        .on(createEventName("click"), (event, node) =>
          handleNodeClick(node, event)
        )
        .on(createEventName("mouseenter"), (event, node) =>
          handleHoverEnter(node, event)
        )
        .on(createEventName("mouseleave"), (event, node) =>
          handleHoverExit(node, event)
        );
    },
    (reject) => {} // console.error("reject bar", reject)
  );
}
)}

function _appendLabel(DOM,computeCenterlineLabel){return(
(selection, datum, i, getName) => {
  const { id, href } = DOM.uid("centerline"); // necessary for Firefox

  if (!datum.label) {
    datum.lable = computeCenterlineLabel({
      label: getName(datum),
      polygon: datum.simplePolygon,
      numPerimeterPoints: 10,
      simplification: 20,
      strategy: "high"
    });
  }

  const { centerline, offset, label, maxFontSize } = datum.lable;

  const labelG = selection
    .append("g")
    .classed("label", true)
    .style(
      "font-family",
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
    )
    .style("font-size", `${maxFontSize * 0.9}px`)
    .style("font-weight", 500)
    .style("user-select", "none")
    .style("letter-spacing", "0em")
    .style("text-transform", "uppercase")
    // .style("text-shadow", "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000")
    .style("text-shadow", "1px 0 0 #fff, 0 -1px 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff")
    // .attr("fill", "white")
    .attr("fill", "black")
    .attr("pointer-events", "none");

  labelG
    .append("path")
    .attr("id", id)
    .attr("d", centerline)
    .attr("visibility", "hidden");

  labelG

    .append("text")
    .attr("dy", "0.35em")
    .attr("opacity", 0.5)
    .append("textPath")
    .attr("xlink:href", href)
    .attr("startOffset", `${100 * offset}%`)
    .attr("text-anchor", "middle")
    .text(label);
}
)}

function _appendImages(uuid,normalizeId,computeImagePosition,d3){return(
(selection, getId, getImage) => {
  const image = selection.filter((d) => d.height === 0);
  const clipUuid = uuid();
  const getClipId = (d) => `${normalizeId(getId(d))}-${clipUuid}`;

  const imageG = image.append("g").classed("image", true);

  imageG
    .append("clipPath")
    .attr("id", getClipId)
    .attr("pointer-events", "none")
    .attr(
      "transform",
      (d) => `translate(${d.polyProps.bounds[0].map((d) => d * -1)})`
    )
    .append("polygon")
    .attr("points", (d) => d.polygon);

  imageG
    .append("image")
    .attr("onload", function (d, i) {
      const image = new Image();
      image.onload = () => {
        d.imageProps = {
          width: image.width,
          height: image.height,
          aspect: image.height / image.width
        };

        const { x, y, width, height } = computeImagePosition(
          d.imageProps,
          d.polyProps
        );

        const imageSelect = d3
          .select(this)
          .attr("x", x)
          .attr("y", y)
          .attr("width", width)
          .attr("height", height)
          .attr("visibility", "visible");
      };

      image.src = getImage(d, i);
    })
    .attr("clip-path", (d) => `url(#${getClipId(d)})`)
    .attr("transform", (d) => `translate(${d.polyProps.bounds[0]})`)
    .attr("visibility", "hidden")
    .attr("href", getImage);
}
)}

function _normalizeId(){return(
(id) =>
  id.replaceAll(" ", "_").replaceAll("/", "_").replaceAll("-", "_")
)}

function _uuid(){return(
() =>
  ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
)}

function _nodeUpdate(d3,showLabel,appendLabel,EVENT_TYPE_UPDATE_TRANSITION_COMPLETE,updateImages){return(
({
  selection,
  current,
  getImage,
  getName,
  handleHoverEnter,
  handleHoverExit,
  phase1Duration,
  phase2Duration,
  strokeWidth,
  dispatcher,
  createEventName
}) => {
  const branches = selection
    .filter((d) => d.height > 0)
    .attr("visibility", "hidden");
  const leaves = selection.filter((d) => d.height === 0);
  const t = d3.transition("update-phase-1").duration(phase1Duration);

  selection.selectAll(".label").remove();

  t.end().then(
    () => {
      branches
        .attr("visibility", "visible")
        .select("polygon")
        .attr("points", (d) => d.polygon)
        .transition()
        .duration(phase2Duration)
        .attr("stroke-width", (d) => strokeWidth(d.depth));

      selection
        .filter((d) => showLabel(d, current))
        .each(function (datum, index) {
          appendLabel(d3.select(this), datum, index, getName);
        });

      selection
        .selectAll(".label")
        .filter((d) => !showLabel(d, current))
        .remove();

      leaves
        .on(createEventName("mouseenter"), (event, node) =>
          handleHoverEnter(node, event)
        )
        .on(createEventName("mouseleave"), (event, node) =>
          handleHoverExit(node, event)
        );
      dispatcher.call(EVENT_TYPE_UPDATE_TRANSITION_COMPLETE, this);
    },
    (reject) => {} //console.error("reject baz", reject)
  );

  leaves
    .on(createEventName("mouseenter"), null)
    .on(createEventName("mouseleave"), null)
    .attr("opacity", 1)
    .select(".body")
    .attr("stroke-width", (d) => strokeWidth(d.depth))
    .transition(t)
    .attr("points", (d) => d.polygon);

  if (getImage) updateImages(selection, t);
}
)}

function _updateImages(computeImagePosition,d3){return(
(selection, t) => {
  const imageG = selection
    .filter(d => d.height === 0 && !!d.imageProps)
    .selectAll(".image");

  imageG
    .select("clipPath")
    .transition(t)
    .attr(
      "transform",
      d => `translate(${d.polyProps.bounds[0].map(d => d * -1)})`
    )
    .select("polygon")
    .attr("points", d => d.polygon);

  imageG
    .select("image")
    .transition(t)
    .attr("transform", d => `translate(${d.polyProps.bounds[0]})`)
    .each(function(d) {
      const { x, y, width, height } = computeImagePosition(
        d.imageProps,
        d.polyProps
      );

      d3.select(this)
        .transition(t)

        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);
    });
}
)}

function _showLabel(){return(
(node, current) => {
  return (
    node.depth === current.depth + 1 ||
    (node.height === 0 && current.height === 0)
  );
}
)}

function _24(md){return(
md`### Smooth Shape Transition`
)}

function _computeImagePosition(){return(
(imageProps, polyProps) => {
  const { aspect: iAspect, width: iWidth, height: iHeight } = imageProps;
  const { aspect: pAspect, width: pWidth, height: pHeight } = polyProps;
  const [x, y, width, height] =
    pAspect < iAspect
      ? [
          0,
          ((iAspect / pAspect) * pHeight - pHeight) / -2,
          pWidth,
          iHeight * (pWidth / iWidth)
        ]
      : [
          ((pAspect / iAspect) * pWidth - pWidth) / -2,
          0,
          iWidth * (pHeight / iHeight),
          pHeight
        ];

  return {
    x,
    y,
    width,
    height
  };
}
)}

function _coordinatePolygons(fixedPointCount,computeCentroid,computeAngle,d3){return(
(source, target, pointCount = 20) => {
  const expandedPolygon = fixedPointCount(target, pointCount);

  if (!source || source.length === 0) return expandedPolygon;

  const sourceCentroid = computeCentroid(source);
  const targetCentroid = computeCentroid(expandedPolygon);

  const startTheta = computeAngle(sourceCentroid, source[0]);

  const pointWidthClosestTheta = expandedPolygon
    .map((point, i) => ({
      theta: Math.abs(computeAngle(targetCentroid, point)),
      index: i
    }))
    .sort((a, b) => a.theta - b.theta)[0].index;

  const coordinatedPolygon = [
    ...expandedPolygon.slice(pointWidthClosestTheta),
    ...expandedPolygon.slice(0, pointWidthClosestTheta)
  ];

  return d3.polygonArea(source) * d3.polygonArea(coordinatedPolygon) < 0
    ? coordinatedPolygon.reverse()
    : coordinatedPolygon;
}
)}

function _computeCentroid(){return(
shape =>
  shape
    .reduce(([xSum, ySum], [x, y]) => [xSum + x, ySum + y], [0, 0])
    .map(d => d / shape.length)
)}

function _computeAngle(){return(
([x0, y0], [x1, y1]) => Math.atan2(y1 - y0, x1 - x0)
)}

function _establishColor(d3){return(
(root, getWeight = (d) => d.value, domain = [0, 1]) => {
  const _establishColor = (node, domain) => {
    node.colorDomain = domain;
    node.colorValue = d3.sum(domain) / 2;
    if (node.children) {
      const sum = d3.sum(node.children.map(getWeight));
      const scale = d3.scaleLinear().domain([0, sum]).range(domain);

      (node.children || [])
        //.sort((a, b) => getWeight(a) - getWeight(b))
        .reduce((sum, child) => {
          const progress = sum + getWeight(child);
          _establishColor(child, [sum, progress].map(scale));
          return progress;
        }, 0);
    }
  };

  _establishColor(root, domain);
}
)}

function _createMeasurablePath(d3,DOM){return(
points =>
  d3
    .select(DOM.svg(1, 1))
    .append("path")
    .datum(points)
    .attr("d", d3.line())
    .node()
)}

function _fixedPointCount(createMeasurablePath,computeDistances,d3){return(
(shape, count) => {
  const measurablePath = createMeasurablePath(shape);

  const newPointCount = count - shape.length + 1;

  if (count < 1) return shape;

  const distances = computeDistances(shape);
  const length = distances[distances.length - 1];

  const distancePoints = distances.map((distance, i) => ({
    distance: distance,
    point: shape[i]
  }));

  const positionScale = d3
    .scaleLinear()
    .domain([0, newPointCount - 1])
    .range([0.001, length]);

  return d3.range(newPointCount).reduce((points, index) => {
    const position = positionScale(index);
    while (distancePoints.length > 0 && position > distancePoints[0].distance) {
      points.push(distancePoints[0].point);
      distancePoints.shift();
    }
    const { x, y } = measurablePath.getPointAtLength(position);
    points.push([x, y]);
    return points;
  }, []);
}
)}

function _computeDistance(){return(
(coord1, coord2) => {
  var distX = coord2[0] - coord1[0];
  var distY = coord2[1] - coord1[1];
  return Math.sqrt(distX * distX + distY * distY);
}
)}

function _computeDistances(computeDistance){return(
coordinates => {
  return coordinates.reduce((distances, coordinate, i) => {
    const value =
      i === 0
        ? 0
        : distances[i - 1] + computeDistance(coordinates[i - 1], coordinate);
    distances.push(value);
    return distances;
  }, []);
}
)}

function _createDispatcher(d3,EVENT_TYPES){return(
() => new d3.dispatch(...EVENT_TYPES)
)}

function _EVENT_TYPES(EVENT_TYPE_FOCUS,EVENT_TYPE_FOCUS_GAIN,EVENT_TYPE_FOCUS_LOSE,EVENT_TYPE_HOVER_GAIN,EVENT_TYPE_HOVER_LOSE,EVENT_TYPE_ENTER_TRANSITION_COMPLETE,EVENT_TYPE_UPDATE_TRANSITION_COMPLETE){return(
[
  EVENT_TYPE_FOCUS,
  EVENT_TYPE_FOCUS_GAIN,
  EVENT_TYPE_FOCUS_LOSE,
  EVENT_TYPE_HOVER_GAIN,
  EVENT_TYPE_HOVER_LOSE,
  EVENT_TYPE_ENTER_TRANSITION_COMPLETE,
  EVENT_TYPE_UPDATE_TRANSITION_COMPLETE
]
)}

function _EVENT_TYPE_HOVER_GAIN(){return(
"hover-gain"
)}

function _EVENT_TYPE_HOVER_LOSE(){return(
"hover-lose"
)}

function _EVENT_TYPE_FOCUS(){return(
"focus"
)}

function _EVENT_TYPE_FOCUS_GAIN(){return(
"focus-gain"
)}

function _EVENT_TYPE_FOCUS_LOSE(){return(
"focus-lose"
)}

function _EVENT_TYPE_ENTER_TRANSITION_COMPLETE(){return(
"enter-transition-complete"
)}

function _EVENT_TYPE_UPDATE_TRANSITION_COMPLETE(){return(
"update-transition-complete"
)}

function _43(md){return(
md`## Libraries`
)}

function _d3(require){return(
require("d3@7", "d3-voronoi-treemap", "seedrandom@2.4.3/seedrandom.min.js")
)}

function _d(require){return(
require("d3-voronoi-treemap")
)}

function __(require){return(
require("lodash")
)}

function displacement(a, b) {
  return [b[0]-a[0], b[1]-a[1]]
}

function distance(a, b) {
  if (b === undefined) {
    return Math.abs(Math.sqrt(a[0]**2 + a[1]**2));
  } else {
    return distance(displacement(a, b))
  }
}

function contractDistance(points, centroid, d) {
  // Move each point in a set of points a distance d closer to the centroid.
  const vec = (p) => displacement(p, centroid);
  const dist = (p) => distance(p, centroid);
  const unitVecToCentroid = (p) => {
    const v = vec(p);
    const d = dist(p);
    return [v[0] / d, v[1] / d];
  }
  // Return the point moved towards the centroid, without going past it.
  return points.map(p => distance(vec(p)) < d ? centroid : [
    p[0] + d*unitVecToCentroid(p)[0],
    p[1] + d*unitVecToCentroid(p)[1],
  ])
}

export default function define(runtime, observer) {
  const main = runtime.module();
  // main.variable(observer()).define(["md"], _1);
  // main.variable(observer()).define(["md"], _2);
  main.variable(observer("data")).define("data", ["d3"], _data);
  // main.variable(observer()).define(["md"], _4);
  main.variable(observer("__exampleChart")).define("__exampleChart", ["renderChart","data","width"], ___exampleChart);
  // main.variable(observer()).define(["md"], _6);
  // main.variable(observer("sampleImages")).define("sampleImages", _sampleImages);
  // main.variable(observer("__exampleChartWithImages")).define("__exampleChartWithImages", ["sampleImages","renderChart","data","width"], ___exampleChartWithImages);
  // main.variable(observer()).define(["md"], _9);
  // main.variable(observer()).define(["md"], _10);
  main.variable(observer("renderChart")).define("renderChart", ["createDispatcher","d3","titelize","uuid","htl","html","css","renderPath","EVENT_TYPE_FOCUS_GAIN","EVENT_TYPE_HOVER_GAIN","EVENT_TYPE_HOVER_LOSE","_","renderMap","EVENT_TYPE_ENTER_TRANSITION_COMPLETE","applyTooltips"], _renderChart);
  main.variable(observer("renderMap")).define("renderMap", ["d3","createDispatcher","titelize","width","EVENT_TYPE_FOCUS","DOM","establishColor","EVENT_TYPE_HOVER_GAIN","EVENT_TYPE_HOVER_LOSE","EVENT_TYPE_FOCUS_GAIN","EVENT_TYPE_FOCUS_LOSE","coordinatePolygons","nodeEnter","nodeUpdate"], _renderMap);
  main.variable(observer("renderPath")).define("renderPath", ["createDispatcher","titelize","html","renderColorRamp","EVENT_TYPE_FOCUS"], _renderPath);
  main.variable(observer("renderColorRamp")).define("renderColorRamp", ["DOM","d3"], _renderColorRamp);
  // main.variable(observer()).define(["md"], _15);
  main.variable(observer("nodeEnter")).define("nodeEnter", ["Promises","d3","showLabel","appendLabel","EVENT_TYPE_ENTER_TRANSITION_COMPLETE","appendImages"], _nodeEnter);
  main.variable(observer("appendLabel")).define("appendLabel", ["DOM","computeCenterlineLabel"], _appendLabel);
  main.variable(observer("appendImages")).define("appendImages", ["uuid","normalizeId","computeImagePosition","d3"], _appendImages);
  main.variable(observer("normalizeId")).define("normalizeId", _normalizeId);
  main.variable(observer("uuid")).define("uuid", _uuid);
  main.variable(observer("nodeUpdate")).define("nodeUpdate", ["d3","showLabel","appendLabel","EVENT_TYPE_UPDATE_TRANSITION_COMPLETE","updateImages"], _nodeUpdate);
  main.variable(observer("updateImages")).define("updateImages", ["computeImagePosition","d3"], _updateImages);
  main.variable(observer("showLabel")).define("showLabel", _showLabel);
  // main.variable(observer()).define(["md"], _24);
  main.variable(observer("computeImagePosition")).define("computeImagePosition", _computeImagePosition);
  main.variable(observer("coordinatePolygons")).define("coordinatePolygons", ["fixedPointCount","computeCentroid","computeAngle","d3"], _coordinatePolygons);
  main.variable(observer("computeCentroid")).define("computeCentroid", _computeCentroid);
  main.variable(observer("computeAngle")).define("computeAngle", _computeAngle);
  main.variable(observer("establishColor")).define("establishColor", ["d3"], _establishColor);
  main.variable(observer("createMeasurablePath")).define("createMeasurablePath", ["d3","DOM"], _createMeasurablePath);
  main.variable(observer("fixedPointCount")).define("fixedPointCount", ["createMeasurablePath","computeDistances","d3"], _fixedPointCount);
  main.variable(observer("computeDistance")).define("computeDistance", _computeDistance);
  main.variable(observer("computeDistances")).define("computeDistances", ["computeDistance"], _computeDistances);
  main.variable(observer("createDispatcher")).define("createDispatcher", ["d3","EVENT_TYPES"], _createDispatcher);
  main.variable(observer("EVENT_TYPES")).define("EVENT_TYPES", ["EVENT_TYPE_FOCUS","EVENT_TYPE_FOCUS_GAIN","EVENT_TYPE_FOCUS_LOSE","EVENT_TYPE_HOVER_GAIN","EVENT_TYPE_HOVER_LOSE","EVENT_TYPE_ENTER_TRANSITION_COMPLETE","EVENT_TYPE_UPDATE_TRANSITION_COMPLETE"], _EVENT_TYPES);
  main.variable(observer("EVENT_TYPE_HOVER_GAIN")).define("EVENT_TYPE_HOVER_GAIN", _EVENT_TYPE_HOVER_GAIN);
  main.variable(observer("EVENT_TYPE_HOVER_LOSE")).define("EVENT_TYPE_HOVER_LOSE", _EVENT_TYPE_HOVER_LOSE);
  main.variable(observer("EVENT_TYPE_FOCUS")).define("EVENT_TYPE_FOCUS", _EVENT_TYPE_FOCUS);
  main.variable(observer("EVENT_TYPE_FOCUS_GAIN")).define("EVENT_TYPE_FOCUS_GAIN", _EVENT_TYPE_FOCUS_GAIN);
  main.variable(observer("EVENT_TYPE_FOCUS_LOSE")).define("EVENT_TYPE_FOCUS_LOSE", _EVENT_TYPE_FOCUS_LOSE);
  main.variable(observer("EVENT_TYPE_ENTER_TRANSITION_COMPLETE")).define("EVENT_TYPE_ENTER_TRANSITION_COMPLETE", _EVENT_TYPE_ENTER_TRANSITION_COMPLETE);
  main.variable(observer("EVENT_TYPE_UPDATE_TRANSITION_COMPLETE")).define("EVENT_TYPE_UPDATE_TRANSITION_COMPLETE", _EVENT_TYPE_UPDATE_TRANSITION_COMPLETE);
  // main.variable(observer()).define(["md"], _43);
  const child1 = runtime.module(define1);
  main.import("titelize", child1);
  const child2 = runtime.module(define2);
  main.import("applyTooltips", child2);
  const child3 = runtime.module(define3);
  main.import("computeCenterlineLabel", child3);
  main.import("css", child3);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("d")).define("d", ["require"], _d);
  main.variable(observer("_")).define("_", ["require"], __);
  return main;
}
