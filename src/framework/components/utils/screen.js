export const canvasFromScreen = (scroll, offset, zoom) => (value) =>
  (value + scroll + offset) / zoom;
