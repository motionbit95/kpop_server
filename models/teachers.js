class Teacher {
  constructor(
    id,
    createdAt,
    category,
    name,
    career,
    rating,
    review,
    student,
    profile
  ) {
    this.id = id;
    this.category = category;
    this.createdAt = createdAt;
    this.name = name;
    this.career = career;
    this.rating = rating;
    this.review = review;
    this.student = student;
    this.profile = profile;
  }
}

module.exports = Teacher;
// 강사 객체 생성 틀
