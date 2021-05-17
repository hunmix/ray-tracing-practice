import { Vec3 } from './base'
import { clamp } from '../utils/index'
export class Color extends Vec3{}

export function getColor(v: Vec3, samplesPerPixel: number) {
  const scale = 1 / samplesPerPixel
  const r =  Math.floor(256 * clamp(Math.sqrt(v.x * scale), 0, 0.999))
  const g =  Math.floor(256 * clamp(Math.sqrt(v.y * scale), 0, 0.999))
  const b =  Math.floor(256 * clamp(Math.sqrt(v.z * scale), 0, 0.999))
  return `${r} ${g} ${b}`
}