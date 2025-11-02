// DOM Elements
const elements = {
  // Panels and containers
  setupPanel: document.getElementById("setup-panel"),
  tournamentView: document.getElementById("tournament-view"),
  matchPanel: document.getElementById("match-panel"),
  bracketContainer: document.getElementById("tournament-bracket"),
  playersList: document.getElementById("players"),

  // Inputs and counters
  tournamentNameInput: document.getElementById("tournament-name"),
  playerInput: document.getElementById("player-input"),
  playerCount: document.getElementById("player-count"),
  tournamentTitle: document.getElementById("tournament-title"),
  roundDisplay: document.getElementById("round-display"),

  // Buttons
  addPlayerBtn: document.getElementById("add-player"),
  startTournamentBtn: document.getElementById("start-tournament"),
  newTournamentBtn: document.getElementById("new-tournament"),
  saveTournamentBtn: document.getElementById("save-tournament"),
  prevRoundBtn: document.getElementById("prev-round"),
  nextRoundBtn: document.getElementById("next-round"),
  closeMatchBtn: document.getElementById("close-match-panel"),

  // Match display
  matchPlayer1: document.getElementById("match-player1"),
  matchPlayer2: document.getElementById("match-player2"),

  // Modal elements
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modal-title"),
  modalBody: document.getElementById("modal-body"),
  modalConfirm: document.getElementById("modal-confirm"),
  modalCancel: document.getElementById("modal-cancel"),
  closeModal: document.querySelector(".close-modal"),

  // Add these new elements
  atcoderIdInput: document.getElementById("atcoder-id"),
  problemContainer: document.getElementById("problem-container"),
  problemLink: document.getElementById("problem-link"),

  // authButton: document.getElementById("auth-button"),

  authButton: document.getElementById("auth-button"),
  logoutButton: document.getElementById("logout-button"),
};

// Update the tournament object to include maxRounds and playerScores
const tournament = {
  name: "",
  players: [],
  rounds: [],
  currentRound: 0,
  winners: [],
  losers: [],
  activeMatch: null,
  maxRounds: 3, // Default to 3 rounds
  playerScores: {}, // Will track wins/losses for each player
  completed: false,
  allProblems: [],
  isTwoPlayerMode: false, // Flag to indicate special 2-player tournament mode
  activeMatch: null,
  activeTimer: null, // Will store the timer interval
  activeStartTime: null, // Will store when the current match was opened

  difficultySettings: {
    mode: "default", // 'default', 'all-a', 'all-b', 'custom'
    roundDifficulties: [], // Will be populated with 'a' or 'b' for each round when using custom
  },
};
// Add authentication state management
const authState = {
  isSignedIn: false,
  user: null,
  token: null,
};

// Function to check if user is signed in
// function checkAuthStatus() {
//   // Check localStorage or your auth system
//   const savedUser = localStorage.getItem("tournament-user");

//   if (savedUser) {
//     authState.isSignedIn = true;
//     authState.user = JSON.parse(savedUser);
//     document.body.classList.add("user-signed-in");
//   } else {
//     authState.isSignedIn = false;
//     authState.user = null;
//     document.body.classList.remove("user-signed-in");
//   }
// }
function checkAuthStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token found
    authState.isSignedIn = false;
    authState.user = null;
    authState.token = null;
    document.body.classList.remove("user-signed-in");
    updateAuthUI(false);
    return;
  }

  // Verify token with backend
  fetch("http://localhost:5000/api/protected", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid or expired token");
      return res.json();
    })
    .then((data) => {
      console.log("Auth Verified:", data);
      // User is authenticated
      authState.isSignedIn = true;
      authState.user = data.user || { username: data.username };
      authState.token = token;
      document.body.classList.add("user-signed-in");
      updateAuthUI(true);
    })
    .catch((err) => {
      console.error("Token verification failed:", err);
      // Token is invalid or expired
      localStorage.removeItem("token");
      authState.isSignedIn = false;
      authState.user = null;
      authState.token = null;
      document.body.classList.remove("user-signed-in");
      updateAuthUI(false);
      showMessage("Session expired. Please log in again.", "warning");
    });
}

// Function to update UI based on authentication status
function updateAuthUI(isAuthenticated) {
  const authRequiredElements = document.querySelectorAll(".auth-required");
  const authButton = document.getElementById("auth-button");

  if (isAuthenticated) {
    // Show authenticated user controls
    authRequiredElements.forEach((el) => (el.style.display = "inline-block"));
    if (authButton) authButton.style.display = "none";
  } else {
    // Show sign-up button, hide authenticated controls
    authRequiredElements.forEach((el) => (el.style.display = "none"));
    if (authButton) authButton.style.display = "inline-block";
  }
}

// // Function to handle auth button click
// function handleAuthButtonClick() {
//   // Redirect to sign up/register page or show modal
//   // For now, we'll just show a message
//   showMessage("Sign up functionality coming soon!", "info");

//   // Example: Redirect to auth page
//   // window.location.href = '/auth/signup';
// }
// Update the handleAuthButtonClick function
function handleAuthButtonClick() {
  // Redirect to signin page
  window.location.href = "signin.html";
}

// Function to handle logout
// function handleLogout() {
//   // Show confirmation message
//   showMessage("Are you sure you want to log out?", "confirm");

//   // Add listener to the newly cloned button
//   elements.modalConfirm.addEventListener(
//     "click",
//     function () {
//       // Remove user from localStorage
//       localStorage.removeItem("tournament-user");

//       // Update auth state
//       authState.isSignedIn = false;
//       authState.user = null;

//       // Update UI
//       document.body.classList.remove("user-signed-in");

//       // Show success message
//       hideModal();
//       showMessage("Successfully logged out!", "info");

//       // Optionally redirect to home or reload page after a short delay
//       setTimeout(() => {
//         hideModal();
//         // Uncomment the next line if you want to redirect to signin page
//         // window.location.href = 'signin.html';
//       }, 1500);
//     },
//     { once: true }
//   );
// }
function handleLogout() {
  // Show confirmation message
  showMessage("Are you sure you want to log out?", "confirm");

  // Add listener to the newly cloned button
  elements.modalConfirm.addEventListener(
    "click",
    function () {
      // Remove token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("tournament-user"); // Also remove old user data if exists

      // Update auth state
      authState.isSignedIn = false;
      authState.user = null;
      authState.token = null;

      // Update UI
      document.body.classList.remove("user-signed-in");
      updateAuthUI(false);

      // Hide modal and show success message
      hideModal();
      showMessage("Successfully logged out!", "info");

      // Redirect to signin page after a short delay
      setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    },
    { once: true }
  );
}

