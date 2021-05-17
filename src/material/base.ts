import { Ray } from '../ray'
import { HitRecord } from '../hittable'
import { Color } from '../vector'

export interface ScatterInfo{
  scattered: Ray,
  attenuation: Color, 
  hasScatter: boolean,
}

export abstract class Material{
  albedo: Color;
  abstract scatter(ray: Ray, record: HitRecord): ScatterInfo;
}