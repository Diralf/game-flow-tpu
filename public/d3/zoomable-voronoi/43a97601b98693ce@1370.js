import define1 from "./1942863f3e7b7b95@715.js";

function _1(md){return(
md`# Tooltip

This is a basic, general-purpose, tooltip system.  Currently, this is about 3/4 baked.  Its only dependency is D3.`
)}

function ___tests(hostedOnThumbtools,renderTests,md){return(
hostedOnThumbtools()
  ? renderTests()
  : md`Vist [test page](https://thumbtools.org/@trebor/tooltip) to see it working`
)}

function _3(md){return(
md`## Code`
)}

function _applyTooltips(POSITION_DYNAMIC,defaultRenderTooltipFrame,defaultRenderTooltipContent,TOOLTIP_CLASS,TOOLTIP_TEXT_ATTR,defaultTooltipTargetsSelector,POSITIONERS,d3,uuid,removeAllChildren,extractDataFromTitle,HTMLElement){return(
(element, customOptions = {}) => {
  const defaultOptions = {
    position: POSITION_DYNAMIC,
    renderTooltipFrame: defaultRenderTooltipFrame,
    renderTooltipContent: defaultRenderTooltipContent,
    thinkOfTheChldren: false,
    tooltipClass: TOOLTIP_CLASS,
    tooltipTextAttr: TOOLTIP_TEXT_ATTR,
    tooltipTargetsSelector: defaultTooltipTargetsSelector,
    hideDelayMs: 0,
    xOffset: 10,
    yOffset: 10,
    zIndex: 2,
    observablePlotSelector: null
  };

  const options = { ...defaultOptions, ...customOptions };

  const {
    positioner = POSITIONERS[options.position] ||
      POSITION_DYNAMIC.POSITION_DYNAMIC,
    renderTooltipFrame,
    renderTooltipContent,
    thinkOfTheChldren,
    tooltipTargetsSelector,
    observablePlotSelector,
    hideDelayMs
  } = options;

  const isObservablePlot = !!observablePlotSelector;

  const body = d3.select("body");
  const tooltipId = `tooltip-${uuid()}`;
  const tooltip = renderTooltipFrame(tooltipId, options);
  const tooltipElement = tooltip.node();
  body.node().appendChild(tooltipElement);

  const setPosition = ({ target, event, tooltip }) => {
    const { x, y } = positioner(
      event,
      target.getBoundingClientRect(),
      tooltipElement.getBoundingClientRect(),
      options
    );

    tooltip
      .style("left", x + window.scrollX + "px")
      .style("top", y + window.scrollY + "px");
  };

  const DUMMY_CANCEL_HIDE = () => {};
  let lastTarget = null;
  let cancelHide = DUMMY_CANCEL_HIDE;
  const showTooltip = () => {
    cancelHide();
    tooltip.style("visibility", "visible");
  };
  const hideTooltip = function () {
    if (hideDelayMs === 0) {
      hideTooltipActual();
    } else {
      let canceled = false;
      cancelHide = () => {
        canceled = true;
        cancelHide = DUMMY_CANCEL_HIDE;
      };

      setTimeout(() => {
        if (!canceled) {
          hideTooltipActual();
        }
      }, hideDelayMs);
    }
  };
  const hideTooltipActual = function () {
    lastTarget = null;
    tooltip.style("visibility", "hidden");
  };

  tooltipTargetsSelector(d3.select(element), options)
    .on("mouseenter", showTooltip)
    .on("mousemove", function (event, datum, ...rest) {
      const target = this;

      if (target !== lastTarget) {
        lastTarget = this;

        if (!thinkOfTheChldren) {
          removeAllChildren(tooltipElement);
        }

        if (isObservablePlot) {
          extractDataFromTitle(target);
        }

        const content = renderTooltipContent(
          {
            event,
            datum: isObservablePlot ? target.__tooltip_data__ : datum,
            target,
            tooltip,
            ...rest
          },
          options
        );

        if (!content) {
          hideTooltip();
        } else if (content instanceof d3.selection) {
          tooltipElement.appendChild(content.node());
        } else if (content instanceof HTMLElement) {
          tooltipElement.appendChild(content);
        } else {
          tooltip.text(content);
        }
      }
      setPosition({ target, event, tooltip });
    })
    .on("mouseleave", hideTooltip);

  return () => {
    body
      .select(`#${tooltipId}`)
      .on("mouseenter", null)
      .on("mosuemove", null)
      .on("mouseleave", null)
      .remove();
  };
}
)}

