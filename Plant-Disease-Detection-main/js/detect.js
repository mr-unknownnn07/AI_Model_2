/* ══════════════════════════════════════════════
   PlantCure AI — detect.js
   TensorFlow.js + Teachable Machine Integration
   AI Plant Disease Detection Logic
══════════════════════════════════════════════ */

/* ─── Disease Database ─── */
/* This data powers the result cards after prediction */
const DISEASE_DB = {
  "Healthy": {
    icon: "✅",
    color: "green",
    severity: "none",
    description: "Your plant appears to be in excellent health! No signs of disease, pest damage, or nutrient deficiency detected.",
    symptoms: ["Vibrant green color", "No spots or lesions", "Normal leaf shape", "No wilting"],
    naturalRemedies: [
      "🌿 Apply neem oil spray monthly as preventive care",
      "💧 Water at the base, avoid wetting leaves",
      "🌞 Ensure 6-8 hours of sunlight daily",
      "🌱 Add compost bi-monthly to enrich soil",
    ],
    medicines: [],
    tips: [
      "Rotate crops every season",
      "Prune dead leaves regularly",
      "Monitor for pests weekly",
      "Keep soil well-draining",
    ],
    message: "Your plant looks healthy! Maintain proper care, adequate sunlight, and regular watering.",
  },
  "Powdery Mildew": {
    icon: "🌫️",
    color: "yellow",
    severity: "moderate",
    description: "Powdery mildew is a fungal disease creating white powdery spots on leaves. It thrives in warm dry days and cool nights.",
    symptoms: ["White or gray powdery coating", "Distorted or stunted leaves", "Yellowing of affected areas", "Premature leaf drop"],
    naturalRemedies: [
      "🍶 Mix 1 tbsp baking soda + few drops of neem oil in 1L water; spray every 5 days",
      "🧄 Garlic spray: blend 3 cloves in 500ml water; filter and spray",
      "🥛 Diluted milk spray (1:9 ratio with water) is surprisingly effective",
      "☀️ Move plant to area with better airflow and sunlight",
    ],
    medicines: [
      { name: "Sulfur-based Fungicide", dose: "2g per liter", freq: "Every 7 days", brand: "Sulfex 80 WP" },
      { name: "Potassium Bicarbonate", dose: "1.5g per liter", freq: "Every 10 days", brand: "Milstop" },
      { name: "Myclobutanil Fungicide", dose: "As per label", freq: "Every 14 days", brand: "Rally 40 WP" },
    ],
    tips: ["Avoid overhead watering", "Increase plant spacing", "Remove infected leaves immediately", "Disinfect garden tools"],
    message: "Possible disease detected. Consider removing affected leaves and applying a fungicide spray immediately.",
    shopItems: ["fungicide-sulfex", "neem-oil", "baking-soda-spray"],
  },
  "Leaf Blight": {
    icon: "🍂",
    color: "red",
    severity: "high",
    description: "Leaf blight is caused by bacterial or fungal pathogens, causing large brown or dark lesions that spread rapidly.",
    symptoms: ["Brown or black water-soaked spots", "Rapid spreading of lesions", "Leaf margins turn brown", "Premature defoliation"],
    naturalRemedies: [
      "🧅 Copper sulfate solution (2g/L) spray on affected leaves",
      "🌿 Trichoderma bio-fungicide mixed in soil",
      "🍃 Remove and burn infected plant material immediately",
      "💧 Reduce humidity around plant using mulch",
    ],
    medicines: [
      { name: "Mancozeb 75 WP", dose: "2.5g per liter", freq: "Every 7 days", brand: "Dithane M-45" },
      { name: "Copper Oxychloride", dose: "3g per liter", freq: "Every 10 days", brand: "Blitox 50 WP" },
      { name: "Chlorothalonil", dose: "2g per liter", freq: "Every 10 days", brand: "Kavach 75 WP" },
    ],
    tips: ["Avoid working in wet fields", "Improve drainage immediately", "Apply copper sprays preventively", "Use disease-resistant varieties"],
    message: "Severe disease detected. Remove affected leaves immediately and begin fungicide treatment to prevent spread.",
    shopItems: ["mancozeb-fungicide", "copper-spray", "neem-oil"],
  },
  "Black Spot": {
    icon: "⚫",
    color: "red",
    severity: "high",
    description: "Black spot is a common fungal disease affecting roses and other plants, causing characteristic black circular spots with yellow halos.",
    symptoms: ["Circular black spots with yellow halos", "Leaf yellowing around spots", "Premature leaf drop", "Weakened plant growth"],
    naturalRemedies: [
      "🧪 Baking soda + neem oil spray (1 tbsp + 1 tsp per liter)",
      "🍃 Remove infected leaves and dispose away from garden",
      "🌿 Apply compost tea to strengthen plant immunity",
      "🌬️ Improve air circulation around plants",
    ],
    medicines: [
      { name: "Tebuconazole", dose: "1ml per liter", freq: "Every 14 days", brand: "Folicur EC 25" },
      { name: "Propiconazole", dose: "1ml per liter", freq: "Every 14 days", brand: "Tilt 25 EC" },
      { name: "Captan 50 WP", dose: "2.5g per liter", freq: "Every 7-10 days", brand: "Captan 50 WP" },
    ],
    tips: ["Water only in the morning", "Mulch to prevent soil splash", "Plant disease-resistant rose varieties", "Space plants for airflow"],
    message: "Black spot disease detected. Apply fungicide and remove all spotted leaves to stop the spread.",
    shopItems: ["tebuconazole", "neem-oil", "copper-spray"],
  },
  "Rust Disease": {
    icon: "🦠",
    color: "orange",
    severity: "moderate",
    description: "Rust is a fungal disease appearing as orange, red, yellow, or brown pustules on leaf undersides. Highly contagious between plants.",
    symptoms: ["Orange/rust-colored pustules on leaf underside", "Yellow patches on upper leaf surface", "Distorted leaves", "Premature leaf fall"],
    naturalRemedies: [
      "🧄 Garlic extract spray (5 cloves blended in 500ml water)",
      "🌿 Neem oil spray every 7 days",
      "🍶 Sulfur dust on dry leaves (not in heat above 35°C)",
      "✂️ Prune and destroy infected leaves immediately",
    ],
    medicines: [
      { name: "Sulfur 80 WP", dose: "3g per liter", freq: "Weekly", brand: "Sulfex/Sulfomite" },
      { name: "Mancozeb + Metalaxyl", dose: "2.5g per liter", freq: "Every 10 days", brand: "Ridomil Gold" },
      { name: "Trifloxystrobin", dose: "0.5g per liter", freq: "Every 14 days", brand: "Flint 50 WG" },
    ],
    tips: ["Never work with wet plants", "Disinfect tools between uses", "Apply fertilizers with balanced nitrogen", "Increase potassium intake"],
    message: "Rust disease detected. Start treatment immediately to prevent spreading to neighboring plants.",
    shopItems: ["sulfur-fungicide", "neem-oil", "mancozeb-fungicide"],
  },
  "Root Rot": {
    icon: "🌱",
    color: "red",
    severity: "critical",
    description: "Root rot is caused by overwatering and soil-borne fungi (Phytophthora, Pythium). It destroys the root system and can kill plants rapidly.",
    symptoms: ["Wilting despite adequate water", "Brown mushy roots", "Yellowing leaves", "Stunted growth", "Foul smell from soil"],
    naturalRemedies: [
      "🌱 Repot with fresh, well-draining soil mix immediately",
      "✂️ Trim all brown/black mushy roots before repotting",
      "🍄 Apply Trichoderma fungi as biocontrol agent",
      "💧 Water only when top 2 inches of soil are completely dry",
    ],
    medicines: [
      { name: "Metalaxyl (Ridomil)", dose: "2g per liter soil drench", freq: "Once every 3 weeks", brand: "Ridomil MZ 72 WP" },
      { name: "Fosetyl-Aluminum", dose: "2.5g per liter drench", freq: "Every 3 weeks", brand: "Aliette 80 WG" },
      { name: "Captan Soil Drench", dose: "3g per liter", freq: "Once monthly", brand: "Captan 50 WP" },
    ],
    tips: ["Use pots with drainage holes", "Never let plant sit in water", "Choose disease-resistant cultivars", "Sterilize soil before planting"],
    message: "Root rot detected! Stop watering immediately. Repot the plant with fresh soil and trim infected roots.",
    shopItems: ["ridomil-fungicide", "perlite-soil", "copper-spray"],
  },
  "Bacterial Leaf Spot": {
    icon: "🔴",
    color: "red",
    severity: "high",
    description: "Bacterial leaf spot causes water-soaked spots that turn brown or black, often surrounded by yellow halos. Spreads via water splash.",
    symptoms: ["Dark water-soaked spots", "Yellow halos around spots", "Lesions may merge into large patches", "Holes in leaves as tissue dies"],
    naturalRemedies: [
      "🧪 Copper sulfate spray every 5-7 days",
      "🌿 Hydrogen peroxide solution (3%) diluted 1:10 with water",
      "🍃 Remove all infected leaves and sterilize tools",
      "🌬️ Improve airflow, avoid overhead watering",
    ],
    medicines: [
      { name: "Copper Oxychloride", dose: "3g per liter", freq: "Every 7 days", brand: "Blitox 50 WP" },
      { name: "Streptomycin Sulfate", dose: "0.5g per liter", freq: "Every 10 days", brand: "Agrimycin 100" },
      { name: "Kasugamycin", dose: "2ml per liter", freq: "Every 7 days", brand: "Kocide 3000" },
    ],
    tips: ["Avoid wetting leaves when watering", "Space plants for good airflow", "Apply copper-based preventive sprays", "Sanitize all cutting tools"],
    message: "Bacterial infection detected. Apply copper-based bactericide and remove infected leaves to prevent spread.",
    shopItems: ["copper-spray", "streptomycin-spray", "neem-oil"],
  },
  "Diseased": {
    icon: "⚠️",
    color: "orange",
    severity: "moderate",
    description: "A plant disease has been detected. Please check the treatment page for detailed diagnosis and specific treatment recommendations.",
    symptoms: ["Visible abnormalities on leaves", "Discoloration", "Unusual spots or lesions"],
    naturalRemedies: [
      "🌿 Apply neem oil spray preventively",
      "✂️ Remove visibly infected leaves",
      "💧 Adjust watering practices",
      "🌬️ Improve airflow around the plant",
    ],
    medicines: [
      { name: "General Fungicide", dose: "As per label", freq: "Weekly", brand: "Various" },
    ],
    tips: ["Isolate the affected plant", "Monitor closely for 1 week", "Avoid overwatering", "Consult a plant expert if no improvement"],
    message: "Possible disease detected. Consider removing affected leaves and avoiding overwatering.",
    shopItems: ["neem-oil", "general-fungicide"],
  },
};

