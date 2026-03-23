/* VARIABLES */
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

let time = document.getElementById("current-time");

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
let TIME_LIMIT = 300;
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("min-input");
const secondInput = document.getElementById("sec-input");
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let start = document.getElementById("start-button");
let restart = document.getElementById("restart-button");
let state = "idle"; // idle, running, paused, end, set
let flagTimePassed = 0;
let timerFlag = false;
const timeBox = document.getElementById("time-box");

const open = document.getElementById("add-task");
const popup = document.getElementById("pop-wrapper");
const close = document.getElementById("close-task");

const input = document.getElementById("task-input");
const save = document.getElementById("save-task");
const reset = document.getElementById("reset-task");
const high_list = document.getElementById("high-list");
const medium_list = document.getElementById("medium-list");
const low_list = document.getElementById("low-list");
const buttons = document.querySelectorAll(".priority-class");
let selected = 0;

let updateBtn = document.getElementById("update-button");

const viewButton = document.getElementById("view-button");
const viewWrapper = document.getElementById("view-wrapper");
const viewClose = document.getElementById("close-view");

let total_finished_task = 0;
let total_task = 0;

const taskWrapper = document.getElementById("task-view-wrapper");



/* MAIN START */
loadTasks();
loadFinishedTasks();
updateProgressBar();
setInterval(() => {
  let d = new Date();
  time.innerHTML = d.toLocaleTimeString();
}, 1000)


/* REFRESH COOKIE */
function refreshCookie() {
  localStorage.setItem("finished", 0);
  localStorage.setItem("unfinished", 0);
  localStorage.setItem("finished_task", 0);
}


/* DARKMODE */
const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})

/* TIMER AND CLOCK HOVER */
let isHover = false;

const wrapper = document.querySelector(".time-wrapper");

function render() {
  wrapper.classList.remove("show-timer", "show-clock");

  if (state === "running") {
    wrapper.classList.add("show-timer");
  } else if (state === "set") {

  } else {
    if (isHover) {
      wrapper.classList.add("show-timer");
    } else {
      wrapper.classList.add("show-clock");
    }
  }
}

wrapper.addEventListener("mouseenter", () => {
  isHover = true;
  render();
});

wrapper.addEventListener("mouseleave", () => {
  isHover = false;
  render();
});

function renderStartTimer() {
  state = "running";
  render();
}

function renderEndTimer() {
  state = "end";
  render();
}

function renderSetTimer() {
  state = "set";
  render();
}


/* TIMER */
function toNumber(val) {
  return isNaN(val) || val === "" ? 0 : Number(val);
}

document.getElementById("timer").innerHTML = `
    <div class="base-timer">
        <svg class="base-timer" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path 
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
                ></path>
            </g>
        </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
    </div>
`;
const setTimer = document.getElementById("base-timer-label");

start.addEventListener("click", function () {
  if (state === "idle" || state === "set") {
    startTimer(timePassed);
    renderStartTimer();
    start.textContent = "PAUSE";
    timeBox.classList.remove("active");
    if (timerFlag) {
      hinput = toNumber(hourInput.value);
      minput = toNumber(minuteInput.value);
      sinput = toNumber(secondInput.value);
      TIME_LIMIT = hinput * 3600 + minput * 60 + sinput;
      setTimer.innerText = formatTime(TIME_LIMIT);
    }
  } else if (state === "running") {
    onTimesUp();
    start.textContent = "RESUME";
    state = "paused";
  } else if (state === "paused") {
    startTimer(flagTimePassed);
    renderStartTimer();
    start.textContent = "PAUSE";
  }
});

restart.addEventListener("click", function () {
  onTimesUp();
  start.textContent = "START";
  document.getElementById("base-timer-label").innerHTML = formatTime(
    TIME_LIMIT
  );
  setCircleDasharray(TIME_LIMIT);
  setRemainingPathColor(TIME_LIMIT);
  state = "idle";
  timeBox.classList.remove("active");
})

function onTimesUp() {
  renderEndTimer();
  clearInterval(timerInterval);
}

