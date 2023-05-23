function ___title(md,getGoogleImage,LOGO_URL,SERVICE_TITLE,getObservableUrl,THIS_NOTEBOOK_PATH,CELL_PREFIX,renderUrlSelection,getServiceUrl){return(
md`# <div style="display: flex; align-items: center;"><img src="${getGoogleImage(
  LOGO_URL,
  0
)}" style="margin-right: 0.5em;" />${SERVICE_TITLE}</div>

${SERVICE_TITLE} provides a fast way to share cells from your [Observable](${getObservableUrl()}) notebooks as stand-alone, single page web applications.  For example the page you are looking at now was created from a [notebook](${getObservableUrl(
  THIS_NOTEBOOK_PATH
)}).
## How to use ${SERVICE_TITLE}:

1. Prefix the names of any cells in your notebook which you wish to show with two underscores "${CELL_PREFIX}" for example:
~~~html
${CELL_PREFIX}helloWorldCell = html\`<div>Hello World\</div>\`
~~~
1. If it is a private notebook, enable link sharing. If it is a public notebook, published the version with the prefixed cell names.
1. Copy the path from the end of the notebook URL:
${renderUrlSelection(getObservableUrl(), THIS_NOTEBOOK_PATH)}
1. Paste that path onto the end of the ${SERVICE_TITLE} URL:
${renderUrlSelection(getServiceUrl(), THIS_NOTEBOOK_PATH)}
This works the same for public notebooks, for example to see my portfolio:
${renderUrlSelection(getObservableUrl(), '@trebor/portfolio')}
becomes:
${renderUrlSelection(getServiceUrl(), '@trebor/portfolio')}

## Tips and Tricks

  - When you change a notebook you will need to:
    - **Reshare** or **Publish** that notebook
    - reload the ${SERVICE_TITLE} page.
  - Often when you **Reshare** or **Publish** a notebook, the changes will become available in a few seconds, but sometimes it takes longer.
`
)}

function ___utilities(md,SERVICE_TITLE,UTILITIES,getParamNameString){return(
md`## Utilities
The following are a set of functions to help make your web application look and work great on ${SERVICE_TITLE}.
${UTILITIES.map(utility => ({ ...utility, type: typeof utility.resource })).map(
  ({ name, resource, description, type }) =>
    `  - **${name}${
      type === "function" ? `(${getParamNameString(resource)})` : ""
    }**<br><br>A${
      type === "object" ? "n" : ""
    } ${type} which ${description}<br><br>\n`
)}

`
)}

function _hostedOnThumbtools(){return(
() => !!window.__thumbtools || !!window.__notebook_view
)}

function _getUrlParam(location,setUrlParam){return(
(name, defaultValue, setIfUnset = false) => {
  const setValue = new URL(location).searchParams.get(name);
  if (setIfUnset && !setValue) setUrlParam(name, defaultValue);
  return setValue || defaultValue;
}
)}

function _setUrlParam(){return(
(name, value) => {
  const { protocol, host, pathname } = window.location;
  const searchParams = new URL(window.location).searchParams;
  searchParams.set(name, value);
  const url = `${protocol}//${host}${pathname}?${searchParams}`;
  window.history.pushState({ path: url }, null, url);
}
)}

function _clearUrlParam(){return(
name => {
  const { protocol, host, pathname } = window.location;
  const searchParams = new URL(window.location).searchParams;
  searchParams.delete(name);
  const paramsString = searchParams.toString();

  const url = `${protocol}//${host}${pathname}${
    paramsString.length > 0 ? "?" : ""
  }${paramsString}`;
  window.history.pushState({ path: url }, '', url);
}
)}

function _setPageTitle(){return(
function setPageTitle(title) {
  document.title = title;
}
)}

function _setFavicon(d3){return(
(faviconImageUrl, type = "image/png") => {
  return d3
    .select("head")
    .append("link")
    .attr("rel", "shortcut icon")
    .attr("type", type)
    .attr("href", faviconImageUrl);
}
)}

function _defaultPageHeight(){return(
800
)}

