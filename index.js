const padding = "        ";
const chartOptions = {
  height: 5,
  padding: padding,
  format: (x, _) => (padding + x.toFixed(1)).slice(-padding.length)
};

function createPopup(popup) {
  var popup = window.open("", "", "width=525,height=725,left=0,top=0");
  var doc = popup.document;
  doc.title = "Elm Performance Tools";

  doc.body.innerHTML = `
    <style type="text/css">
      html{
        font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
        line-height:1.5
      }
      body {
        background-color: #1f1f1f;
        color: #eeeeee;
      }
      .flex { display: -webkit-box; display: flex; }
      .flex-col { flex-direction: column; }
      .flex-wrap { flex-wrap: wrap; }
      .m-1 { margin: 0.25em; }
      .mt-4 { margin-top: 1rem; }
      .mt-6 { margin-top: 1.5rem; }
      .ml-6 { margin-left: 1.5rem; }
      .text-xs { font-size: 0.75rem; }
      .text-xl { font-size: 1.25rem; }
      .text-center { text-align: center; }
      .w-1\\/3 { width: 33.333333%; }
      .w-2\\/3 { width: 66.666667%; }
      .text-gray { color: #eeeeee; }
      .overflow-scroll { overflow: scroll; }
      .justify-center { justify-content: center; }
      pre {
        font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }
      .flex-col-reverse {
        -webkit-box-orient: vertical;
        -webkit-box-direction: reverse;
        flex-direction: column-reverse;
      }
    </style>
    <div class="mt-4 text-xs">
      <div class="flex flex-col my-6">
        <div>Lazyness Type</div>
        <div class="flex flex-col">
          <div>
            <input class="mr-2" type="radio" id="reference-lazy" name="lazy" onchange="window.opener.elm_use_structural_equality = false;">
            <label for="reference-lazy">Reference equality (default)</label>
          </div>
          <div>
            <input class="mr-2" type="radio" id="structural-lazy" name="lazy" onchange="window.opener.elm_use_structural_equality = true;">
            <label for="structural-lazy">Structural Equality (experimental)</label>
          </div>
        </div>
      </div>
      <div class="flex text-center justify-center">
        <div>
          <div class="text-xl" id="lazy-success-chart"></div>
          <h4 class="text-center text-gray m-1">Lazy render success</h4>
        </div>
        <div class="ml-6">
          <div class="text-xl" id="lazy-failure-chart"></div>
          <h4 class="text-center text-gray m-1">Lazy render failure</h4>
        </div>
      </div>
    <div class="flex flex-wrap">
      <div style="width: 510px;">
        <pre class="mt-6" id="view-chart"></pre>
        <h4 class="text-center text-gray m-1">View function (ms)</h4>
      </div>
      <div style="width: 510px;">
        <pre class="mt-6" id="diff-chart"></pre>
        <h4 class="text-center text-gray m-1">VDom diffing (ms)</h4>
      </div>
      <div style="width: 510px;">
        <pre class="mt-6" id="patch-chart"></pre>
        <h4 class="text-center text-gray m-1">VDom patching (ms)</h4>
      </div>
      <div style="width: 510px;">
        <pre class="mt-6" id="frame-chart"></pre>
        <h4 class="text-center text-gray m-1">Frame time (ms)</h4></div>
      </div>
    </div>
  `;

  return doc;
}

