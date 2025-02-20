// Function to get a cookie value
function getCookie(cookieName) {
  var cookiesArray = document.cookie.split("; ");
  for (var i = 0; i < cookiesArray.length; i++) {
    var cookie = cookiesArray[i].split("=");
    if (cookie[0] === cookieName) {
      return decodeURIComponent(cookie[1]); // Decode value for special characters
    }
  }
  return null;
}

// Function to set a cookie
function setCookie(name, value, hours = 5) {
  const now = new Date();
  now.setTime(now.getTime() + hours * 60 * 60 * 1000);
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    now.toUTCString() +
    "; path=/";
}

// Redirect to login page if not logged in
if (!getCookie("loggedIn")) {
  window.location.href = "./login.html";
}

// Display team name on the webpage
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submitBTN").addEventListener("click", () => {
    submitScoreProcess();
  });
  const teamName = getCookie("loggedTeamName");
  if (teamName) {
    document.getElementById("teamNameDisplay").innerText = "Team:\n" + teamName;
  } else {
    document.getElementById("teamNameDisplay").innerText = "CONTACT HELPDESK";
  }
});

// Check and handle score submission
if (getCookie("round1Score") && !getCookie("submittedScore")) {
  alert("Score Already Saved, Score Not Submitted\nSUBMITTING SCORE");
  submitScoreProcess(true);
} else if (getCookie("submittedScore")) {
  window.location.href = "./thanks.html";
}

// Function to process score submission
async function submitScoreProcess(useCookie = false) {
  var userSubmit = document
    .querySelector("input[name='codeInput']")
    .value.toLowerCase();
  if (userSubmit === "promise" || useCookie) {
    var teamName = getCookie("loggedTeamName");
    var Score = parseInt(
      800 - (new Date().getTime() - parseInt(getCookie("startTime"))) / 700
    );

    Score = useCookie ? getCookie("round1Score") : (Score > 0 ? Score : 1);

    setCookie("round1Score", Score);

    try {
      var res = await fetch(
        `https://api.counterapi.dev/v1/gameflix30/${teamName}`,
        {
          method: "GET",
        }
      );
      if (res.status == 200) {
        alert("We Warned You Not To Cheat, But You Did. DISQUALIFIED!!");
        Score = 1;
        setCookie("round1Score", Score);
      }
      await fetch(
        `https://api.counterapi.dev/v1/gameflix30/${teamName}/set?count=${Score}`,
        {
          method: "GET",
        }
      );
      setCookie("submittedScore", Score);
      window.location.href = "./thanks.html";
    } catch (error) {
      console.log("ERROR : " + error);
      alert("ERROR SUBMITTING, Refresh Page To Submit Automatically");
    }
  } else {
    alert("Wrong Code");
  }
}

// Function to show Morse Code chart popup
function showPopup() {
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

// Function to hide Morse Code chart popup
function hidePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
