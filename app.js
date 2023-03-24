const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// get players API
app.get("/players/", async (request, response) => {
  const dbPlayersQuery = `
    select * from cricket_team;`;
  const playersArray = await db.all(dbPlayersQuery);
  const convertDbToResponseObject = (dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  };
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbToResponseObject(eachPlayer);
    )
  );
});

module.exports = app.js;

// add player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team
    (playerName,jerseyNumber,role)
    VALUES (${playerName},${jerseyNumber},${role});`;
  const insertedPlayer = await db.run(addPlayerQuery);
  const playerId = insertedPlayer.lastID;
  response.send(`Player ${PlayerId} Added to Team`);
});

// get player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerID } = request.params;
  const dbQuery = `select * from cricket_team
  where playerID=${playerId};`;
  const getPlayer = await db.get(dbQuery);
  response.send(getPlayer);
});

// put player api
app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playersDetails = request.body;
  const { playerName, jerseyNumber, role } = playersDetails;
  const updateQuery = `UPDATE cricket_team SET 
    playerName=${playerName},
    jerseyNumber=${jerseyNumber},
    role= ${role}
    where playerId=${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

// delete player api
app.DELETE("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const deleteQuery = `DELETE FROM cricket_team
    WHERE playerId=${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
