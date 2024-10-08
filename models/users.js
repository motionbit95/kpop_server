class User {
  constructor(
    id,
    createdAt,
    isTeacher,
    profile,
    name,
    firstName,
    email,
    password,
    interest,
    experience,
    birthday,
    gender,
    interestClass,
    interestTeacher,
    timezone,
    frequency,
    classes
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.isTeacher = isTeacher;
    this.profile = profile;
    this.name = name;
    this.firstName = firstName;
    this.email = email;
    this.password = password;
    this.interest = interest;
    this.experience = experience;
    this.birthday = birthday;
    this.gender = gender;
    this.interestClass = interestClass;
    this.interestTeacher = interestTeacher;
    this.timezone = timezone;
    this.frequency = frequency;
    this.classes = classes;
  }
}

module.exports = User;
// 강사 객체 생성 틀
