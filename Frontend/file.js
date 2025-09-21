async function analyzeCrop() {
  const crop = document.getElementById("cropType").value;
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!crop || !file) {
    alert("Please upload an image and select crop type.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    const result = await response.json();

    // Use backend's exact prediction label
    const status = result.prediction;
    const confidence = result.confidence;

    // Save to localStorage
    const history = JSON.parse(localStorage.getItem("cropHistory")) || [];
    history.unshift({
      crop,
      status,
      confidence,
      date: new Date().toDateString(),
      recommendations: Math.floor(1 + Math.random() * 4)
    });
    localStorage.setItem("cropHistory", JSON.stringify(history));

    showPage("historyPage");
    renderHistory();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  document.querySelectorAll(".sidebar nav a").forEach(a => a.classList.remove("active"));
  if (pageId === "analysisPage") document.getElementById("nav-analysis").classList.add("active");
  if (pageId === "historyPage") document.getElementById("nav-history").classList.add("active");
}

function renderHistory() {
  const historyContainer = document.getElementById("historyCards");
  if (!historyContainer) return;
  historyContainer.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("cropHistory")) || [];
  history.forEach(item => {
    // classify card type
    let cardClass = "stressed";
    if (item.status.toLowerCase().includes("healthy")) {
      cardClass = "healthy";
    } else if (
      item.status.toLowerCase().includes("rust") ||
      item.status.toLowerCase().includes("rot") ||
      item.status.toLowerCase().includes("borer") ||
      item.status.toLowerCase().includes("armyworm") ||
      item.status.toLowerCase().includes("mite")
    ) {
      cardClass = "diseased";
    }

    const card = document.createElement("div");
    card.className = "crop-card " + cardClass;
    card.innerHTML = `
      <img src="https://via.placeholder.com/150" alt="${item.crop}">
      <h3>${item.crop}</h3>
      <p>Status: <span>${item.status}</span></p>
      <p>Confidence: ${item.confidence}%</p>
      <p>Date: ${item.date}</p>
      <p>${item.recommendations} recommendations provided</p>
    `;
    historyContainer.appendChild(card);
  });
}

function filterHistory() {
  const search = document.getElementById("searchBox").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const crop = document.getElementById("cropFilter").value;

  const cards = document.querySelectorAll("#historyCards .crop-card");
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const matchesSearch = !search || text.includes(search);
    const matchesStatus = !status || card.querySelector("span").innerText.toLowerCase().includes(status.toLowerCase());
    const matchesCrop = !crop || card.querySelector("h3").innerText === crop;

    card.style.display = (matchesSearch && matchesStatus && matchesCrop) ? "block" : "none";
  });
}

// Render history on load
window.onload = renderHistory;
