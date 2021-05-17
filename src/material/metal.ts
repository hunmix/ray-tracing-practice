import { HitRecord } from "../hittable"
import { Ray } from "../ray"
import { Color, randomInUnitSphere, Vec3 } from "../vector"
import { Material, ScatterInfo } from "./index"

export class Metal extends Material{
  albedo: Color
  fuzzy: number

  constructor(albedo: Color, fuzzy: number) {
    super()
    this.albedo = albedo
    this.fuzzy = fuzzy < 1 ? fuzzy : 1
  }

  scatter(rayIn: Ray, record: HitRecord): ScatterInfo {
    const reflected = Vec3.reflect(Vec3.unitVector(rayIn.direction), record.normal)
    const scattered = new Ray(
      record.point,
      Vec3.plus(
        reflected,
        Vec3.multi(randomInUnitSphere(), this.fuzzy)
      )
    )
    return {scattered, attenuation: this.albedo, hasScatter: (Vec3.dot(scattered.direction, record.normal) > 0)}
  }
}