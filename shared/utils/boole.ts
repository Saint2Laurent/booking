function id(x) {
  return x;
}

export const anyBool = (pred, bool, xs) => {
  for (var i = 0; i < xs.length; i++) {
    if (pred(xs[i]) === bool) {
      return bool;
    }
  }
  return !bool;
};

export const or = xs => {
  return anyBool(id, true, xs);
};

export const nor = xs => {
  return !or(xs);
};

export const and = xs => {
  return anyBool(id, false, xs);
};

export const nand = xs => {
  return !and(xs);
};

export const xor = xs => {
  return or(xs) && nand(xs);
};

export const iff = xs => {
  return !xor(xs);
};

export const any = (pred, xs) => {
  return anyBool(pred, true, xs);
};

export const all = (pred, xs) => {
  return anyBool(pred, false, xs);
};

export const none = (pred, xs) => {
  return !any(pred, xs);
};
