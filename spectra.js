<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SPECTRA — Thank You</title>
<link rel="stylesheet" href="../css/main.css"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"/>
</head>
<body>
<div id="spectra-chrome"></div>

<div class="confirm-wrapper">
  <div class="confirm-emoji">🎉</div>
  <h2 class="confirm-title" id="titleText">Thank you!</h2>
  <p class="confirm-sub" id="subText">Your responses have been recorded and sent to the OT team.</p>
  <p class="confirm-note" id="noteText">Response saved securely.</p>
  <button class="btn-primary" style="max-width:220px;margin-top:22px" onclick="window.location.href='../index.html'" id="homeBtn">Back to Home</button>
</div>

<script src="../js/spectra.js"></script>
<script>
const tt = t();
document.getElementById("titleText").textContent = tt.submitted;
document.getElementById("subText").textContent = tt.submittedSub;
document.getElementById("noteText").textContent = tt.sheetNote;
document.getElementById("homeBtn").textContent = tt.backHome;
</script>
</body>
</html>
