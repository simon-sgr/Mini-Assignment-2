function updateJokeTypes() {
  const jokeType = document.getElementById("joke-type").value;
  fetch("/types")
    .then((response) => response.json())
    .then((data) => {
      const jokeTypeSelect = document.getElementById("joke-type");
      jokeTypeSelect.innerHTML = "";
      data.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.type;
        option.textContent = type.type;
        if (type.type === jokeType) {
          option.setAttribute("selected", "selected");
        }
        jokeTypeSelect.appendChild(option);
      });
    });
}

function submitJoke(event) {
  event.preventDefault();
  const setup = document.getElementById("setup").value;
  const punchline = document.getElementById("punchline").value;

  let jokeType = document.getElementById("joke-type").value;

  if (document.getElementById("type-selection").checked) {
    jokeType = document.getElementById("new-joke-type").value;
  }
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ setup, punchline, type: jokeType }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("Service unavailable");
        }
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert("Joke submitted successfully!");
      location.reload();
    })
    .catch((error) => {
      console.error("Failed to submit joke:", error.message);
      if (error.message === "Service unavailable") {
        alert("Failed to submit joke. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    });
}

function toggleJokeTypeInput() {
  const typeSelection = document.getElementById("type-selection");
  const existingTypeContainer = document.getElementById(
    "existing-type-container"
  );
  const newTypeContainer = document.getElementById("new-type-container");
  const typeLabel = document.getElementById("type-selection-label");

  if (typeSelection.checked) {
    existingTypeContainer.style.display = "none";
    newTypeContainer.style.display = "block";
    typeLabel.textContent = "Add New Type";
  } else {
    existingTypeContainer.style.display = "block";
    newTypeContainer.style.display = "none";
    typeLabel.textContent = "Use Existing";
  }
}
