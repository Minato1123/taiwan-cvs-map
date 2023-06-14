export type ServiceType = 'coffee-hybrid-shop' | 'fami-super' | 'fami-laundry' | 'smart-coffee' | 'fresh-brew-tea' | 
'sweat-potato' | 'baked-potato' | 'steam-fresh' | 'spicy-egg' | 'sohot-fresh-snacks' | 'single-famiice' |
'two-famiice' | 'chubby-famiice' | 'mont-blanc-famiice' | 'picard' | 'tianhe-fresh' | 'fresh-vegetables' |
'costco-shelf' | 'classic-game-broadcast' | 'recyclable-cup' | 'polaroid' | 'charge-spot' | 'gogoro-battery-exchange' | 
'rest-area' | 'toilet'

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
  service: ServiceType[]
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

