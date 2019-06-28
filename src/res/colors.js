/* eslint-disable no-underscore-dangle */
const colors = {
  // title: '#FFFFFF',
  // text: '#FFFFFF',
  // logo: '#3FAE33',
  // logoBack: '#333333',
  // darkerLogoBack: '#1D1D1D',
  // lighterLogoBack: '#444444',
  // red: '#CE0C0C',
  // darkerText: '#f2f2f2',
  text: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  logo: (opacity = 1) => `rgba(63,174,51,${opacity})`,
  logoBack: (opacity = 1) => `rgba(51,51,51,${opacity})`,
  darkerLogoBack: (opacity = 1) => `rgba(29,29,29,${opacity})`,
  lighterLogoBack: (opacity = 1) => `rgba(68,68,68,${opacity})`,
  red: (opacity = 1) => `rgba(206,12,12,${opacity})`,
  darkerText: (opacity = 1) => `rgba(242,242,242,${opacity})`,
};

const colors2 = {
  title: '#FFFFFF',
  text: '#FFFFFF',
  logo: '#3FAE33',
  logoBack: '#2D2D2D',
  darkerLogoBack: '#111111',
  lighterLogoBack: '#333333',
  red: '#CE0C0C',
  darkerText: '#f2f2f2',
  textOp: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  logoOp: (opacity = 1) => `rgba(63,174,51,${opacity})`,
  logoBackOp: (opacity = 1) => `rgba(45,45,45,${opacity})`,
  darkerLogoBackOp: (opacity = 1) => `rgba(17,17,17,${opacity})`,
  lighterLogoBackOp: (opacity = 1) => `rgba(51,51,51,${opacity})`,
  redOp: (opacity = 1) => `rgba(206,12,12,${opacity})`,
  darkerTextOp: (opacity = 1) => `rgba(242,242,242,${opacity})`,
};

export default colors2;

// Converts a #ffffff hex string into an [r,g,b] array
export const h2r = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
};

// Inverse of the above
export const r2h = rgb => `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`;

// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
const _interpolateColor = (color1, color2, factor) => {
  if (arguments.length < 3) { factor = 0.5; }
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

const rgb2hsl = (color) => {
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;

  const max = Math.max(r, g, b); const
    min = Math.min(r, g, b);
  let h; let s; const
    l = (max + min) / 2;

  if (max === min) {
    h = 0; // achromatic
    s = 0;
  } else {
    const d = max - min;
    s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const hsl2rgb = (color) => {
  let l = color[2];

  if (color[1] == 0) {
    l = Math.round(l * 255);
    return [l, l, l];
  } else {
    const s = color[1];
    const q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
    const p = 2 * l - q;
    const r = hue2rgb(p, q, color[0] + 1 / 3);
    const g = hue2rgb(p, q, color[0]);
    const b = hue2rgb(p, q, color[0] - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
};

const _interpolateHSL = (color1, color2, factor) => {
  if (arguments.length < 3) { factor = 0.5; }
  const hsl1 = rgb2hsl(color1);
  const hsl2 = rgb2hsl(color2);
  for (let i = 0; i < 3; i++) {
    hsl1[i] += factor * (hsl2[i] - hsl1[i]);
  }
  return hsl2rgb(hsl1);
};

export const hexInterpolateHSL = ((color1, color2, factor) => (
  r2h(_interpolateHSL(h2r(color1), h2r(color2), factor))
));
