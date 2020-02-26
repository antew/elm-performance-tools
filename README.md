# Elm Performance Tools

## DISCLAIMER 
** EXPERIMENTAL, REQUIRES KERNEL CODE, MAY BEWITCH YOUR COMPUTER **

This library, requires changes to the `elm/browser` and `elm/virtual-dom` packages to add code to perform the benchmarks.

Running this code in your own project is possible, but requires unapproved methods that circumvent all of the guarantees you get with the Elm package system.

I do not recommend running this in production, it is intended for use in development environments to help with benchmarking and improving app performance.

## Trying it out

Open [antew.dev/lazy](https://antew.dev/lazy) and try it out.

## Usage in other projects

Because this requires modified kernel code you will need [shelm](https://github.com/robx/shelm) installed.

With shelm installed, edit the `elm.json` file in your project to point to the modified packages.

```
{
  ...
  "dependencies": {
    ...
    "locations": {
      "elm/virtual-dom": {
        "method": "git",
        "url": "https://github.com/antew/virtual-dom.git",
        "ref": "master"
      },
      "elm/browser": {
        "method": "git",
        "url": "https://github.com/antew/browser.git",
        "ref": "master"
      }
    }
  },
  ...
}
```

Next run `shelm fetch` to download the dependencies and get everything set up.

Once that is complete run your build, but substitute `shelm` for `elm`.  If you are using webpack with the node-elm-compiler, change the `pathToElm` to `shelm`:

```
{
  test: /\.elm$/,
  exclude: [/elm-stuff/, /node_modules/],
  loader: "elm-webpack-loader",
  options: {
    debug: false,
    optimize: true,
    pathToElm: "shelm"
  }
}
```

Final Steps:

- Disable debug mode, debug mode has additional overhead that would invalidate the data. This tool will not work in debug mode.
- Disabling `optimize` is optional, it'll work with either setting.
- Run your webpack build as usual.
- Drag the bookmarklet below to your bookmarks.

Bookmarklet, drag to your bookmarks: <a href="javascript:(function()%7Bconst%20padding%20%3D%20%22%20%20%20%20%20%20%20%20%22%3B%0Aconst%20chartOptions%20%3D%20%7B%0A%20%20height%3A%205%2C%0A%20%20padding%3A%20padding%2C%0A%20%20format%3A%20(x%2C%20_)%20%3D%3E%20(padding%20%2B%20x.toFixed(1)).slice(-padding.length)%0A%7D%3B%0A%0Afunction%20createPopup(popup)%20%7B%0A%20%20var%20popup%20%3D%20window.open(%22%22%2C%20%22%22%2C%20%22width%3D525%2Cheight%3D725%2Cleft%3D0%2Ctop%3D0%22)%3B%0A%20%20var%20doc%20%3D%20popup.document%3B%0A%20%20doc.title%20%3D%20%22Elm%20Performance%20Tools%22%3B%0A%0A%20%20doc.body.innerHTML%20%3D%20%60%0A%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20html%7B%0A%20%20%20%20%20%20%20%20font-family%3Asystem-ui%2C-apple-system%2CBlinkMacSystemFont%2CSegoe%20UI%2CRoboto%2CHelvetica%20Neue%2CArial%2CNoto%20Sans%2Csans-serif%2CApple%20Color%20Emoji%2CSegoe%20UI%20Emoji%2CSegoe%20UI%20Symbol%2CNoto%20Color%20Emoji%3B%0A%20%20%20%20%20%20%20%20line-height%3A1.5%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20body%20%7B%0A%20%20%20%20%20%20%20%20background-color%3A%20%231f1f1f%3B%0A%20%20%20%20%20%20%20%20color%3A%20%23eeeeee%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.flex%20%7B%20display%3A%20-webkit-box%3B%20display%3A%20flex%3B%20%7D%0A%20%20%20%20%20%20.flex-col%20%7B%20flex-direction%3A%20column%3B%20%7D%0A%20%20%20%20%20%20.flex-wrap%20%7B%20flex-wrap%3A%20wrap%3B%20%7D%0A%20%20%20%20%20%20.m-1%20%7B%20margin%3A%200.25em%3B%20%7D%0A%20%20%20%20%20%20.mt-4%20%7B%20margin-top%3A%201rem%3B%20%7D%0A%20%20%20%20%20%20.mt-6%20%7B%20margin-top%3A%201.5rem%3B%20%7D%0A%20%20%20%20%20%20.ml-6%20%7B%20margin-left%3A%201.5rem%3B%20%7D%0A%20%20%20%20%20%20.text-xs%20%7B%20font-size%3A%200.75rem%3B%20%7D%0A%20%20%20%20%20%20.text-xl%20%7B%20font-size%3A%201.25rem%3B%20%7D%0A%20%20%20%20%20%20.text-center%20%7B%20text-align%3A%20center%3B%20%7D%0A%20%20%20%20%20%20.w-1%5C%5C%2F3%20%7B%20width%3A%2033.333333%25%3B%20%7D%0A%20%20%20%20%20%20.w-2%5C%5C%2F3%20%7B%20width%3A%2066.666667%25%3B%20%7D%0A%20%20%20%20%20%20.text-gray%20%7B%20color%3A%20%23eeeeee%3B%20%7D%0A%20%20%20%20%20%20.overflow-scroll%20%7B%20overflow%3A%20scroll%3B%20%7D%0A%20%20%20%20%20%20.justify-center%20%7B%20justify-content%3A%20center%3B%20%7D%0A%20%20%20%20%20%20pre%20%7B%0A%20%20%20%20%20%20%20%20font-family%3A%20Menlo%2C%20Monaco%2C%20Consolas%2C%20%22Liberation%20Mono%22%2C%20%22Courier%20New%22%2C%20monospace%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20.flex-col-reverse%20%7B%0A%20%20%20%20%20%20%20%20-webkit-box-orient%3A%20vertical%3B%0A%20%20%20%20%20%20%20%20-webkit-box-direction%3A%20reverse%3B%0A%20%20%20%20%20%20%20%20flex-direction%3A%20column-reverse%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%3Cdiv%20class%3D%22mt-4%20text-xs%22%3E%0A%20%20%20%20%20%20%3Cdiv%20class%3D%22flex%20flex-col%20my-6%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3ELazyness%20Type%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22flex%20flex-col%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20class%3D%22mr-2%22%20type%3D%22radio%22%20id%3D%22reference-lazy%22%20name%3D%22lazy%22%20onchange%3D%22window.opener.elm_use_structural_equality%20%3D%20false%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Clabel%20for%3D%22reference-lazy%22%3EReference%20equality%20(default)%3C%2Flabel%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20class%3D%22mr-2%22%20type%3D%22radio%22%20id%3D%22structural-lazy%22%20name%3D%22lazy%22%20onchange%3D%22window.opener.elm_use_structural_equality%20%3D%20true%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Clabel%20for%3D%22structural-lazy%22%3EStructural%20Equality%20(experimental)%3C%2Flabel%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3Cdiv%20class%3D%22flex%20text-center%20justify-center%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22text-xl%22%20id%3D%22lazy-success-chart%22%3E%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3ELazy%20render%20success%3C%2Fh4%3E%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22ml-6%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22text-xl%22%20id%3D%22lazy-failure-chart%22%3E%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3ELazy%20render%20failure%3C%2Fh4%3E%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%3Cdiv%20class%3D%22flex%20flex-wrap%22%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%20510px%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Cpre%20class%3D%22mt-6%22%20id%3D%22view-chart%22%3E%3C%2Fpre%3E%0A%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3EView%20function%20(ms)%3C%2Fh4%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%20510px%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Cpre%20class%3D%22mt-6%22%20id%3D%22diff-chart%22%3E%3C%2Fpre%3E%0A%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3EVDom%20diffing%20(ms)%3C%2Fh4%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%20510px%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Cpre%20class%3D%22mt-6%22%20id%3D%22patch-chart%22%3E%3C%2Fpre%3E%0A%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3EVDom%20patching%20(ms)%3C%2Fh4%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3Cdiv%20style%3D%22width%3A%20510px%3B%22%3E%0A%20%20%20%20%20%20%20%20%3Cpre%20class%3D%22mt-6%22%20id%3D%22frame-chart%22%3E%3C%2Fpre%3E%0A%20%20%20%20%20%20%20%20%3Ch4%20class%3D%22text-center%20text-gray%20m-1%22%3EFrame%20time%20(ms)%3C%2Fh4%3E%3C%2Fdiv%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%3C%2Fdiv%3E%0A%20%20%60%3B%0A%0A%20%20return%20doc%3B%0A%7D%0A%0Afunction%20startListening(doc)%20%7B%0A%20%20var%20viewChartElem%20%3D%20doc.getElementById(%22view-chart%22)%3B%0A%20%20var%20diffChartElem%20%3D%20doc.getElementById(%22diff-chart%22)%3B%0A%20%20var%20patchChartElem%20%3D%20doc.getElementById(%22patch-chart%22)%3B%0A%20%20var%20frameChartElem%20%3D%20doc.getElementById(%22frame-chart%22)%3B%0A%20%20var%20lazySuccessChartElem%20%3D%20doc.getElementById(%22lazy-success-chart%22)%3B%0A%20%20var%20lazyFailureChartElem%20%3D%20doc.getElementById(%22lazy-failure-chart%22)%3B%0A%20%20var%20MAX_SAMPLES%20%3D%2060%3B%0A%20%20var%20viewData%20%3D%20%5B%5D%3B%0A%20%20var%20diffData%20%3D%20%5B%5D%3B%0A%20%20var%20patchData%20%3D%20%5B%5D%3B%0A%20%20var%20frameData%20%3D%20%5B%5D%3B%0A%20%20var%20frameStart%2C%20frameEnd%3B%0A%20%20var%20lastChartUpdate%20%3D%200%3B%0A%0A%20%20var%20lazySuccesses%20%3D%200%3B%0A%20%20var%20lazyFailures%20%3D%200%3B%0A%0A%20%20var%20updateCharts%20%3D%20()%20%3D%3E%20%7B%0A%20%20%20%20viewChartElem.innerHTML%20%3D%20plot(viewData%2C%20chartOptions)%3B%0A%20%20%20%20diffChartElem.innerHTML%20%3D%20plot(diffData%2C%20chartOptions)%3B%0A%20%20%20%20patchChartElem.innerHTML%20%3D%20plot(patchData%2C%20chartOptions)%3B%0A%20%20%20%20lazyFailureChartElem.innerHTML%20%3D%20lazyFailures%3B%0A%20%20%20%20lazySuccessChartElem.innerHTML%20%3D%20lazySuccesses%3B%0A%20%20%7D%3B%0A%0A%20%20document.addEventListener(%22elm-view%22%2C%20event%20%3D%3E%20%7B%0A%20%20%20%20if%20(viewData.length%20%3E%3D%20MAX_SAMPLES)%20viewData.shift()%3B%0A%20%20%20%20viewData.push(event.detail)%3B%0A%20%20%7D)%3B%0A%20%20document.addEventListener(%22elm-vdom-diff%22%2C%20event%20%3D%3E%20%7B%0A%20%20%20%20if%20(diffData.length%20%3E%3D%20MAX_SAMPLES)%20diffData.shift()%3B%0A%20%20%20%20diffData.push(event.detail)%3B%0A%20%20%7D)%3B%0A%20%20document.addEventListener(%22elm-vdom-patch%22%2C%20event%20%3D%3E%20%7B%0A%20%20%20%20if%20(patchData.length%20%3E%3D%20MAX_SAMPLES)%20patchData.shift()%3B%0A%20%20%20%20patchData.push(event.detail)%3B%0A%0A%20%20%20%20%2F%2F%20view-%3Ediff-%3Epatch-%3Eupdate%20charts%0A%20%20%20%20if%20(event.timeStamp%20-%20lastChartUpdate%20%3E%3D%20250)%20%7B%0A%20%20%20%20%20%20lastChartUpdate%20%3D%20event.timeStamp%3B%0A%20%20%20%20%20%20updateCharts()%3B%0A%20%20%20%20%7D%0A%20%20%7D)%3B%0A%0A%20%20document.addEventListener(%22elm-lazy-success%22%2C%20_%20%3D%3E%20lazySuccesses%2B%2B)%3B%0A%20%20document.addEventListener(%22elm-lazy-failure%22%2C%20_%20%3D%3E%20lazyFailures%2B%2B)%3B%0A%0A%20%20frameStart%20%3D%20performance.now()%3B%0A%20%20var%20lastFrameTime%20%3D%200%3B%0A%20%20var%20smoothing%20%3D%2010%3B%0A%20%20var%20lastFrameChartUpdate%20%3D%200%3B%0A%20%20function%20timeFrames()%20%7B%0A%20%20%20%20frameEnd%20%3D%20performance.now()%3B%0A%20%20%20%20if%20(frameData.length%20%3E%3D%20MAX_SAMPLES)%20frameData.shift()%3B%0A%20%20%20%20var%20duration%20%3D%20frameEnd%20-%20frameStart%3B%0A%20%20%20%20lastFrameTime%20%2B%3D%20(duration%20*%20(duration%20-%20lastFrameTime))%20%2F%20smoothing%3B%0A%20%20%20%20frameData.push(duration)%3B%0A%20%20%20%20frameStart%20%3D%20frameEnd%3B%0A%0A%20%20%20%20if%20(frameEnd%20-%20lastFrameChartUpdate%20%3E%3D%20100)%20%7B%0A%20%20%20%20%20%20frameChartElem.innerHTML%20%3D%20plot(frameData%2C%20chartOptions)%3B%0A%20%20%20%20%20%20lastFrameChartUpdate%20%3D%20frameEnd%3B%0A%20%20%20%20%7D%0A%20%20%20%20requestAnimationFrame(timeFrames)%3B%0A%20%20%7D%0A%20%20timeFrames()%3B%0A%7D%0A%0A%2F**%0A%20*%20Thanks%20to%20kroitor%20for%20the%20awesome%20asciichart%20library%0A%20*%20https%3A%2F%2Fgithub.com%2Fkroitor%2Fasciichart%0A%20*%0A%20*%2F%0Afunction%20plot(series%2C%20cfg%20%3D%20undefined)%20%7B%0A%20%20let%20min%20%3D%20series%5B0%5D%3B%0A%20%20let%20max%20%3D%20series%5B0%5D%3B%0A%0A%20%20for%20(let%20i%20%3D%201%3B%20i%20%3C%20series.length%3B%20i%2B%2B)%20%7B%0A%20%20%20%20min%20%3D%20Math.min(min%2C%20series%5Bi%5D)%3B%0A%20%20%20%20max%20%3D%20Math.max(max%2C%20series%5Bi%5D)%3B%0A%20%20%7D%0A%0A%20%20let%20range%20%3D%20Math.abs(max%20-%20min)%3B%0A%20%20cfg%20%3D%20typeof%20cfg%20!%3D%3D%20%22undefined%22%20%3F%20cfg%20%3A%20%7B%7D%3B%0A%20%20let%20offset%20%3D%20typeof%20cfg.offset%20!%3D%3D%20%22undefined%22%20%3F%20cfg.offset%20%3A%203%3B%0A%20%20let%20padding%20%3D%0A%20%20%20%20typeof%20cfg.padding%20!%3D%3D%20%22undefined%22%20%3F%20cfg.padding%20%3A%20%22%20%20%20%20%20%20%20%20%20%20%20%22%3B%0A%20%20let%20height%20%3D%20typeof%20cfg.height%20!%3D%3D%20%22undefined%22%20%3F%20cfg.height%20%3A%20range%3B%0A%20%20let%20ratio%20%3D%20range%20!%3D%3D%200%20%3F%20height%20%2F%20range%20%3A%201%3B%0A%20%20let%20min2%20%3D%20Math.round(min%20*%20ratio)%3B%0A%20%20let%20max2%20%3D%20Math.round(max%20*%20ratio)%3B%0A%20%20let%20rows%20%3D%20Math.abs(max2%20-%20min2)%3B%0A%20%20let%20width%20%3D%20series.length%20%2B%20offset%3B%0A%20%20let%20format%20%3D%0A%20%20%20%20typeof%20cfg.format%20!%3D%3D%20%22undefined%22%0A%20%20%20%20%20%20%3F%20cfg.format%0A%20%20%20%20%20%20%3A%20function(x)%20%7B%0A%20%20%20%20%20%20%20%20%20%20return%20(padding%20%2B%20x.toFixed(2)).slice(-padding.length)%3B%0A%20%20%20%20%20%20%20%20%7D%3B%0A%0A%20%20let%20result%20%3D%20new%20Array(rows%20%2B%201)%3B%20%2F%2F%20empty%20space%0A%20%20for%20(let%20i%20%3D%200%3B%20i%20%3C%3D%20rows%3B%20i%2B%2B)%20%7B%0A%20%20%20%20result%5Bi%5D%20%3D%20new%20Array(width)%3B%0A%20%20%20%20for%20(let%20j%20%3D%200%3B%20j%20%3C%20width%3B%20j%2B%2B)%20%7B%0A%20%20%20%20%20%20result%5Bi%5D%5Bj%5D%20%3D%20%22%20%22%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20for%20(let%20y%20%3D%20min2%3B%20y%20%3C%3D%20max2%3B%20%2B%2By)%20%7B%0A%20%20%20%20%2F%2F%20axis%20%2B%20labels%0A%20%20%20%20let%20label%20%3D%20format(%0A%20%20%20%20%20%20rows%20%3E%200%20%3F%20max%20-%20((y%20-%20min2)%20*%20range)%20%2F%20rows%20%3A%20y%2C%0A%20%20%20%20%20%20y%20-%20min2%0A%20%20%20%20)%3B%0A%20%20%20%20result%5By%20-%20min2%5D%5BMath.max(offset%20-%20label.length%2C%200)%5D%20%3D%20label%3B%0A%20%20%20%20result%5By%20-%20min2%5D%5Boffset%20-%201%5D%20%3D%20y%20%3D%3D%200%20%3F%20%22%E2%94%BC%22%20%3A%20%22%E2%94%A4%22%3B%0A%20%20%7D%0A%0A%20%20let%20y0%20%3D%20Math.round(series%5B0%5D%20*%20ratio)%20-%20min2%3B%0A%20%20result%5Brows%20-%20y0%5D%5Boffset%20-%201%5D%20%3D%20%22%E2%94%BC%22%3B%20%2F%2F%20first%20value%0A%0A%20%20for%20(let%20x%20%3D%200%3B%20x%20%3C%20series.length%20-%201%3B%20x%2B%2B)%20%7B%0A%20%20%20%20%2F%2F%20plot%20the%20line%0A%20%20%20%20let%20y0%20%3D%20Math.round(series%5Bx%20%2B%200%5D%20*%20ratio)%20-%20min2%3B%0A%20%20%20%20let%20y1%20%3D%20Math.round(series%5Bx%20%2B%201%5D%20*%20ratio)%20-%20min2%3B%0A%20%20%20%20if%20(y0%20%3D%3D%20y1)%20%7B%0A%20%20%20%20%20%20result%5Brows%20-%20y0%5D%5Bx%20%2B%20offset%5D%20%3D%20%22%E2%94%80%22%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20result%5Brows%20-%20y1%5D%5Bx%20%2B%20offset%5D%20%3D%20y0%20%3E%20y1%20%3F%20%22%E2%95%B0%22%20%3A%20%22%E2%95%AD%22%3B%0A%20%20%20%20%20%20result%5Brows%20-%20y0%5D%5Bx%20%2B%20offset%5D%20%3D%20y0%20%3E%20y1%20%3F%20%22%E2%95%AE%22%20%3A%20%22%E2%95%AF%22%3B%0A%20%20%20%20%20%20let%20from%20%3D%20Math.min(y0%2C%20y1)%3B%0A%20%20%20%20%20%20let%20to%20%3D%20Math.max(y0%2C%20y1)%3B%0A%20%20%20%20%20%20for%20(let%20y%20%3D%20from%20%2B%201%3B%20y%20%3C%20to%3B%20y%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20result%5Brows%20-%20y%5D%5Bx%20%2B%20offset%5D%20%3D%20%22%E2%94%82%22%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20return%20result%0A%20%20%20%20.map(function(x)%20%7B%0A%20%20%20%20%20%20return%20x.join(%22%22)%3B%0A%20%20%20%20%7D)%0A%20%20%20%20.join(%22%5Cn%22)%3B%0A%7D%0A%0Avar%20popup%20%3D%20createPopup()%3B%0AstartListening(popup)%3B%0Awindow.onbeforeunload%20%3D%20function()%20%7B%0A%20%20popup.close()%3B%0A%20%20popup%20%3D%20undefined%3B%0A%7D%3B%7D)()%3B">Elm Performance Tools</a>

- Open your app
- Click the bookmarklet
