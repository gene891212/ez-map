import FieldExample from "./FieldExample";

class Attraction {
  constructor(name, address, backgroundImage, coverImage, fields = []) {
    this.name = name; // 景點名稱
    this.address = address; // 地址
    this.backgroundImage = backgroundImage; // 背景圖片
    this.coverImage = coverImage; // 封面圖片
    this.fields = fields; // FieldExample 陣列
  }

  // // 新增欄位
  // addField(field) {
  //   if (field instanceof FieldExample) {
  //     this.fields.push(field);
  //   } else {
  //     throw new Error("Invalid field type. Expected FieldExample instance.");
  //   }
  // }

  toObject() {
    return {
      name: this.name,
      address: this.address,
      backgroundImage: this.backgroundImage,
      coverImage: this.coverImage,
      fields: this.fields.map((field) => field.toObject()),
    };
  }
}

export default Attraction;