async function* _windowSize(addPixelRatioAdjust,hostedOnThumbtools,getAdjustedBodySize,width,defaultPageHeight,ResizeObserver)
{
  while (true) {
    yield addPixelRatioAdjust(
      hostedOnThumbtools()
        ? getAdjustedBodySize(width, window.innerHeight)
        : { width, height: defaultPageHeight }
    );

    await new Promise(resolve => {
      const rso = new ResizeObserver(resizeHander);
      let count = 0;
      function resizeHander() {
        if (++count > 1) {
          rso.unobserve(document.body);
          resolve();
        }
      }
      rso.observe(document.body);
    });
  }
}


function _renderStyle(html,hostedOnThumbtools){return(
({
  thumbToolsOnly = "",
  always = "",
  observableOnly = ""
}) => html`
<style>
  ${always || ""}
  ${(hostedOnThumbtools() ? thumbToolsOnly : observableOnly) || ""}
</style>
`
)}

function _renderThumtoolsStyle(hostedOnThumbtools,html){return(
(style = "") =>
  hostedOnThumbtools()
    ? html`
<style>
  ${style}
</style>
`
    : ""
)}

function _13(md){return(
md`## Page Support`
)}

function _addPixelRatioAdjust(adjustForDevicePixelRatio){return(
size => ({
  ...size,
  pixelRatioAdjust: {
    width: adjustForDevicePixelRatio(size.width),
    height: adjustForDevicePixelRatio(size.height)
  }
})
)}

function _adjustForDevicePixelRatio(){return(
x => Math.floor(x * (window.devicePixelRatio / 2))
)}

function ___style(renderStyle){return(
renderStyle({
  thumbToolsOnly: `

    @import url('https://fonts.googleapis.com/css2?family=Questrial&display=swap');

    body {
      font-family: 'Questrial', sans-serif;
      margin: 4em 4em;
    }`
})
)}

function ___pageSetup(setPageTitle,SERVICE_TITLE)
{
  setPageTitle(SERVICE_TITLE);
  return "";
}


function _UTILITIES(hostedOnThumbtools,SERVICE_TITLE,getUrlParam,IFRAME_CAVEAT,setUrlParam,clearUrlParam,setPageTitle,setFavicon,defaultPageHeight,windowSize,renderStyle){return(
[
  {
    name: "hostedOnThumbtools",
    resource: hostedOnThumbtools,
    description: `returns **true** if the notebook is being rendered on ${SERVICE_TITLE} and **false** when rendered as a classic notebook on Observable.  Use this when you want to conditionally execute code on one system or the other.`
  },
  {
    name: "getUrlParam",
    resource: getUrlParam,
    description: `returns a name URL parameter.  A default value may also be specified which will be returned if the parameter is not present in the URL. This works on Observable and ${SERVICE_TITLE}.<br>
<br>
If the parameter is not present in the URL and **setIfUnset** is set true, the default value will be both returned AND set in the URL. ${IFRAME_CAVEAT}`
  },
  {
    name: "setUrlParam",
    resource: setUrlParam,
    description: `sets the named URL parameter to the specified value. ${IFRAME_CAVEAT}`
  },
  {
    name: "clearUrlParam",
    resource: clearUrlParam,
    description: `clears the named URL parameter. ${IFRAME_CAVEAT}`
  },
  {
    name: "setPageTitle",
    resource: setPageTitle,
    description: `sets the title of the web page. ${IFRAME_CAVEAT}`
  },
  {
    name: "setFavicon",
    resource: setFavicon,
    description: `sets the [favicon](https://en.wikipedia.org/wiki/Favicon) of the web page. ${IFRAME_CAVEAT}`
  },
  {
    name: "defaultPageHeight",
    resource: defaultPageHeight,
    description: `is the default page height value used by **windowSize** when rendered in Observable.`
  },
  {
    name: "windowSize",
    resource: windowSize,
    description: `contains the **width**, **height**, **innerWidth** and **innerHeight** of the web page's body element, when rendered on ${SERVICE_TITLE}.  If the web page's size changes, this object will recalculate, and thus any cells which use it will also recalculate. **windowSize** can be used to create full page web applications.`
  },
  {
    name: "renderStyle",
    resource: renderStyle,
    description: `conditionally renders selected CSS on ${SERVICE_TITLE} only, both systems or Observable only.`
  }
]
)}

