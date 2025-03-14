// 假设 vocab.json 已包含 2000 个词，这里用示例数据
const vocab = {
    foundation: [
        {word: "go", zh: "去", audio: "audio/go.mp3", example: "I go to school."},
        {word: "eat", zh: "吃", audio: "audio/eat.mp3", example: "I eat rice."},
        // ... 共500个
    ],
    daily_life: [
        {word: "buy", zh: "买", audio: "audio/buy.mp3", example: "I buy food."},
        // ... 共500个
    ],
    broadband: [
        {word: "router", zh: "路由器", audio: "audio/router.mp3", example: "The router is on the table."},
        {word: "signal", zh: "信号", audio: "audio/signal.mp3", example: "The signal is weak."},
        {word: "check", zh: "检查", audio: "audio/check.mp3", example: "Please check the router."},
        {word: "weak", zh: "弱", audio: "audio/weak.mp3", example: "The signal is weak."},
        {word: "restart", zh: "重启", audio: "audio/restart.mp3", example: "Restart the router now."},
        // ... 共500个
    ],
    ielts: [
        {word: "study", zh: "学习", audio: "audio/study.mp3", example: "I study English."},
        // ... 共500个
    ]
};

// 阶段和进度管理
const stages = ["foundation", "daily_life", "broadband", "ielts"];
let currentStage = localStorage.getItem("stage") || stages[0];
let learnedWords = JSON.parse(localStorage.getItem("learnedWords")) || [];
let dayCount = parseInt(localStorage.getItem("dayCount")) || 0;

// 随机选择5个未学单词
function getRandomWords(category, count) {
    const unlearned = vocab[category].filter(w => !learnedWords.includes(w.word));
    if (unlearned.length < count) return unlearned; // 如果不够，返回剩余的
    const shuffled = unlearned.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 生成句子
function generateSentences(words) {
    const templates = [
        `The ${words[0].word} has a ${words[3].word} ${words[1].word}.`,
        `Please ${words[2].word} the ${words[0].word}.`,
        `${words[4].word} the ${words[0].word} now.`
    ];
    return templates.slice(0, 3); // 确保3个句子
}

// 生成练习
function generateExercises(words, sentences) {
    return [
        {type: "fill", question: `The ___ is ${words[3].word}.`, answer: words[1].word},
        {type: "translate", question: `请${words[2].zh}`, answer: `Please ${words[2].word}`},
        {type: "listen", question: sentences[1], options: [sentences[1], sentences[0]], answer: sentences[1]}
    ];
}

// 每日内容
const todayWords = getRandomWords(currentStage, 5);
const todaySentences = generateSentences(todayWords);
const exercises = generateExercises(todayWords, todaySentences);

// 渲染单词
const wordList = document.getElementById("word-list");
todayWords.forEach(w => {
    const li = document.createElement("li");
    li.innerHTML = `
        <p><strong>${w.word}</strong> - ${w.zh}</p >
        <audio controls src="${w.audio}"></audio>
        <p>例句: ${w.example}</p >
    `;
    wordList.appendChild(li);
    if (!learnedWords.includes(w.word)) learnedWords.push(w.word); // 添加到已学
});

// 渲染句子
const sentenceList = document.getElementById("sentence-list");
todaySentences.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
        <p>${s}</p >
        <audio controls src="audio/sample.mp3"></audio> <!-- 实际需替换为动态音频 -->
    `;
    sentenceList.appendChild(li);
});

// 渲染练习
const exerciseList = document.getElementById("exercise-list");
exercises.forEach((e, i) => {
    const div = document.createElement("div");
    if (e.type === "fill") {
        div.innerHTML = `<p>${e.question}</p ><input id="ans-${i}" type="text" class="border p-1">`;
    } else if (e.type === "translate") {
        div.innerHTML = `<p>${e.question}</p ><input id="ans-${i}" type="text" class="border p-1">`;
    } else if (e.type === "listen") {
        div.innerHTML = `
            <p>听音频选择正确句子:</p >
            <audio controls src="audio/sample.mp3"></audio> <!-- 实际需替换 -->
            <select id="ans-${i}" class="border p-1">
                ${e.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
        `;
    }
    exerciseList.appendChild(div);
});

// 检查答案并更新进度
document.getElementById("check-answers").addEventListener("click", () => {
    let correctCount = 0;
    exercises.forEach((e, i) => {
        const input = document.getElementById(`ans-${i}`);
        const userAnswer = input.value || input.selectedOptions[0].value;
        if (userAnswer === e.answer) correctCount++;
        alert(userAnswer === e.answer ? "正确！" : `错误，正确答案是: ${e.answer}`);
    });
    dayCount++;
    if (correctCount === exercises.length && learnedWords.length >= 500 * (stages.indexOf(currentStage) + 1)) {
        currentStage = stages[stages.indexOf(currentStage) + 1] || "ielts";
        localStorage.setItem("stage", currentStage);
        alert(`恭喜！你已进入${currentStage}阶段！`);
    }
    localStorage.setItem("learnedWords", JSON.stringify(learnedWords));
    localStorage.setItem("dayCount", dayCount);
});