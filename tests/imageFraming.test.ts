import { test } from "node:test"
import assert from "node:assert/strict"
import { normalizeFraming, parseFraming, framingStyle, dragFraming } from "../src/lib/imageFraming.ts"

test("legacy defaults, malformed metadata, and bounds", () => {
  assert.deepEqual(normalizeFraming(null), { x: 50, y: 50, zoom: 1 })
  assert.deepEqual(parseFraming("bad", 0), { x: 50, y: 0, zoom: 1 })
  assert.deepEqual(normalizeFraming({ x: -20, y: Infinity, zoom: 100 }), { x: 0, y: 50, zoom: 3 })
  assert.deepEqual(parseFraming('{"x":80,"y":20,"zoom":1.5}'), { x: 80, y: 20, zoom: 1.5 })
  assert.deepEqual(framingStyle({ x: 80, y: 20, zoom: 1.5 }), { objectPosition: "80% 20%", transformOrigin: "80% 20%", transform: "scale(1.5)" })
})

test("drag follows pointer, clamps edges, and ignores axes with no crop", () => {
  assert.deepEqual(dragFraming({ x: 50, y: 50, zoom: 1 }, 100, 50, 400, 300, 800, 400), { x: 0, y: 50, zoom: 1 })
  assert.deepEqual(dragFraming({ x: 50, y: 50, zoom: 2 }, -2000, 2000, 400, 300, 800, 400), { x: 100, y: 0, zoom: 2 })
  assert.deepEqual(dragFraming({ x: 50, y: 50, zoom: 2 }, 40, 30, 400, 300, 800, 600), { x: 40, y: 40, zoom: 2 })
})
