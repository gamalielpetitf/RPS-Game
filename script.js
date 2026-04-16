
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;


let currentPrediction = "";
let playerScore = 0;
let computerScore = 0;


async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);

    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}


async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}


async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let bestProb = 0;
    let bestClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.childNodes[i].innerHTML =
            prediction[i].className + ": " +
            prediction[i].probability.toFixed(2);

        if (prediction[i].probability > bestProb) {
            bestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }

    currentPrediction = bestClass;
}


function startRound() {
    let time = 3;
    document.getElementById("countdown").innerText = time;

    const timer = setInterval(() => {
        time--;
        document.getElementById("countdown").innerText = time;

        if (time === 0) {
            clearInterval(timer);
            playRound();
        }
    }, 1000);
}


function playRound() {
    const player = currentPrediction;
    const computer = randomChoice();

    document.getElementById("playerChoice").innerText = player;
    document.getElementById("computerChoice").innerText = computer;

    const result = getWinner(player, computer);
    document.getElementById("winner").innerText = result;

    document.getElementById("playerScore").innerText = playerScore;
    document.getElementById("computerScore").innerText = computerScore;

    document.getElementById("countdown").innerText = "Ready";
}


function randomChoice(player) {
    const choices = ["Rock", "Paper", "Scissors"];

    
    if (Math.random() < 0.5) {
        if (player === "Rock") return "Scissors";
        if (player === "Paper") return "Rock";
        if (player === "Scissors") return "Paper";
    }

    
    return choices[Math.floor(Math.random() * 3)];
}


function getWinner(player, computer) {
    if (player === computer) return "Tie";

    if (
        (player === "Rock" && computer === "Scissors") ||
        (player === "Paper" && computer === "Rock") ||
        (player === "Scissors" && computer === "Paper")
    ) {
        playerScore++;
        return "You Win";
    } else {
        computerScore++;
        return "Computer Wins";
    }
}