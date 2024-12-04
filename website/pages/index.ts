import { send } from "../utilities";

let scoreDiv = document.querySelector("#scoreDiv") as HTMLDivElement;
let bestDiv = document.querySelector("#bestDiv") as HTMLDivElement;
let lightImg = document.querySelector("#lightImg") as HTMLImageElement;
let startButton = document.querySelector("#startButton") as HTMLButtonElement;
let nameInput = document.querySelector("#nameInput") as HTMLInputElement;
let panelButtons = document.querySelectorAll(".panelButton") as NodeListOf<HTMLButtonElement>;

let panelHistory: number[] = [];
let panelHistoryI = 0;
let score = 0;
let best = 0;

startButton.onclick = function() {
  updateScore(0);
  startButton.disabled = true;
  startRound();
}

let updateScore = function(newScore: number) {
  score = newScore;
  scoreDiv.innerText = "Score: " + newScore;

  if (best < newScore) {
    best = newScore;
    bestDiv.innerText = "Best: " + best;
  }
}

let startRound = async function() {
  activatePanels(false);

  let panelI = Math.floor(Math.random() * 4);

  panelHistory.push(panelI);

  panelHistoryI = 0;

  for (let i = 0; i < panelHistory.length; i++) {
    await flash(panelHistory[i], 200);
    await wait(100);
  }

  activatePanels(true);
}

let activatePanels = function(activate: boolean) {
  for (let i = 0; i < panelButtons.length; i++) {
    panelButtons[i].disabled = !activate;
  }
}

let flash = async function(panelI: number, ms: number) {
  lightImg.style.display = "block";

  if (panelI == 0) {
    lightImg.style.left = "30%";
    lightImg.style.top = "30%";
  }
  else if (panelI == 1) {
    lightImg.style.left = "70%";
    lightImg.style.top = "30%";
  }
  else if (panelI == 2) {
    lightImg.style.left = "30%";
    lightImg.style.top = "70%";
  }
  else if (panelI == 3) {
    lightImg.style.left = "70%";
    lightImg.style.top = "70%";
  }

  await wait(ms);

  lightImg.style.display = "none";
}

let wait = async function (ms: number) {
  return await new Promise((resolve) => setTimeout(() => resolve(null), ms));
}


for (let i = 0; i < panelButtons.length; i++) {
  panelButtons[i].onclick = function() {
    handlePanelClick(i);
  }
}

let handlePanelClick = async function (panelI: number) {
  activatePanels(false);

  if (panelI == panelHistory[panelHistoryI]) {
    await flash(panelI, 200);

    panelHistoryI++;

    if (panelHistoryI == panelHistory.length) {
      updateScore(score + 1);

      await wait(500);

      await startRound();
    }

    activatePanels(true);
  }
  else {
    panelHistoryI = 0;
    panelHistory = [];
    for (let i = 0; i < 3; i++) {
      await flash(0, 50);
      await flash(1, 50);
      await flash(2, 50);
      await flash(3, 50);
    }
    startButton.disabled = false;

    send("addRecord", [nameInput.value, score])

    activatePanels(false);
  }
}

activatePanels(false);