// Map custom model labels to our DB
DISEASE_DB["Healthy"] = DISEASE_DB["Healthy"]; // Already exists
DISEASE_DB["Bacterial Disease"] = DISEASE_DB["Bacterial Leaf Spot"];
DISEASE_DB["Fungal Disease"] = DISEASE_DB["Powdery Mildew"]; // Fallback for fungal
DISEASE_DB["Viral Disease"] = DISEASE_DB["Diseased"]; // Generic fallback for viral



/* ─── Care Tips (shown when healthy) ─── */
const CARE_TIPS = [
  { icon: "💧", tip: "Water deeply but less frequently to encourage deep root growth." },
  { icon: "☀️", tip: "Most vegetables need 6-8 hours of direct sunlight daily." },
  { icon: "🌱", tip: "Add compost to your soil every 2-3 months to maintain nutrients." },
  { icon: "✂️", tip: "Prune dead or yellowing leaves to redirect energy to healthy growth." },
  { icon: "🐛", tip: "Inspect plants weekly for pests. Early detection saves plants." },
  { icon: "🧪", tip: "Test your soil pH. Most vegetables thrive at pH 6.0-7.0." },
  { icon: "🌬️", tip: "Good airflow prevents fungal diseases. Space plants adequately." },
  { icon: "🍂", tip: "Mulch around plants to retain moisture and prevent soil splash." },
];

