// scripts.js
const contentPool = {
    words: [
        { word: "work", phonetics: "/wɜːk/", meaning: "工作", sentence: "I want to work in Australia." },
        { word: "cable", phonetics: "/ˈkeɪ.bəl/", meaning: "电缆", sentence: "The cable is loose." },
        { word: "fix", phonetics: "/fɪks/", meaning: "修理", sentence: "I fix the cable." },
        { word: "signal", phonetics: "/ˈsɪɡ.nəl/", meaning: "信号", sentence: "The signal is weak." },
        { word: "tool", phonetics: "/tuːl/", meaning: "工具", sentence: "I use a tool to fix it." },
        { word: "battery", phonetics: "/ˈbæt.ər.i/", meaning: "电池", sentence: "The battery is weak." },
        { word: "charge", phonetics: "/tʃɑːrdʒ/", meaning: "充电", sentence: "I charge the device." },
        { word: "device", phonetics: "/dɪˈvaɪs/", meaning: "设备", sentence: "I charge a heavy device." },
        { word: "heavy", phonetics: "/ˈhev.i/", meaning: "重的", sentence: "The device is heavy." },
        { word: "lift", phonetics: "/lɪft/", meaning: "举起", sentence: "I lift a heavy battery." },
        { word: "install", phonetics: "/ɪnˈstɔːl/", meaning: "安装", sentence: "I install the modem." },
        { word: "wireless", phonetics: "/ˈwaɪə.ləs/", meaning: "无线", sentence: "The wireless signal is strong." },
    ],
    audio: [
        { text: "Hi, I charge a heavy device. The battery is weak.", quiz: [
            { q: "What does the person charge?", opts: ["A light", "A heavy device"], ans: 1, explain: "文中说‘I charge a heavy device’。" },
            { q: "Is the battery strong?", opts: ["Yes", "No"], ans: 1, explain: "文中说‘The battery is weak’，所以选‘No’。" },
            { q: "What does the person do?", opts: ["Fix a cable", "Charge a device"], ans: 1, explain: "文中说‘I charge a heavy device’。" }
        ]},
        { text: "I need to fix the cable because the signal is weak.", quiz: [
            { q: "Why does the person fix the cable?", opts: ["It’s broken", "The signal is weak"], ans: 1, explain: "文中说‘because the signal is weak’。" },
            { q: "What is weak?", opts: ["The cable", "The signal"], ans: 1, explain: "文中说‘the signal is weak’。" },
            { q: "What does the person need to do?", opts: ["Fix the cable", "Charge the battery"], ans: 0, explain: "文中说‘I need to fix the cable’。" }
        ]},
    ],
    speaking: [
        [
            { q: "What do you do?", a: "I install wireless devices." },
            { q: "Is the signal strong?", a: "No, the signal is weak." },
            { q: "Can you fix it?", a: "Yes, I can fix it with a tool." }
        ],
        [
            { q: "What’s the problem?", a: "The battery is weak." },
            { q: "How long does it take to charge?", a: "It takes a short time to charge." },
            { q: "Do you need help?", a: "No, I can do it myself." }
        ],
    ],
    writing: [
        { prompts: ["我给无线设备充电。"], answers: ["I charge a wireless device."], tip: ["主语+动词+宾语结构。"] },
        { prompts: ["我修电缆因为信号弱。"], answers: ["I fix the cable because the signal is weak."], tip: ["用‘because’连接原因。"] },
    ]
};

// 全局变量
let vocab = JSON.parse(localStorage.getItem('vocab')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];
let today = new Date().toISOString().split('T')[0];
let startDate = new Date(today);
let dayNum = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24)) || 1;
let plan = JSON.parse(localStorage.getItem('plan')) || { date: today, review: 0, new: 0, speaking: 0, listening: 0, writing: 0, time: 0 };

// 保存数据
function saveData() {
    try {
        localStorage.setItem('vocab', JSON.stringify(vocab));
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('plan', JSON.stringify(plan));
    } catch (e) {
        console.error('保存数据失败:', e);
    }
}

// 获取每日内容
function getDailyContent() {
    return {
        words: contentPool.words.slice((dayNum - 1) * 5 % contentPool.words.length, ((dayNum - 1) * 5 + 5) % contentPool.words.length || 5),
        audio: contentPool.audio[dayNum % contentPool.audio.length],
        speaking: contentPool.speaking[dayNum % contentPool.speaking.length],
        writing: contentPool.writing[dayNum % contentPool.writing.length]
    };
}

// 文字转语音
function speak(text) {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.error('语音播放失败:', e);
    }
}