// Event Listeners
function setupEventListeners() {
  // Setup panel listeners
  elements.addPlayerBtn.addEventListener("click", addPlayer);
  elements.playerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addPlayer();
  });
  elements.startTournamentBtn.addEventListener("click", startTournament);

  // Tournament controls
  elements.newTournamentBtn.addEventListener("click", confirmNewTournament);
  elements.saveTournamentBtn.addEventListener("click", saveTournament);
  elements.prevRoundBtn.addEventListener("click", showPreviousRound);
  elements.nextRoundBtn.addEventListener("click", showNextRound);

  // Add these elements to your elements object
  // Add this to the elements object near the top of the file
  elements.roundsInput = document.getElementById("rounds-input");
  elements.scoreboardPanel = document.getElementById("scoreboard-panel");
  elements.scoreboard = document.getElementById("scoreboard");
  elements.returnToTournamentBtn = document.getElementById(
    "return-to-tournament"
  );
  elements.newTournamentFromResultsBtn = document.getElementById(
    "new-tournament-from-results"
  );
  elements.returnToTournamentBtn.addEventListener("click", hideScoreboard);
  elements.newTournamentFromResultsBtn.addEventListener(
    "click",
    confirmNewTournament
  );

  // custom difficulty elements
  // Add these to your elements object
  elements.difficultyOptions = document.getElementsByName("difficulty-option");
  elements.customDifficultyContainer = document.getElementById(
    "custom-difficulty-container"
  );
  elements.roundDifficultyInputs = document.getElementById(
    "round-difficulty-inputs"
  );
  elements.roundsInput = document.getElementById("rounds-input");

  // Match panel
  elements.closeMatchBtn.addEventListener("click", closeMatchPanel);
  document.querySelectorAll(".win-btn").forEach((btn) => {
    btn.addEventListener("click", markWinner);
  });

  // Modal
  elements.closeModal.addEventListener("click", () => hideModal());
  elements.modalCancel.addEventListener("click", () => hideModal());

  // Allow removing players
  elements.playersList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-player")) {
      const playerItem = e.target.closest("li");
      const playerIndex = Array.from(elements.playersList.children).indexOf(
        playerItem
      );
      removePlayer(playerIndex);
    }
  });

  // Add event listener for rounds input to update custom difficulty inputs
  elements.roundsInput.addEventListener("change", updateCustomDifficultyInputs);

  // Add event listeners for difficulty options
  elements.difficultyOptions.forEach((option) => {
    option.addEventListener("change", toggleCustomDifficultyInputs);
  });

  // Allow removing players - fixed version
  elements.playersList.addEventListener("click", (e) => {
    // Check if the click was on the icon or the parent with remove-player class
    const removeButton = e.target.closest(".remove-player");
    if (removeButton) {
      const playerItem = removeButton.closest("li");
      const playerIndex = Array.from(elements.playersList.children).indexOf(
        playerItem
      );
      removePlayer(playerIndex);
    }
  });

  // Add auth button listener
  if (elements.authButton) {
    elements.authButton.addEventListener("click", handleAuthButtonClick);
  }

  // Add auth button listener
  if (elements.authButton) {
    elements.authButton.addEventListener("click", handleAuthButtonClick);
  }

  // Add logout button listener
  if (elements.logoutButton) {
    elements.logoutButton.addEventListener("click", handleLogout);
  }
}

// Player Management Functions
// Update the addPlayer function to include AtCoder ID
function addPlayer() {
  const playerName = elements.playerInput.value.trim();
  const atcoderId = elements.atcoderIdInput.value.trim();

  if (playerName === "") {
    showMessage("Please enter a player name", "warning");
    return;
  }

  if (atcoderId === "") {
    showMessage("Please enter an AtCoder ID", "warning");
    return;
  }

  // Check if player name already exists
  if (tournament.players.some((p) => p.name === playerName)) {
    showMessage("This player is already in the tournament", "warning");
    return;
  }

  // Add player with AtCoder ID and empty unsolved problems array
  tournament.players.push({
    name: playerName,
    atcoderId: atcoderId,
    unsolvedProblems: [],
  });

  updatePlayersList();
  elements.playerInput.value = "";
  elements.atcoderIdInput.value = "";
  elements.playerInput.focus();
}

// Function to toggle custom difficulty inputs visibility
function toggleCustomDifficultyInputs() {
  const customSelected = Array.from(elements.difficultyOptions).find(
    (option) => option.value === "custom" && option.checked
  );

  if (customSelected) {
    elements.customDifficultyContainer.classList.remove("hidden");
    updateCustomDifficultyInputs();
  } else {
    elements.customDifficultyContainer.classList.add("hidden");
  }
}

// Function to update custom difficulty inputs based on round count
function updateCustomDifficultyInputs() {
  const roundCount = parseInt(elements.roundsInput.value) || 3;
  elements.roundDifficultyInputs.innerHTML = "";

  // Create select elements for each round
  for (let i = 0; i < roundCount; i++) {
    const row = document.createElement("div");
    row.className = "round-difficulty-row";

    const label = document.createElement("label");
    label.textContent = `Round ${i + 1}:`;

    const select = document.createElement("select");
    select.id = `round-difficulty-${i}`;
    select.name = `round-difficulty-${i}`;

    const optionA = document.createElement("option");
    optionA.value = "a";
    optionA.textContent = "Difficulty A";

    const optionB = document.createElement("option");
    optionB.value = "b";
    optionB.textContent = "Difficulty B";

    // Set default selection based on current logic
    if ((roundCount === 3 && i < 2) || (roundCount >= 4 && i < 2)) {
      optionA.selected = true;
    } else {
      optionB.selected = true;
    }

    select.appendChild(optionA);
    select.appendChild(optionB);

    row.appendChild(label);
    row.appendChild(select);

    elements.roundDifficultyInputs.appendChild(row);
  }
}

function removePlayer(index) {
  tournament.players.splice(index, 1);
  updatePlayersList();
}

