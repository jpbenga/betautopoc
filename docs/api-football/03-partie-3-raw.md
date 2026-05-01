Statistics
Get players statistics.

This endpoint returns the players for whom the profile and statistics data are available. Note that it is possible that a player has statistics for 2 teams in the same season in case of transfers.

The statistics are calculated according to the team id, league id and season.

You can find the available seasons by using the endpoint players/seasons.

To get the squads of the teams it is better to use the endpoint players/squads.

The players id are unique in the API and players keep it among all the teams they have been in.

In this endpoint you have the rating field, which is the rating of the player according to a match or a season. This data is calculated according to the performance of the player in relation to the other players of the game or the season who occupy the same position (Attacker, defender, goal...). There are different algorithms that take into account the position of the player and assign points according to his performance.

To get the photo of a player you have to call the following url: https://media.api-sports.io/football/players/{player_id}.png

This endpoint uses a pagination system, you can navigate between the different pages with to the page parameter.

Pagination : 20 results per page.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

Tutorials :

HOW TO GET ALL TEAMS AND PLAYERS FROM A LEAGUE ID
query Parameters
id	
integer
The id of the player

team	
integer
The id of the team

league	
integer
The id of the league

season	
integer = 4 characters YYYY | Requires the fields Id, League or Team...
The season of the league

search	
string >= 4 characters Requires the fields League or Team
The name of the player

page	
integer
Default: 1
Use for the pagination

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all players statistics from one player {id} & {season}
get("https://v3.football.api-sports.io/players?id=19088&season=2018");

// Get all players statistics from one {team} & {season}
get("https://v3.football.api-sports.io/players?season=2018&team=33");
get("https://v3.football.api-sports.io/players?season=2018&team=33&page=2");

// Get all players statistics from one {league} & {season}
get("https://v3.football.api-sports.io/players?season=2018&league=61");
get("https://v3.football.api-sports.io/players?season=2018&league=61&page=4");

// Get all players statistics from one {league}, {team} & {season}
get("https://v3.football.api-sports.io/players?season=2018&league=61&team=33");
get("https://v3.football.api-sports.io/players?season=2018&league=61&team=33&page=5");

// Allows you to search for a player in relation to a player {name}
get("https://v3.football.api-sports.io/players?team=85&search=cavani");
get("https://v3.football.api-sports.io/players?league=61&search=cavani");
get("https://v3.football.api-sports.io/players?team=85&search=cavani&season=2018");

Squads
Return the current squad of a team when the team parameter is used. When the player parameter is used the endpoint returns the set of teams associated with the player.

The response format is the same regardless of the parameter sent.

This endpoint requires at least one parameter.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per week.

query Parameters
team	
integer
The id of the team

player	
integer
The id of the player

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all players from one {team}
get("https://v3.football.api-sports.io/players/squads?team=33");

// Get all teams from one {player}
get("https://v3.football.api-sports.io/players/squads?player=276");

eams
Returns the list of teams and seasons in which the player played during his career.

This endpoint requires at least one parameter.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per week.

query Parameters
player
required
integer
The id of the player

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all teams from one {player}
get("https://v3.football.api-sports.io/players/teams?player=276");

Top Scorers
Get the 20 best players for a league or cup.

How it is calculated:

1 : The player that has scored the higher number of goals
2 : The player that has scored the fewer number of penalties
3 : The player that has delivered the higher number of goal assists
4 : The player that scored their goals in the higher number of matches
5 : The player that played the fewer minutes
6 : The player that plays for the team placed higher on the table
7 : The player that received the fewer number of red cards
8 : The player that received the fewer number of yellow cards
Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
league
required
integer
The id of the league

season
required
integer = 4 characters YYYY
The season of the league

header Parameters
x-apisports-key
required
string
Your Api-Key
fetch("https://v3.football.api-sports.io/players/topscorers?season=2018&league=61", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});

Top Assists
Get the 20 best players assists for a league or cup.

How it is calculated:

1 : The player that has delivered the higher number of goal assists
2 : The player that has scored the higher number of goals
3 : The player that has scored the fewer number of penalties
4 : The player that assists in the higher number of matches
5 : The player that played the fewer minutes
6 : The player that received the fewer number of red cards
7 : The player that received the fewer number of yellow cards
Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
league
required
integer
The id of the league

season
required
integer = 4 characters YYYY
The season of the league

header Parameters
x-apisports-key
required
string
Your Api-Key

fetch("https://v3.football.api-sports.io/players/topassists?season=2020&league=61", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});

