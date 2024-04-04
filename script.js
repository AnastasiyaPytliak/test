let contentElement = document.querySelector(".content");
let nextElementBtn = document.querySelector(".next");
let prevElementBtn = document.querySelector(".prev");
let pointElementBtns = document.querySelectorAll(".test-question__option");
let blockElementBtns = [...document.querySelectorAll(".test-questions")];
let activeBlockElement = document.querySelector(".test-questions.active");
let resultsBtnElement = document.querySelector(".btn-result");
let resultsBlockElement = document.querySelector(".results");

// -------Change Steps
function changeStep(btn) {
  let index = 0;
  const active = document.querySelector(".test-questions.active");
  index = blockElementBtns.indexOf(active);
  blockElementBtns[index].classList.remove("active");
  if (btn === "next") {
    index++;
  } else if (btn === "prev") {
    index--;
  }
  blockElementBtns[index].classList.add("active");
}

// ------Transition to Next Step
nextElementBtn.addEventListener("click", () => {
  changeStep("next");
  nextElementBtn.classList.add("inactive");
  const active = document.querySelector(".test-questions.active");
  if (blockElementBtns.indexOf(active) >= 1) {
    prevElementBtn.classList.remove("inactive");
  }
  // Add active when every questions has a check
  if (active.querySelectorAll(".test-question__option.active").length == "4") {
    nextElementBtn.classList.remove("inactive");
  }
});

// ------Transition to Previous Step
prevElementBtn.addEventListener("click", () => {
  changeStep("prev");
  const active = document.querySelector(".test-questions.active");
  if (blockElementBtns.indexOf(active) == 0) {
    prevElementBtn.classList.add("inactive");
  }
  // Add active when every questions has a check
  if (active.querySelectorAll(".test-question__option.active").length == "4") {
    nextElementBtn.classList.remove("inactive");
  }
});

// ------Choosing Answer
pointElementBtns.forEach((pointBtn) => {
  pointBtn.addEventListener("click", () => {
    // Add actie class on point btns
    pointBtn.parentElement
      .querySelectorAll(".test-question__option")
      .forEach((i) => {
        i.classList.remove("active");
      });
    pointBtn.classList.add("active");
    const active = document.querySelector(".test-questions.active");
    // Check on every steps
    if (
      active.querySelectorAll(".test-question__option.active").length == "4"
    ) {
      nextElementBtn.classList.remove("inactive");
    }
    // Check on last step
    if (
      active.querySelectorAll(".test-question__option.active").length == "4" &&
      blockElementBtns.indexOf(active) == 9
    ) {
      resultsBtnElement.style.display = "block";
      nextElementBtn.classList.add("inactive");
    }
  });
});

// --------Sumbit Form
function handleGetResults(e) {
  e.preventDefault();
  const data = [];
  let id = window.location.search
  // data.push({name: 'lead_id', value: `${id.slice(4, attr.length)}`})
  data.push({name: 'lead_id', value: `123456789`})
  const elements = document.querySelectorAll(".test-question__options");
  elements.forEach((element) => {
    const name = element.dataset.name;
    const value = element.querySelector(".test-question__option.active").dataset.points;
    data.push({
      name: name,
      value: value,
    });
  });
  
  // Convert the array of objects to a single object using reduce()
  const formData = data.reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});

  console.log(formData);
  fetch('https://advaga.peaceful-mahavira.173-249-18-74.plesk.page/webhook/fd464835-baeb-4c84-b5e9-24dca078df81', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Преобразуем ответ в JSON
  })
  .then(data => {
    resultsBlockElement.innerHTML = `
    <div class="results__title">${data.result_header}</div> 
    <div class="results__info">${data.result}</div> 
    `
  })
  .catch(error => {
    console.error('Error sending form data:', error);
  });
}
resultsBtnElement.addEventListener("click", handleGetResults);
