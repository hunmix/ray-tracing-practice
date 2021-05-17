import { Hittable, HitRecord } from './base'
import { Ray } from '../ray' 

export class HittableList{
  objects: Hittable[] = []
  constructor(object?: Hittable) {
    object && this.add(object)
  }
  clear() {
    this.objects = []
  }
  add(object: Hittable) {
    this.objects.push(object)
  }

  hit(ray: Ray, tMin: number, tMax: number, record: HitRecord) {
    let hitAnything = false
    let closestSoFar = tMax

    this.objects.forEach(object => {
      if (object.hit(ray, tMin, closestSoFar, record)) {
        hitAnything = true
        closestSoFar = record.t
      }
    })

    return hitAnything
  }
}