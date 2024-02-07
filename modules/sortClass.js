module.exports = (students) => {
  const uniqueClassesMap = students.reduce((acc, student) => {
    const className = student.class;
    if (!acc[className]) {
      acc[className] = student;
    }
    return acc;
  }, {});

  return Object.values(uniqueClassesMap).sort((a, b) => a.class.localeCompare(b.class));
};