function _19(md){return(
md`### Code`
)}

function _getParamNameString(getParamNameArray){return(
funk => {
  const names = getParamNameArray(funk);
  const equalsAt = names
    .map((d, i) => [d === "=", i])
    .filter(([isEqual]) => isEqual)
    .map(([_, d]) => d - 1);
  return names
    .map((d, i, all) => (equalsAt.includes(i) ? `${d} = ${all[i + 2]}` : d))
    .filter((d, i) => !equalsAt.includes(i - 1) && !equalsAt.includes(i - 2))
    .join(", ");
}
)}

function _getParamNameArray(){return(
func => {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
  const ARGUMENT_NAMES = /([^\s,]+)/g;

  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr
    .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
    .match(ARGUMENT_NAMES);
  if (result === null) result = [];
  return result;
}
)}

function _getBodyMargins(){return(
() => {
  const style = window.getComputedStyle(document.body);

  const properties = [
    'margin-left',
    'margin-right',
    'margin-top',
    'margin-bottom'
  ];

  return properties.map(d => Number.parseInt(style.getPropertyValue(d)));
}
)}

function _getAdjustedBodySize(getBodyMargins){return(
(width, height) => {
  const [leftMargin, rightMargin, topMargin, bottomMargin] = getBodyMargins();

  return {
    width: width - (leftMargin + rightMargin),
    height: height - (topMargin + bottomMargin)
  };
}
)}

function _renderUrlSelection(html){return(
(head = "", tail = "", link = true) => {
  const url = `${head}${tail}`;
  const open = link ? `<a href="${url}" target="_blank">` : "<div>";
  const close = link ? `</a>` : "</div>";

  return html`
    <br>
    <br>
      ${open}
        <b><span>${head}</span><span style="background: #ACCEF7;">${tail}</span><b>
      ${close}
    <br>
    <br>
  `;
}
)}

function _getServiceUrl(BASE_THUMBTOOLS_URL){return(
(path = "", debug = false) =>
  `${BASE_THUMBTOOLS_URL}/${path}${debug ? '?db=true' : ''}`
)}

function _getObservableUrl(){return(
(path = "") => `https://observablehq.com/${path}`
)}

function _getGoogleImage(){return(
(baseUrl, size) => `${baseUrl}h${size}`
)}

function _28(md){return(
md`### Constants`
)}

function _IFRAME_CAVEAT(SERVICE_TITLE){return(
`This only works on ${SERVICE_TITLE}, and not on Observable because Observable uses [IFrames](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) to render cells.`
)}

function _THIS_NOTEBOOK_PATH(){return(
`@trebor/thumbtools`
)}

function _THIS_NOTEBOOK_ID(){return(
"1942863f3e7b7b95"
)}

function _BASE_THUMBTOOLS_URL(SERVICE_DOMAIN){return(
`http://${SERVICE_DOMAIN}`
)}

function _CELL_PREFIX(){return(
"__"
)}

function _SERVICE_TITLE(){return(
"ThumbTools"
)}

function _SERVICE_DOMAIN(){return(
"thumbtools.org"
)}

function _LOGO_URL(){return(
"https://lh3.googleusercontent.com/pw/ACtC-3fVIdIvgTrPT1Cu3tUBZZhMDOTugF1amNIW-jJndJ7nWWNDz7g7s2kYrTXxEtPKigR--JHBrawT552tqLKWNzc2QGXufXQ2fRzfQO5RZ4YQcMkYmkUzBUeguVn7p_wrRW_Ys1cppjMq8riLj06GBp9ZtA="
)}

