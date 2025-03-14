// ���� vocab.json �Ѱ��� 2000 ���ʣ�������ʾ������
const vocab = {
    foundation: [
        {word: "go", zh: "ȥ", audio: "audio/go.mp3", example: "I go to school."},
        {word: "eat", zh: "��", audio: "audio/eat.mp3", example: "I eat rice."},
        // ... ��500��
    ],
    daily_life: [
        {word: "buy", zh: "��", audio: "audio/buy.mp3", example: "I buy food."},
        // ... ��500��
    ],
    broadband: [
        {word: "router", zh: "·����", audio: "audio/router.mp3", example: "The router is on the table."},
        {word: "signal", zh: "�ź�", audio: "audio/signal.mp3", example: "The signal is weak."},
        {word: "check", zh: "���", audio: "audio/check.mp3", example: "Please check the router."},
        {word: "weak", zh: "��", audio: "audio/weak.mp3", example: "The signal is weak."},
        {word: "restart", zh: "����", audio: "audio/restart.mp3", example: "Restart the router now."},
        // ... ��500��
    ],
    ielts: [
        {word: "study", zh: "ѧϰ", audio: "audio/study.mp3", example: "I study English."},
        // ... ��500��
    ]
};

// �׶κͽ��ȹ���
const stages = ["foundation", "daily_life", "broadband", "ielts"];
let currentStage = localStorage.getItem("stage") || stages[0];
let learnedWords = JSON.parse(localStorage.getItem("learnedWords")) || [];
let dayCount = parseInt(localStorage.getItem("dayCount")) || 0;

// ���ѡ��5��δѧ����
function getRandomWords(category, count) {
    const unlearned = vocab[category].filter(w => !learnedWords.includes(w.word));
    if (unlearned.length < count) return unlearned; // �������������ʣ���
    const shuffled = unlearned.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// ���ɾ���
function generateSentences(words) {
    const templates = [
        `The ${words[0].word} has a ${words[3].word} ${words[1].word}.`,
        `Please ${words[2].word} the ${words[0].word}.`,
        `${words[4].word} the ${words[0].word} now.`
    ];
    return templates.slice(0, 3); // ȷ��3������
}

// ������ϰ
function generateExercises(words, sentences) {
    return [
        {type: "fill", question: `The ___ is ${words[3].word}.`, answer: words[1].word},
        {type: "translate", question: `��${words[2].zh}`, answer: `Please ${words[2].word}`},
        {type: "listen", question: sentences[1], options: [sentences[1], sentences[0]], answer: sentences[1]}
    ];
}

// ÿ������
const todayWords = getRandomWords(currentStage, 5);
const todaySentences = generateSentences(todayWords);
const exercises = generateExercises(todayWords, todaySentences);

// ��Ⱦ����
const wordList = document.getElementById("word-list");
todayWords.forEach(w => {
    const li = document.createElement("li");
    li.innerHTML = `
        <p><strong>${w.word}</strong> - ${w.zh}</p >
        <audio controls src="${w.audio}"></audio>
        <p>����: ${w.example}</p >
    `;
    wordList.appendChild(li);
    if (!learnedWords.includes(w.word)) learnedWords.push(w.word); // ��ӵ���ѧ
});

// ��Ⱦ����
const sentenceList = document.getElementById("sentence-list");
todaySentences.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `
        <p>${s}</p >
        <audio controls src="audio/sample.mp3"></audio> <!-- ʵ�����滻Ϊ��̬��Ƶ -->
    `;
    sentenceList.appendChild(li);
});

// ��Ⱦ��ϰ
const exerciseList = document.getElementById("exercise-list");
exercises.forEach((e, i) => {
    const div = document.createElement("div");
    if (e.type === "fill") {
        div.innerHTML = `<p>${e.question}</p ><input id="ans-${i}" type="text" class="border p-1">`;
    } else if (e.type === "translate") {
        div.innerHTML = `<p>${e.question}</p ><input id="ans-${i}" type="text" class="border p-1">`;
    } else if (e.type === "listen") {
        div.innerHTML = `
            <p>����Ƶѡ����ȷ����:</p >
            <audio controls src="audio/sample.mp3"></audio> <!-- ʵ�����滻 -->
            <select id="ans-${i}" class="border p-1">
                ${e.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
        `;
    }
    exerciseList.appendChild(div);
});

// ���𰸲����½���
document.getElementById("check-answers").addEventListener("click", () => {
    let correctCount = 0;
    exercises.forEach((e, i) => {
        const input = document.getElementById(`ans-${i}`);
        const userAnswer = input.value || input.selectedOptions[0].value;
        if (userAnswer === e.answer) correctCount++;
        alert(userAnswer === e.answer ? "��ȷ��" : `������ȷ����: ${e.answer}`);
    });
    dayCount++;
    if (correctCount === exercises.length && learnedWords.length >= 500 * (stages.indexOf(currentStage) + 1)) {
        currentStage = stages[stages.indexOf(currentStage) + 1] || "ielts";
        localStorage.setItem("stage", currentStage);
        alert(`��ϲ�����ѽ���${currentStage}�׶Σ�`);
    }
    localStorage.setItem("learnedWords", JSON.stringify(learnedWords));
    localStorage.setItem("dayCount", dayCount);
});