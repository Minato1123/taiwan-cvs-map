export type sevenElevenServiceType = 'parking' | 'toilet' | 'atm' | 'seat' | 'ibon-wifi' | 'slurpee' | 'open-store' | 'pet' 
  | 'open-plaza' | 'blood-pressure' | 'power-rental' | 'organic-vegetable' | 'cold-stone' | 'mister-donut' | 'cosmetic' 
  | 'dessert' | 'recycle' | 'ibon' | 'bar' | 'fresh-tea' | 'sweet-potato' | 'ice-cream' | 'open-kids-room' | 'k-seren' 
  | 'togo' | 'santa-bread' | 'unbelievable-coffee' | 'books' | 'candy' | 'open-eco-cup' | 'city-oatmeal' | 'specialty-coffee' 
  | 'vegetable' | 'frozen-fresh-food' | 'hot-pressed-toast' | 'frozen-delivery' | 'city-cafe-nitrogen-drinks' | 'contact-lens' 
  | 'whisky-coffee' | 'dvd' | 'ha-burn' | 'vegetable-complex' | 'steamed-bun-machine' | 'gogoro' | 'ionex'

export type FamilymartServiceType = 'coffee-hybrid-shop' | 'fami-super' | 'fami-laundry' | 'smart-coffee' | 'fresh-brew-tea' | 
'sweat-potato' | 'baked-potato' | 'steam-fresh' | 'spicy-egg' | 'sohot-fresh-snacks' | 'single-famiice' |
'two-famiice' | 'chubby-famiice' | 'mont-blanc-famiice' | 'picard' | 'tianhe-fresh' | 'fresh-vegetables' |
'costco-shelf' | 'classic-game-broadcast' | 'recyclable-cup' | 'polaroid' | 'charge-spot' | 'gogoro-battery-exchange' | 
'rest-area' | 'toilet'

export type ServiceType = string//sevenElevenServiceType | FamilymartServiceType

export type MartDataType = {
  name: string
  id: string
  tel: string
  lat: number
  lng: number
  city: string
  area: string
  address: string
  service: (sevenElevenServiceType | FamilymartServiceType)[]
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

