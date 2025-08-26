// ✅ Only declare these once at the top
const output = document.getElementById("output");
const languageSelect = document.getElementById("language");
const alertBox = document.getElementById("customAlert");
let finalTranscript = "";
let isListening = false;

// ✅ Setup Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;
recognition.lang = "en-US"; // Default language

// ✅ Update language dynamically
languageSelect.addEventListener("change", () => {
  recognition.lang = languageSelect.value;
});

// ✅ Typing effect with cursor
function typeAppend(el, text, speed = 10) {
  const cursorClass = "typing";
  let cursor = el.querySelector("." + cursorClass);

  if (!cursor) {
    cursor = document.createElement("span");
    cursor.classList.add(cursorClass);
    el.appendChild(cursor);
  }

  let i = 0;
  function typing() {
    if (i < text.length) {
      cursor.insertAdjacentText("beforebegin", text[i]);
      i++;
      el.scrollTop = el.scrollHeight;
      setTimeout(typing, speed);
    } else {
      cursor.insertAdjacentText("beforebegin", " ");
      el.scrollTop = el.scrollHeight;
    }
  }
  typing();
}

// ✅ Custom alert box
function showAlert(message, duration = 1500) {
  alertBox.textContent = message;
  alertBox.classList.remove("hide");
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
    alertBox.classList.add("hide");
  }, duration);
}

// ✅ Handle recognition results
let lastFinal = "";

recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const result = event.results[i];
    const text = result[0].transcript.trim();

    if (result.isFinal) {
      if (text !== lastFinal) {
        finalTranscript += text + " ";
        typeAppend(output, text);
        lastFinal = text;
      }
    }
  }
};


// ✅ Auto-restart for mobile/browser interruptions
recognition.onend = () => {
  if (isListening) {
    setTimeout(() => recognition.start(), 300); // short delay for stability
  }
};

// ✅ Start listening
document.getElementById("strt").addEventListener("click", () => {
  isListening = true;
  recognition.start();
  showAlert("🎙️ Listening started!");
});

// ✅ Stop listening
document.getElementById("stp").addEventListener("click", () => {
  isListening = false;
  recognition.stop();
  showAlert("🛑 Listening stopped!");

  if (!output.lastChild || !output.lastChild.classList?.contains("typing")) {
    const cursor = document.createElement("span");
    cursor.classList.add("typing");
    output.appendChild(cursor);
    output.scrollTop = output.scrollHeight;
  }
});

// ✅ Clear transcript
document.getElementById("clr").addEventListener("click", () => {
  finalTranscript = "";
  output.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.classList.add("typing");
  output.appendChild(cursor);
  output.scrollTop = output.scrollHeight;
});

// ✅ Print transcript
document.getElementById("prt").addEventListener("click", () => {
  const content = output.innerText || "Transcript is empty.";
  const printWindow = window.open("", "_blank");
  printWindow.document.write("<pre>" + content + "</pre>");
  printWindow.document.close();
  printWindow.print();
});

// ✅ Download transcript
document.getElementById("dwn").addEventListener("click", () => {
  const content = output.innerText || "Transcript is empty.";
  const fileType = document.getElementById("fileType").value;

  let blob, filename;

  if (fileType === "txt") {
    blob = new Blob([content], { type: "text/plain" });
    filename = "transcript.txt";
  } else if (fileType === "doc") {
    const docContent = `<html><body><pre>${content}</pre></body></html>`;
    blob = new Blob([docContent], { type: "application/msword" });
    filename = "transcript.doc";
  } else if (fileType === "pdf") {
    const pdfContent = `<html><body><pre>${content}</pre></body></html>`;
    blob = new Blob([pdfContent], { type: "application/pdf" });
    filename = "transcript.pdf";
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});










