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

  // Add input listeners for theory/practical to update total fields
  subjects.forEach((subject) => {
    ["theory", "practical"].forEach((type) => {
      const input = document.querySelector(
        `input[data-subject="${subject}"][data-type="${type}"]`
      );
      input.addEventListener("input", () => {
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
        document.getElementById(`total-${subject}`).value = theory + practical;
      });
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const rollno = document.getElementById("rollno").value.trim();

    // Show student info immediately
    document.getElementById("studentName").textContent = name;
    document.getElementById("rollNo").textContent = rollno;

    const tbody = document.getElementById("gradesTableBody");
    tbody.innerHTML = "";

    let grandTotal = 0;
    const marks = {};

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

      grandTotal += total;
      marks[subject] = total;

      const grade = getGrade(total);
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

    const finalPercentage = ((grandTotal / (subjects.length * 100)) * 100) / 25;
    document.getElementById("finalTotal").textContent =
      finalPercentage.toFixed(2);

    try {
      const response = await fetch("/submit-marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollno, ...marks }),
      });

      if (!response.ok) throw new Error("Server error!");

      const result = await response.json();
      console.log("Server response:", result);

      alert("Marksheet submitted successfully!");

      // Reset the form inputs (name, rollno, theory/practical)
      form.reset();

      // Clear total fields
      subjects.forEach((subject) => {
        document.getElementById(`total-${subject}`).value = "";
      });

      // Clear displayed student info and grades table
      document.getElementById("studentName").textContent = "";
      document.getElementById("rollNo").textContent = "";
      document.getElementById("finalTotal").textContent = "";
      tbody.innerHTML = "";
    } catch (error) {
      console.error("Error sending data:", error.message);
      alert("Failed to submit marksheet. Please try again.");
    }
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
