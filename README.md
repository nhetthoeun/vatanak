# Telegram Bot & Admin Web Console 🤖

Telegram Bot (@vatanak20168_bot) ដំណើរការដោយ **Node.js** ជាមួយ **Web Admin Dashboard** សម្រាប់កែប្រែសារ Welcome Message, ប៊ូតុងអន្តរកម្ម (Inline Buttons), និងមើលស្ថិតិអ្នកប្រើប្រាស់ផ្ទាល់ (Live Activity Feed)។

---

## 🌟 លក្ខណៈពិសេស (Key Features)

- **Telegram Bot (@vatanak20168_bot)**:
  - ឆ្លើយតបសារ `/start` ដោយស្វ័យប្រវត្តិតាមទម្រង់ដែល Admin បានកំណត់
  - បង្ហាញព័ត៌មាន Profile របស់អ្នកប្រើប្រាស់ (User ID, Name, Username)
  - ប៊ូតុងអន្តរកម្ម Inline Keyboard (About, Help, Custom Links)
  - គាំទ្រពាក្យបញ្ជា `/help`, `/ping` និងការឆ្លើយតបសារទូទៅ
- **Web Admin Dashboard (Port 3000)**:
  - កែប្រែ Welcome Message តាមចិត្ត និងគាំទ្រ HTML Tags (`<b>`, `<i>`, `<code>`, `<a>`)
  - បញ្ចូល Tags ស្វ័យប្រវត្តិ (`{name}`, `{username}`, `{id}`, `{bot_name}`)
  - Live Smartphone Simulator: មើលឃើញសារដែលកែប្រែភ្លាមៗក្នុងទម្រង់ Telegram
  - គ្រប់គ្រងប៊ូតុងអន្តរកម្ម Inline Keyboard (Add, Edit, Delete)
  - គំរូសាររហ័ស (Templates): លំនាំដើម, ប្រូម៉ូសិន, សេវាកម្មអតិថិជន, សាមញ្ញ
  - KPI Metrics & Real-time Live Activity Feed

---

## 📁 រចនាសម្ព័ន្ធឯកសារ (Project Structure)

```text
├── .env.example        # គំរូកំណត់ Environment Variables
├── .gitignore          # ឯកសារ Ignore (node_modules, .env)
├── config.json         # រក្សាទុក Welcome Message និង Button Configurations
├── index.html          # Web Admin UI
├── index.js            # Unified Server (Express Web Server + Telegram Bot)
├── package.json        # Node.js dependencies & scripts
├── public/
│   └── index.html      # Web Admin UI Assets
└── README.md           # ឯកសារណែនាំគម្រោង
```

---

## 🚀 របៀបដំឡើង និងដំណើរការ (Getting Started)

### ១. Clone Repository
```bash
git clone https://github.com/nhetthoeun/vatanak.git
cd vatanak
```

### ២. ដំឡើង Dependencies
```bash
npm install
```

### ៣. កំណត់ `.env`
ចម្លងឯកសារ `.env.example` ទៅជា `.env` រួចដាក់ Token Bot របស់អ្នក៖
```bash
cp .env.example .env
```
បើកឯកសារ `.env` ហើយកំណត់៖
```env
BOT_TOKEN=8978213859:AAFdimqALTEQ0-o7p0SwHHrfCuNJFpr-W40
PORT=3000
```

### ៤. ចាប់ផ្ដើមដំណើរការ (Start Server & Bot)
```bash
npm start
```
ឬសម្រាប់ Developer mode (Auto-reload ពេលកែ code):
```bash
npm run dev
```

### ៥. បើកមើល Web Admin UI
បើក Browser ហើយចូលទៅកាន់៖
👉 **[http://localhost:3000](http://localhost:3000)**
*(លេខសម្ងាត់ Admin លំនាំដើម: `admin123`)*

---

## 🔗 តំណភ្ជាប់ Telegram Bot
👉 [https://t.me/vatanak20168_bot](https://t.me/vatanak20168_bot)
