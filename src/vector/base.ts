import { random } from '../utils/index'
import { EPSILON } from '../utils/constant'

export class Vec3{
  e: number[] = [0, 0, 0]
  constructor(e0: number, e1: number, e2: number) {
    if (arguments.length < 3) {
      this.e = [0, 0, 0]
    } else {
      this.e = [e0, e1, e2]
    }
  }
  get x() {
    return this.e[0]
  }
  get y() {
    return this.e[1]
  }
  get z() {
    return this.e[2]
  }
  negate (vec3: Vec3) {
    return new Vec3(-this.x, -this.y, -this.z)
  }
  plus(vec3: Vec3) {
    this.e[0] += vec3.e[0]
    this.e[1] += vec3.e[1]
    this.e[2] += vec3.e[2]
    return this
  }
  minus(vec3: Vec3) {
    this.e[0] -= vec3.e[0]
    this.e[1] -= vec3.e[1]
    this.e[2] -= vec3.e[2]
    return this
  }
  multi(t: number) {
    this.e[0] *= t
    this.e[1] *= t
    this.e[2] *= t
    return this
  }
  divide(t: number) {
    this.e[0] /= t
    this.e[1] /= t
    this.e[2] /= t
    return this
  }

  length() {
    return Math.sqrt(this.lengthSquared())
  }

  lengthSquared() {
    return this.x ** 2 + this.y ** 2 + this.z ** 2
  }

  nearZero(): boolean {
    return Math.abs(this.e[0]) < EPSILON && Math.abs(this.e[1]) < EPSILON && Math.abs(this.e[2]) < EPSILON
  }

  print() {
    console.log(`${this.x} ${this.y} ${this.z}`)
  }

  static negate (vec: Vec3) {
    return new Vec3(-vec.x, -vec.y, -vec.z)
  }

  static plus(...vectors: (Vec3 | number)[]): Vec3 {
    return vectors.reduce((pre: Vec3 | number, cur: Vec3 | number): Vec3 => {
      const v1 = transformToNumbersArray(pre)
      const v2 = transformToNumbersArray(cur)
      return new Vec3(v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2])
    }, new Vec3(0, 0, 0)) as Vec3
  }

  static minus(...vectors: (Vec3 | number)[]): Vec3 {
    return vectors.slice(1).reduce((pre: Vec3 | number, cur: Vec3 | number): Vec3 => {
      const v1 = transformToNumbersArray(pre)
      const v2 = transformToNumbersArray(cur)
      return new Vec3(v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2])
    }, vectors[0]) as Vec3
  }

  static multi(...vectors: (Vec3 | number | number)[]): Vec3 {
    const vec = (vectors.reduce((pre: Vec3, cur: Vec3 | number): Vec3 => {
      const v1 = transformToNumbersArray(pre)
      const v2 = transformToNumbersArray(cur)
      return new Vec3(v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2])
    }, new Vec3(1, 1, 1)) as Vec3)
    return vec
  }

  static divide(vec: Vec3, t: number) {
    return Vec3.multi(vec, 1 / t)
  }

  static dot(u: Vec3, v: Vec3): number {
    return u.x * v.x + u.y * v.y + u.z * v.z
  }

  static cross(u: Vec3, v: Vec3): Vec3  {
    return new Vec3(u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x)
  }

  static unitVector(v: Vec3): Vec3 {
    const len = v.length()
    return Vec3.multi(v, 1 / len)
  }
  static random(min: number, max: number): Vec3 {
    return new Vec3(random(min, max), random(min, max), random(min, max))
  }
  static reflect(v: Vec3, n: Vec3) {
    return Vec3.minus(v, Vec3.multi(n, 2 * Vec3.dot(v, n)))
  }
  static refract(uv: Vec3, n: Vec3, etaiOverEtat: number) {
    const cosTheta = Math.min(
      Vec3.dot(Vec3.negate(uv), n),
      1
    )
    const rayOutPerp = Vec3.multi(
      Vec3.plus(
        uv,
        Vec3.multi(n, cosTheta)
      ),
      etaiOverEtat
    )
    const rayOutParallel = Vec3.multi(
      n,
      -Math.sqrt(
        Math.abs(1 -  rayOutPerp.lengthSquared())
      )
    )
    return Vec3.plus(rayOutPerp, rayOutParallel)
  }
}

function transformToNumbersArray(v: Vec3 | number): number[] {
  if (v instanceof Vec3) {
    return [v.x, v.y, v.z]
  } else {
    return [v, v, v]
  }
}

export function randomInUnitSphere() {
  while(true) {
    const point = Vec3.random(-1, 1)
    if (point.lengthSquared() >= 1) continue
    return point
  }
}

export function randomUnitVector() {
  return Vec3.unitVector(randomInUnitSphere())
}

export function randomInHemisphere(normal: Vec3) {
  const inUnitSphere = randomInUnitSphere()
  if (Vec3.dot(inUnitSphere, normal) > 0) {
    return inUnitSphere
  } else {
    return Vec3.negate(inUnitSphere)
  }
}

export function randomInUnitDisk(): Vec3 {
  while(true) {
    const p = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1, 0)
    if (p.lengthSquared() >= 1) continue
    return p
  }
}