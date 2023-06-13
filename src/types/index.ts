export type MartDataType = {
  name: string
  pkey: string
  tel: string
  POSTel: string
  lat: number
  lng: number
  city: string
  area: string
  road: string
  address: string
  service: string[]
}

export type PointType = {
  lat: number
  lng: number
}

export type BoundType = {
  east: number
  north: number
  west: number
  south: number
}