/* ─── Model State ─── */
let model = null;
let maxPredictions = 0;
let isModelLoaded = false;
let uploadedImage = null;

/* ─── Prediction History (stores last 3) ─── */
let predictionHistory = JSON.parse(localStorage.getItem('plantcure_history') || '[]');

/* ─── DOM Elements ─── */
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const previewImg = document.getElementById('preview-img');
const previewWrap = document.getElementById('preview-wrap');
const uploadPrompt = document.getElementById('upload-prompt');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingState = document.getElementById('loading-state');
const resultPanel = document.getElementById('result-panel');
const tryAgainBtn = document.getElementById('try-again-btn');
const historyList = document.getElementById('history-list');
const modelStatus = document.getElementById('model-status');
const cameraBtn = document.getElementById('camera-btn');

/* ─── Load TensorFlow + Teachable Machine Model ─── */
async function loadModel() {
  updateModelStatus('ready', '✅ Backend AI Ready');
  isModelLoaded = true;
}

function updateModelStatus(state, text) {
  if (!modelStatus) return;
  const colors = { loading: 'badge-yellow', ready: 'badge-green', demo: 'badge-blue', error: 'badge-red' };
  modelStatus.className = 'badge ' + (colors[state] || 'badge-blue');
  modelStatus.textContent = text;
}

