document.addEventListener("DOMContentLoaded", () => {
    const draftBoardTable = document.querySelector("#draftBoardTable");
    const queueTab = document.querySelector("#queueItems");
    const playerStatsTable = document.querySelector("#playerStatsTable");
  
    const tabs = document.querySelectorAll(".tab-button");
    const tabPanes = document.querySelectorAll(".tab-pane");
  
    const queue = [];
    let currentPick = 1;
    const teams = 12;
    const rounds = 15;
  
    // Populate Draft Board with rounds and teams
    for (let round = 1; round <= rounds; round++) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-4 border">${round}</td>
        ${Array.from({ length: teams }).map(() => `<td class="p-4 border"></td>`).join("")}
      `;
      draftBoardTable.appendChild(row);
    }
  
    // Example Available Players Data
    const players = [
      { name: "Christian McCaffrey", position: "RB", team: "SF", adp: 1.5, bye: 9 },
      { name: "Justin Jefferson", position: "WR", team: "MIN", adp: 2.0, bye: 7 },
      { name: "Travis Kelce", position: "TE", team: "KC", adp: 1.8, bye: 10 },
    ];
  
    // Populate Available Players Table
    players.forEach((player) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-4 border">
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 draft-player">
            Draft
          </button>
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 queue-player">
            Queue
          </button>
        </td>
        <td class="p-4 border">
          ${player.name} ${player.position} ${player.team} (${player.bye})
        </td>
      `;
      playerStatsTable.appendChild(row);
    });
  
    // Draft Player Functionality
    playerStatsTable.addEventListener("click", (event) => {
      if (event.target.classList.contains("draft-player")) {
        const row = event.target.closest("tr");
        const playerDetails = row.children[1].textContent.trim();
  
        const round = Math.ceil(currentPick / teams);
        const team = currentPick % teams === 0 ? teams : currentPick % teams;
  
        const roundRow = draftBoardTable.querySelector(`tr:nth-child(${round})`);
        const teamCell =
          round % 2 === 1
            ? roundRow.children[team]
            : roundRow.children[teams + 1 - team];
  
        if (teamCell.textContent.trim() === "") {
          teamCell.textContent = playerDetails;
  
          row.remove();
  
          const queueItem = [...queueTab.children].find(
            (item) => item.querySelector(".queue-player-name")?.textContent === playerDetails
          );
          if (queueItem) {
            queueItem.remove();
            queue.splice(queue.indexOf(playerDetails), 1);
          }
  
          currentPick++;
        }
      }
  
      if (event.target.classList.contains("queue-player")) {
        const row = event.target.closest("tr");
        const playerDetails = row.children[1].textContent.trim();
  
        if (queue.includes(playerDetails)) {
          alert(`${playerDetails} is already in the queue.`);
          return;
        }
  
        queue.push(playerDetails);
        const queueItem = document.createElement("div");
        queueItem.classList.add("flex", "justify-between", "items-center", "p-2", "border-b", "border-gray-600");
        queueItem.innerHTML = `
          <span class="queue-player-name">${playerDetails}</span>
          <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 remove-queue">
            Remove
          </button>
        `;
        queueTab.appendChild(queueItem);
      }
    });
  
    // Remove Player from Queue
    queueTab.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-queue")) {
        const queueItem = event.target.closest("div");
        const playerDetails = queueItem.querySelector(".queue-player-name").textContent.trim();
  
        queue.splice(queue.indexOf(playerDetails), 1);
        queueItem.remove();
      }
    });
  
    // Tab Switching Functionality
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabPanes.forEach((pane) => pane.classList.add("hidden"));
  
        const activePane = document.querySelector(`#${tab.dataset.tab}`);
        activePane.classList.remove("hidden");
  
        tabs.forEach((t) => t.classList.remove("bg-gray-600"));
        tab.classList.add("bg-gray-600");
      });
    });
  });
  