function startListening(doc) {
  var viewChartElem = doc.getElementById("view-chart");
  var diffChartElem = doc.getElementById("diff-chart");
  var patchChartElem = doc.getElementById("patch-chart");
  var frameChartElem = doc.getElementById("frame-chart");
  var lazySuccessChartElem = doc.getElementById("lazy-success-chart");
  var lazyFailureChartElem = doc.getElementById("lazy-failure-chart");
  var MAX_SAMPLES = 60;
  var viewData = [];
  var diffData = [];
  var patchData = [];
  var frameData = [];
  var frameStart, frameEnd;
  var lastChartUpdate = 0;

  var lazySuccesses = 0;
  var lazyFailures = 0;

  var updateCharts = () => {
    viewChartElem.innerHTML = plot(viewData, chartOptions);
    diffChartElem.innerHTML = plot(diffData, chartOptions);
    patchChartElem.innerHTML = plot(patchData, chartOptions);
    lazyFailureChartElem.innerHTML = lazyFailures;
    lazySuccessChartElem.innerHTML = lazySuccesses;
  };

  document.addEventListener("elm-view", event => {
    if (viewData.length >= MAX_SAMPLES) viewData.shift();
    viewData.push(event.detail);
  });
  document.addEventListener("elm-vdom-diff", event => {
    if (diffData.length >= MAX_SAMPLES) diffData.shift();
    diffData.push(event.detail);
  });
  document.addEventListener("elm-vdom-patch", event => {
    if (patchData.length >= MAX_SAMPLES) patchData.shift();
    patchData.push(event.detail);

    // view->diff->patch->update charts
    if (event.timeStamp - lastChartUpdate >= 250) {
      lastChartUpdate = event.timeStamp;
      updateCharts();
    }
  });

  document.addEventListener("elm-lazy-success", _ => lazySuccesses++);
  document.addEventListener("elm-lazy-failure", _ => lazyFailures++);

  frameStart = performance.now();
  var lastFrameTime = 0;
  var smoothing = 10;
  var lastFrameChartUpdate = 0;
  function timeFrames() {
    frameEnd = performance.now();
    if (frameData.length >= MAX_SAMPLES) frameData.shift();
    var duration = frameEnd - frameStart;
    lastFrameTime += (duration * (duration - lastFrameTime)) / smoothing;
    frameData.push(duration);
    frameStart = frameEnd;

    if (frameEnd - lastFrameChartUpdate >= 100) {
      frameChartElem.innerHTML = plot(frameData, chartOptions);
      lastFrameChartUpdate = frameEnd;
    }
    requestAnimationFrame(timeFrames);
  }
  timeFrames();
}

/**
 * Thanks to kroitor for the awesome asciichart library
 * https://github.com/kroitor/asciichart
 *
 */
function plot(series, cfg = undefined) {
  let min = series[0];
  let max = series[0];

  for (let i = 1; i < series.length; i++) {
    min = Math.min(min, series[i]);
    max = Math.max(max, series[i]);
  }

  let range = Math.abs(max - min);
  cfg = typeof cfg !== "undefined" ? cfg : {};
  let offset = typeof cfg.offset !== "undefined" ? cfg.offset : 3;
  let padding =
    typeof cfg.padding !== "undefined" ? cfg.padding : "           ";
  let height = typeof cfg.height !== "undefined" ? cfg.height : range;
  let ratio = range !== 0 ? height / range : 1;
  let min2 = Math.round(min * ratio);
  let max2 = Math.round(max * ratio);
  let rows = Math.abs(max2 - min2);
  let width = series.length + offset;
  let format =
    typeof cfg.format !== "undefined"
      ? cfg.format
      : function(x) {
          return (padding + x.toFixed(2)).slice(-padding.length);
        };

  let result = new Array(rows + 1); // empty space
  for (let i = 0; i <= rows; i++) {
    result[i] = new Array(width);
    for (let j = 0; j < width; j++) {
      result[i][j] = " ";
    }
  }
  for (let y = min2; y <= max2; ++y) {
    // axis + labels
    let label = format(
      rows > 0 ? max - ((y - min2) * range) / rows : y,
      y - min2
    );
    result[y - min2][Math.max(offset - label.length, 0)] = label;
    result[y - min2][offset - 1] = y == 0 ? "┼" : "┤";
  }

  let y0 = Math.round(series[0] * ratio) - min2;
  result[rows - y0][offset - 1] = "┼"; // first value

  for (let x = 0; x < series.length - 1; x++) {
    // plot the line
    let y0 = Math.round(series[x + 0] * ratio) - min2;
    let y1 = Math.round(series[x + 1] * ratio) - min2;
    if (y0 == y1) {
      result[rows - y0][x + offset] = "─";
    } else {
      result[rows - y1][x + offset] = y0 > y1 ? "╰" : "╭";
      result[rows - y0][x + offset] = y0 > y1 ? "╮" : "╯";
      let from = Math.min(y0, y1);
      let to = Math.max(y0, y1);
      for (let y = from + 1; y < to; y++) {
        result[rows - y][x + offset] = "│";
      }
    }
  }

  return result
    .map(function(x) {
      return x.join("");
    })
    .join("\n");
}

var popup = createPopup();
startListening(popup);
window.onbeforeunload = function() {
  popup.close();
  popup = undefined;
};
