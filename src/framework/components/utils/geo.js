export const getRect = (node) =>
  node.radius
    ? {
        l: node.x() - node.radius(),
        t: node.y() - node.radius(),
        r: node.x() + node.radius(),
        b: node.y() + node.radius()
      }
    : {
        l: node.x(),
        t: node.y(),
        r: node.x() + node.width(),
        b: node.y() + node.height()
      };

export const doRectsIntersect = (a, b) =>
  a.l <= b.r && a.t <= b.b && b.l <= a.r && b.t <= a.b;
