class Inquiry {
  constructor(id, uid, createdAt, tag, date, state, title, details) {
    this.id = id;
    this.uid = uid;
    this.createdAt = createdAt;
    this.tag = tag;
    this.date = date;
    this.state = state;
    this.title = title;
    this.details = details;
  }
}

module.exports = Inquiry;
// 강사 객체 생성 틀
