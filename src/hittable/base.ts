import { Point3, Vec3 } from '../vector'
import { Ray } from '../ray' 
import { Material } from '../material/base'

export class HitRecord{
  point: Point3
  normal: Vec3
  t: number
  frontFace: boolean
  material: Material

  setFaceNormal(ray: Ray, outwardNormal: Vec3) {
    this.frontFace = Vec3.dot(ray.direction, outwardNormal) < 0
    this.normal = this.frontFace ? outwardNormal : Vec3.negate(outwardNormal)
  }
}

export abstract class Hittable{
  abstract hit(ray: Ray, tMin: number, tMax: number, record: HitRecord): boolean;
}