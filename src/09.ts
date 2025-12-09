import { readFileSync } from "fs";
import { getRange, memoize } from "./utils";

const input = readFileSync("inputs/09.txt", "utf-8");
const lines = input.split("\n").filter((line) => line.trim().length > 0);

class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}

  coveredArea(other: Point) {
    return Math.abs(this.x + 1 - other.x) * Math.abs(this.y + 1 - other.y);
  }
}

const redTileLocations = lines.map((line) => {
  const [x, y] = line.split(",").map((num) => parseInt(num));
  return new Point(x, y);
});

const areasCovered = redTileLocations
  .flatMap((tile, i) =>
    redTileLocations.map((other, j) => [i, j, tile.coveredArea(other)]),
  )
  .sort((a, b) => b[2] - a[2]);
const biggestCoveredArea = areasCovered[0][2];
console.log(`Biggest covered area: ${biggestCoveredArea}`);
