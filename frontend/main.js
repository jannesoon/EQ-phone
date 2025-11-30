// 简单工具：当前时间字符串
function nowTimeStr() {
  const d = new Date();
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

const chatArea = document.getElementById("chat-area");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("btn-send");
const plusBtn = document.getElementById("btn-plus");
const fileInput = document.getElementById("file-input");

// 当前简单的对话列表（后面会替换成真实接口）
const messages = [];

// 渲染一条文本消息
function appendTextMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.textContent = text;

  const ts = document.createElement("div");
  ts.className = "timestamp";
  ts.textContent = nowTimeStr();

  bubble.appendChild(ts);
  row.appendChild(bubble);
  chatArea.appendChild(row);

  chatArea.scrollTop = chatArea.scrollHeight;
}

// 渲染一条图片消息
function appendImageMessage(role, dataUrl) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble bubble-image ${role}`;

  const img = document.createElement("img");
  img.src = dataUrl;
  bubble.appendChild(img);

  const ts = document.createElement("div");
  ts.className = "timestamp";
  ts.textContent = nowTimeStr();
  bubble.appendChild(ts);

  row.appendChild(bubble);
  chatArea.appendChild(row);

  chatArea.scrollTop = chatArea.scrollHeight;
}

// 发送文本
function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;

  // 用户消息
  appendTextMessage("user", text);
  messages.push({ role: "user", content: text });

  inputEl.value = "";

  // 这里暂时用“假逸辰”回复，后面会接 EQ-Chat10.2 的真实接口
  setTimeout(() => {
    const reply = `（假逸辰）听到了哦：${text}`;
    appendTextMessage("assistant", reply);
    messages.push({ role: "assistant", content: reply });
  }, 500);
}

// 选择图片
plusBtn.addEventListener("click", () => {
  fileInput.click();
});

// 文件选择变化
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    appendImageMessage("user", dataUrl);
    messages.push({ role: "user-image", content: dataUrl });
    // 后面这块会改成：上传到后端 /upload_image，再在那边生成 __IMAGE__ 记录
  };
  reader.readAsDataURL(file);

  fileInput.value = "";
});

// 点击发送按钮
sendBtn.addEventListener("click", handleSend);

// 回车发送
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSend();
  }
});

// 初始问候
appendTextMessage("assistant", "这里是 EQ-phone · 星月小手机，逸辰在等你说话。");
