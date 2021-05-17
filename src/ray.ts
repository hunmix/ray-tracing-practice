import { HitRecord, Hittable } from './hittable/base'
import { Point3, Vec3, Color, randomInUnitSphere, randomUnitVector, randomInHemisphere } from './vector'
import { INFINITY } from './utils/constant'

export class Ray{
  private orig: Point3
  private dir: Vec3
  constructor(origin: Point3, direction: Vec3) {
    this.orig = origin
    this.dir = direction
  }

  get origin() {
    return this.orig
  }
  get direction() {
    return this.dir
  }

  at(t: number) {
    return Vec3.plus(this.orig, Vec3.multi(this.dir, t))
  }
}

export function rayColor(ray: Ray, world: Hittable, depth: number) {
  if (depth <= 0) {
    return new Color(0, 0, 0)
  }
  const record = new HitRecord()
  // FIXME: 额这里为什么要去掉靠近0的部分
  if (world.hit(ray, 0.001, INFINITY, record)) {
    const material = record.material
    const { hasScatter, attenuation, scattered } = material.scatter(ray, record)
    if (hasScatter) {
      return Vec3.multi(rayColor(scattered, world, depth - 1), attenuation)
    }
    return new Color(0, 0, 0)
  }
  const unitDirection = Vec3.unitVector(ray.direction)
  const t = 0.5 * (unitDirection.y + 1)
  return Vec3.plus(new Color(1, 1, 1).multi(1 - t), new Color(0.5, 0.7, 1).multi(t))
}

export function hitSphere(center: Point3, radius: number, ray: Ray) {
  // (𝐀+𝑡𝐛−𝐂)⋅(𝐀+𝑡𝐛−𝐂)=𝑟2
  // t^2𝐛⋅𝐛 + 2t𝐛⋅(𝐀−𝐂)+(𝐀−𝐂)⋅(𝐀−𝐂)−t^2=0
  const oc = Vec3.minus(ray.origin, center)
  const a = ray.direction.lengthSquared()
  const halfB = Vec3.dot(oc, ray.direction)
  const c = Vec3.dot(oc, oc) - radius ** 2
  const discriminant = halfB ** 2 - a * c
  if (discriminant  < 0) {
    return -1
  } else {
    return (-halfB - Math.sqrt(discriminant)) / a
  }
}