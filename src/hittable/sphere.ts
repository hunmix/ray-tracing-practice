import { Vec3 } from '../vector';
import { Hittable, HitRecord } from './base'
import { Ray } from '../ray'
import { EPSILON } from '../utils/constant'
import { Material } from '../material/base';

export class Sphere extends Hittable{
  center: Vec3
  radius: number
  material: Material

  constructor(center: Vec3, radius: number, material: Material) {
    super()
    this.center = center
    this.radius = radius
    this.material = material
  }
  hit(ray: Ray, tMin: number, tMax: number, record: HitRecord): boolean {
    const oc = Vec3.minus(ray.origin, this.center)
    const a = ray.direction.lengthSquared()
    const halfB = Vec3.dot(oc, ray.direction)
    const c = oc.lengthSquared() - this.radius ** 2
    const discriminant = halfB ** 2 - a * c
    if (discriminant < 0) return false
    // FIXME: 这里有小数精度丢失的问题，取一个误差范围
    const sqrtD = Math.sqrt(discriminant)
    let root = (-halfB.toFixed(5) - sqrtD) / a
    if (root - tMin < EPSILON || root - tMax > -EPSILON) {
      root = (-halfB.toFixed(5) + sqrtD) / a
      if (root - tMin < EPSILON || root - tMax > -EPSILON) {
        return false
      }
    }
    record.t = root
    record.point = ray.at(record.t)
    const outwardNormal = Vec3.divide(Vec3.minus(record.point, this.center), this.radius)
    record.setFaceNormal(ray, outwardNormal)
    record.material = this.material

    return true
  }
}