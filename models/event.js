class Event {
  constructor(
    id,
    index,
    createdAt,
    thumbnail,
    title,
    description,
    discountType,
    discountAmount,
    deadline_start,
    deadline_end,
    use_start,
    use_end
  ) {
    this.id = id;
    this.index = index;
    this.createdAt = createdAt;
    this.thumbnail = thumbnail;
    this.title = title;
    this.description = description;
    this.discountType = discountType;
    this.discountAmount = discountAmount;
    this.deadline_start = deadline_start;
    this.deadline_end = deadline_end;
    this.use_start = use_start;
    this.use_end = use_end;
  }
}

module.exports = Event;
// 강사 객체 생성 틀
