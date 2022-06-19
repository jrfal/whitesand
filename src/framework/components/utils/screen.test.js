import { canvasFromScreen } from "./screen";

it("should get the right canvas coordinate from where the mouse is", () => {
  expect(canvasFromScreen(100, -100, 1)(15)).toBe(15);
});

it("should get the right canvas coordinate when scrolled some amount", () => {
  expect(canvasFromScreen(75, -100, 1)(15)).toBe(-10);
});

it("should get the right canvas coordinate when zoomed some amount", () => {
  expect(canvasFromScreen(100, -100, 2)(20)).toBe(10);
});

it("should get the right canvas coordinate when zoomed and scrolled", () => {
  expect(canvasFromScreen(110, -100, 1.5)(20)).toBe(20);
});
