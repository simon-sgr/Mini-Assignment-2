const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "any";
defaultOption.setAttribute("selected", "selected");

function updateJokeType() {
  const jokeType = document.getElementById("joke-type");

  const currentValue = jokeType.value;

  jokeType.innerHTML = "";
  jokeType.appendChild(defaultOption);
  fetch("/types")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((type) => {
        let option = document.createElement("option");
        option.value = type.type;
        option.textContent = type.type;

        if (type.type === currentValue) {
          option.setAttribute("selected", "selected");
        }

        jokeType.appendChild(option);
      });
    });
}

function getJoke() {
  let setup = document.getElementById("setup");
  let punchline = document.getElementById("punchline");

  setup.textContent = "";
  punchline.textContent = "";

  const jokeType = document.getElementById("joke-type");
  fetch(`/joke/${jokeType.value}`)
    .then((response) => response.json())
    .then((data) => {
      setup.textContent = data[0].setup;
      setTimeout(() => {
        punchline.textContent = data[0].punchline;
      }, 3000);
    });
}
