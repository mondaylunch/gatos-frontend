export default function getTextColor(hue: number): string {
  // Convert hue to a value between 0 and 360
  hue = ((hue % 360) + 360) % 360;

  // Calculate the perceived brightness of the hue
  let perceivedBrightness =
    0.2126 * Math.pow((hue + 16) / 116, 3) +
    0.7152 * Math.pow((hue + 16) / 116, 2) +
    0.0722 * Math.pow((hue + 16) / 116, 1);
  perceivedBrightness =
    perceivedBrightness > 0.0031308
      ? 1.055 * Math.pow(perceivedBrightness, 1 / 2.4) - 0.055
      : 12.92 * perceivedBrightness;

  // Return "black" if the perceived brightness is low, "white" if high
  return perceivedBrightness < 0.6 ? "#1e293b" : "#FFFFFF";
}
