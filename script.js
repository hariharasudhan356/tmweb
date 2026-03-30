// ====================== CONFIGURATION ======================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0aCOJ32RQmKSIFO2q-xyh3gLu5dGzZPsEHgmf1lJRAJpyxNF2zdd9Ox8lI5ThLsYqAw/exec";   // ←←← CHANGE THIS

// ====================== MAIN FUNCTION ======================
function loadData() {
    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("status").innerHTML = "⚠️ No data found in Google Sheet";
                return;
            }

            const latest = data[data.length - 1];   // Get the newest row

            const dashboard = document.getElementById("dashboard");
            
            // Build clean cards (Timestamp is ignored)
            dashboard.innerHTML = `
                <div class="card">
                    <i class="fas fa-bolt" style="color:#f59e0b;"></i>
                    <div class="label">Voltage</div>
                    <div class="value">${latest.Voltage} V</div>
                </div>

                <div class="card">
                    <i class="fas fa-plug" style="color:#3b82f6;"></i>
                    <div class="label">Current</div>
                    <div class="value">${latest.Current} A</div>
                </div>

                <div class="card">
                    <i class="fas fa-fire" style="color:#ef4444;"></i>
                    <div class="label">Power</div>
                    <div class="value">${latest.Power} W</div>
                </div>

                <div class="card">
                    <i class="fas fa-thermometer-half" style="color:#ec4899;"></i>
                    <div class="label">Temperature</div>
                    <div class="value">${latest.Temperature} °C</div>
                </div>

                <div class="card">
                    <i class="fas fa-vibrate" style="color:#8b5cf6;"></i>
                    <div class="label">Vibration</div>
                    <div class="value">${latest.Vibration}</div>
                </div>

                <div class="card ${latest["Fault Active"] === "YES" || latest["Fault Active"] === "yes" ? "fault" : ""}">
                    <i class="fas fa-exclamation-triangle" style="color:#fff;"></i>
                    <div class="label">Fault Status</div>
                    <div class="value">${latest["Fault Active"]}</div>
                    <div style="margin-top:10px; font-size:1.1rem; opacity:0.9;">
                        ${latest["Fault Message"] || "Normal Operation"}
                    </div>
                </div>
            `;

            // Update status
            const now = new Date();
            document.getElementById("status").innerHTML = `✅ Live • Connected`;
            document.getElementById("last-updated").innerHTML = 
                `Last updated: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        })
        .catch(error => {
            console.error(error);
            document.getElementById("status").innerHTML = "❌ Error loading data. Check your Google Script URL.";
        });
}

// Auto-refresh every 5 seconds
setInterval(loadData, 5000);

// Load data immediately when page opens
loadData();
