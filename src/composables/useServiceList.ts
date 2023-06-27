import type { ServiceType } from "@/types"

export function useServiceList() {
  const serviceMap: { [x in ServiceType]: string } = {
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
  
  function getServiceListByMart(service: ServiceType) {
    return serviceMap[service]
  }

  return { 
    serviceMap,
    getServiceListByMart,
  }
}