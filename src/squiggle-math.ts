// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import _ from 'lodash'

type xyDistLine = { readonly xs: number[]; readonly ys: number[] }
type xyDistLines = xyDistLine[]
type xyCoord = { x: number; y: number }
type xyCoords = xyCoord[]

export type interpolationStrategy = 'Stepwise' | 'Linear'
export type extrapolationStrategy = 'UseZero' | 'UseOutermostPoints'

module xyDistLine {
  export let xs = (t: xyDistLine) => t.xs
  export let ys = (t: xyDistLine) => t.ys
  export let length = (t: xyDistLine) => t.xs.length
  export let empty: xyDistLine = { xs: [], ys: [] }
  export let isEmpty = (t: xyDistLine) => length(t) === 0
  export let minX = (t: xyDistLine) => xs(t)[0]
  export let maxX = (t: xyDistLine) => xs(t)[length(t) - 1]
  export let firstY = (t: xyDistLine) => ys(t)[0]
  export let lastY = (t: xyDistLine) => ys(t)[length(t) - 1]
  export let xRange = (t: xyDistLine) => maxX(t) - minX(t)
  export let mapX = (t: xyDistLine, f: (x: number) => number): xyDistLine => {
    return { xs: t.xs.map(f), ys: t.ys }
  }
  export let mapY = (t: xyDistLine, f: (y: number) => number): xyDistLine => {
    return { xs: t.xs, ys: t.ys.map(f) }
  }
  export let toXYCoords = ({ xs, ys }: xyDistLine): xyCoord[] => xs.map((x, i) => ({ x, y: ys[i] }))

  export let firstCoord = (t: xyDistLine): xyCoord => ({
    x: xyDistLine.minX(t),
    y: xyDistLine.firstY(t)
  })
  export let lastCoord = (t: xyDistLine): xyCoord => ({
    x: xyDistLine.maxX(t),
    y: xyDistLine.lastY(t)
  })
  //todo: This could be sped up by not using zip.
  export let getCoordBy = (t: xyDistLine, fn: (p: xyCoord) => boolean) => toXYCoords(t).find(fn)

  export let fromArrays = (xs: number[], ys: number[]): xyDistLine => ({ xs: xs, ys: ys })
  export let concat = (t1: xyDistLine, t2: xyDistLine): xyDistLine => {
    return { xs: t1.xs.concat(t2.xs), ys: t1.ys.concat(t2.ys) }
  }
  export let equallyDividedXs = (t: xyDistLine, n: number): number[] => {
    let step = xRange(t) / (n - 1)
    return _.range(minX(t), maxX(t), step)
  }
}

module xyDistLines {
  type xyDistLines = xyDistLine[]
  let minX = (t: xyDistLines) => _.min(t.map(xyDistLine.minX))
  let maxX = (t: xyDistLines) => _.max(t.map(xyDistLine.maxX))
  //TODO: Handle undefined cases
  let equallyDividedXs = (t: xyDistLines, n: number): number[] => {
    let step = (maxX(t) - minX(t)) / (n - 1)
    return _.range(minX(t), maxX(t), step)
  }
  let allXs = (t: xyDistLines) => _.uniq(_.flatten(t.map(xyDistLine.xs)))
}

// module YtoX = {
//   let linear = (t: xyDistLine, y:number): number => {

// }
