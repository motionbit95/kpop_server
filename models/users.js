class User {
  constructor(
    id,
    createdAt,
    isTeacher,
    profile,
    name,
    firstName,
    email,
    snsType,
    snsId,
    location
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.isTeacher = isTeacher;
    this.profile = profile;
    this.name = name;
    this.firstName = firstName;
    this.email = email;
    this.snsType = snsType;
    this.snsId = snsId;
    this.location = location;
  }
}

module.exports = User;
// 강사 객체 생성 틀
