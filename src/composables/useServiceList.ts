import type { sevenElevenServiceType, FamilymartServiceType } from "@/types"


const sevenElevenServiceList: { [x in string]: string } = {
  'parking': '停車場',
  'toilet': '廁所',
  'atm': 'ATM',
  'seat': '座位區',
  'ibon-wifi': 'ibon WiFi',
  'slurpee': '思樂冰',
  'open-store': 'OPEN! STORE',
  'pet': '寵物生活專區',
  'open-plaza': 'OPEN! PLAZA 專櫃',
  'blood-pressure': '千禧血壓站',
  'power-rental': '行動電源租賃',
  'organic-vegetable': '台塑有機蔬菜',
  'cold-stone': '酷聖石',
  'mister-donut': ' Mister Donut 甜甜圈',
  'cosmetic': '美妝',
  'dessert': '甜點專櫃',
  'recycle': '高效智慧回收機',
  'ibon': 'ibon',
  'bar': '酒 BAR',
  'fresh-tea': '現萃茶',
  'sweet-potato': '現蒸地瓜',
  'ice-cream': '霜淇淋',
  'open-kids-room': 'OPEN! 兒童閱覽室',
  'k-seren': 'K·Seren',
  'togo': '21TOGO',
  'santa-bread': '聖娜麵包',
  'unbelievable-coffee': '不可思議咖啡',
  'books': '博客來',
  'candy': '糖果屋',
  'open-eco-cup': 'OPEN iECO 循環杯',
  'city-oatmeal': 'CITY 系列熱燕麥飲',
  'specialty-coffee': '精品咖啡',
  'vegetable': '天素地蔬',
  'frozen-fresh-food': '嚴選素材冷凍鮮物',
  'hot-pressed-toast': '原賞熱壓土司',
  'frozen-delivery': '冷凍交貨便',
  'city-cafe-nitrogen-drinks': 'CITY CAFE 氮氣飲品',
  'contact-lens': ' 拋棄式隱形眼鏡',
  'whisky-coffee': '精品威士忌咖啡',
  'dvd': '霹靂 DVD',
  'ha-burn': '哈燒',
  'vegetable-complex': '天素地蔬複合店',
  'steamed-bun-machine': '蒸包機',
  'gogoro': 'gogoro',
  'ionex': 'ionex',
}

const familymartServiceList: { [x in string]: string } = {
  'coffee-hybrid-shop': '咖啡複合店',
  'fami-super': 'FamiSuper',
  'fami-laundry': 'Fami 自助洗衣',
  'smart-coffee': '智能咖啡機',
  'fresh-brew-tea': '現煮茶機',
  'sweat-potato': '夯番薯',
  'baked-potato': '烤馬鈴薯',
  'steam-fresh': '蒸新鮮',
  'spicy-egg': '鼎王麻辣蛋',
  'sohot-fresh-snacks': 'SOHOT炎選－現烤點心',
  'single-famiice': 'Fami!ce（單口味店）',
  'two-famiice': 'Fami!ce（雙口味店）',
  'chubby-famiice': 'Fami!ce（圓滾滾店）',
  'mont-blanc-famiice': 'Fami!ce（蒙布朗店）',
  'picard': 'picard',
  'tianhe-fresh': '天和鮮物',
  'fresh-vegetables': '生鮮蔬菜',
  'costco-shelf': '好市多專架',
  'classic-game-broadcast': '經典賽轉播',
  'recyclable-cup': '塑環真循環杯',
  'polaroid': '相片拍立得',
  'charge-spot': 'ChargeSPOT',
  'gogoro-battery-exchange': 'gogoro 電池交換站',
  'rest-area': '休憩區',
  'toilet': '廁所'
}

export function useServiceList<T extends '7-11' | 'familymart'>(store: T) {
  const serviceMap = store === '7-11' ? sevenElevenServiceList : familymartServiceList
  
  function getServiceListByMart(service: sevenElevenServiceType | FamilymartServiceType) {
    return serviceMap[service]
  }

  return { 
    serviceMap,
    getServiceListByMart,
  }
}