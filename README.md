# Gaming Service
Implementing a service that keeps track of the top scores of players.

### Functional Requirements
1. Creating new players
2. Creating a new game with a defining count of players.
3. Scheduling a cron job which runs every 2 hours. It is responsible for updating each player with his/her new total score by fetching new games created in the last 2 hours.


### Entities
1. Player
```
{
    "_id": {
        "$oid": "663eea5cb80c4e665f1f0e7e"
    },
    "name": "MJ",
    "email": "mj@gmail.com",
    "createdAt": {
        "$date": {
            "$numberLong": "1715399260976"
        }
    },
    "updatedAt": {
        "$date": {
            "$numberLong": "1715399260976"
        }
    },
    "__v": {
        "$numberInt": "0"
    }
}
```

2. Game
```
{
    "_id": {
        "$oid": "663f7a6c9ebd0c2ab88f7353"
    },
    "players": {
        "$numberInt": "4"
    },
    "playerScores": [
        {
            "name": "MJ",
            "playerId": {
                "$oid": "663eea5cb80c4e665f1f0e7e"
            },
            "score": {
                "$numberInt": "50"
            }
        },
        {
            "name": "Sherlock Holmes",
            "playerId": {
                "$oid": "663eed4688a438d73da53e0b"
            },
            "score": {
                "$numberInt": "13"
            }
        },
        {
            "name": "Hermoine Granger",
            "playerId": {
                "$oid": "663eecfb88a438d73da53df8"
            },
            "score": {
                "$numberInt": "79"
            }
        },
        {
            "name": "Sky Vashist",
            "playerId": {
                "$oid": "663eede8cb8dcf860d057eaf"
            },
            "score": {
                "$numberInt": "78"
            }
        }
    ],
    "createdAt": {
        "$date": {
            "$numberLong": "1715436140268"
        }
    },
    "updatedAt": {
        "$date": {
            "$numberLong": "1715436140268"
        }
    },
    "__v": {
        "$numberInt": "0"
    }
}
```
3. PlayerGameMapping
```
{
    "_id": {
        "$oid": "663f7e241dbf552e7f3b0c19"
    },
    "player": {
        "$oid": "663eedf9cb8dcf860d057eb2"
    },
    "playerName": "Lily Luna Potter",
    "gameScores": [
        {
            "gameId": "663f7dea1dbf552e7f3b0be4",
            "score": {
                "$numberInt": "18"
            }
        },
        {
            "gameId": "663f7e6f1dbf552e7f3b0c48",
            "score": {
                "$numberInt": "4"
            }
        },
        {
            "gameId": "663f7ecebf7c3a55cf70e581",
            "score": {
                "$numberInt": "72"
            }
        }
    ],
    "totalGames": {
        "$numberInt": "3"
    },
    "totalScore": {
        "$numberInt": "94"
    },
    "createdAt": {
        "$date": {
            "$numberLong": "1715437092292"
        }
    },
    "updatedAt": {
        "$date": {
            "$numberLong": "1715437692249"
        }
    },
    "__v": {
        "$numberInt": "0"
    }
}
```

### API Design
1. Create a player:
```
POST '/players'
HEADER 'Content-Type: application/json'
BODY '{
    "name":"JK Rowling",
    "email":"jkr@gmail.com"
}'
RESPONSE
{
    "data": {
        "player": {
            "name": "JK Rowling",
            "email": "jkr@gmail.com"
        }
    }
}
```

2. Get all players:
```
GET '/players/all'
RESPONSE
{
    "data": {
        "count": 2,
        "players": [
            {
                "name": "Lily Luna Potter",
                "email": "llp@gmail.com"
            },
            {
                "name": "Barack Obama",
                "email": "obama@gmail.com"
            },
           
        ]
    }
}
```

3. Create a game:
```
POST '/games'
HEADER'Content-Type: application/json' 
BODY '{
    "count": 2
}'
RESPONSE
{
    "responseData": {
        "count": 2,
        "playerScores": [
            {
                "name": "John Doe",
                "score": 16
            },
            {
                "name": "Rose Weasley",
                "score": 30
            }
        ]
    }
}
```

4. Get all games:
```
GET '/games/all'
RESPONSE
{
    "data": {
        "count": 1,
        "responseData": [
            {
                "noOfPlayers": 2,
                "playerScore": [
                    {
                        "name": "MJ",
                        "score": 50
                    },
                    {
                        "name": "Sherlock Holmes",
                        "score": 13
                    }
                ]
            }
        ]
    }
}
```

4. Compute latest scores of players from new games created:
```
GET '/games/recalibrate'
RESPONSE
{
    "data": {
        "count": 1,
        "responseData": [
            {
                "playerName": "John Doe",
                "totalScore": 167,
                "totalGames": 3,
                "gameScores": [
                    {
                        "score": 99
                    },
                    {
                        "score": 52
                    },
                    {
                        "score": 16
                    }
                ]
            },
            {
                "playerName": "Rose Weasley",
                "totalScore": 370,
                "totalGames": 6,
                "gameScores": [
                    {
                        "score": 53
                    },
                    {
                        "score": 93
                    },
                ]
            }
        ]
    }
}
```

4. Get top players with highest scores
```
GET '/games/recalibrate/top-players?limit=2'
RESPONSE
{
    "data": {
        "playerGameMapping": [
            {
                "playerName": "Albus Potter",
                "totalGames": 8,
                "totalScore": 488
            },
            {
                "playerName": "JK Rowling",
                "totalGames": 9,
                "totalScore": 428
            }
        ]
    }
}
```

### Flowchart
<img width="1362" alt="Screenshot 2024-05-12 at 9 16 36 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/99d30718-2bd5-49d1-9983-5d338990f839">


### Current Architecture
<img width="861" alt="Screenshot 2024-05-12 at 10 15 34 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/0d4f0c44-a3e4-47a2-8419-4a5039dc9304">


### Future improvements in the Current Architecture
<img width="1201" alt="Screenshot 2024-05-12 at 10 12 01 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/7b32d27c-52f7-4fe6-bdc1-ae038cb2ecc9">


### Testing 

1. Create a player
<img width="624" alt="Screenshot 2024-05-12 at 10 55 06 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/dad4dbff-7b2e-4b23-9c8c-acc8461a3abc">
<br/>
<br/>
2. Create a game
<img width="1080" alt="Screenshot 2024-05-12 at 10 57 06 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/92557d92-61fc-4fe1-83d0-97e20cdf8883">
<br/>
<br/>
3. Scheduler running in the background
<br/>
<img width="717" alt="Screenshot 2024-05-12 at 10 57 31 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/da1e2a0c-cba5-45ee-96c5-65edec5200f3">
<br/>
<br/>
<img width="756" alt="Screenshot 2024-05-12 at 10 59 10 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/c38f011e-4c64-407c-8ccb-df314b8243a8">
<br/>
<br/>
4. Displaying the top 5 players on UI
<br/>
<img width="880" alt="Screenshot 2024-05-12 at 11 00 01 AM" src="https://github.com/JainManjari/GameScheduler/assets/54873596/17bbc595-7a6e-4d79-b904-9553aa3de375">
<br/>


## Running project

1. git clone https://github.com/JainManjari/GameScheduler.git
2. npm install
3. npm start
4. Open browser and go to http://localhost:8000