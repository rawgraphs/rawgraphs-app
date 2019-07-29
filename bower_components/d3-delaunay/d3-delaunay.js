// https://github.com/d3/d3-delaunay Version 2.0.1. Copyright 2018 Observable, Inc.
// https://github.com/mapbox/delaunator Version 1.0.5. Copyright 2017, Mapbox, Inc.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

  class Cell {
    constructor(voronoi) {
      this.voronoi = voronoi;
      this.triangles = []; // Triangle indexes, similar to halfedges.
      this.v0 = null; // Starting edge vector if hull cell.
      this.vn = null; // Ending edge vector if hull cell.
    }
    _points() {
      const {triangles, voronoi: {circumcenters}} = this;
      if (triangles === null) return null;
      const points = new Float64Array(triangles.length * 2);
      for (let i = 0, n = triangles.length; i < n; ++i) {
        const pi = i * 2;
        const ti = triangles[i] * 2;
        points[pi] = circumcenters[ti];
        points[pi + 1] = circumcenters[ti + 1];
      }
      return points;
    }
    render(context) {
      const {v0, vn} = this;
      let points;
      if ((points = this._points()) === null) return;
      if ((points = this.voronoi._clip(points, v0, vn)) === null) return;
      context.moveTo(points[0], points[1]);
      for (let i = 2, n = points.length; i < n; i += 2) { // TODO Avoid last closing coordinate.
        context.lineTo(points[i], points[i + 1]);
      }
      context.closePath();
    }
    contains(x, y) {
      const points = this._points();
      return points === null ? false
          : this.v0 === null ? containsFinite(points, x, y)
          : containsInfinite(points, this.v0, this.vn, x, y);
    }
  }

  function containsFinite(points, x, y) {
    const n = points.length;
    let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
    for (let i = 0; i < n; i += 2) {
      x0 = x1, y0 = y1, x1 = points[i], y1 = points[i + 1];
      if ((x1 - x0) * (y - y0) < (y1 - y0) * (x - x0)) {
        return false;
      }
    }
    return true;
  }

  function containsInfinite(points, [v0x, v0y], [vnx, vny], x, y) {
    const n = points.length;
    let x0, y0, x1 = points[0], y1 = points[1];
    if ((x0 + v0x - x) * (y1 - y) < (y0 + v0y - y) * (x1 - x)) return false;
    for (let i = 2; i < n; i += 2) {
      x0 = x1, y0 = y1, x1 = points[i], y1 = points[i + 1];
      if ((x0 - x) * (y1 - y) < (y0 - y) * (x1 - x)) return false;
    }
    if ((x0 - x) * (y1 + vny - y) < (y0 - y) * (x1 + vnx - x)) return false;
    return true;
  }

  var delaunator = Delaunator;
  var default_1 = Delaunator;

  function Delaunator(points, getX, getY) {

      if (!getX) getX = defaultGetX;
      if (!getY) getY = defaultGetY;

      var minX = Infinity;
      var minY = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;

      var coords = this.coords = [];
      var ids = this.ids = new Uint32Array(points.length);

      for (var i = 0; i < points.length; i++) {
          var p = points[i];
          var x = getX(p);
          var y = getY(p);
          ids[i] = i;
          coords[2 * i] = x;
          coords[2 * i + 1] = y;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
      }

      var cx = (minX + maxX) / 2;
      var cy = (minY + maxY) / 2;

      var minDist = Infinity;
      var i0, i1, i2;

      // pick a seed point close to the centroid
      for (i = 0; i < points.length; i++) {
          var d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
          if (d < minDist) {
              i0 = i;
              minDist = d;
          }
      }

      minDist = Infinity;

      // find the point closest to the seed
      for (i = 0; i < points.length; i++) {
          if (i === i0) continue;
          d = dist(coords[2 * i0], coords[2 * i0 + 1], coords[2 * i], coords[2 * i + 1]);
          if (d < minDist && d > 0) {
              i1 = i;
              minDist = d;
          }
      }

      var minRadius = Infinity;

      // find the third point which forms the smallest circumcircle with the first two
      for (i = 0; i < points.length; i++) {
          if (i === i0 || i === i1) continue;

          var r = circumradius(
              coords[2 * i0], coords[2 * i0 + 1],
              coords[2 * i1], coords[2 * i1 + 1],
              coords[2 * i], coords[2 * i + 1]);

          if (r < minRadius) {
              i2 = i;
              minRadius = r;
          }
      }

      if (minRadius === Infinity) {
          throw new Error('No Delaunay triangulation exists for this input.');
      }

      // swap the order of the seed points for counter-clockwise orientation
      if (area(coords[2 * i0], coords[2 * i0 + 1],
          coords[2 * i1], coords[2 * i1 + 1],
          coords[2 * i2], coords[2 * i2 + 1]) < 0) {

          var tmp = i1;
          i1 = i2;
          i2 = tmp;
      }

      var i0x = coords[2 * i0];
      var i0y = coords[2 * i0 + 1];
      var i1x = coords[2 * i1];
      var i1y = coords[2 * i1 + 1];
      var i2x = coords[2 * i2];
      var i2y = coords[2 * i2 + 1];

      var center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
      this._cx = center.x;
      this._cy = center.y;

      // sort the points by distance from the seed triangle circumcenter
      quicksort(ids, coords, 0, ids.length - 1, center.x, center.y);

      // initialize a hash table for storing edges of the advancing convex hull
      this._hashSize = Math.ceil(Math.sqrt(points.length));
      this._hash = [];
      for (i = 0; i < this._hashSize; i++) this._hash[i] = null;

      // initialize a circular doubly-linked list that will hold an advancing convex hull
      var e = this.hull = insertNode(coords, i0);
      this._hashEdge(e);
      e.t = 0;
      e = insertNode(coords, i1, e);
      this._hashEdge(e);
      e.t = 1;
      e = insertNode(coords, i2, e);
      this._hashEdge(e);
      e.t = 2;

      var maxTriangles = 2 * points.length - 5;
      var triangles = this.triangles = new Uint32Array(maxTriangles * 3);
      var halfedges = this.halfedges = new Int32Array(maxTriangles * 3);

      this.trianglesLen = 0;

      this._addTriangle(i0, i1, i2, -1, -1, -1);

      var xp, yp;
      for (var k = 0; k < ids.length; k++) {
          i = ids[k];
          x = coords[2 * i];
          y = coords[2 * i + 1];

          // skip duplicate points
          if (x === xp && y === yp) continue;
          xp = x;
          yp = y;

          // skip seed triangle points
          if ((x === i0x && y === i0y) ||
              (x === i1x && y === i1y) ||
              (x === i2x && y === i2y)) continue;

          // find a visible edge on the convex hull using edge hash
          var startKey = this._hashKey(x, y);
          var key = startKey;
          var start;
          do {
              start = this._hash[key];
              key = (key + 1) % this._hashSize;
          } while ((!start || start.removed) && key !== startKey);

          e = start;
          while (area(x, y, e.x, e.y, e.next.x, e.next.y) >= 0) {
              e = e.next;
              if (e === start) {
                  throw new Error('Something is wrong with the input points.');
              }
          }

          var walkBack = e === start;

          // add the first triangle from the point
          var t = this._addTriangle(e.i, i, e.next.i, -1, -1, e.t);

          e.t = t; // keep track of boundary triangles on the hull
          e = insertNode(coords, i, e);

          // recursively flip triangles from the point until they satisfy the Delaunay condition
          e.t = this._legalize(t + 2);
          if (e.prev.prev.t === halfedges[t + 1]) {
              e.prev.prev.t = t + 2;
          }

          // walk forward through the hull, adding more triangles and flipping recursively
          var q = e.next;
          while (area(x, y, q.x, q.y, q.next.x, q.next.y) < 0) {
              t = this._addTriangle(q.i, i, q.next.i, q.prev.t, -1, q.t);
              q.prev.t = this._legalize(t + 2);
              this.hull = removeNode(q);
              q = q.next;
          }

          if (walkBack) {
              // walk backward from the other side, adding more triangles and flipping
              q = e.prev;
              while (area(x, y, q.prev.x, q.prev.y, q.x, q.y) < 0) {
                  t = this._addTriangle(q.prev.i, i, q.i, -1, q.t, q.prev.t);
                  this._legalize(t + 2);
                  q.prev.t = t;
                  this.hull = removeNode(q);
                  q = q.prev;
              }
          }

          // save the two new edges in the hash table
          this._hashEdge(e);
          this._hashEdge(e.prev);
      }

      // trim typed triangle mesh arrays
      this.triangles = triangles.subarray(0, this.trianglesLen);
      this.halfedges = halfedges.subarray(0, this.trianglesLen);
  }

  Delaunator.prototype = {

      _hashEdge: function (e) {
          this._hash[this._hashKey(e.x, e.y)] = e;
      },

      _hashKey: function (x, y) {
          var dx = x - this._cx;
          var dy = y - this._cy;
          // use pseudo-angle: a measure that monotonically increases
          // with real angle, but doesn't require expensive trigonometry
          var p = 1 - dx / (Math.abs(dx) + Math.abs(dy));
          return Math.floor((2 + (dy < 0 ? -p : p)) / 4 * this._hashSize);
      },

      _legalize: function (a) {
          var triangles = this.triangles;
          var coords = this.coords;
          var halfedges = this.halfedges;

          var b = halfedges[a];

          var a0 = a - a % 3;
          var b0 = b - b % 3;

          var al = a0 + (a + 1) % 3;
          var ar = a0 + (a + 2) % 3;
          var bl = b0 + (b + 2) % 3;

          var p0 = triangles[ar];
          var pr = triangles[a];
          var pl = triangles[al];
          var p1 = triangles[bl];

          var illegal = inCircle(
              coords[2 * p0], coords[2 * p0 + 1],
              coords[2 * pr], coords[2 * pr + 1],
              coords[2 * pl], coords[2 * pl + 1],
              coords[2 * p1], coords[2 * p1 + 1]);

          if (illegal) {
              triangles[a] = p1;
              triangles[b] = p0;

              this._link(a, halfedges[bl]);
              this._link(b, halfedges[ar]);
              this._link(ar, bl);

              var br = b0 + (b + 1) % 3;

              this._legalize(a);
              return this._legalize(br);
          }

          return ar;
      },

      _link: function (a, b) {
          this.halfedges[a] = b;
          if (b !== -1) this.halfedges[b] = a;
      },

      // add a new triangle given vertex indices and adjacent half-edge ids
      _addTriangle: function (i0, i1, i2, a, b, c) {
          var t = this.trianglesLen;

          this.triangles[t] = i0;
          this.triangles[t + 1] = i1;
          this.triangles[t + 2] = i2;

          this._link(t, a);
          this._link(t + 1, b);
          this._link(t + 2, c);

          this.trianglesLen += 3;

          return t;
      }
  };

  function dist(ax, ay, bx, by) {
      var dx = ax - bx;
      var dy = ay - by;
      return dx * dx + dy * dy;
  }

  function area(px, py, qx, qy, rx, ry) {
      return (qy - py) * (rx - qx) - (qx - px) * (ry - qy);
  }

  function inCircle(ax, ay, bx, by, cx, cy, px, py) {
      ax -= px;
      ay -= py;
      bx -= px;
      by -= py;
      cx -= px;
      cy -= py;

      var ap = ax * ax + ay * ay;
      var bp = bx * bx + by * by;
      var cp = cx * cx + cy * cy;

      return ax * (by * cp - bp * cy) -
             ay * (bx * cp - bp * cx) +
             ap * (bx * cy - by * cx) < 0;
  }

  function circumradius(ax, ay, bx, by, cx, cy) {
      bx -= ax;
      by -= ay;
      cx -= ax;
      cy -= ay;

      var bl = bx * bx + by * by;
      var cl = cx * cx + cy * cy;

      if (bl === 0 || cl === 0) return Infinity;

      var d = bx * cy - by * cx;
      if (d === 0) return Infinity;

      var x = (cy * bl - by * cl) * 0.5 / d;
      var y = (bx * cl - cx * bl) * 0.5 / d;

      return x * x + y * y;
  }

  function circumcenter(ax, ay, bx, by, cx, cy) {
      bx -= ax;
      by -= ay;
      cx -= ax;
      cy -= ay;

      var bl = bx * bx + by * by;
      var cl = cx * cx + cy * cy;

      var d = bx * cy - by * cx;

      var x = (cy * bl - by * cl) * 0.5 / d;
      var y = (bx * cl - cx * bl) * 0.5 / d;

      return {
          x: ax + x,
          y: ay + y
      };
  }

  // create a new node in a doubly linked list
  function insertNode(coords, i, prev) {
      var node = {
          i: i,
          x: coords[2 * i],
          y: coords[2 * i + 1],
          t: 0,
          prev: null,
          next: null,
          removed: false
      };

      if (!prev) {
          node.prev = node;
          node.next = node;

      } else {
          node.next = prev.next;
          node.prev = prev;
          prev.next.prev = node;
          prev.next = node;
      }
      return node;
  }

  function removeNode(node) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node.removed = true;
      return node.prev;
  }

  function quicksort(ids, coords, left, right, cx, cy) {
      var i, j, temp;

      if (right - left <= 20) {
          for (i = left + 1; i <= right; i++) {
              temp = ids[i];
              j = i - 1;
              while (j >= left && compare(coords, ids[j], temp, cx, cy) > 0) ids[j + 1] = ids[j--];
              ids[j + 1] = temp;
          }
      } else {
          var median = (left + right) >> 1;
          i = left + 1;
          j = right;
          swap(ids, median, i);
          if (compare(coords, ids[left], ids[right], cx, cy) > 0) swap(ids, left, right);
          if (compare(coords, ids[i], ids[right], cx, cy) > 0) swap(ids, i, right);
          if (compare(coords, ids[left], ids[i], cx, cy) > 0) swap(ids, left, i);

          temp = ids[i];
          while (true) {
              do i++; while (compare(coords, ids[i], temp, cx, cy) < 0);
              do j--; while (compare(coords, ids[j], temp, cx, cy) > 0);
              if (j < i) break;
              swap(ids, i, j);
          }
          ids[left + 1] = ids[j];
          ids[j] = temp;

          if (right - i + 1 >= j - left) {
              quicksort(ids, coords, i, right, cx, cy);
              quicksort(ids, coords, left, j - 1, cx, cy);
          } else {
              quicksort(ids, coords, left, j - 1, cx, cy);
              quicksort(ids, coords, i, right, cx, cy);
          }
      }
  }

  function compare(coords, i, j, cx, cy) {
      var d1 = dist(coords[2 * i], coords[2 * i + 1], cx, cy);
      var d2 = dist(coords[2 * j], coords[2 * j + 1], cx, cy);
      return (d1 - d2) || (coords[2 * i] - coords[2 * j]) || (coords[2 * i + 1] - coords[2 * j + 1]);
  }

  function swap(arr, i, j) {
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
  }

  function defaultGetX(p) {
      return p[0];
  }
  function defaultGetY(p) {
      return p[1];
  }
  delaunator.default = default_1;

  class Voronoi {
    constructor(cells, circumcenters, delaunay, xmin, ymin, xmax, ymax) {
      if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
      this.cells = cells;
      this.circumcenters = circumcenters;
      this.delaunay = delaunay;
      this.xmax = xmax, this.xmin = xmin;
      this.ymax = ymax, this.ymin = ymin;
    }
    find(x, y) {
      return this.cells[this.findIndex(x, y)];
    }
    findIndex(x, y) {
      const {cells, delaunay: {halfedges, points, triangles}} = this;
      if (cells.length === 0 || (x = +x, x !== x) || (y = +y, y !== y)) return -1;
      let c = 0, c2 = (x - points[0]) ** 2 + (y - points[1]) ** 2;
      while (true) {
        let d = c, d2 = c2;
        for (let T = cells[c].triangles, i = 0, n = T.length; i < n; ++i) {
          let k = T[i] * 3;
          switch (c) {
            case triangles[k]: k = triangles[k + 1]; break;
            case triangles[k + 1]: k = triangles[k + 2]; break;
            case triangles[k + 2]: k = triangles[k]; break;
          }
          let k2 = (x - points[k * 2]) ** 2 + (y - points[k * 2 + 1]) ** 2;
          if (k2 < d2) d2 = k2, d = k;
        }
        if (d === c) return d;
        c = d, c2 = d2;
      }
    }
    render(context) {
      const {cells, circumcenters, delaunay: {halfedges, hull}} = this;
      for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) continue;
        const ti = Math.floor(i / 3) * 2;
        const tj = Math.floor(j / 3) * 2;
        context.moveTo(circumcenters[ti], circumcenters[ti + 1]);
        context.lineTo(circumcenters[tj], circumcenters[tj + 1]);
      }
      let node = hull;
      do {
        const t = Math.floor(node.t / 3) * 2;
        const x = circumcenters[t];
        const y = circumcenters[t + 1];
        const p = this._project(x, y, cells[node.i].vn);
        if (p) {
          context.moveTo(x, y);
          context.lineTo(p[0], p[1]);
        }
      } while ((node = node.next) !== hull);
    }
    renderBounds(context) {
      context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
    }
    _clip(points, v0, vn) {
      return v0 ? this._clipInfinite(points, v0, vn) : this._clipFinite(points);
    }
    _clipFinite(points) {
      const n = points.length;
      let P = null, S;
      let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
      let c0, c1 = this._regioncode(x1, y1);
      let e0, e1;
      for (let i = 0; i < n; i += 2) {
        x0 = x1, y0 = y1, x1 = points[i], y1 = points[i + 1];
        c0 = c1, c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
          e0 = e1, e1 = 0;
          if (P) P.push(x1, y1);
          else P = [x1, y1];
        } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
          const [sx0, sy0, sx1, sy1] = S;
          if (c0) {
            e0 = e1, e1 = this._edgecode(sx0, sy0);
            if (e0 && e1) this._edge(points, e0, e1, P);
            if (P) P.push(sx0, sy0);
            else P = [sx0, sy0];
          }
          e0 = e1, e1 = this._edgecode(sx1, sy1);
          if (e0 && e1) this._edge(points, e0, e1, P);
          if (P) P.push(sx1, sy1);
          else P = [sx1, sy1];
        }
      }
      if (P) {
        e0 = e1, e1 = this._edgecode(P[0], P[1]);
        if (e0 && e1) this._edge(points, e0, e1, P);
      } else if (containsFinite(points, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
        return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
      }
      return P;
    }
    _clipSegment(x0, y0, x1, y1, c0, c1) {
      while (true) {
        if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
        if (c0 & c1) return;
        let x, y, c = c0 || c1;
        if (c & 0b1000) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax, c ^= 0b1000;
        else if (c & 0b0100) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin, c ^= 0b0100;
        else if (c & 0b0010) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax, c ^= 0b0010;
        else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin, c ^= 0b0001;
        if (c0) x0 = x, y0 = y, c0 = c;
        else x1 = x, y1 = y, c1 = c;
      }
    }
    // TODO Consolidate corner traversal code using edge?
    _clipInfinite(points, v0, vn) {
      let P = Array.from(points), p;
      if (p = this._project(P[0], P[1], v0)) P.unshift(p[0], p[1]);
      if (p = this._project(P[P.length - 2], P[P.length - 1], vn)) P.unshift(p[0], p[1]);
      if (P = this._clipFinite(P)) {
        for (let i = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); i < n; i += 2) {
          c0 = c1, c1 = this._edgecode(P[i], P[i + 1]);
          if (c0 && c1) {
            while (c0 !== c1) {
              let cx, cy;
              switch (c0) {
                case 0b0101: c0 = 0b0100; continue; // top-left
                case 0b0100: c0 = 0b0110, cx = this.xmax, cy = this.ymin; break; // top
                case 0b0110: c0 = 0b0010; continue; // top-right
                case 0b0010: c0 = 0b1010, cx = this.xmax, cy = this.ymax; break; // right
                case 0b1010: c0 = 0b1000; continue; // bottom-right
                case 0b1000: c0 = 0b1001, cx = this.xmin, cy = this.ymax; break; // bottom
                case 0b1001: c0 = 0b0001; continue; // bottom-left
                case 0b0001: c0 = 0b0101, cx = this.xmin, cy = this.ymin; break; // left
              }
              if (containsInfinite(points, v0, vn, cx, cy)) {
                P.splice(i, 0, cx, cy), n += 2, i += 2;
              }
            }
          }
        }
      } else if (containsInfinite(points, v0, vn, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
        P.push(this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax);
      }
      return P;
    }
    // TODO Allow containsInfinite instead of contains for clipInfinite?
    _edge(points, e0, e1, P) {
      while (e0 !== e1) {
        let cx, cy;
        switch (e0) {
          case 0b0101: e0 = 0b0100; continue; // top-left
          case 0b0100: e0 = 0b0110, cx = this.xmax, cy = this.ymin; break; // top
          case 0b0110: e0 = 0b0010; continue; // top-right
          case 0b0010: e0 = 0b1010, cx = this.xmax, cy = this.ymax; break; // right
          case 0b1010: e0 = 0b1000; continue; // bottom-right
          case 0b1000: e0 = 0b1001, cx = this.xmin, cy = this.ymax; break; // bottom
          case 0b1001: e0 = 0b0001; continue; // bottom-left
          case 0b0001: e0 = 0b0101, cx = this.xmin, cy = this.ymin; break; // left
        }
        if (containsFinite(points, cx, cy)) {
          P.push(cx, cy);
        }
      }
    }
    _project(x0, y0, [vx, vy]) {
      let t = Infinity, c, x, y;
      if (vy < 0) { // top
        if (y0 <= this.ymin) return;
        if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
      } else if (vy > 0) { // bottom
        if (y0 >= this.ymax) return;
        if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
      }
      if (vx > 0) { // right
        if (x0 >= this.xmax) return;
        if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
      } else if (vx < 0) { // left
        if (x0 <= this.xmin) return;
        if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
      }
      return [x, y];
    }
    _edgecode(x, y) {
      return (x === this.xmin ? 0b0001
          : x === this.xmax ? 0b0010 : 0b0000)
          | (y === this.ymin ? 0b0100
          : y === this.ymax ? 0b1000 : 0b0000);
    }
    _regioncode(x, y) {
      return (x < this.xmin ? 0b0001
          : x > this.xmax ? 0b0010 : 0b0000)
          | (y < this.ymin ? 0b0100
          : y > this.ymax ? 0b1000 : 0b0000);
    }
  }

  class Delaunay {
    constructor(points, halfedges, hull, triangles) {
      this.points = points;
      this.halfedges = halfedges;
      this.hull = hull;
      this.triangles = triangles;
    }
    voronoi([xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
      const {points, halfedges, hull, triangles} = this;
      const cells = new Array(points.length / 2);
      const circumcenters = new Float64Array(triangles.length / 3 * 2);
      const voronoi = new Voronoi(cells, circumcenters, this, xmin, ymin, xmax, ymax);

      // Compute cell topology.
      for (let i = 0, n = cells.length; i < n; ++i) {
        cells[i] = new Cell(voronoi);
      }
      for (let i = 0, m = halfedges.length; i < m; ++i) {
        const t = triangles[i]; // Cell vertex.
        const T = cells[t].triangles;
        if (T.length) continue; // Already connected.
        let j = i;

        do { // Walk forward.
          T.push(Math.floor(j / 3));
          j = halfedges[j];
          if (j === -1) break; // Went off the convex hull.
          j = j % 3 === 2 ? j - 2 : j + 1;
          if (triangles[j] !== t) break; // Bad triangulation; break early.
        } while (j !== i);

        if (j !== i) { // Stopped when walking forward; walk backward.
          j = i;
          while (true) {
            j = halfedges[j % 3 === 0 ? j + 2 : j - 1];
            if (j === -1 || triangles[j] !== t) break;
            T.unshift(Math.floor(j / 3));
          }
        } else {
          T.push(T[0]); // Close polygon.
        }
      }
      for (let i = 0, n = cells.length; i < n; ++i) {
        const cell = cells[i];
        if (cell.triangles.length === 0) cell.triangles = null;
      }

      // Compute circumcenters.
      for (let i = 0, j = 0, n = triangles.length; i < n; i += 3, j += 2) {
        const t1 = triangles[i] * 2;
        const t2 = triangles[i + 1] * 2;
        const t3 = triangles[i + 2] * 2;
        const x1 = points[t1];
        const y1 = points[t1 + 1];
        const x2 = points[t2];
        const y2 = points[t2 + 1];
        const x3 = points[t3];
        const y3 = points[t3 + 1];
        const a2 = x1 - x2;
        const a3 = x1 - x3;
        const b2 = y1 - y2;
        const b3 = y1 - y3;
        const d1 = x1 * x1 + y1 * y1;
        const d2 = d1 - x2 * x2 - y2 * y2;
        const d3 = d1 - x3 * x3 - y3 * y3;
        const ab = (a3 * b2 - a2 * b3) * 2;
        circumcenters[j] = (b2 * d3 - b3 * d2) / ab;
        circumcenters[j + 1] = (a3 * d2 - a2 * d3) / ab;
      }

      // Compute exterior cell rays.
      {
        let node = hull;
        do {
          const {x: x1, y: y1, t: i, next: {x: x2, y: y2, t: j}} = node;
          const ci = Math.floor(i / 3) * 2;
          const cx = circumcenters[ci];
          const cy = circumcenters[ci + 1];
          const dx = (x1 + x2) / 2 - cx;
          const dy = (y1 + y2) / 2 - cy;
          const k = (x2 - x1) * (cy - y1) > (y2 - y1) * (cx - x1) ? -1 : 1;
          cells[triangles[i]].vn = cells[triangles[j]].v0 = [k * dx, k * dy];
        } while ((node = node.next) !== hull);
      }

      return voronoi;
    }
    render(context) {
      const {points, halfedges, triangles} = this;
      for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) continue;
        const ti = triangles[i] * 2;
        const tj = triangles[j] * 2;
        context.moveTo(points[ti], points[ti + 1]);
        context.lineTo(points[tj], points[tj + 1]);
      }
      this.renderHull(context);
    }
    renderHull(context) {
      const {hull} = this;
      let node = hull;
      do {
        context.moveTo(node.x, node.y);
        context.lineTo(node.next.x, node.next.y);
      } while ((node = node.next) !== hull);
    }
    renderTriangle(i, context) {
      const {points, triangles} = this;
      const t0 = triangles[i *= 3] * 2;
      const t1 = triangles[i + 1] * 2;
      const t2 = triangles[i + 2] * 2;
      context.moveTo(points[t0], points[t0 + 1]);
      context.lineTo(points[t1], points[t1 + 1]);
      context.lineTo(points[t2], points[t2 + 1]);
      context.closePath();
    }
  }

  Delaunay.from = function(points, fx, fy) {
    const {coords, halfedges, hull, triangles} = new delaunator(points, fx, fy);
    return new Delaunay(coords, halfedges, hull, triangles);
  };

  exports.Cell = Cell;
  exports.Delaunay = Delaunay;
  exports.Voronoi = Voronoi;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
