document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("marksForm");
  const subjects = [
    "english",
    "nepali",
    "math",
    "physics",
    "chemistry",
    "biology",
  ];
  const subjectNames = {
    english: "Com.English",
    nepali: "Com.Nepali",
    math: "Com.Math",
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const rollno = document.getElementById("rollno").value;

    document.getElementById("studentName").textContent = name;
    document.getElementById("rollNo").textContent = rollno;

    const tbody = document.getElementById("gradesTableBody");
    tbody.innerHTML = "";

    let grandTotal = 0;

    subjects.forEach((subject) => {
      const theory =
        parseFloat(
          document.querySelector(
            `input[data-subject="${subject}"][data-type="theory"]`
          ).value
        ) || 0;
      const practical =
        parseFloat(
          document.querySelector(
            `input[data-subject="${subject}"][data-type="practical"]`
          ).value
        ) || 0;
      const total = theory + practical;

      // Calculate grade
      const grade = getGrade(total);

      grandTotal += total;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-3 py-2">${subjectNames[subject]}</td>
        <td class="border px-3 py-2">${theory}</td>
        <td class="border px-3 py-2">${practical}</td>
        <td class="border px-3 py-2">${total}</td>
        <td class="border px-3 py-2">${grade}</td>
      `;
      tbody.appendChild(row);
    });

    const finalPercentage = (grandTotal / (subjects.length * 100)) * 100;
    document.getElementById("finalTotal").textContent =
      finalPercentage.toFixed(2);
  });

  function getGrade(total) {
    if (total >= 90) return "A+";
    if (total >= 80) return "A";
    if (total >= 70) return "B+";
    if (total >= 60) return "B";
    if (total >= 50) return "C+";
    if (total >= 40) return "C";
    return "F";
  }
});