function updatePlayersList() {
  elements.playersList.innerHTML = "";
  tournament.players.forEach((player) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div>
                <span>${player.name}</span>
                <small>(${player.atcoderId})</small>
            </div>
            <span class="remove-player"><i class="fas fa-times"></i></span>
        `;
    elements.playersList.appendChild(li);
  });

  elements.playerCount.textContent = `(${tournament.players.length})`;

  // Enable/disable start button based on player count
  if (tournament.players.length < 2) {
    elements.startTournamentBtn.disabled = true;
    elements.startTournamentBtn.classList.add("disabled");
  } else {
    elements.startTournamentBtn.disabled = false;
    elements.startTournamentBtn.classList.remove("disabled");
  }
}

// Add a function to fetch all problems
// Modified fetchAllProblems function to separate problems by difficulty
async function fetchAllProblems() {
  try {
    const response = await fetch(
      "https://kenkoooo.com/atcoder/resources/merged-problems.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch problems from AtCoder API");
    }

    const allProblems = await response.json();

    // Categorize problems by difficulty
    const problemsByDifficulty = {
      a: [],
      b: [],
    };

    allProblems.forEach((problem) => {
      const id = problem.id.toLowerCase();
      if (id.startsWith("abc")) {
        if (id.endsWith("_a")) {
          problemsByDifficulty.a.push(problem);
        } else if (id.endsWith("_b")) {
          problemsByDifficulty.b.push(problem);
        }
      }
    });

    return problemsByDifficulty;
  } catch (error) {
    console.error("Error fetching problems:", error);
    showMessage("Failed to fetch problems. Please try again.", "error");
    return {
      a: [],
      b: [],
    };
  }
}

// Add a function to fetch user's submissions
async function fetchUserSubmissions(userId) {
  try {
    const response = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${userId}&from_second=0`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data for user: ${userId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching submissions for ${userId}:`, error);
    return [];
  }
}

// Add a function to get unsolved problems for a player
async function getUnsolvedProblems(player, allProblems) {
  // Fetch user submissions
  const submissions = await fetchUserSubmissions(player.atcoderId);

  // Get solved problems (unique problem IDs with AC status)
  const solvedProblems = new Set();
  submissions.forEach((sub) => {
    if (sub.result === "AC") {
      solvedProblems.add(sub.problem_id);
    }
  });

  // Return unsolved problems (ABC A and B only)
  return allProblems.filter((problem) => !solvedProblems.has(problem.id));
}

// Tournament Management
// async function startTournament() {
//   const tournamentName =
//     elements.tournamentNameInput.value.trim() || "New Tournament";

//   if (tournament.players.length < 2) {
//     showMessage("You need at least 2 players to start a tournament", "warning");
//     return;
//   }

//   // Get the number of rounds
//   const maxRounds = parseInt(elements.roundsInput.value);
//   if (isNaN(maxRounds) || maxRounds < 1) {
//     showMessage("Please enter a valid number of rounds", "warning");
//     return;
//   }

//   // Get difficulty settings
//   const difficultyMode =
//     Array.from(elements.difficultyOptions).find((option) => option.checked)
//       ?.value || "default";
//   tournament.difficultySettings.mode = difficultyMode;

//   // If custom mode, store difficulties for each round
//   if (difficultyMode === "custom") {
//     tournament.difficultySettings.roundDifficulties = [];
//     for (let i = 0; i < maxRounds; i++) {
//       const difficultySelect = document.getElementById(`round-difficulty-${i}`);
//       tournament.difficultySettings.roundDifficulties.push(
//         difficultySelect.value
//       );
//     }
//   }

//   // Show loading message
//   showMessage("Fetching problems from AtCoder...", "info");
//   elements.startTournamentBtn.disabled = true;
//   elements.startTournamentBtn.innerHTML =
//     '<i class="fas fa-spinner fa-spin"></i> Loading...';

//   try {
//     // Fetch all ABC A and B problems, categorized by difficulty
//     tournament.allProblems = await fetchAllProblems();

//     if (
//       tournament.allProblems.a.length === 0 ||
//       tournament.allProblems.b.length === 0
//     ) {
//       throw new Error("Failed to fetch problems from AtCoder");
//     }

//     // Fetch unsolved problems for all players
//     for (const player of tournament.players) {
//       // Combine A and B problems for initial check
//       const allProblemsArray = [
//         ...tournament.allProblems.a,
//         ...tournament.allProblems.b,
//       ];
//       player.unsolvedProblems = await getUnsolvedProblems(
//         player,
//         allProblemsArray
//       );
//     }

//     // Setup tournament
//     tournament.name = tournamentName;
//     tournament.maxRounds = maxRounds;
//     tournament.completed = false;
//     elements.tournamentTitle.textContent = tournament.name;

//     // Set two-player mode if exactly 2 players
//     tournament.isTwoPlayerMode = tournament.players.length === 2;

//     // Initialize player scores
//     tournament.playerScores = {};
//     tournament.players.forEach((player) => {
//       tournament.playerScores[player.name] = {
//         wins: 0,
//         losses: 0,
//         score: 0,
//       };
//     });

//     // Shuffle players for random matching
//     shuffleArray(tournament.players);

//     // Create first round
//     await createFirstRound();

//     // Show tournament view
//     elements.setupPanel.classList.add("hidden");
//     elements.tournamentView.classList.remove("hidden");
//     elements.tournamentView.classList.add("fade-in");

//     // Render the bracket
//     renderBracket();

//     hideModal();
//   } catch (error) {
//     console.error("Error starting tournament:", error);
//     showMessage(`Error: ${error.message}`, "error");
//   } finally {
//     // Reset button state
//     elements.startTournamentBtn.disabled = false;
//     elements.startTournamentBtn.innerHTML =
//       '<i class="fas fa-play"></i> Start Tournament';
//   }
// }
// Update startTournament error handling
async function startTournament() {
  const tournamentName =
    elements.tournamentNameInput.value.trim() || "New Tournament";

  if (tournament.players.length < 2) {
    showMessage("You need at least 2 players to start a tournament", "warning");
    return;
  }

  // Get the number of rounds
  const maxRounds = parseInt(elements.roundsInput.value);
  if (isNaN(maxRounds) || maxRounds < 1) {
    showMessage("Please enter a valid number of rounds", "warning");
    return;
  }

  // Get difficulty settings
  const difficultyMode =
    Array.from(elements.difficultyOptions).find((option) => option.checked)
      ?.value || "default";
  tournament.difficultySettings.mode = difficultyMode;

  // If custom mode, store difficulties for each round
  if (difficultyMode === "custom") {
    tournament.difficultySettings.roundDifficulties = [];
    for (let i = 0; i < maxRounds; i++) {
      const difficultySelect = document.getElementById(`round-difficulty-${i}`);
      tournament.difficultySettings.roundDifficulties.push(
        difficultySelect.value
      );
    }
  }

  // Show loading message
  showMessage("Fetching problems from AtCoder...", "info");
  elements.startTournamentBtn.disabled = true;
  elements.startTournamentBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Loading...';

  try {
    // Fetch all ABC A and B problems, categorized by difficulty
    tournament.allProblems = await fetchAllProblems();

    if (
      tournament.allProblems.a.length === 0 ||
      tournament.allProblems.b.length === 0
    ) {
      throw new Error("Failed to fetch problems from AtCoder");
    }

    // Fetch unsolved problems for all players
    for (const player of tournament.players) {
      // Combine A and B problems for initial check
      const allProblemsArray = [
        ...tournament.allProblems.a,
        ...tournament.allProblems.b,
      ];
      player.unsolvedProblems = await getUnsolvedProblems(
        player,
        allProblemsArray
      );
    }

    // Setup tournament
    tournament.name = tournamentName;
    tournament.maxRounds = maxRounds;
    tournament.completed = false;
    elements.tournamentTitle.textContent = tournament.name;

    // Set two-player mode if exactly 2 players
    tournament.isTwoPlayerMode = tournament.players.length === 2;

    // Initialize player scores
    tournament.playerScores = {};
    tournament.players.forEach((player) => {
      tournament.playerScores[player.name] = {
        wins: 0,
        losses: 0,
        score: 0,
      };
    });

    // Shuffle players for random matching
    shuffleArray(tournament.players);

    // Create first round
    await createFirstRound();

    // Hide modal first, then show tournament view
    hideModal();

    // Small delay to ensure modal is hidden
    setTimeout(() => {
      elements.setupPanel.classList.add("hidden");
      elements.tournamentView.classList.remove("hidden");
      elements.tournamentView.classList.add("fade-in");

      // Render the bracket
      renderBracket();
    }, 100);
  } catch (error) {
    console.error("Error starting tournament:", error);
    hideModal(); // Hide the loading modal
    showMessage(`Error: ${error.message}`, "error");
  } finally {
    // Reset button state
    elements.startTournamentBtn.disabled = false;
    elements.startTournamentBtn.innerHTML =
      '<i class="fas fa-play"></i> Start Tournament';
  }
}

// Update createFirstRound function to assign problems to matches
async function createFirstRound() {
  // Reset tournament state
  tournament.rounds = [];
  tournament.currentRound = 0;
  tournament.winners = [];
  tournament.losers = [];

  // Get appropriate difficulty for the first round
  const difficulty = getProblemDifficultyForRound(0, tournament.maxRounds);

  // Create matches for the first round
  const firstRound = [];
  const players = [...tournament.players];

  // If odd number of players, one gets a bye
  if (players.length % 2 !== 0) {
    tournament.losers.push(null); // Add placeholder for tracking
    const byePlayer = players.pop();
    tournament.winners.push(byePlayer.name); // Last player gets a bye
  }

  // Create matches
  while (players.length > 0) {
    const player1 = players.pop();
    const player2 = players.pop();

    // Find common unsolved problems of the appropriate difficulty
    const commonUnsolved = findCommonUnsolvedProblems(
      player1,
      player2,
      difficulty
    );

    // Assign a random problem from common unsolved ones
    let assignedProblem = null;
    if (commonUnsolved.length > 0) {
      assignedProblem =
        commonUnsolved[Math.floor(Math.random() * commonUnsolved.length)];
    }

    firstRound.push({
      player1: player1.name,
      player2: player2.name,
      player1Id: player1.atcoderId,
      player2Id: player2.atcoderId,
      winner: null,
      loser: null,
      completed: false,
      problem: assignedProblem,
      difficulty: difficulty, // Store the difficulty level
      startTime: null, // Will be set when match is opened
      endTime: null, // Will be set when winner is declared
      solveDuration: null, // Will store the duration in seconds
    });
  }

  tournament.rounds.push(firstRound);
  updateRoundDisplay();
}

// Function to find common unsolved problems between two players
// Updated findCommonUnsolvedProblems to filter by difficulty
function findCommonUnsolvedProblems(player1, player2, difficulty) {
  // Filter the unsolved problems by the specified difficulty
  const player1UnsolvedByDifficulty = player1.unsolvedProblems.filter((p) =>
    p.id.toLowerCase().endsWith(`_${difficulty}`)
  );

  // Get problem IDs for easier comparison
  const player1UnsolvedIds = new Set(
    player1UnsolvedByDifficulty.map((p) => p.id)
  );

  // Find problems that player2 hasn't solved with the required difficulty
  return player2.unsolvedProblems.filter(
    (p) =>
      player1UnsolvedIds.has(p.id) &&
      p.id.toLowerCase().endsWith(`_${difficulty}`)
  );
}

// Update createNextRound function to assign problems to new matches
async function createNextRound() {
  const currentRound = tournament.rounds[tournament.currentRound];
  const completedMatches = currentRound.filter((match) => match.completed);

  // Check if all matches are completed
  if (completedMatches.length !== currentRound.length) {
    showMessage(
      "Complete all matches before advancing to the next round",
      "warning"
    );
    return false;
  }

  // Determine difficulty for the next round (current round + 1)
  const nextRoundIndex = tournament.currentRound + 1;
  const difficulty = getProblemDifficultyForRound(
    nextRoundIndex,
    tournament.maxRounds
  );

  // Special handling for two-player mode
  if (tournament.isTwoPlayerMode) {
    // Check if we've reached the maximum number of rounds
    if (tournament.currentRound >= tournament.maxRounds - 1) {
      tournament.completed = true;
      return false;
    }

    // Get the two players
    const player1 = tournament.players[0];
    const player2 = tournament.players[1];

    // Find common unsolved problems with appropriate difficulty
    const commonUnsolved = findCommonUnsolvedProblems(
      player1,
      player2,
      difficulty
    );

    // Assign a random problem from common unsolved ones
    let assignedProblem = null;
    if (commonUnsolved.length > 0) {
      assignedProblem =
        commonUnsolved[Math.floor(Math.random() * commonUnsolved.length)];
    }

    // Create a new match for the next round
    const newRound = [
      {
        player1: player1.name,
        player2: player2.name,
        player1Id: player1.atcoderId,
        player2Id: player2.atcoderId,
        winner: null,
        loser: null,
        completed: false,
        problem: assignedProblem,
        difficulty: difficulty,
        startTime: null, // Initialize timing properties
        endTime: null,
        solveDuration: null,
      },
    ];

    // Reset winners and losers arrays for the next match
    tournament.winners = [];
    tournament.losers = [];

    // Add the new round to the tournament
    tournament.rounds.push(newRound);
    tournament.currentRound++;
    updateRoundDisplay();

    return true;
  }

  // Regular tournament mode (more than 2 players)
  // Create winner and loser brackets
  const winnersRound = [];
  const losersRound = [];

  // Handle winners bracket
  const winners = [...tournament.winners];

  // If odd number of winners, one gets a bye
  if (winners.length % 2 !== 0 && winners.length > 1) {
    // Move the last winner to the next round directly
    const byePlayer = winners.pop();
    tournament.winners = [byePlayer];
  } else {
    tournament.winners = [];
  }

  // Create winner matches
  while (winners.length > 1) {
    const player1Name = winners.pop();
    const player2Name = winners.pop();

    // Find player objects
    const player1 = tournament.players.find((p) => p.name === player1Name);
    const player2 = tournament.players.find((p) => p.name === player2Name);

    // Find common unsolved problems with appropriate difficulty
    const commonUnsolved = findCommonUnsolvedProblems(
      player1,
      player2,
      difficulty
    );

    // Assign a random problem from common unsolved ones
    let assignedProblem = null;
    if (commonUnsolved.length > 0) {
      assignedProblem =
        commonUnsolved[Math.floor(Math.random() * commonUnsolved.length)];
    }

    winnersRound.push({
      player1: player1Name,
      player2: player2Name,
      player1Id: player1.atcoderId,
      player2Id: player2.atcoderId,
      winner: null,
      loser: null,
      completed: false,
      bracket: "winners",
      problem: assignedProblem,
      difficulty: difficulty,
      startTime: null,
      endTime: null,
      solveDuration: null,
    });
  }

  // Handle losers bracket
  const losers = [...tournament.losers].filter((player) => player !== null);

  if (losers.length % 2 !== 0 && losers.length > 1) {
    const byePlayer = losers.pop();
    tournament.losers = [byePlayer];
  } else {
    tournament.losers = [];
  }

  while (losers.length > 1) {
    const player1Name = losers.pop();
    const player2Name = losers.pop();

    const player1 = tournament.players.find((p) => p.name === player1Name);
    const player2 = tournament.players.find((p) => p.name === player2Name);

    const commonUnsolved = findCommonUnsolvedProblems(
      player1,
      player2,
      difficulty
    );

    let assignedProblem = null;
    if (commonUnsolved.length > 0) {
      assignedProblem =
        commonUnsolved[Math.floor(Math.random() * commonUnsolved.length)];
    }

    losersRound.push({
      player1: player1Name,
      player2: player2Name,
      player1Id: player1.atcoderId,
      player2Id: player2.atcoderId,
      winner: null,
      loser: null,
      completed: false,
      bracket: "losers",
      problem: assignedProblem,
      difficulty: difficulty,
    });
  }

  // Add new rounds to tournament
  tournament.rounds.push([...winnersRound, ...losersRound]);
  tournament.currentRound++;
  updateRoundDisplay();

  return true;
}

function showPreviousRound() {
  if (tournament.currentRound > 0) {
    tournament.currentRound--;
    updateRoundDisplay();
    renderBracket();
  }
}

function showNextRound() {
  // If looking at the last round and we haven't reached the max rounds
  if (
    tournament.currentRound === tournament.rounds.length - 1 &&
    tournament.currentRound < tournament.maxRounds - 1
  ) {
    if (createNextRound()) {
      renderBracket();
    } else if (tournament.completed) {
      // If tournament is completed, show scoreboard
      showScoreboard();
    }
  } else if (tournament.currentRound < tournament.rounds.length - 1) {
    // Otherwise just navigate to the next existing round
    tournament.currentRound++;
    updateRoundDisplay();
    renderBracket();
  }
}

function updateRoundDisplay() {
  elements.roundDisplay.textContent = `Round ${
    tournament.currentRound + 1
  } of ${tournament.maxRounds}`;

  // Update navigation buttons
  elements.prevRoundBtn.disabled = tournament.currentRound === 0;

  if (tournament.currentRound === tournament.rounds.length - 1) {
    // If we've reached max rounds or all final matches are completed
    const finalRound = tournament.rounds[tournament.currentRound];
    const completedFinals = finalRound.filter((match) => match.completed);

    if (
      tournament.currentRound >= tournament.maxRounds - 1 ||
      (finalRound.length === 1 && completedFinals.length === 1)
    ) {
      elements.nextRoundBtn.disabled = true;
    } else {
      elements.nextRoundBtn.disabled = false;
    }
  } else {
    elements.nextRoundBtn.disabled = false;
  }
}

// Bracket Rendering
function renderBracket() {
  elements.bracketContainer.innerHTML = "";

  const currentRoundMatches = tournament.rounds[tournament.currentRound];
  const roundsContainer = document.createElement("div");
  roundsContainer.className = "rounds-container";

  // Determine if we have separate brackets
  const winnerMatches = currentRoundMatches.filter(
    (match) => match.bracket !== "losers"
  );
  const loserMatches = currentRoundMatches.filter(
    (match) => match.bracket === "losers"
  );

  // Render winner bracket if exists
  if (winnerMatches.length > 0) {
    const winnerRound = createRoundElement("Winners Bracket", winnerMatches);
    roundsContainer.appendChild(winnerRound);
  }

  // Check if we've completed the final round of the tournament
  if (
    tournament.completed &&
    tournament.currentRound === tournament.maxRounds - 1 &&
    !elements.scoreboardPanel.classList.contains("fade-in")
  ) {
    showScoreboard();
  }

  // Render loser bracket if exists
  if (loserMatches.length > 0) {
    const loserRound = createRoundElement("Losers Bracket", loserMatches);
    roundsContainer.appendChild(loserRound);
  }

  // If no separate brackets, render all matches
  if (winnerMatches.length === 0 && loserMatches.length === 0) {
    const round = createRoundElement(
      `Round ${tournament.currentRound + 1}`,
      currentRoundMatches
    );
    roundsContainer.appendChild(round);
  }

  elements.bracketContainer.appendChild(roundsContainer);

  // Check if we have a winner and we've reached the max rounds
  if (tournament.currentRound === tournament.maxRounds - 1) {
    if (tournament.isTwoPlayerMode) {
      // For two-player mode, only show winner after all rounds
      if (tournament.completed) {
        // Determine the overall winner based on total score
        const player1 = Object.keys(tournament.playerScores)[0];
        const player2 = Object.keys(tournament.playerScores)[1];
        const winner =
          tournament.playerScores[player1].score >
          tournament.playerScores[player2].score
            ? player1
            : player2;

        // If there's a tie, don't display a winner
        if (
          tournament.playerScores[player1].score !==
          tournament.playerScores[player2].score
        ) {
          const message = document.createElement("div");
          message.className = "winner-announcement";
          message.innerHTML = `
                        <h2>Tournament Champion!</h2>
                        <div class="winner-name">${winner}</div>
                        <p>Congratulations to our tournament winner!</p>
                    `;
          elements.bracketContainer.appendChild(message);
        } else {
          const message = document.createElement("div");
          message.className = "winner-announcement";
          message.innerHTML = `
                        <h2>Tournament Result: Tie!</h2>
                        <p>Both players have the same score.</p>
                    `;
          elements.bracketContainer.appendChild(message);
        }
      }
    } else {
      // For regular tournaments
      const finalRound = tournament.rounds[tournament.currentRound];

      if (finalRound.length === 1 && finalRound[0].completed) {
        const winner = finalRound[0].winner;
        const message = document.createElement("div");
        message.className = "winner-announcement";
        message.innerHTML = `
                    <h2>Tournament Champion!</h2>
                    <div class="winner-name">${winner}</div>
                    <p>Congratulations to our tournament winner!</p>
                `;
        elements.bracketContainer.appendChild(message);
      }
    }
  }
}

function createRoundElement(title, matches) {
  const round = document.createElement("div");
  round.className = "round";

  const header = document.createElement("div");
  header.className = "round-header";
  header.textContent = title;
  round.appendChild(header);

  matches.forEach((match) => {
    const matchElement = createMatchElement(match);
    round.appendChild(matchElement);
  });

  return round;
}

// Update createMatchElement function to show problem info in the bracket
function createMatchElement(match) {
  const matchElement = document.createElement("div");
  matchElement.className = "match";

  if (!match.player1 || !match.player2) {
    matchElement.classList.add("match-pending");
  }

  // Player 1
  const player1Element = document.createElement("div");
  player1Element.className = "match-player";

  if (match.winner === match.player1) {
    player1Element.classList.add("winner");
  } else if (match.completed) {
    player1Element.classList.add("loser");
  }

  player1Element.innerHTML = `
        <span class="player-name">${match.player1 || "TBD"}</span>
    `;

  // Player 2
  const player2Element = document.createElement("div");
  player2Element.className = "match-player";

  if (match.winner === match.player2) {
    player2Element.classList.add("winner");
  } else if (match.completed) {
    player2Element.classList.add("loser");
  }

  player2Element.innerHTML = `
        <span class="player-name">${match.player2 || "TBD"}</span>
    `;

  // Add solve time if match is completed
  if (match.completed && match.solveDuration) {
    const solveTimeElement = document.createElement("div");
    solveTimeElement.className = "solve-time";
    solveTimeElement.innerHTML = `
            <small>Solve time: ${formatTime(match.solveDuration)}</small>
        `;

    if (match.winner === match.player1) {
      player1Element.appendChild(solveTimeElement);
    } else {
      player2Element.appendChild(solveTimeElement);
    }
  }

  matchElement.appendChild(player1Element);
  matchElement.appendChild(player2Element);

  // Add problem indicator if one exists
  if (match.problem) {
    const problemIndicator = document.createElement("div");
    problemIndicator.className = "problem-indicator";
    const difficulty = match.problem.id.split("_").pop().toUpperCase();
    problemIndicator.innerHTML = `
            <small>Problem: ${match.problem.title} (Difficulty: ${difficulty})</small>
        `;

    matchElement.appendChild(problemIndicator);
  }

  // Add click event to edit match
  if (!match.completed && match.player1 && match.player2) {
    matchElement.addEventListener("click", () => openMatchPanel(match));
  }

  return matchElement;
}

// Helper function to determine problem difficulty based on tournament progress
function getProblemDifficultyForRound(currentRound, maxRounds) {
  // Check if we have custom difficulty settings
  if (tournament.difficultySettings.mode === "all-a") {
    return "a";
  } else if (tournament.difficultySettings.mode === "all-b") {
    return "b";
  } else if (
    tournament.difficultySettings.mode === "custom" &&
    tournament.difficultySettings.roundDifficulties &&
    tournament.difficultySettings.roundDifficulties[currentRound]
  ) {
    return tournament.difficultySettings.roundDifficulties[currentRound];
  }

  // Default logic - use existing behavior
  // For 3-round tournament: rounds 1-2 use difficulty A, round 3 uses difficulty B
  // For 4+ round tournament: rounds 1-2 use difficulty A, rounds 3+ use difficulty B

  // If tournament is 3 rounds, only the final round uses difficulty B
  if (maxRounds === 3) {
    return currentRound < 2 ? "a" : "b";
  }
  // If tournament is 4+ rounds, first half uses A, second half uses B
  else {
    return currentRound < 2 ? "a" : "b";
  }
}

// Match Management
// Update openMatchPanel function to show the assigned problem
function openMatchPanel(match) {
  tournament.activeMatch = match;

  // Start the timer if the match hasn't been completed
  if (!match.completed) {
    // Record start time if not already set
    if (!match.startTime) {
      match.startTime = Date.now();
    }

    // Setup timer display element if not already present
    let timerElement = elements.matchPanel.querySelector(".match-timer");
    if (!timerElement) {
      timerElement = document.createElement("div");
      timerElement.className = "match-timer";
      // Insert after the match-problem div
      elements.matchPanel.querySelector(".match-problem").after(timerElement);
    }

    // Display current elapsed time immediately
    const currentElapsedSeconds = Math.floor(
      (Date.now() - match.startTime) / 1000
    );
    timerElement.innerHTML = `<div class="timer">Time: ${formatTime(
      currentElapsedSeconds
    )}</div>`;

    // Start the timer from the match's actual start time
    startMatchTimer(timerElement.querySelector(".timer"), match);
  }

  elements.matchPlayer1.querySelector("h3").textContent = match.player1;
  elements.matchPlayer2.querySelector("h3").textContent = match.player2;

  // Display problem information
  if (match.problem) {
    const difficulty = match.problem.id.split("_").pop().toUpperCase();
    elements.problemContainer.innerHTML = `
            <div class="problem-title">${match.problem.title}</div>
            <div class="problem-contest">Contest: ${match.problem.contest_id.toUpperCase()}</div>
            <div>Difficulty: ${difficulty}</div>
        `;

    // Set problem link
    elements.problemLink.href = `https://atcoder.jp/contests/${match.problem.contest_id}/tasks/${match.problem.id}`;
    elements.problemLink.style.display = "inline-block";
  } else {
    elements.problemContainer.innerHTML = `
            <div class="error-message">
                No common unsolved problems found for these players.
                Please manually assign a problem.
            </div>
        `;
    elements.problemLink.style.display = "none";
  }

  elements.matchPanel.classList.remove("hidden");
  elements.matchPanel.classList.add("fade-in");
}

function closeMatchPanel() {
  // Stop the active timer
  if (tournament.activeTimer) {
    clearInterval(tournament.activeTimer);
    tournament.activeTimer = null;
  }

  elements.matchPanel.classList.add("hidden");
  tournament.activeMatch = null;
}

// Update markWinner to check if the match actually has both players
function markWinner(e) {
  const winnerNum = e.target.getAttribute("data-player");
  const match = tournament.activeMatch;

  if (!match) return;

  const winner = winnerNum === "1" ? match.player1 : match.player2;
  const loser = winnerNum === "1" ? match.player2 : match.player1;

  match.winner = winner;
  match.loser = loser;
  match.completed = true;

  // Record end time and calculate duration based on actual start time
  match.endTime = Date.now();
  match.solveDuration = Math.floor((match.endTime - match.startTime) / 1000);

  // Update player scores and solve times
  if (tournament.playerScores[winner]) {
    tournament.playerScores[winner].wins += 1;
    tournament.playerScores[winner].score += 1;

    // Initialize solve times array if it doesn't exist
    if (!tournament.playerScores[winner].solveTimes) {
      tournament.playerScores[winner].solveTimes = [];
    }

    // Record this solve time
    tournament.playerScores[winner].solveTimes.push({
      round: tournament.currentRound + 1,
      problem: match.problem ? match.problem.id : "unknown",
      time: match.solveDuration,
      timeFormatted: formatTime(match.solveDuration),
    });
  }

  if (tournament.playerScores[loser]) {
    tournament.playerScores[loser].losses += 1;
  }

  // Add to winners and losers for next round
  tournament.winners.push(winner);
  tournament.losers.push(loser);

  closeMatchPanel();
  renderBracket();

  // Check if this was the last match of the max round
  checkTournamentCompletion();
}

function checkTournamentCompletion() {
  // If we've completed the max number of rounds
  if (tournament.currentRound >= tournament.maxRounds - 1) {
    const currentRound = tournament.rounds[tournament.currentRound];
    const allCompleted = currentRound.every((match) => match.completed);

    if (allCompleted) {
      tournament.completed = true;

      // For two-player mode, only show scoreboard after all rounds are complete
      if (tournament.isTwoPlayerMode) {
        if (tournament.currentRound === tournament.maxRounds - 1) {
          setTimeout(() => {
            showScoreboard();
          }, 500);
        }
      } else {
        setTimeout(() => {
          showScoreboard();
        }, 500);
      }
    }
  }
}

// Add function to show the scoreboard
function showScoreboard() {
  // Generate the scoreboard HTML
  const scoreboardHTML = generateScoreboardHTML();
  elements.scoreboard.innerHTML = scoreboardHTML;

  // Set up toggle button event listeners
  setupToggleButtons();

  // Hide tournament view and show scoreboard
  elements.tournamentView.classList.add("hidden");
  elements.scoreboardPanel.classList.remove("hidden");
  elements.scoreboardPanel.classList.add("fade-in");
}

// Function to set up toggle buttons after scoreboard is rendered
function setupToggleButtons() {
  const toggleButtons = elements.scoreboard.querySelectorAll(
    ".toggle-details-btn"
  );
  toggleButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const playerId = button.getAttribute("data-player-id");
      togglePlayerDetails(playerId, button);
      e.stopPropagation(); // Prevent event bubbling
    });
  });
}

