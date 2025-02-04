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
  'organic-vegetable': '生鮮蔬菜',
  'cold-stone': '酷聖石複合店',
  'mister-donut': ' Mister Donut 甜甜圈',
  'cosmetic': '美妝',
  'dessert': '甜點專櫃',
  'recycle': '高效智慧回收機',
  'ibon': 'ibon',
  'bar': '酒 BAR',
  'fresh-tea': '現萃茶',
  'sweet-potato': '現蒸地瓜',
  'ice-cream': '雪淋霜霜淇淋',
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
  'steamed-bun-machine': '蒸食機',
  'gogoro': 'gogoro',
  'ionex': 'ionex',
  'open-bar': 'OPEN Bar',
  'watts-59': 'Watts 均一價 59 元',
  'cold-stone-ice-cream': '酷聖石霜淇淋',
  'self-service-microwave': '自助微波',
  'hot-pot': '饗喫鍋',
}

const familymartServiceList: { [x in string]: string } = {
  'coffee-hybrid-shop': '咖啡複合店',
  'fami-super': 'FamiSuper',
  'fami-laundry': 'Fami 自助洗衣',
  'smart-coffee': '智能咖啡機',
  'cook-now': '馬尚煮',
  'hot-dog': '哈逗堡',
  'formosa-tea': '福爾摩沙茶館',
  'sweat-potato': '夯番薯',
  'baked-potato': '烤馬鈴薯',
  'steam-fresh': '蒸新鮮',
  'spicy-egg': '鼎王麻辣蛋',
  'sohot-grill': 'SOHOT炎選－炸烤物',
  'sohot-dessert': 'SOHOT炎選－現烤點心',
  'famiice': 'Fami!ce（有販售店）',
  'single-famiice': 'Fami!ce（單口味店）',
  'two-famiice': 'Fami!ce（雙口味店）',
  'special-famiice': 'Fami!ce（特殊造型店）',
  'drink-famiice': 'Fami!ce 喝的霜淇淋',
  'picard': 'picard',
  'tianhe-fresh': '天和鮮物',
  'fresh-vegetables': '生鮮蔬菜',
  'costco-shelf': '好市多專架',
  'hogan': '哈肯舖',
  'bear-snack': '小熊菓子',
  'no-pork': '無豬肉熱食友善店',
  'recyclable-cup': '塑環真循環杯',
  'polaroid': '相片拍立得',
  'charge-spot': 'ChargeSPOT',
  'gogoro-battery-exchange': 'gogoro 電池交換站',
  'jpy-atm': '台新外幣 ATM（日圓）',
  'ecar-charging': '電動車充電站',
  'rest-area': '休憩區',
  'toilet': '廁所',
  
  
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