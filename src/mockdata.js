const attractions = [
    {
        "name": "日月潭",
        "address": "南投縣魚池鄉水社村",
        "backgroundImage": "bg_image_sunmoonlake",
        "coverImage": "cover_image_sunmoonlake",
        "fields": [
            { "index": 1, "name": "景點介紹", "value": "日月潭是台灣最大的湖泊，以美麗的景色與水上活動聞名。", "image": null },
            { "index": 2, "name": "最佳旅遊季節", "value": "四季皆宜，秋天特別適合遊覽。", "image": null },
            { "index": 3, "name": "門票資訊", "value": "免費", "image": null },
            { "index": 4, "name": "交通方式", "value": "搭乘高鐵至台中站，轉乘客運可抵達", "image": null },
            { "index": 5, "name": "官方網站", "value": "https://www.sunmoonlake.gov.tw/", "image": null }
        ]
    },
    {
        "name": "阿里山國家風景區",
        "address": "嘉義縣阿里山鄉",
        "backgroundImage": "bg_image_alisan",
        "coverImage": "cover_image_alisan",
        "fields": [
            { "index": 1, "name": "主要特色", "value": "阿里山以壯觀的日出、雲海與森林鐵道聞名。", "image": null },
            { "index": 2, "name": "開放時間", "value": "全年無休", "image": null },
            { "index": 3, "name": "門票費用", "value": "150元", "image": null },
            { "index": 4, "name": "交通指南", "value": "搭乘台鐵至嘉義站，轉乘阿里山小火車", "image": null },
            { "index": 5, "name": "官方網站", "value": "https://www.ali-nsa.net/", "image": null }
        ]
    },
    {
        "name": "野柳地質公園",
        "address": "新北市萬里區野柳里",
        "backgroundImage": "bg_image_yehliu",
        "coverImage": "cover_image_yehliu",
        "fields": [
            { "index": 1, "name": "特色地形", "value": "野柳以獨特的岩石地形與女王頭聞名。", "image": null },
            { "index": 2, "name": "開放時間", "value": "08:00 - 17:00", "image": null },
            { "index": 3, "name": "票價", "value": "80元", "image": null },
            { "index": 4, "name": "交通資訊", "value": "從台北搭乘客運至野柳站", "image": null },
            { "index": 5, "name": "旅遊建議", "value": "建議平日前往，避免週末人潮。", "image": null }
        ]
    },
    {
        "name": "墾丁國家公園",
        "address": "屏東縣恆春鎮",
        "backgroundImage": "bg_image_kenting",
        "coverImage": "cover_image_kenting",
        "fields": [
            { "index": 1, "name": "熱門景點", "value": "墾丁擁有台灣最美的沙灘與熱帶景觀，是著名的度假勝地。", "image": null },
            { "index": 2, "name": "最佳旅遊時間", "value": "夏季適合水上活動，春秋較涼爽", "image": null },
            { "index": 3, "name": "票價資訊", "value": "免費", "image": null },
            { "index": 4, "name": "交通方式", "value": "搭乘高鐵至左營站，轉乘墾丁快線", "image": null },
            { "index": 5, "name": "住宿推薦", "value": "墾丁大街周邊有眾多民宿與飯店可選擇。", "image": null }
        ]
    },
    {
        "name": "清境農場",
        "address": "南投縣仁愛鄉大同村仁和路170號",
        "backgroundImage": "bg_image_cingjing",
        "coverImage": "cover_image_cingjing",
        "fields": [
            { "index": 1, "name": "農場特色", "value": "清境農場擁有歐洲風情的高山草原，適合親子旅遊。", "image": null },
            { "index": 2, "name": "開放時間", "value": "08:00 - 17:00", "image": null },
            { "index": 3, "name": "門票價格", "value": "200元", "image": null },
            { "index": 4, "name": "交通建議", "value": "搭乘高鐵至台中站，轉乘南投客運可抵達", "image": null },
            { "index": 5, "name": "旅遊建議", "value": "建議穿著保暖衣物，清晨與夜晚較冷。", "image": null }
        ]
    }
]

import { database } from './firebase';
import { ref, push, set } from 'firebase/database';

// 上傳資料到 Firebase
const uploadAttractions = async () => {
    try {
        const attractionsRef = ref(database, 'attractions'); // 指定 Firebase Database 節點
        for (const attraction of attractions) {
            const newAttractionRef = push(attractionsRef); // 產生新 key
            await set(newAttractionRef, attraction); // 上傳資料
        }
        console.log("✅ Attractions 上傳成功！");
    } catch (error) {
        console.error("❌ 上傳失敗:", error);
    }
};

export { uploadAttractions };