function hideScoreboard() {
  elements.scoreboardPanel.classList.add("hidden");
  elements.tournamentView.classList.remove("hidden");
}

// Function to toggle player details visibility
function togglePlayerDetails(playerId, button) {
  const detailsRow = document.getElementById(playerId + "-details");
  const icon = button.querySelector("i");

  if (detailsRow.style.display === "none") {
    detailsRow.style.display = "table-row";
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  } else {
    detailsRow.style.display = "none";
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  }
}

// Generate the HTML for the scoreboard with collapsible player details
function generateScoreboardHTML() {
  // Convert player scores to an array for sorting
  const playerScores = Object.entries(tournament.playerScores).map(
    ([name, stats]) => ({
      name,
      ...stats,
    })
  );

  // Sort by score (descending)
  playerScores.sort((a, b) => b.score - a.score);

  // Create the table HTML
  let html = `
        <table class="scoreboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
    `;

  // Add each player row with collapsible details
  playerScores.forEach((player, index) => {
    const rankClass = index < 3 ? `player-rank-${index + 1}` : "";
    const hasSolveTimes = player.solveTimes && player.solveTimes.length > 0;

    // Calculate total solve time if available
    let totalTime = 0;
    let totalTimeFormatted = "00:00";

    if (hasSolveTimes) {
      totalTime = player.solveTimes.reduce((sum, time) => sum + time.time, 0);
      totalTimeFormatted = formatTime(totalTime);
    }

    // Main player row with toggle button
    html += `
            <tr class="${rankClass}">
                <td>${index + 1}</td>
                <td class="player-name-cell">
                    <div class="player-name-with-toggle">
                        ${player.name}
                        ${
                          hasSolveTimes
                            ? `<button class="toggle-details-btn" data-player-id="player-${index}">
                                <i class="fas fa-chevron-down"></i>
                            </button>`
                            : ""
                        }
                    </div>
                </td>
                <td class="score-win">${player.wins}</td>
                <td class="score-loss">${player.losses}</td>
                <td>${player.score}</td>
            </tr>
        `;

    // Collapsible details row
    if (hasSolveTimes) {
      html += `
                <tr class="player-details-row" id="player-${index}-details" style="display: none;">
                    <td colspan="5">
                        <div class="player-details-content">
                            <div class="total-time-summary">
                                <strong>Total Solve Time:</strong> ${totalTimeFormatted}
                            </div>
                            <table class="solve-times-table">
                                <thead>
                                    <tr>
                                        <th>Round</th>
                                        <th>Problem</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;

      // Add each solve time
      player.solveTimes.forEach((solveTime) => {
        const problemId = solveTime.problem.split("_");
        const problemDisplay = `${problemId[0].toUpperCase()} ${problemId[1].toUpperCase()}`;

        html += `
                    <tr>
                        <td>${solveTime.round}</td>
                        <td>${problemDisplay}</td>
                        <td>${solveTime.timeFormatted}</td>
                    </tr>
                `;
      });

      // Add average solve time
      const avgTime = Math.floor(totalTime / player.solveTimes.length);

      html += `
                                    <tr class="avg-time">
                                        <td colspan="2">Average Solve Time:</td>
                                        <td>${formatTime(avgTime)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            `;
    }
  });

  html += `
            </tbody>
        </table>
    `;

  return html;
}

// Helper Functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// function showMessage(message, type = "info") {
//   elements.modalTitle.textContent =
//     type.charAt(0).toUpperCase() + type.slice(1);
//   elements.modalBody.textContent = message;

//   // Hide cancel button for info/warning messages
//   if (type === "info" || type === "warning") {
//     elements.modalCancel.classList.add("hidden");
//   } else {
//     elements.modalCancel.classList.remove("hidden");
//   }

//   elements.modal.classList.remove("hidden");
// }
// Update the showMessage function to handle cleanup better
function showMessage(message, type = "info") {
  elements.modalTitle.textContent =
    type.charAt(0).toUpperCase() + type.slice(1);
  elements.modalBody.textContent = message;

  // Remove any existing event listeners by cloning the buttons
  const oldConfirm = elements.modalConfirm;
  const newConfirm = oldConfirm.cloneNode(true);
  oldConfirm.parentNode.replaceChild(newConfirm, oldConfirm);
  elements.modalConfirm = newConfirm;

  const oldCancel = elements.modalCancel;
  const newCancel = oldCancel.cloneNode(true);
  oldCancel.parentNode.replaceChild(newCancel, oldCancel);
  elements.modalCancel = newCancel;

  // Hide cancel button for info/warning messages
  if (type === "info" || type === "warning" || type === "error") {
    elements.modalCancel.classList.add("hidden");
    // For simple messages, just hide modal on OK click
    elements.modalConfirm.addEventListener("click", hideModal, { once: true });
  } else {
    elements.modalCancel.classList.remove("hidden");
    // For confirm dialogs, the caller will handle the confirm action
    elements.modalCancel.addEventListener("click", hideModal, { once: true });
  }

  elements.modal.classList.remove("hidden");
}

function hideModal() {
  elements.modal.classList.add("hidden");
}

// function confirmNewTournament() {
//   showMessage(
//     "Start a new tournament? All current progress will be lost.",
//     "confirm"
//   );

//   elements.modalConfirm.addEventListener(
//     "click",
//     function newTournamentHandler() {
//       resetTournament();
//       hideModal();
//       elements.modalConfirm.removeEventListener("click", newTournamentHandler);
//     },
//     {
//       once: true,
//     }
//   );
// }

// Update resetTournament function to reset player data structure
// Update confirmNewTournament to use the new pattern
function confirmNewTournament() {
  showMessage(
    "Start a new tournament? All current progress will be lost.",
    "confirm"
  );

  // Add listener to the newly cloned button
  elements.modalConfirm.addEventListener(
    "click",
    function () {
      resetTournament();
      hideModal();
    },
    { once: true }
  );
}

function resetTournament() {
  // Reset tournament state
  tournament.name = "";
  tournament.players = [];
  tournament.rounds = [];
  tournament.currentRound = 0;
  tournament.winners = [];
  tournament.losers = [];
  tournament.activeMatch = null;
  tournament.activeTimer = null;
  tournament.activeStartTime = null;
  tournament.maxRounds = 3;
  tournament.playerScores = {};
  tournament.completed = false;
  tournament.allProblems = [];
  tournament.isTwoPlayerMode = false;
  tournament.difficultySettings = {
    mode: "default",
    roundDifficulties: [],
  };

  // Stop any active timer
  if (tournament.activeTimer) {
    clearInterval(tournament.activeTimer);
  }

  // Reset UI
  elements.tournamentView.classList.add("hidden");
  elements.matchPanel.classList.add("hidden");
  elements.scoreboardPanel.classList.add("hidden");
  elements.setupPanel.classList.remove("hidden");
  elements.tournamentNameInput.value = "";
  elements.playerInput.value = "";
  elements.atcoderIdInput.value = "";
  elements.roundsInput.value = "3";

  // Reset difficulty selection
  document.getElementById("difficulty-default").checked = true;
  elements.customDifficultyContainer.classList.add("hidden");

  updatePlayersList();
}

function saveTournament() {
  const tournamentData = JSON.stringify(tournament);

  try {
    localStorage.setItem("knockout-tournament", tournamentData);
    showMessage("Tournament saved successfully!", "info");
  } catch (e) {
    showMessage("Failed to save tournament", "warning");
    console.error("Save error:", e);
  }
}

// function loadSavedTournament() {
//   try {
//     const savedData = localStorage.getItem("knockout-tournament");

//     if (savedData) {
//       const savedTournament = JSON.parse(savedData);

//       // Confirm before loading
//       showMessage("Load saved tournament?", "confirm");

//       elements.modalConfirm.addEventListener(
//         "click",
//         function loadHandler() {
//           // Copy saved data to tournament state
//           Object.assign(tournament, savedTournament);

//           // Update UI
//           elements.tournamentNameInput.value = tournament.name;
//           elements.tournamentTitle.textContent = tournament.name;
//           updatePlayersList();
//           updateRoundDisplay();

//           // Show tournament view if rounds exist
//           if (tournament.rounds.length > 0) {
//             elements.setupPanel.classList.add("hidden");
//             elements.tournamentView.classList.remove("hidden");
//             renderBracket();
//           }

//           hideModal();
//           elements.modalConfirm.removeEventListener("click", loadHandler);
//         },
//         {
//           once: true,
//         }
//       );
//     }
//   } catch (e) {
//     console.error("Load error:", e);
//   }
// }

// Start the match timer
// Start the match timer based on the match's start time
// Update loadSavedTournament to properly hide modal
function loadSavedTournament() {
  try {
    const savedData = localStorage.getItem("knockout-tournament");

    if (savedData) {
      const savedTournament = JSON.parse(savedData);

      // Confirm before loading
      showMessage("Load saved tournament?", "confirm");

      elements.modalConfirm.addEventListener(
        "click",
        function () {
          // Copy saved data to tournament state
          Object.assign(tournament, savedTournament);

          // Update UI
          elements.tournamentNameInput.value = tournament.name;
          elements.tournamentTitle.textContent = tournament.name;
          updatePlayersList();
          updateRoundDisplay();

          // Show tournament view if rounds exist
          if (tournament.rounds.length > 0) {
            elements.setupPanel.classList.add("hidden");
            elements.tournamentView.classList.remove("hidden");
            renderBracket();
          }

          hideModal();
        },
        { once: true }
      );
    }
  } catch (e) {
    console.error("Load error:", e);
    showMessage("Failed to load saved tournament", "error");
  }
}

function startMatchTimer(timerElement, match) {
  // Clear any existing timer
  if (tournament.activeTimer) {
    clearInterval(tournament.activeTimer);
  }

  // Start a new timer that updates every second based on the match's actual start time
  tournament.activeTimer = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - match.startTime) / 1000);
    timerElement.textContent = `Time: ${formatTime(elapsedSeconds)}`;
  }, 1000);
}

// Format time as MM:SS
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus(); // Check authentication status first
  setupEventListeners();
  populatePlayerDataLists();
  updatePlayersList();
  updateCustomDifficultyInputs();

  // Check for saved tournament
  if (localStorage.getItem("knockout-tournament")) {
    loadSavedTournament();
  }
});
