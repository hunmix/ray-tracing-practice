import { rayColor, Ray } from "./ray";
import { Point3, randomInUnitDisk, Vec3 } from "./vector";
import { degreesToRadians } from './utils'

export class Camera{
  private origin: Point3
  private lowerLeftCorner: Point3
  private horizontal: Vec3
  private vertical: Vec3
  private lengthRadius: number
  private w: Vec3
  private u: Vec3
  private v: Vec3
  constructor(
    lookFrom: Point3,
    lookAt: Point3,
    vup: Vec3,
    fov: number,
    aspectRatio: number,
    aperture: number,
    focusDistance: number,
  ) {
    const theta = degreesToRadians(fov)
    const h = Math.tan(theta / 2)
    const w = Vec3.unitVector(Vec3.minus(lookFrom, lookAt))
    const u = Vec3.unitVector(Vec3.cross(vup, w))
    const v = Vec3.unitVector(Vec3.cross(w, u))
    const viewportHeight = 2 * h
    const viewportWidth = aspectRatio * viewportHeight
    this.w = w
    this.v = v
    this.u = u

    this.origin = lookFrom
    this.horizontal = Vec3.multi(u, viewportWidth, focusDistance)
    this.vertical = Vec3.multi(v, viewportHeight, focusDistance)
    this.lowerLeftCorner = Vec3.minus(this.origin, Vec3.divide(this.horizontal, 2), Vec3.divide(this.vertical, 2), Vec3.multi(w, focusDistance))
    this.lengthRadius = aperture / 2
  }

  getRay(s: number ,t: number) {
    const randomDisk = Vec3.multi(randomInUnitDisk(), this.lengthRadius)
    const offset = Vec3.plus(Vec3.multi(this.u, randomDisk.x), Vec3.multi(this.v, randomDisk.y))
    return new Ray(
      Vec3.plus(this.origin, offset),
      Vec3.minus(
        Vec3.plus(this.lowerLeftCorner,
          Vec3.multi(this.horizontal, s),
          Vec3.multi(this.vertical, t)
        ),
        this.origin,
        offset
      ))
  }
}
