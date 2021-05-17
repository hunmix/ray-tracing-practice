export function degreesToRadians(degrees: number) {
  return degrees * 3.1415926535897932385 / 180
}

export function random(min: number = 0, max: number = 1) {
  const range = max - min
  return Math.random() * range + min
}

export function clamp(x: number, min: number, max: number) {
  if (x < min) return min
  if (x > max) return max
  return x
}
