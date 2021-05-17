import { Material, ScatterInfo } from "./base"
import { HitRecord } from "../hittable";
import { Ray } from "../ray";
import { Color, randomUnitVector, Vec3 } from "../vector";
import { random } from '../utils/index'
import { EPSILON } from '../utils/constant'

export class Dielectric extends Material{
  indexOfRefraction: number

  constructor(indexOfRefraction: number) {
    super()
    this.indexOfRefraction = indexOfRefraction
  }

  scatter(rayIn: Ray, record: HitRecord): ScatterInfo {
    const attenuation = new Color(1, 1, 1)
    const refractionRatio = record.frontFace ? (1 / this.indexOfRefraction) : this.indexOfRefraction

    const unitDirection = Vec3.unitVector(rayIn.direction)

    const cosTheta = Math.min(Vec3.dot(Vec3.negate(unitDirection), record.normal), 1)
    const sinTheta = Math.sqrt(1 - cosTheta ** 2)

    const cannotRefract = refractionRatio * sinTheta > 1

    let direction
    if (cannotRefract || this.reflection(cosTheta, refractionRatio) > random()) {
      direction = Vec3.reflect(unitDirection, record.normal)
    } else {
      direction = Vec3.refract(unitDirection, record.normal, refractionRatio)
    }
 

    const scattered = new Ray(record.point, direction)

    return { hasScatter: true, attenuation, scattered }
  }

  // 菲涅尔
  private reflection(cos: number, refractionRatio: number) {
    let r0 = (1 - refractionRatio) / (1 + refractionRatio)
    r0 = r0 * r0
    return r0 + (1 - r0) * Math.pow((1 - cos), 5)
  }
}