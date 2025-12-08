import { readFileSync } from "fs";
import { getRange, memoize } from "./utils";

const input = readFileSync("inputs/08.txt", "utf-8");
const lines = input.split("\n").filter((line) => line.trim().length > 0);

class Coordinate {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public getDistance(other: Coordinate) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2) +
        Math.pow(this.z - other.z, 2),
    );
  }
}

const coordinates = lines.map((line) => {
  const [x, y, z] = line.split(",").map((num) => parseInt(num));
  return new Coordinate(x, y, z);
});

const distances = coordinates
  .flatMap((coord1, i) =>
    coordinates.map(
      (coord2, j) =>
        [i, j, coord1.getDistance(coord2)] as [number, number, number],
    ),
  )
  .filter(([i, j, d]) => i < j)
  .sort(([, , d1], [, , d2]) => d1 - d2);

const edges = distances.slice(0, 1000);

const circuits = getRange({ start: 0, end: coordinates.length }).map((c) => [
  c,
]);
edges.forEach(([i, j, d]) => {
  const circuitWithI = circuits.findIndex((v) => v.includes(i));
  const circuitWithJ = circuits.findIndex((v) => v.includes(j));
  if (circuitWithJ === circuitWithI) {
    return;
  }
  circuits[circuitWithI] = [
    ...circuits[circuitWithI],
    ...circuits[circuitWithJ],
  ];
  circuits[circuitWithJ] = [];
});

const numCircuits = circuits.filter((c) => c.length > 0).length;
console.log(`Number of circuits: ${numCircuits}`);
const p1Total = circuits
  .map((c) => c.length)
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a * b, 1);
console.log(`P1 solution: ${p1Total}`);

const p2Circuits = getRange({ start: 0, end: coordinates.length }).map((c) => [
  c,
]);
let k = 0;
while (k < distances.length) {
  const [i, j, d] = distances[k];
  const circuitWithI = circuits.findIndex((v) => v.includes(i));
  const circuitWithJ = circuits.findIndex((v) => v.includes(j));
  if (circuitWithJ === circuitWithI) {
    k++;
    continue;
  }
  circuits[circuitWithI] = [
    ...circuits[circuitWithI],
    ...circuits[circuitWithJ],
  ];
  circuits[circuitWithJ] = [];
  if (circuits.filter((c) => c.length > 0).length === 1) {
    // this was the last edge
    const coordI = coordinates[i];
    const coordJ = coordinates[j];
    const xProduct = coordJ.x * coordI.x;
    console.log(`P2 ${xProduct}`);
    break;
  }
  k++;
}
