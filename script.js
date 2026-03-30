const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI7a9il68Nb0bY4WwBAMdaVvTXA-Zc8-Eklf5tZBr1LpkeIXaIvrK_AjfDdlcoAI4a/exec";   // ← CHANGE THIS

function loadData() {
    fetch(GOOGLE_SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                document.getElementById("status").textContent = "No data found";
                return;
            }

            const tbody = document.getElementById("tableBody");
            tbody.innerHTML = "";   // Clear previous rows

            // Show ALL rows (newest on top)
            data.reverse().forEach(row => {
                const faultActive = (row["Fault Active"] || "").toString().toUpperCase();
                const isFault = faultActive === "YES" || faultActive === "Y";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${row.Timestamp || "--"}</td>
                    <td>${row.Voltage || "--"}</td>
                    <td>${row.Current || "--"}</td>
                    <td>${row.Power || "--"}</td>
                    <td>${row.Temperature || "--"}</td>
                    <td>${row.Vibration || "--"}</td>
                    <td class="${isFault ? 'fault-yes' : ''}">${row["Fault Active"] || "--"}</td>
                    <td>${row["Fault Message"] || "Normal"}</td>
                `;
                tbody.appendChild(tr);
            });

            const now = new Date();
            document.getElementById("status").innerHTML = `✅ Live • ${data.length} readings loaded`;
            document.getElementById("last-updated").textContent = 
                `Last updated: ${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("status").textContent = "❌ Failed to load data. Check Google Script URL.";
        });
}

// Auto refresh every 8 seconds (good balance)
setInterval(loadData, 8000);

// Load immediately
loadData();