Top Yellow Cards
Get the 20 players with the most yellow cards for a league or cup.

How it is calculated:

1 : The player that received the higher number of yellow cards
2 : The player that received the higher number of red cards
3 : The player that assists in the higher number of matches
4 : The player that played the fewer minutes
Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
league
required
integer
The id of the league

season
required
integer = 4 characters YYYY
The season of the league

header Parameters
x-apisports-key
required
string
Your Api-Key

fetch("https://v3.football.api-sports.io/players/topyellowcards?season=2020&league=61", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});

Top Red Cards
Get the 20 players with the most red cards for a league or cup.

How it is calculated:

1 : The player that received the higher number of red cards
2 : The player that received the higher number of yellow cards
3 : The player that assists in the higher number of matches
4 : The player that played the fewer minutes
Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
league
required
integer
The id of the league

season
required
integer = 4 characters YYYY
The season of the league

header Parameters
x-apisports-key
required
string
Your Api-Key

fetch("https://v3.football.api-sports.io/players/topredcards?season=2020&league=61", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});

Transfers
Get all available transfers for players and teams

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
player	
integer
The id of the player

team	
integer
The id of the team

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all transfers from one {player}
get("https://v3.football.api-sports.io/transfers?player=35845");

// Get all transfers from one {team}
get("https://v3.football.api-sports.io/transfers?team=463");

Trophies
Get all available trophies for a player or a coach.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
player	
integer
The id of the player

players	
stringMaximum of 20 players ids
Value: "id-id-id"
One or more players ids

coach	
integer
The id of the coach

coachs	
stringMaximum of 20 coachs ids
Value: "id-id-id"
One or more coachs ids

header Parameters
x-apisports-key
required
string
Your Api-Key
// Get all trophies from one {player}
get("https://v3.football.api-sports.io/trophies?player=276");

// Get all trophies from several {player} ids
get("https://v3.football.api-sports.io/trophies?players=276-278");

// Get all trophies from one {coach}
get("https://v3.football.api-sports.io/trophies?coach=2");

// Get all trophies from several {coach} ids
get("https://v3.football.api-sports.io/trophies?coachs=2-6");

Sidelined
Get all available sidelined for a player or a coach.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
player	
integer
The id of the player

players	
stringMaximum of 20 players ids
Value: "id-id-id"
One or more players ids

coach	
integer
The id of the coach

coachs	
stringMaximum of 20 coachs ids
Value: "id-id-id"
One or more coachs ids

header Parameters
x-apisports-key
required
string
Your Api-Key
// Get all from one {player}
get("https://v3.football.api-sports.io/sidelined?player=276");

// Get all from several {player} ids
get("https://v3.football.api-sports.io/sidelined?players=276-278-279-280-281-282");

// Get all from one {coach}
get("https://v3.football.api-sports.io/sidelined?coach=2");

// Get all from several {coach} ids
get("https://v3.football.api-sports.io/sidelined?coachs=2-6-44-77-54-52");

odds/live
This endpoint returns in-play odds for fixtures in progress.

Fixtures are added between 15 and 5 minutes before the start of the fixture. Once the fixture is over they are removed from the endpoint between 5 and 20 minutes. No history is stored. So fixtures that are about to start, fixtures in progress and fixtures that have just ended are available in this endpoint.

Update Frequency : This endpoint is updated every 5 seconds.*

* This value can change in the range of 5 to 60 seconds

INFORMATIONS ABOUT STATUS

"status": {
    "stopped": false, // True if the fixture is stopped by the referee for X reason
    "blocked": false, // True if bets on this fixture are temporarily blocked
    "finished": false // True if the fixture has not started or if it is finished
},
INFORMATIONS ABOUT VALUES

When several identical values exist for the same bet the main field is set to True for the bet being considered, the others will have the value False.

The main field will be set to True only if several identical values exist for the same bet.

When a value is unique for a bet the main value will always be False or null.

Example below :

"id": 36,
"name": "Over/Under Line",
"values": [
    {
        "value": "Over",
        "odd": "1.975",
        "handicap": "2",
        "main": true, // Bet to consider
        "suspended": false // True if this bet is temporarily suspended
    },
    {
        "value": "Over",
        "odd": "3.45",
        "handicap": "2",
        "main": false, // Bet to no consider
        "suspended": false
    },
]
query Parameters
fixture	
integer
The id of the fixture

