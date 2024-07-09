class Curriculum {
  constructor(
    id,
    title,
    image,
    createdAt,
    teacherId,
    category,
    format,
    month,
    totalSessions,
    sessions,
    price,
    description,
    difficulty,
    likes,
    review,
    student,
    classes
  ) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.createdAt = createdAt;
    this.teacherId = teacherId;
    this.category = category;
    this.format = format;
    this.month = month;
    this.totalSessions = totalSessions;
    this.sessions = sessions;
    this.price = price;
    this.description = description;
    this.difficulty = difficulty;
    this.likes = likes;
    this.review = review;
    this.student = student;
    this.classes = classes;
  }
}

module.exports = Curriculum;