function _5(md){return(
md`### Defaults`
)}

function _defaultRenderTooltipFrame(d3){return(
(tooltipId, { zIndex }) =>
  d3
    .create("div")
    .attr("class", "tooltip-frame")
    .attr("id", tooltipId)
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("padding", "0.3em 0.5em")
    .style("background", "white")
    .style("border-radius", "4px")
    .style("border", "1px solid #ddd")
    .style("visibility", "hidden")
    .style("z-index", zIndex)
)}

function _defaultRenderTooltipContent(d3,TOOLTIP_TEXT_ATTR){return(
({ target }) =>
  d3.select(target).attr(TOOLTIP_TEXT_ATTR) || "<No Tooltip Text Provided>"
)}

function _defaultTooltipTargetsSelector(){return(
(
  selection,
  { tooltipClass, observablePlotSelector }
) =>
  selection.selectAll(
    !!observablePlotSelector ? observablePlotSelector : `.${tooltipClass}`
  )
)}

function _9(md){return(
md`### Utility`
)}

function _removeAllChildren(){return(
(element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
)}

function _extractDataFromTitle(d3){return(
(target) => {
  if (!target.__tooltip_data__) {
    const title = d3.select(target).select("title");
    try {
      target.__tooltip_data__ = JSON.parse(title.text());
      title.remove();
    } catch (error) {}

    if (!target.__tooltip_data__) return null;
  }
}
)}

function _uuid(){return(
() => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
)}

function _establishMouseQuadrent(){return(
({ clientX, clientY }) => ({
  onLeft: clientX < window.innerWidth / 2,
  onTop: clientY < window.outerHeight / 2
})
)}

function _14(md){return(
md`### Testing Code`
)}

function _renderTests(html,TOOLTIP_CLASS,TOOLTIP_TEXT_ATTR,renderSvgTestArea,width,applyTooltips,POSITIONS,renderTestItems,invalidation){return(
() => {
  const body = html`
     <div style="display: flex; flex-direction: column; align-items: stretch;">
      <h1>Tooltip Testing Area Area</h1>
      <h2>Simple Tests</h2>
      <div>
        <div class="${TOOLTIP_CLASS}" ${TOOLTIP_TEXT_ATTR}="dog">DOG</div>
        <div class="${TOOLTIP_CLASS}" ${TOOLTIP_TEXT_ATTR}="cat">CAT</div>
        <div class="${TOOLTIP_CLASS}" ${TOOLTIP_TEXT_ATTR}="frog">FROG</div>
      <div>
      <h2>Advanced SVG Tests</h2>
      ${renderSvgTestArea(width, 600)}
      <h2>Advanced HTML Tests</h2>
   </div>`;

  const cleanUps = [applyTooltips(body)];
  POSITIONS.forEach((position) => {
    cleanUps.push(
      renderTestItems(body, 3, 3, position, {
        position
        // hideDelayMs: 1000
      })
    );
  });

  invalidation.then(() => {
    cleanUps.forEach((cleanUp) => cleanUp);
  });
  return body;
}
)}

function _renderSvgTestArea(svg,d3,POSITIONS,TOOLTIP_TEXT_ATTR,POSITION_MARKER,applyTooltips,md){return(
(width, height, tooltipClassName = "svg-tooltip") => {
  const svgTestArea = svg`
    <svg width="${width}px" height="${height}px" style="background-color: #eee;" />
  `;

  const columns = d3.range(4);

  const sectionsScale = d3
    .scalePoint()
    .domain(POSITIONS)
    .range([0, height])
    .padding(0.4);

  const columnScale = d3
    .scalePoint()
    .domain(columns)
    .range([0, width])
    .padding(0.1);

  const dots = d3
    .select(svgTestArea)
    .selectAll(".section")
    .data(POSITIONS)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(0, ${sectionsScale(d)})`)
    .attr("width", width)
    .selectAll(".column")
    .data((position) => columns.map((column) => ({ column, position })))
    .enter()
    .append("g")
    .attr("class", (d) => `${tooltipClassName}-${d.position}`)
    .attr("transform", (d) => `translate(${columnScale(d.column)})`);

  dots
    .append("circle")
    .attr(
      TOOLTIP_TEXT_ATTR,
      ({ column, position }) => `col: ${column} tooltip-type: ${position}`
    )
    .attr("r", 20)
    .attr("fill", "red");

  dots
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.34em")
    .style("font-size", "1.5em")
    .style("font-weight", "bold")
    .style("fill", "white")
    .text((d) => `${POSITION_MARKER[d.position]}`);

  const cleanups = POSITIONS.map((position) =>
    applyTooltips(svgTestArea, {
      position,
      renderTooltipContent: () => {
        return md`## SVG Tooltip Markdown

Conetent ${tooltipClassName}-${position}
`;
        const content = d3.create("div");
        content.append("h3").text("SVG Tooltip");
        content.append("p").text(`${tooltipClassName}-${position}`);
        console.log({ content });
        return content;
      },
      tooltipTargetsSelector: (selection) =>
        selection.selectAll(`.${tooltipClassName}-${position}`)
    })
  );

  return svgTestArea;
}
)}

function _renderTestItems(d3,applyTooltips){return(
(body, rows, cols, name, options) => {
  const tooltipClass = `datum-based-tip-${name}`;

  d3.select(body)
    .selectAll(".row")
    .data(d3.range(rows))
    .join()
    .append("div")
    .style("display", "flex")
    .style("justify-content", "space-between")
    .selectAll(".item")
    .data((row) => d3.range(cols).map((col) => [col, row]))
    .join()
    .append("div")
    .style("background", "#eee")
    .style("padding", "10px")
    .style("margin", "10px")
    .style("border", "1px solid #ddd")
    .style("cursor", "pointer")
    .classed(tooltipClass, true)
    .text((d) => `${name} Item [${d}]`);

  return applyTooltips(body, {
    renderTooltipContent: ({ datum }) => `Tip for ${name} ${datum}`,
    ...options,
    tooltipClass
  });
}
)}

function _18(md){return(
md`## Constants`
)}

function _POSITIONERS(POSITION_TOP,POSITION_BOTTOM,POSITION_RIGHT,POSITION_LEFT,POSITION_DYNAMIC,establishMouseQuadrent,POSITION_TOP_LEFT,POSITION_TOP_RIGHT,POSITION_BOTTOM_LEFT,POSITION_BOTTOM_RIGHT,POSITION_FIXED_AUTO)
{
  const positioners = {
    [POSITION_TOP]: (
      event,
      { top, left, width, height },
      tooltipBounds,
      { yOffset }
    ) => ({
      x: left - (tooltipBounds.width - width) / 2,
      y: top - tooltipBounds.height - yOffset
    }),
    [POSITION_BOTTOM]: (
      event,
      { top, left, width, height },
      tooltipBounds,
      { yOffset }
    ) => ({
      x: left - (tooltipBounds.width - width) / 2,
      y: top + height + yOffset
    }),
    [POSITION_RIGHT]: (
      event,
      { top, left, width, height },
      tooltipBounds,
      { xOffset }
    ) => ({
      x: left + width + xOffset,
      y: top - (tooltipBounds.height - height) / 2
    }),
    [POSITION_LEFT]: (
      event,
      { top, left, width, height },
      tooltipBounds,
      { xOffset }
    ) => ({
      x: left - tooltipBounds.width - xOffset,
      y: top - (tooltipBounds.height - height) / 2
    }),

    [POSITION_DYNAMIC]: (
      event,
      targetBounds,
      { top, left, width, height },
      { xOffset, yOffset }
    ) => {
      const { pageX, pageY, clientX, clientY } = event;
      const { onLeft, onTop } = establishMouseQuadrent(event, targetBounds);

      return {
        x:
          (onLeft ? pageX + xOffset : pageX - width - xOffset) - window.scrollX,
        y: (onTop ? pageY + yOffset : pageY - height - yOffset) - window.scrollY
      };
    }
  };

  positioners[POSITION_TOP_LEFT] = (...args) => {
    const { x } = positioners[POSITION_LEFT](...args);
    const { y } = positioners[POSITION_TOP](...args);
    return { x, y };
  };

  positioners[POSITION_TOP_RIGHT] = (...args) => {
    const { x } = positioners[POSITION_RIGHT](...args);
    const { y } = positioners[POSITION_TOP](...args);
    return { x, y };
  };

  positioners[POSITION_BOTTOM_LEFT] = (...args) => {
    const { x } = positioners[POSITION_LEFT](...args);
    const { y } = positioners[POSITION_BOTTOM](...args);
    return { x, y };
  };

  positioners[POSITION_BOTTOM_RIGHT] = (...args) => {
    const { x } = positioners[POSITION_RIGHT](...args);
    const { y } = positioners[POSITION_BOTTOM](...args);
    return { x, y };
  };

  positioners[POSITION_FIXED_AUTO] = (...args) => {
    const { onLeft, onTop } = establishMouseQuadrent(...args);
    const { x } = positioners[onLeft ? POSITION_RIGHT : POSITION_LEFT](...args);
    const { y } = positioners[onTop ? POSITION_BOTTOM : POSITION_TOP](...args);

    return { x, y };
  };

  return positioners;
}


function _POSITIONS(POSITION_DYNAMIC,POSITION_FIXED_AUTO,POSITION_TOP_LEFT,POSITION_TOP_RIGHT,POSITION_BOTTOM_LEFT,POSITION_BOTTOM_RIGHT,POSITION_TOP,POSITION_BOTTOM,POSITION_LEFT,POSITION_RIGHT){return(
[
  POSITION_DYNAMIC,
  POSITION_FIXED_AUTO,
  POSITION_TOP_LEFT,
  POSITION_TOP_RIGHT,
  POSITION_BOTTOM_LEFT,
  POSITION_BOTTOM_RIGHT,
  POSITION_TOP,
  POSITION_BOTTOM,
  POSITION_LEFT,
  POSITION_RIGHT
]
)}

function _POSITION_MARKER(POSITION_DYNAMIC,POSITION_FIXED_AUTO,POSITION_TOP_LEFT,POSITION_TOP_RIGHT,POSITION_BOTTOM_LEFT,POSITION_BOTTOM_RIGHT,POSITION_TOP,POSITION_BOTTOM,POSITION_LEFT,POSITION_RIGHT){return(
{
  [POSITION_DYNAMIC]: "*",
  [POSITION_FIXED_AUTO]: "+",
  [POSITION_TOP_LEFT]: "↖",
  [POSITION_TOP_RIGHT]: "↗",
  [POSITION_BOTTOM_LEFT]: "↙",
  [POSITION_BOTTOM_RIGHT]: "↘",
  [POSITION_TOP]: "↑",
  [POSITION_BOTTOM]: "↓",
  [POSITION_LEFT]: "←",
  [POSITION_RIGHT]: "→"
}
)}

function _TOOLTIP_CLASS(){return(
"has-tooltip"
)}

function _TOOLTIP_TEXT_ATTR(){return(
"tooltip-text"
)}

function _POSITION_TOP(){return(
"top"
)}

function _POSITION_TOP_LEFT(){return(
"top-left"
)}

function _POSITION_TOP_RIGHT(){return(
"top-right"
)}

function _POSITION_BOTTOM_LEFT(){return(
"bottom-left"
)}

function _POSITION_BOTTOM_RIGHT(){return(
"bottom-right"
)}

function _POSITION_BOTTOM(){return(
"bottom"
)}

function _POSITION_RIGHT(){return(
"right"
)}

function _POSITION_LEFT(){return(
"left"
)}

function _POSITION_FIXED_AUTO(){return(
"fixed-auto"
)}

function _POSITION_DYNAMIC(){return(
"dynamic"
)}

function _34(md){return(
md`## Import`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("__tests")).define("__tests", ["hostedOnThumbtools","renderTests","md"], ___tests);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("applyTooltips")).define("applyTooltips", ["POSITION_DYNAMIC","defaultRenderTooltipFrame","defaultRenderTooltipContent","TOOLTIP_CLASS","TOOLTIP_TEXT_ATTR","defaultTooltipTargetsSelector","POSITIONERS","d3","uuid","removeAllChildren","extractDataFromTitle","HTMLElement"], _applyTooltips);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("defaultRenderTooltipFrame")).define("defaultRenderTooltipFrame", ["d3"], _defaultRenderTooltipFrame);
  main.variable(observer("defaultRenderTooltipContent")).define("defaultRenderTooltipContent", ["d3","TOOLTIP_TEXT_ATTR"], _defaultRenderTooltipContent);
  main.variable(observer("defaultTooltipTargetsSelector")).define("defaultTooltipTargetsSelector", _defaultTooltipTargetsSelector);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("removeAllChildren")).define("removeAllChildren", _removeAllChildren);
  main.variable(observer("extractDataFromTitle")).define("extractDataFromTitle", ["d3"], _extractDataFromTitle);
  main.variable(observer("uuid")).define("uuid", _uuid);
  main.variable(observer("establishMouseQuadrent")).define("establishMouseQuadrent", _establishMouseQuadrent);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("renderTests")).define("renderTests", ["html","TOOLTIP_CLASS","TOOLTIP_TEXT_ATTR","renderSvgTestArea","width","applyTooltips","POSITIONS","renderTestItems","invalidation"], _renderTests);
  main.variable(observer("renderSvgTestArea")).define("renderSvgTestArea", ["svg","d3","POSITIONS","TOOLTIP_TEXT_ATTR","POSITION_MARKER","applyTooltips","md"], _renderSvgTestArea);
  main.variable(observer("renderTestItems")).define("renderTestItems", ["d3","applyTooltips"], _renderTestItems);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("POSITIONERS")).define("POSITIONERS", ["POSITION_TOP","POSITION_BOTTOM","POSITION_RIGHT","POSITION_LEFT","POSITION_DYNAMIC","establishMouseQuadrent","POSITION_TOP_LEFT","POSITION_TOP_RIGHT","POSITION_BOTTOM_LEFT","POSITION_BOTTOM_RIGHT","POSITION_FIXED_AUTO"], _POSITIONERS);
  main.variable(observer("POSITIONS")).define("POSITIONS", ["POSITION_DYNAMIC","POSITION_FIXED_AUTO","POSITION_TOP_LEFT","POSITION_TOP_RIGHT","POSITION_BOTTOM_LEFT","POSITION_BOTTOM_RIGHT","POSITION_TOP","POSITION_BOTTOM","POSITION_LEFT","POSITION_RIGHT"], _POSITIONS);
  main.variable(observer("POSITION_MARKER")).define("POSITION_MARKER", ["POSITION_DYNAMIC","POSITION_FIXED_AUTO","POSITION_TOP_LEFT","POSITION_TOP_RIGHT","POSITION_BOTTOM_LEFT","POSITION_BOTTOM_RIGHT","POSITION_TOP","POSITION_BOTTOM","POSITION_LEFT","POSITION_RIGHT"], _POSITION_MARKER);
  main.variable(observer("TOOLTIP_CLASS")).define("TOOLTIP_CLASS", _TOOLTIP_CLASS);
  main.variable(observer("TOOLTIP_TEXT_ATTR")).define("TOOLTIP_TEXT_ATTR", _TOOLTIP_TEXT_ATTR);
  main.variable(observer("POSITION_TOP")).define("POSITION_TOP", _POSITION_TOP);
  main.variable(observer("POSITION_TOP_LEFT")).define("POSITION_TOP_LEFT", _POSITION_TOP_LEFT);
  main.variable(observer("POSITION_TOP_RIGHT")).define("POSITION_TOP_RIGHT", _POSITION_TOP_RIGHT);
  main.variable(observer("POSITION_BOTTOM_LEFT")).define("POSITION_BOTTOM_LEFT", _POSITION_BOTTOM_LEFT);
  main.variable(observer("POSITION_BOTTOM_RIGHT")).define("POSITION_BOTTOM_RIGHT", _POSITION_BOTTOM_RIGHT);
  main.variable(observer("POSITION_BOTTOM")).define("POSITION_BOTTOM", _POSITION_BOTTOM);
  main.variable(observer("POSITION_RIGHT")).define("POSITION_RIGHT", _POSITION_RIGHT);
  main.variable(observer("POSITION_LEFT")).define("POSITION_LEFT", _POSITION_LEFT);
  main.variable(observer("POSITION_FIXED_AUTO")).define("POSITION_FIXED_AUTO", _POSITION_FIXED_AUTO);
  main.variable(observer("POSITION_DYNAMIC")).define("POSITION_DYNAMIC", _POSITION_DYNAMIC);
  main.variable(observer()).define(["md"], _34);
  const child1 = runtime.module(define1);
  main.import("hostedOnThumbtools", child1);
  return main;
}
