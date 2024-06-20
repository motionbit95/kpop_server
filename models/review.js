class Review {
  constructor(id, createdAt, teacherId, userId, lessonId, rating, comment) {
    this.id = id;
    this.createdAt = createdAt;
    this.teacherId = teacherId;
    this.userId = userId;
    this.lessonId = lessonId;
    this.rating = rating;
    this.comment = comment;
  }
}

module.exports = Review;
// 강사 객체 생성 틀