/* ─── File Upload Handling ─── */
function initUpload() {
  if (!uploadZone || !fileInput) return;

  // Click to upload
  uploadZone.addEventListener('click', () => fileInput.click());

  // Keyboard accessibility
  uploadZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  // File selected
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  // Drag & Drop
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
    else window.PlantCure?.showToast('Please upload an image file.', 'error');
  });

  // Paste from clipboard
  document.addEventListener('paste', (e) => {
    const items = [...(e.clipboardData?.items || [])];
    const imageItem = items.find(i => i.type.startsWith('image/'));
    if (imageItem) handleFile(imageItem.getAsFile());
  });
}

function handleFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    window.PlantCure?.showToast('Image too large. Max 10MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewWrap.classList.remove('hidden');
    uploadPrompt.classList.add('hidden');
    analyzeBtn.disabled = false;
    uploadedImage = previewImg;
    resultPanel.classList.add('hidden');
    uploadZone.classList.add('has-image');
  };
  reader.readAsDataURL(file);
}

/* ─── Camera Capture ─── */
async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    // Show camera modal
    showCameraModal(stream);
  } catch (err) {
    window.PlantCure?.showToast('Camera access denied or not available.', 'error');
  }
}

function showCameraModal(stream) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.style.zIndex = '3000';
  overlay.innerHTML = `
    <div class="modal" style="max-width:400px;text-align:center;">
      <div class="modal-header">
        <h3>📷 Camera</h3>
        <button class="modal-close" id="close-cam">✕</button>
      </div>
      <video id="cam-video" autoplay playsinline style="width:100%;border-radius:12px;margin-bottom:16px;"></video>
      <button class="btn btn-primary w-full" id="snap-btn">📸 Capture Photo</button>
      <canvas id="cam-canvas" style="display:none;"></canvas>
    </div>
  `;
  document.body.appendChild(overlay);

  const video = overlay.querySelector('#cam-video');
  const canvas = overlay.querySelector('#cam-canvas');
  video.srcObject = stream;

  overlay.querySelector('#snap-btn').addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      handleFile(blob);
      stream.getTracks().forEach(t => t.stop());
      overlay.remove();
    }, 'image/jpeg', 0.9);
  });

  overlay.querySelector('#close-cam').addEventListener('click', () => {
    stream.getTracks().forEach(t => t.stop());
    overlay.remove();
  });
}