function startTimer(timePassed) {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray(timeLeft);
    setRemainingPathColor(timeLeft);

    flagTimePassed = timePassed;
    if (timeLeft === 0) {
      onTimesUp();
      state = "end";
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft == TIME_LIMIT) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  } else if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction(timeLeft) {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray(timeLeft) {
  const circleDasharray = `${(
    calculateTimeFraction(timeLeft) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

/* SET TIMER */
setTimer.addEventListener("click", () => {
  if (state !== "running") {
    timerFlag = true;
    timeBox.classList.add("active");
    renderSetTimer();
  }
})

/* ADD NEW TASK POP UP */
open.onclick = () => {
  popup.classList.add("active");
  selected = 0;
};

close.onclick = () => {
  popup.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === popup) {
    popup.classList.add("active");
  }
};

/* ADD TASK */
function saveTasks() {
  const items = document.querySelectorAll(".list-item");
  const data = [];

  items.forEach(item => {
    const text = item.querySelector("span").textContent;
    const done = item.querySelector(".check").checked;
    const priority = item.dataset.priority;

    data.push({ text, done, priority });
  })

  localStorage.setItem("tasks", JSON.stringify(data));
}

function loadTasks() {
  const raw = JSON.parse(localStorage.getItem("tasks")) || [];
  const data = Array.from(raw);

  data.forEach(task => {
    createTask(task.text, task.priority, task.done);
  });
  loadProgress(data.length);
}

function createTask(text, priority, done = false) {
  const item = document.createElement("div");
  item.className = "list-item";
  item.dataset.priority = priority;

  item.innerHTML = `
    <label>
      <input type="checkbox" class="check" ${done ? "checked" : ""}>
      <span>${text}</span>
    </label>
  `;

  if (priority === "high") high_list.appendChild(item);
  if (priority === "medium") medium_list.appendChild(item);
  if (priority === "low") low_list.appendChild(item);
}

function updateFinished(text, done, priority) {
  const finished_tasks = [];

  const raw = JSON.parse(localStorage.getItem("finished_task")) || [];
  const data = Array.from(raw);
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      finished_tasks.push({ text: item.text, done: item.done, priority: item.priority });
    }
  });

  finished_tasks.push({ text: text, done: done, priority: priority });

  localStorage.setItem("finished_task", JSON.stringify(finished_tasks));
  updateProgressBar();
}

function updateFinishedTask(text, priority) {
  const listItem = document.createElement("div");
  listItem.className = "task-view-item";

  listItem.innerHTML = `
    <div class="view-task">${text}</div>
    <button class="view-priority">${(priority).toUpperCase()}</button>
  `;
  taskWrapper.appendChild(listItem);
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selected = btn.dataset.priority;
  })
})

save.addEventListener("click", function () {
  const inputVal = input.value.trim();
  if (inputVal !== "" && selected != 0) {
    console.log("test");
    createTask(inputVal, selected);
    saveTasks();

    input.value = "";
    buttons.forEach(b => b.classList.remove("active"));
    popup.classList.remove("active");
    total_task = JSON.parse(localStorage.getItem("unfinished")) + 1;
    localStorage.setItem("unfinished", total_task);
    updateProgress();
    updateProgressBar();
  }
});

reset.addEventListener("click", function () {
  input.value = "";
  buttons.forEach(b => b.classList.remove("active"));
})

updateBtn.addEventListener("click", () => {
  const items = document.querySelectorAll(".list-item");

  items.forEach(item => {
    const checkbox = item.querySelector(".check");
    if (checkbox.checked) {
      const text = item.querySelector("span").textContent;
      const done = item.querySelector(".check").checked;
      const priority = item.dataset.priority;
      updateFinished(text, done, priority);
      updateFinishedTask(text, priority);

      item.remove();
      total_finished_task = JSON.parse(localStorage.getItem("finished")) + 1;
      localStorage.setItem("finished", total_finished_task);
    }
  });
  saveTasks();
  updateProgress();
  updateProgressBar();
});

/* ADD NEW TASK POP UP */
viewButton.onclick = () => {
  viewWrapper.classList.add("active");
};

viewClose.onclick = () => {
  viewWrapper.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === viewWrapper) {
    viewWrapper.classList.add("active");
  }
};

function loadFinishedTasks() {
  const raw = JSON.parse(localStorage.getItem("finished_task")) || [];
  const data = Array.from(raw);

  data.forEach(item => {
    const listItem = document.createElement("div");
    listItem.className = "task-view-item";

    listItem.innerHTML = `
      <div class="view-task">${item.text}</div>
      <button class="view-priority">${(item.priority).toUpperCase()}</button>
    `;
    taskWrapper.appendChild(listItem);
  })
}

/* PROGRESS BAR */
function loadProgress(data) {
  let finished = document.getElementById("finished");
  let unfinished = document.getElementById("unfinished");

  finished.textContent = localStorage.getItem("finished");
  unfinished.textContent = localStorage.getItem("unfinished");
  total_task = data;
}

function updateProgress() {
  let finished = document.getElementById("finished");
  let unfinished = document.getElementById("unfinished");

  finished.textContent = localStorage.getItem("finished");
  unfinished.textContent = localStorage.getItem("unfinished");
}

function updateProgressBar() {
  let done = localStorage.getItem("finished");
  let total = localStorage.getItem("unfinished");
  const percent = total === 0 ? 0 : (done / total)*100;
  document.getElementById("progress-fill").style.width = percent + "%";
}