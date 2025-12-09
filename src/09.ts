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

  perimeter(other: Point) {
    return 2 * (Math.abs(this.x - other.x) + Math.abs(this.y - other.y));
  }

  allPointsOnPerimeter(other: Point): Point[] {
    const minX = Math.min(this.x, other.x);
    const maxX = Math.max(this.x, other.x);
    const minY = Math.min(this.y, other.y);
    const maxY = Math.max(this.y, other.y);
    return [
      ...getRange({ start: minX, end: maxX + 1 }).map(
        (x) => new Point(x, minY),
      ),
      ...(minY !== maxY
        ? getRange({ start: minY + 1, end: maxY }).map(
            (y) => new Point(maxX, y),
          )
        : []),
      ...getRange({ start: maxX, end: minX - 1, step: -1 }).map(
        (x) => new Point(x, maxY),
      ),
      ...(minY !== maxY
        ? getRange({ start: maxY - 1, end: minY, step: -1 }).map(
            (y) => new Point(minX, y),
          )
        : []),
    ];
  }
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export const redTileLocations = lines.map((line) => {
  const [x, y] = line.split(",").map((num) => parseInt(num));
  return new Point(x, y);
});

const areasCovered = redTileLocations
  .flatMap((tile, i) =>
    redTileLocations
      .slice(i + 1)
      .map(
        (other, j) =>
          [tile, other, tile.coveredArea(other)] as [Point, Point, number],
      ),
  )
  .sort((a, b) => b[2] - a[2]);
const biggestCoveredArea = areasCovered[0][2];
console.log(`Biggest covered area: ${biggestCoveredArea}`);
console.log(
  `Perimeter of biggest covered area: ${areasCovered[0][1].perimeter(areasCovered[0][0])}`,
);

function getDirection(p1: Point, p2: Point) {
  if (p1.x === p2.x) {
    return p1.y < p2.y ? "up" : "down";
  } else {
    return p1.x < p2.x ? "right" : "left";
  }
}

class Edge {
  readonly direction: "up" | "down" | "left" | "right";
  readonly length: number;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  constructor(
    public p1: Point,
    public p2: Point,
  ) {
    this.direction = getDirection(p1, p2);
    this.length = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    this.minX = Math.min(p1.x, p2.x);
    this.maxX = Math.max(p1.x, p2.x);
    this.minY = Math.min(p1.y, p2.y);
    this.maxY = Math.max(p1.y, p2.y);
  }
  contains(point: Point) {
    if (this.direction === "left" || this.direction === "right") {
      return (
        this.minX <= point.x && point.x <= this.maxX && this.minY === point.y
      );
    } else {
      return (
        this.minY <= point.y && point.y <= this.maxY && this.minX === point.x
      );
    }
  }

  toString() {
    return `${this.p1} -> ${this.p2}`;
  }

  crosses(other: Edge) {
    if (this.direction === other.direction) {
      return false;
    }
    if (this.direction === "left" || this.direction === "right") {
      const otherX = other.minX;
      const otherInX = this.minX <= otherX && otherX <= this.maxX;
      return otherInX && this.minY > other.minY && this.maxY < other.maxY;
    } else {
      const otherY = other.minY;
      const otherInY = this.minY <= otherY && otherY <= this.maxY;
      return otherInY && this.minX > other.minX && this.maxX < other.maxX;
    }
  }
}

const edges = redTileLocations.map(
  (tile, i, arr) => new Edge(tile, arr[(i + 1) % arr.length]),
);

for (let i = 0; i < areasCovered.length; i++) {
  const [tile, other, area] = areasCovered[i];
  const minX = Math.min(tile.x, other.x);
  const maxX = Math.max(tile.x, other.x);
  const minY = Math.min(tile.y, other.y);
  const maxY = Math.max(tile.y, other.y);

  const leftCrosses = edges.some((edge) =>
    edge.crosses(new Edge(new Point(minX, minY), new Point(minX, maxY))),
  );
  const rightCrosses = edges.some((edge) =>
    edge.crosses(new Edge(new Point(maxX, minY), new Point(maxX, maxY))),
  );
  const bottomCrosses = edges.some((edge) =>
    edge.crosses(new Edge(new Point(minX, minY), new Point(maxX, minY))),
  );
  const topCrosses = edges.some((edge) =>
    edge.crosses(new Edge(new Point(minX, maxY), new Point(maxX, maxY))),
  );
  if (!leftCrosses && !rightCrosses && !bottomCrosses && !topCrosses) {
    console.log(`Area ${area} is not covered by any edge`);
    throw new Error("Area is not covered by any edge");
  }
}

class Shape {
  readonly horizontals: Edge[];
  readonly verticals: Edge[];
  constructor(public edges: Edge[]) {
    this.horizontals = edges.filter(
      (edge) => edge.direction === "left" || edge.direction === "right",
    );
    this.verticals = edges.filter(
      (edge) => edge.direction === "up" || edge.direction === "down",
    );
  }
  pointIsInShape(point: Point) {
    // point is in shape if it is on an edge
    if (this.edges.some((edge) => edge.contains(point))) {
      return true;
    }

    // point is in shape if there is an odd number of edges to the left and right, as well as up and down
    const relevantVerticalEdges = this.edges.filter(
      (edge) => edge.minY <= point.y && point.y <= edge.maxY,
    );
    const leftEdges = relevantVerticalEdges.filter(
      (edge) => edge.minX <= point.x,
    );
    const rightEdges = relevantVerticalEdges.filter(
      (edge) => edge.maxX >= point.x,
    );

    const relevantHorizontalEdges = this.edges.filter(
      (edge) => edge.minX <= point.x && point.x <= edge.maxX,
    );
    const bottomEdges = relevantHorizontalEdges.filter(
      (edge) => edge.minY <= point.y,
    );
    const topEdges = relevantHorizontalEdges.filter(
      (edge) => edge.maxY >= point.y,
    );

    return (
      leftEdges.length % 2 === 1 &&
      rightEdges.length % 2 === 1 &&
      topEdges.length % 2 === 1 &&
      bottomEdges.length % 2 === 1
    );
  }
  toString() {
    const largestX =
      this.edges.reduce((max, edge) => Math.max(max, edge.maxX), 0) + 2;
    const largestY =
      this.edges.reduce((max, edge) => Math.max(max, edge.maxY), 0) + 1;
    return getRange({ start: 0, end: largestY + 1 })
      .map((y) =>
        getRange({ start: 0, end: largestX + 1 })
          .map((x) => (this.pointIsInShape(new Point(x, y)) ? "#" : "."))
          .join(""),
      )
      .join("\n");
  }
}

// console.log(`Edges: ${edges}`);
const shape = new Shape(edges);
shape.pointIsInShape = memoize(shape.pointIsInShape.bind(shape), {
  maxCacheSize: 10000000,
  resetCacheOnMaxCacheSize: true,
});
// console.log(`Shape: \n${shape}`);

const biggestCoveredAreaInShape = areasCovered
  .slice(15000)
  .find(([p1, p2, area], i, arr) => {
    const perimeterPoints = p1.allPointsOnPerimeter(p2);
    console.log(`Processed ${i} of ${arr.length} areas`);
    return perimeterPoints.every((point) => shape.pointIsInShape(point));
  });
console.log(`Biggest covered area in shape: ${biggestCoveredAreaInShape[2]}`);
