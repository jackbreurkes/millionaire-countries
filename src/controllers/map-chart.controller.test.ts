import {genRangeTransformer} from "./map-chart.controller";

test.each([
    [0, 25], [1e6, 90], [500000, 57.5]
])("[0, 1e6] -> [25, 90], input %d", (originalVal, expected) => {
    // @ts-ignore
    const transformer = genRangeTransformer(0, 1e6, 25, 90)
    expect(transformer(originalVal)).toBeCloseTo(expected, 6)
})

test.each([
    [0, 90], [1e6, 25], [500000, 57.5]
])("[0, 1e6] -> [90, 25], input %d", (originalVal, expected) => {
    const transformer = genRangeTransformer(0, 1e6, 90, 25)
    expect(transformer(originalVal)).toBeCloseTo(expected, 6)
})

test.each([
    [5, 60], [10, 100], [7.5, 80], [200, 100], [-10, 60]
])("[5, 10] -> [60, 100], input %d", (originalVal, expected) => {
    const transformer = genRangeTransformer(5, 10, 60, 100)
    expect(transformer(originalVal)).toBeCloseTo(expected, 6)
})