document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("goToPage");
  button.addEventListener("click", function () {
    console.log("clicked");
    window.location.href = "/";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const teacherId = row.getAttribute("data-id");

      if (confirm("강사를 삭제하시겠습니까?")) {
        fetch(`/teachers/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: teacherId }),
        }).then(async (response) => {
          if (response.ok) {
            row.remove();
          } else {
            alert("Failed to delete the teacher.");
          }
        });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".update-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const teacherId = row.getAttribute("data-id");

      href = `/teachers/update/${teacherId}`;
      window.location.href = href;
    });
  });
});
