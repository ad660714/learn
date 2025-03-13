const contentPool = {
    words: [
        { word: "work", phonetics: "/wɜːk/", meaning: "工作", sentence: "I want to work in Australia." },
        { word: "cable", phonetics: "/ˈkeɪ.bəl/", meaning: "电缆", sentence: "The cable is loose." },
        { word: "battery", phonetics: "/ˈbæt.ər.i/", meaning: "电池", sentence: "The battery is weak." },
        { word: "charge", phonetics: "/tʃɑːrdʒ/", meaning: "充电", sentence: "I charge the device." },
        { word: "device", phonetics: "/dɪˈvaɪs/", meaning: "设备", sentence: "I charge a heavy device." },
        { word: "fix", phonetics: "/fɪks/", meaning: "修理", sentence: "I fix the cable." },
        { word: "signal", phonetics: "/ˈsɪɡ.nəl/", meaning: "信号", sentence: "The signal is weak." }
    ],
    audio: [
        { text: "Hi, I charge a heavy device. The battery is weak.", quiz: [
            { q: "What does the person charge?", opts: ["A light", "A heavy device"], ans: 1, explain: "文中说‘I charge a heavy device’。" }
        ]},
    ],
    exercises: [
        { prompts: ["我给无线设备充电。"], answers: ["I charge a wireless device."] }
    ]
};

let vocab = JSON.parse(localStorage.getItem('vocab')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let today = new Date().toISOString().split('T')[0];
let startDate = new Date("2025-03-11");
let dayNum = Math.floor((new Date(today) - startDate) / (1000 * 60 * 60 * 24)) + 1;
let plan = JSON.parse(localStorage.getItem('plan')) || { date: today, review: 0, new: 0, quiz: 0, exercise: 0, time: 0 };
let timeStart = null;

function getDailyContent() {
    const dayIndex = (dayNum - 1) % contentPool.words.length;
    return {
        words: contentPool.words.slice(dayIndex, dayIndex + 5),
        audio: contentPool.audio[dayNum % contentPool.audio.length],
        exercises: contentPool.exercises[dayNum % contentPool.exercises.length]
    };
}

function saveData() {
    localStorage.setItem('vocab', JSON.stringify(vocab));
    localStorage.setItem('plan', JSON.stringify(plan));
    localStorage.setItem('history', JSON.stringify(history));
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-AU';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
}

function updateTime() {
    if (!timeStart) timeStart = Date.now();
    plan.time = Math.floor((Date.now() - timeStart) / 60000);
    document.getElementById('timeSpent')?.textContent = plan.time;
    saveData();
}

setInterval(updateTime, 60000);