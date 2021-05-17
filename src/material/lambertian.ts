import { HitRecord } from "../hittable";
import { Ray } from "../ray";
import { Color, randomUnitVector, Vec3 } from "../vector";
import { Material, ScatterInfo } from "./base"

export class LambertianMaterial extends Material{
  albedo: Color;
  constructor(albedo: Color) {
    super()
    this.albedo = albedo
  }
  scatter(rayIn: Ray, record: HitRecord): ScatterInfo {
    let scatterDirection = Vec3.plus(record.normal, randomUnitVector())
    scatterDirection.nearZero() && (scatterDirection = record.normal)
    const scattered = new Ray(record.point, scatterDirection)
    return { scattered, attenuation: this.albedo, hasScatter: true }
  }
}