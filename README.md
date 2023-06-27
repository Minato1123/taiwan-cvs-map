# Taiwan FamilyMart Map

Demo：https://minato1123.github.io/taiwan-familymart-map/

## 介紹
使用 Figma 規劃網頁設計，配合開源地圖（[openstreetmap](https://www.openstreetmap.org/)）及 Leaflet 實作 SPA 全家門市地圖，並具備 RWD。<br>
門市資料獲取方式為透過全家官方店舖地圖，撰寫程式碼腳本打 API 獲取並整理。

資料來源與參考：[FamilyMart 全家便利商店](https://www.family.com.tw/Marketing/Map)

## 動機
全家的霜淇淋越來越出名，大多人想知道附近有哪些門市有販賣「單口味」或是「雙口味」的霜淇淋等，都需要透過全家官方提供的店舖地圖來查詢。<br>
我也不例外，但在使用過程中覺得有一些不太方便的地方，例如：一定要用選取街道的方式查詢、地址的輸入框會誤導使用者，以及地址搜尋時若路名沒有對應到任何門市就會查無結果。<br>
因此我想要自己做一份全家的門市地圖來改善這些地方，像是：不需選擇地區可以直接透過拖動地圖來查詢門市、使用地址搜尋門市時有建議選項、以及若想查詢的街道正好沒有全家門市，仍然可以查詢附近的其他門市。

## 功能

### 主畫面
![image](https://github.com/Minato1123/taiwan-familymart-map/assets/71639540/6a74e696-73c2-4d52-9276-a482cbecfc95)

### 根據地址建議搜尋門市
* 可以使用鍵盤上下鍵及 Enter 鍵做選擇

![image](https://github.com/Minato1123/taiwan-familymart-map/assets/71639540/50509ea1-4ae4-4955-a918-6907f71688cb)

### 載入網頁時透過 GPS 取得使用者當前位置
* 超過三秒尚未取得會暫停此操作以免影響使用者體驗
* 點擊上方 NavBar 的連結「FamilyMart Map」可以隨時移動到 GPS 所取得的使用者當前位置（如果有存取到的話）
### 地址若沒有所需門市也可以依照步驟給予經緯度來找尋附近的門市
![image](https://github.com/Minato1123/taiwan-familymart-map/assets/71639540/507ae9f8-bc5e-41ba-b2f9-fb0e9efaa133)

### 依服務項目篩選相符門市
* 勾選項目會記錄在網址，方便存取或分享給其他人
* 地圖的縮放數值也會記錄在網址，確保分享他人時能看到相同的畫面

![image](https://github.com/Minato1123/taiwan-familymart-map/assets/71639540/a25b61ac-43ba-4a32-861a-c66f06ccbb10)

### 透過點擊地圖 Martker 或門市資訊切換選擇的門市
* 門市名稱旁的地標 icon 可以從 Google Map 開啟此間門市，對一般使用者來說更加方便（可以提供導航、儲存地標等）。

## 技術
1. Vue 3
2. Vue Router
3. Vite
4. TypeScript
5. SCSS

## 套件
1. [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
2. [VueUse](https://vueuse.org/)
3. [FZF](https://fzf.netlify.app/docs/latest)
4. [leaflet](https://leafletjs.com/examples.html)
5. [floating-vue](https://floating-vue.starpad.dev/)
6. [ofetch](https://github.com/unjs/ofetch)
7. [tsx](https://github.com/esbuild-kit/tsx)