function _37(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("__title")).define("__title", ["md","getGoogleImage","LOGO_URL","SERVICE_TITLE","getObservableUrl","THIS_NOTEBOOK_PATH","CELL_PREFIX","renderUrlSelection","getServiceUrl"], ___title);
  main.variable(observer("__utilities")).define("__utilities", ["md","SERVICE_TITLE","UTILITIES","getParamNameString"], ___utilities);
  main.variable(observer("hostedOnThumbtools")).define("hostedOnThumbtools", _hostedOnThumbtools);
  main.variable(observer("getUrlParam")).define("getUrlParam", ["location","setUrlParam"], _getUrlParam);
  main.variable(observer("setUrlParam")).define("setUrlParam", _setUrlParam);
  main.variable(observer("clearUrlParam")).define("clearUrlParam", _clearUrlParam);
  main.variable(observer("setPageTitle")).define("setPageTitle", _setPageTitle);
  main.variable(observer("setFavicon")).define("setFavicon", ["d3"], _setFavicon);
  main.variable(observer("defaultPageHeight")).define("defaultPageHeight", _defaultPageHeight);
  main.variable(observer("windowSize")).define("windowSize", ["addPixelRatioAdjust","hostedOnThumbtools","getAdjustedBodySize","width","defaultPageHeight","ResizeObserver"], _windowSize);
  main.variable(observer("renderStyle")).define("renderStyle", ["html","hostedOnThumbtools"], _renderStyle);
  main.variable(observer("renderThumtoolsStyle")).define("renderThumtoolsStyle", ["hostedOnThumbtools","html"], _renderThumtoolsStyle);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("addPixelRatioAdjust")).define("addPixelRatioAdjust", ["adjustForDevicePixelRatio"], _addPixelRatioAdjust);
  main.variable(observer("adjustForDevicePixelRatio")).define("adjustForDevicePixelRatio", _adjustForDevicePixelRatio);
  main.variable(observer("__style")).define("__style", ["renderStyle"], ___style);
  main.variable(observer("__pageSetup")).define("__pageSetup", ["setPageTitle","SERVICE_TITLE"], ___pageSetup);
  main.variable(observer("UTILITIES")).define("UTILITIES", ["hostedOnThumbtools","SERVICE_TITLE","getUrlParam","IFRAME_CAVEAT","setUrlParam","clearUrlParam","setPageTitle","setFavicon","defaultPageHeight","windowSize","renderStyle"], _UTILITIES);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("getParamNameString")).define("getParamNameString", ["getParamNameArray"], _getParamNameString);
  main.variable(observer("getParamNameArray")).define("getParamNameArray", _getParamNameArray);
  main.variable(observer("getBodyMargins")).define("getBodyMargins", _getBodyMargins);
  main.variable(observer("getAdjustedBodySize")).define("getAdjustedBodySize", ["getBodyMargins"], _getAdjustedBodySize);
  main.variable(observer("renderUrlSelection")).define("renderUrlSelection", ["html"], _renderUrlSelection);
  main.variable(observer("getServiceUrl")).define("getServiceUrl", ["BASE_THUMBTOOLS_URL"], _getServiceUrl);
  main.variable(observer("getObservableUrl")).define("getObservableUrl", _getObservableUrl);
  main.variable(observer("getGoogleImage")).define("getGoogleImage", _getGoogleImage);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("IFRAME_CAVEAT")).define("IFRAME_CAVEAT", ["SERVICE_TITLE"], _IFRAME_CAVEAT);
  main.variable(observer("THIS_NOTEBOOK_PATH")).define("THIS_NOTEBOOK_PATH", _THIS_NOTEBOOK_PATH);
  main.variable(observer("THIS_NOTEBOOK_ID")).define("THIS_NOTEBOOK_ID", _THIS_NOTEBOOK_ID);
  main.variable(observer("BASE_THUMBTOOLS_URL")).define("BASE_THUMBTOOLS_URL", ["SERVICE_DOMAIN"], _BASE_THUMBTOOLS_URL);
  main.variable(observer("CELL_PREFIX")).define("CELL_PREFIX", _CELL_PREFIX);
  main.variable(observer("SERVICE_TITLE")).define("SERVICE_TITLE", _SERVICE_TITLE);
  main.variable(observer("SERVICE_DOMAIN")).define("SERVICE_DOMAIN", _SERVICE_DOMAIN);
  main.variable(observer("LOGO_URL")).define("LOGO_URL", _LOGO_URL);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