/* ─── Run Prediction ─── */
async function runPrediction() {
  if (!uploadedImage) return;

  // Show loading
  analyzeBtn.disabled = true;
  loadingState.classList.remove('hidden');
  resultPanel.classList.add('hidden');

  try {
    // 1. Get the image file from the input or the source
    const file = fileInput.files[0];
    if (!file) throw new Error("No file selected");

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('file', file);

    // 3. Call Flask Backend API
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend Error (${response.status}): ${errorText || response.statusText}`);
    }

    const data = await response.json();

    // 4. Format results for display
    const topResult = {
      label: data.prediction,
      probability: data.confidence / 100
    };

    const allResults = Object.entries(data.all_scores).map(([label, score]) => ({
      label: label,
      probability: score / 100
    })).sort((a, b) => b.probability - a.probability);

    displayResult(topResult, allResults);
    addToHistory(topResult);

  } catch (err) {
    console.error('Prediction error:', err);
    window.PlantCure?.showToast('Error connecting to backend: ' + err.message, 'error');
  } finally {
    loadingState.classList.add('hidden');
    analyzeBtn.disabled = false;
  }
}

/* ─── Display Result ─── */
function displayResult(top, allResults) {
  const disease = DISEASE_DB[top.label] || DISEASE_DB['Diseased'];
  const isHealthy = top.label.toLowerCase() === 'healthy';
  const pct = Math.round(top.probability * 100);
  const severity = disease.severity || 'moderate';

  const severityBadge = {
    none: '<span class="badge badge-green">✅ No Disease</span>',
    moderate: '<span class="badge badge-yellow">⚠️ Moderate</span>',
    high: '<span class="badge badge-red">🔴 High Risk</span>',
    critical: '<span class="badge badge-red">🚨 Critical</span>',
  }[severity] || '';

  // Build all-predictions bars
  const allBarsHTML = allResults.slice(0, 4).map(r => `
    <div class="pred-item">
      <div class="flex justify-between" style="margin-bottom:4px;">
        <span style="font-size:.82rem;font-weight:600;">${r.label}</span>
        <span style="font-size:.82rem;color:var(--green-400);font-weight:700;">${Math.round(r.probability * 100)}%</span>
      </div>
      <div class="progress-track">
        <div class="${r.label.toLowerCase() === 'healthy' ? 'progress-fill' : 'progress-fill progress-fill-red'}" style="width:${Math.round(r.probability * 100)}%;"></div>
      </div>
    </div>
  `).join('');

  // Build medicines list (if diseased)
  const medsHTML = disease.medicines?.length > 0 ? `
    <div class="result-section">
      <h4>💊 Recommended Medicines</h4>
      <div class="medicines-grid">
        ${disease.medicines.map(m => `
          <div class="medicine-card">
            <div class="med-name">${m.name}</div>
            <div class="med-brand badge badge-blue">${m.brand}</div>
            <div class="med-detail"><span>Dose:</span> ${m.dose}</div>
            <div class="med-detail"><span>Apply:</span> ${m.freq}</div>
            <a href="shop.html" class="btn btn-sm btn-primary" style="margin-top:10px;width:100%;justify-content:center;">🛒 Buy Now</a>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Remedies list
  const remediesHTML = `
    <div class="result-section">
      <h4>🌿 ${isHealthy ? 'Care Tips' : 'Natural Remedies'}</h4>
      <ul class="remedy-list">
        ${(isHealthy ? disease.naturalRemedies : disease.naturalRemedies).map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `;

  // Tips
  const tipsHTML = `
    <div class="result-section">
      <h4>💡 Plant Care Tips</h4>
      <div class="tips-grid">
        ${(isHealthy ? CARE_TIPS.slice(0, 4) : disease.tips.map((t, i) => ({ icon: ['✂️', '💧', '🌬️', '🌱'][i % 4], tip: t }))).map(t => `
          <div class="tip-item"><span class="tip-icon">${t.icon}</span><span>${t.tip}</span></div>
        `).join('')}
      </div>
    </div>
  `;

  // Inject into result panel
  resultPanel.innerHTML = `
    <!-- Result Header -->
    <div class="result-header ${isHealthy ? 'result-healthy-bg' : 'result-diseased-bg'}">
      <div class="result-icon">${disease.icon}</div>
      <div class="result-header-content">
        <div class="flex items-center gap-12 flex-wrap">
          <h3>${isHealthy ? '✅ Plant is Healthy!' : `⚠️ ${top.label} Detected`}</h3>
          ${severityBadge}
        </div>
        <p class="result-msg">${disease.message}</p>
      </div>
    </div>

    <!-- Confidence & All Predictions -->
    <div class="result-confidence result-section">
      <h4 style="margin-bottom:12px;">📊 Detailed Prediction Scores</h4>
      <div style="display:flex;flex-direction:column;gap:14px;margin-top:16px;">
        ${allBarsHTML}
      </div>
      <div style="font-size:.82rem;color:var(--text-dim);margin-top:16px;text-align:center;">
        ${pct > 85 ? '🎯 High confidence — very accurate' : pct > 65 ? '📊 Moderate confidence — consider a second opinion' : '⚡ Low confidence — try a clearer photo'}
      </div>
    </div>



    <!-- Disease Description -->
    <div class="result-section">
      <h4>ℹ️ About ${isHealthy ? 'Your Healthy Plant' : top.label}</h4>
      <p style="font-size:.9rem;line-height:1.7;">${disease.description}</p>
      ${!isHealthy ? `
        <div style="margin-top:12px;">
          <div class="result-sub-label">Symptoms:</div>
          <ul class="symptom-list">
            ${disease.symptoms.map(s => `<li>• ${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>

    ${remediesHTML}
    ${medsHTML}
    ${tipsHTML}

    <!-- Actions -->
    <div class="result-actions">
      <button class="btn btn-secondary" id="try-again-btn-inner">↺ Try Another Image</button>
      <a href="treatment.html?d=${encodeURIComponent(top.label.toLowerCase().replace(/\s+/g, '-'))}" class="btn btn-primary">📖 Full Treatment Guide</a>
      <a href="shop.html" class="btn btn-ghost">🛒 Buy Medicines</a>
    </div>
  `;

  resultPanel.classList.remove('hidden');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Wire up try again
  document.getElementById('try-again-btn-inner')?.addEventListener('click', resetUpload);
}

/* ─── Reset Upload State ─── */
function resetUpload() {
  previewWrap.classList.add('hidden');
  uploadPrompt.classList.remove('hidden');
  resultPanel.classList.add('hidden');
  loadingState.classList.add('hidden');
  uploadZone.classList.remove('has-image');
  fileInput.value = '';
  analyzeBtn.disabled = true;
  uploadedImage = null;
  previewImg.src = '';
  window.scrollTo({ top: uploadZone.offsetTop - 100, behavior: 'smooth' });
}

/* ─── Prediction History ─── */
function addToHistory(result) {
  const entry = {
    label: result.label,
    confidence: Math.round(result.probability * 100),
    time: new Date().toLocaleTimeString(),
    icon: DISEASE_DB[result.label]?.icon || '🌿',
    isHealthy: result.label.toLowerCase() === 'healthy',
    img: previewImg.src.substring(0, 200), // Store thumbnail substr
  };

  predictionHistory.unshift(entry);
  if (predictionHistory.length > 3) predictionHistory.pop();
  localStorage.setItem('plantcure_history', JSON.stringify(predictionHistory));
  renderHistory();
}

function renderHistory() {
  if (!historyList) return;
  if (predictionHistory.length === 0) {
    historyList.innerHTML = '<p class="no-history">No scans yet. Upload a plant image to start!</p>';
    return;
  }

  historyList.innerHTML = predictionHistory.map((h, i) => `
    <div class="history-item" style="animation-delay:${i * 0.1}s;">
      <div class="history-icon">${h.icon}</div>
      <div class="history-content">
        <div class="history-label ${h.isHealthy ? 'text-healthy' : 'text-diseased'}">${h.label}</div>
        <div class="history-meta">${h.confidence}% confidence · ${h.time}</div>
      </div>
      <div class="history-badge ${h.isHealthy ? 'badge-green' : 'badge-red'} badge">
        ${h.isHealthy ? '✅' : '⚠️'}
      </div>
    </div>
  `).join('');
}

/* ─── Initialize ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Wire buttons
  analyzeBtn?.addEventListener('click', runPrediction);
  tryAgainBtn?.addEventListener('click', resetUpload);
  cameraBtn?.addEventListener('click', openCamera);

  // Initialize upload
  initUpload();

  // Render existing history
  renderHistory();

  // Try loading the model (non-blocking)
  loadModel().catch(console.warn);
});
