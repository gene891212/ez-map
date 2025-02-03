class FieldExample {
  constructor(index, name, value, image) {
    this.index = index; // 欄位索引
    this.name = name; // 欄位名稱
    this.value = value; // 欄位值
    this.image = image; // 欄位圖片
  }

  toObject() {
    return {
      index: this.index,
      name: this.name,
      value: this.value,
      image: this.image,
    };
  }
}

export default FieldExample;
