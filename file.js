async function analyzeCrop() {
  const crop = document.getElementById("cropType").value;
  const file = document.getElementById("fileInput").files[0];

  if (!crop || !file) {
    alert("Please upload an image and select crop type.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // 🔹 Replace with your deployed backend URL
    const response = await fetch("https://your-backend.onrender.com/predict", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    const result = await response.json();

    const history = JSON.parse(localStorage.getItem("cropHistory")) || [];
    history.unshift({
      crop,
      status: result.prediction,        // from backend
      confidence: result.confidence,    // from backend
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
    const card = document.createElement("div");
    card.className = "crop-card " + item.status.toLowerCase();
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
    const matchesStatus = !status || card.querySelector("span").innerText === status;
    const matchesCrop = !crop || card.querySelector("h3").innerText === crop;

    card.style.display = (matchesSearch && matchesStatus && matchesCrop) ? "block" : "none";
  });
}

// Render history on load
window.onload = renderHistory;