league	
integer (In this endpoint the "season" parameter is ...Show pattern
The id of the league

bet	
integer
The id of the bet

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available odds
get("https://v3.football.api-sports.io/odds/live");

// Get all available odds from one {fixture}
get("https://v3.football.api-sports.io/odds/live?fixture=164327");

// Get all available odds from one {league}
get("https://v3.football.api-sports.io/odds/live?league=39");

// It’s possible to make requests by mixing the available parameters
get("https://v3.football.api-sports.io/odds/live?bet=4&league=39");
get("https://v3.football.api-sports.io/odds/live?bet=4&fixture=164327");

odds/live/bets
Get all available bets for in-play odds.

All bets id can be used in endpoint odds/live as filters, but are not compatible with endpoint odds for pre-match odds.

Update Frequency : This endpoint is updated every 60 seconds.

query Parameters
id	
string
The id of the bet name

search	
string = 3 characters
The name of the bet

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available bets
get("https://v3.football.api-sports.io/odds/live/bets");

// Get bet from one {id}
get("https://v3.football.api-sports.io/odds/live/bets?id=1");

// Allows you to search for a bet in relation to a bets {name}
get("https://v3.football.api-sports.io/odds/live/bets?search=winner");

Odds
Get odds from fixtures, leagues or date.

This endpoint uses a pagination system, you can navigate between the different pages with to the page parameter.

Pagination : 10 results per page.

We provide pre-match odds between 1 and 14 days before the fixture.

We keep a 7-days history (The availability of odds may vary according to the leagues, seasons, fixtures and bookmakers)

Update Frequency : This endpoint is updated every 3 hours.

Recommended Calls : 1 call every 3 hours.

query Parameters
fixture	
integer
The id of the fixture

league	
integer
The id of the league

season	
integer = 4 characters YYYY
The season of the league

date	
stringYYYY-MM-DD
A valid date

timezone	
string
A valid timezone from the endpoint Timezone

page	
integer
Default: 1
Use for the pagination

bookmaker	
integer
The id of the bookmaker

bet	
integer
The id of the bet

header Parameters
x-apisports-key
required
string
Your Api-Key
// Get all available odds from one {fixture}
get("https://v3.football.api-sports.io/odds?fixture=164327");

// Get all available odds from one {league} & {season}
get("https://v3.football.api-sports.io/odds?league=39&season=2019");

// Get all available odds from one {date}
get("https://v3.football.api-sports.io/odds?date=2020-05-15");

// It’s possible to make requests by mixing the available parameters
get("https://v3.football.api-sports.io/odds?bookmaker=1&bet=4&league=39&season=2019");
get("https://v3.football.api-sports.io/odds?bet=4&fixture=164327");
get("https://v3.football.api-sports.io/odds?bookmaker=1&league=39&season=2019");
get("https://v3.football.api-sports.io/odds?date=2020-05-15&page=2&bet=4");

Mapping
Get the list of available fixtures id for the endpoint odds.

All fixtures, leagues id and date can be used in endpoint odds as filters.

This endpoint uses a pagination system, you can navigate between the different pages with to the page parameter.

Pagination : 100 results per page.

Update Frequency : This endpoint is updated every day.

Recommended Calls : 1 call per day.

query Parameters
page	
integer
Default: 1
Use for the pagination

header Parameters
x-apisports-key
required
string
Your Api-Key
fetch("https://v3.football.api-sports.io/odds/mapping", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});

Bookmakers
Get all available bookmakers.

All bookmakers id can be used in endpoint odds as filters.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
id	
integer
The id of the bookmaker

search	
string = 3 characters
The name of the bookmaker

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available bookmakers
get("https://v3.football.api-sports.io/odds/bookmakers");

// Get bookmaker from one {id}
get("https://v3.football.api-sports.io/odds/bookmakers?id=1");

// Allows you to search for a bookmaker in relation to a bookmakers {name}
get("https://v3.football.api-sports.io/odds/bookmakers?search=Betfair");
Bets
Get all available bets for pre-match odds.

All bets id can be used in endpoint odds as filters, but are not compatible with endpoint odds/live for in-play odds.

Update Frequency : This endpoint is updated several times a week.

Recommended Calls : 1 call per day.

query Parameters
id	
string
The id of the bet name

search	
string = 3 characters
The name of the bet

header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available bets
get("https://v3.football.api-sports.io/odds/bets");

// Get bet from one {id}
get("https://v3.football.api-sports.io/odds/bets?id=1");

// Allows you to search for a bet in relation to a bets {name}
get("https://v3.football.api-sports.io/odds/bets?search=winner");

la derniere partie