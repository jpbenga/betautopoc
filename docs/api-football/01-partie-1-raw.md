Timezone
Get the list of available timezone to be used in the fixtures endpoint.
This endpoint does not require any parameters.
Update Frequency : This endpoint contains all the existing timezone, it is not updated.
Recommended Calls : 1 call when you need.
header Parameters
x-apisports-key
required
string
Your Api-Key

fetch("https://v3.football.api-sports.io/timezone", {
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

Countries
Get the list of available countries for the leagues endpoint.
The name and code fields can be used in other endpoints as filters.
To get the flag of a country you have to call the following url: https://media.api-sports.io/flags/{country_code}.svg
Examples available in Request samples "Use Cases".
All the parameters of this endpoint can be used together.
Update Frequency : This endpoint is updated each time a new league from a country not covered by the API is added.
Recommended Calls : 1 call per day.
query Parameters
namestring
The name of the country
codestring [ 2 .. 6 ] characters FR, GB-ENG, IT…
The Alpha code of the country
searchstring = 3 characters
The name of the country
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available countries across all {seasons} and competitions
get("https://v3.football.api-sports.io/countries");

// Get all available countries from one country {name}
get("https://v3.football.api-sports.io/countries?name=england");

// Get all available countries from one country {code}
get("https://v3.football.api-sports.io/countries?code=fr");

// Allows you to search for a countries in relation to a country {name}
get("https://v3.football.api-sports.io/countries?search=engl");

Leagues
Get the list of available leagues and cups.
The league id are unique in the API and leagues keep it across all seasons
To get the logo of a competition you have to call the following url: https://media.api-sports.io/football/leagues/{league_id}.png
This endpoint also returns the coverage of each competition, which makes it possible to know what is available for that league or cup.
The values returned by the coverage indicate the data available at the moment you call the API, so for a competition that has not yet started, it is normal to have all the features set to False. This will be updated once the competition has started.
You can find all the leagues ids on our Dashboard.
Example :

"coverage": {
  "fixtures": {
      "events": true,
      "lineups": true,
      "statistics_fixtures": false,
      "statistics_players": false
  },
  "standings": true,
  "players": true,
  "top_scorers": true,
  "top_assists": true,
  "top_cards": true,
  "injuries": true,
  "predictions": true,
  "odds": false}
In this example we can deduce that the competition does not have the following features: statistics_fixtures, statistics_players, odds because it is set to False.
The coverage of a competition can vary from season to season and values set to True do not guarantee 100% data availability.
Some competitions, such as the friendlies, are exceptions to the coverage indicated in the leagues endpoint, and the data available may differ depending on the match, including livescore, events, lineups, statistics and players.
Competitions are automatically renewed by the API when a new season is available. There may be a delay between the announcement of the official calendar and the availability of data in the API.
For Cup competitions, fixtures are automatically added when the two participating teams are known. For example if the current phase is the 8th final, the quarter final will be added once the teams playing this phase are known.
Examples available in Request samples "Use Cases".
Most of the parameters of this endpoint can be used together.
Update Frequency : This endpoint is updated several times a day.
Recommended Calls : 1 call per hour.
query Parameters
idinteger
The id of the league
namestring
The name of the league
countrystring
The country name of the league
codestring [ 2 .. 6 ] characters FR, GB-ENG, IT…
The Alpha code of the country
seasoninteger = 4 characters YYYY
The season of the league
teaminteger
The id of the team
typestring
Enum: "league" "cup"
The type of the league
currentstring Return the list of active seasons or the las...Show pattern
Enum: "true" "false"
The state of the league
searchstring >= 3 characters
The name or the country of the league
lastinteger <= 2 characters
The X last leagues/cups added in the API
header Parameters
x-apisports-key
required
string
Your Api-Key

// Allows to retrieve all the seasons available for a league/cup
get("https://v3.football.api-sports.io/leagues?id=39");

// Get all leagues from one league {name}
get("https://v3.football.api-sports.io/leagues?name=premier league");

// Get all leagues from one {country}
// You can find the available {country} by using the endpoint country
get("https://v3.football.api-sports.io/leagues?country=england");

// Get all leagues from one country {code} (GB, FR, IT etc..)
// You can find the available country {code} by using the endpoint country
get("https://v3.football.api-sports.io/leagues?code=gb");

// Get all leagues from one {season}
// You can find the available {season} by using the endpoint seasons
get("https://v3.football.api-sports.io/leagues?season=2019");

// Get one league from one league {id} & {season}
get("https://v3.football.api-sports.io/leagues?season=2019&id=39");

// Get all leagues in which the {team} has played at least one match
get("https://v3.football.api-sports.io/leagues?team=33");

// Allows you to search for a league in relation to a league {name} or {country}
get("https://v3.football.api-sports.io/leagues?search=premier league");
get("https://v3.football.api-sports.io/leagues?search=England");

// Get all leagues from one {type}
get("https://v3.football.api-sports.io/leagues?type=league");

// Get all leagues where the season is in progress or not
get("https://v3.football.api-sports.io/leagues?current=true");

// Get the last 99 leagues or cups added to the API
get("https://v3.football.api-sports.io/leagues?last=99");

// It’s possible to make requests by mixing the available parameters
get("https://v3.football.api-sports.io/leagues?season=2019&country=england&type=league");
get("https://v3.football.api-sports.io/leagues?team=85&season=2019");
get("https://v3.football.api-sports.io/leagues?id=61¤t=true&type=league");

Seasons
Get the list of available seasons.
All seasons are only 4-digit keys, so for a league whose season is 2018-2019 like the English Premier League (EPL), the 2018-2019 season in the API will be 2018.
All seasons can be used in other endpoints as filters.
This endpoint does not require any parameters.
Update Frequency : This endpoint is updated each time a new league is added.
Recommended Calls : 1 call per day.
header Parameters
x-apisports-key
required
string
Your Api-Key

fetch("https://v3.football.api-sports.io/leagues/seasons", {
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


Teams information
Get the list of available teams.
The team id are unique in the API and teams keep it among all the leagues/cups in which they participate.
To get the logo of a team you have to call the following url: https://media.api-sports.io/football/teams/{team_id}.png
You can find all the teams ids on our Dashboard.
Examples available in Request samples "Use Cases".
All the parameters of this endpoint can be used together.
This endpoint requires at least one parameter.
Update Frequency : This endpoint is updated several times a week.
Recommended Calls : 1 call per day.
Tutorials :
HOW TO GET ALL TEAMS AND PLAYERS FROM A LEAGUE ID
query Parameters
idinteger
The id of the team
namestring
The name of the team
leagueinteger
The id of the league
seasoninteger = 4 characters YYYY
The season of the league
countrystring
The country name of the team
codestring = 3 characters
The code of the team
venueinteger
The id of the venue
searchstring >= 3 characters
The name or the country name of the team
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get one team from one team {id}
get("https://v3.football.api-sports.io/teams?id=33");

// Get one team from one team {name}
get("https://v3.football.api-sports.io/teams?name=manchester united");

// Get all teams from one {league} & {season}
get("https://v3.football.api-sports.io/teams?league=39&season=2019");

// Get teams from one team {country}
get("https://v3.football.api-sports.io/teams?country=england");

// Get teams from one team {code}
get("https://v3.football.api-sports.io/teams?code=FRA");

// Get teams from one venue {id}
get("https://v3.football.api-sports.io/teams?venue=789");

// Allows you to search for a team in relation to a team {name} or {country}
get("https://v3.football.api-sports.io/teams?search=manches");
get("https://v3.football.api-sports.io/teams?search=England");

Returns the statistics of a team in relation to a given competition and season.
It is possible to add the date parameter to calculate statistics from the beginning of the season to the given date. By default the API returns the statistics of all games played by the team for the competition and the season.
Update Frequency : This endpoint is updated twice a day.
Recommended Calls : 1 call per day for the teams who have at least one fixture during the day otherwise 1 call per week.
query Parameters
league
required
integer
The id of the league
season
required
integer = 4 characters YYYY
The season of the league
team
required
integer
The id of the team
datestringYYYY-MM-DD
The limit date
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all statistics for a {team} in a {league} & {season}
get("https://v3.football.api-sports.io/teams/statistics?league=39&team=33&season=2019");

//Get all statistics for a {team} in a {league} & {season} with a end {date}
get("https://v3.football.api-sports.io/teams/statistics?league=39&team=33&season=2019&date=2019-10-08");

Teams seasons
Get the list of seasons available for a team.
Examples available in Request samples "Use Cases".
This endpoint requires at least one parameter.
Update Frequency : This endpoint is updated several times a week.
Recommended Calls : 1 call per day.
query Parameters
team
required
integer
The id of the team
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all seasons available for a team from one team {id}
get("https://v3.football.api-sports.io/teams/seasons?team=33");

Teams countries
Get the list of countries available for the teams endpoint.
Update Frequency : This endpoint is updated several times a week.
Recommended Calls : 1 call per day.
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all countries available for the teams endpoints
get("https://v3.football.api-sports.io/teams/countries");

Venues
Get the list of available venues.
The venue id are unique in the API.
To get the image of a venue you have to call the following url: https://media.api-sports.io/football/venues/{venue_id}.png
Examples available in Request samples "Use Cases".
All the parameters of this endpoint can be used together.
This endpoint requires at least one parameter.
Update Frequency : This endpoint is updated several times a week.
Recommended Calls : 1 call per day.
query Parameters
idinteger
The id of the venue
namestring
The name of the venue
citystring
The city of the venue
countrystring
The country name of the venue
searchstring >= 3 characters
The name, city or the country of the venue
header Parameters
x-apisports-key
required
string
Your Api-Key


// Get one venue from venue {id}
get("https://v3.football.api-sports.io/venues?id=556");

// Get one venue from venue {name}
get("https://v3.football.api-sports.io/venues?name=Old Trafford");

// Get all venues from {city}
get("https://v3.football.api-sports.io/venues?city=manchester");

// Get venues from {country}
get("https://v3.football.api-sports.io/venues?country=england");

// Allows you to search for a venues in relation to a venue {name}, {city} or {country}
get("https://v3.football.api-sports.io/venues?search=trafford");
get("https://v3.football.api-sports.io/venues?search=manches");
get("https://v3.football.api-sports.io/venues?search=England");

Standings
Get the standings for a league or a team.
Return a table of one or more rankings according to the league / cup.
Some competitions have several rankings in a year, group phase, opening ranking, closing ranking etc…
Examples available in Request samples "Use Cases".
Most of the parameters of this endpoint can be used together.
Update Frequency : This endpoint is updated every hour.
Recommended Calls : 1 call per hour for the leagues or teams who have at least one fixture in progress otherwise 1 call per day.
Tutorials :
HOW TO GET STANDINGS FOR ALL CURRENT SEASONS
query Parameters
leagueinteger
The id of the league
season
required
integer = 4 characters YYYY
The season of the league
teaminteger
The id of the team
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all Standings from one {league} & {season}
get("https://v3.football.api-sports.io/standings?league=39&season=2019");

// Get all Standings from one {league} & {season} & {team}
get("https://v3.football.api-sports.io/standings?league=39&team=33&season=2019");

// Get all Standings from one {team} & {season}
get("https://v3.football.api-sports.io/standings?team=33&season=2019");

Rounds
Get the rounds for a league or a cup.
The round can be used in endpoint fixtures as filters
Examples available in Request samples "Use Cases".
Update Frequency : This endpoint is updated every day.
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
currentboolean
Enum: "true" "false"
The current round only
datesboolean
Default: false
Enum: "true" "false"
Add the dates of each round in the response
timezonestring
A valid timezone from the endpoint Timezone
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get all available rounds from one {league} & {season}
get("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2019");

// Get all available rounds from one {league} & {season} With the dates of each round
get("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2019&dates=true");

// Get current round from one {league} & {season}
get("https://v3.football.api-sports.io/fixtures/rounds?league=39&season=2019&current=true");

Fixtures
For all requests to fixtures you can add the query parameter timezone to your request in order to retrieve the list of matches in the time zone of your choice like “Europe/London“
To know the list of available time zones you have to use the endpoint timezone.
Available fixtures status

SHORTLONGTYPEDESCRIPTIONTBDTime To Be DefinedScheduledScheduled but date and time are not knownNSNot StartedScheduled1HFirst Half, Kick OffIn PlayFirst half in playHTHalftimeIn PlayFinished in the regular time2HSecond Half, 2nd Half StartedIn PlaySecond half in playETExtra TimeIn PlayExtra time in playBTBreak TimeIn PlayBreak during extra timePPenalty In ProgressIn PlayPenaly played after extra timeSUSPMatch SuspendedIn PlaySuspended by referee's decision, may be rescheduled another dayINTMatch InterruptedIn PlayInterrupted by referee's decision, should resume in a few minutesFTMatch FinishedFinishedFinished in the regular timeAETMatch FinishedFinishedFinished after extra time without going to the penalty shootoutPENMatch FinishedFinishedFinished after the penalty shootoutPSTMatch PostponedPostponedPostponed to another day, once the new date and time is known the status will change to Not StartedCANCMatch CancelledCancelledCancelled, match will not be playedABDMatch AbandonedAbandonedAbandoned for various reasons (Bad Weather, Safety, Floodlights, Playing Staff Or Referees), Can be rescheduled or not, it depends on the competitionAWDTechnical LossNot PlayedWOWalkOverNot PlayedVictory by forfeit or absence of competitorLIVEIn ProgressIn PlayUsed in very rare cases. It indicates a fixture in progress but the data indicating the half-time or elapsed time are not available
Fixtures with the status TBD may indicate an incorrect fixture date or time because the fixture date or time is not yet known or final. Fixtures with this status are checked and updated daily. The same applies to fixtures with the status PST, CANC.
The fixtures ids are unique and specific to each fixture. In no case an ID will change.
Not all competitions have livescore available and only have final result. In this case, the status remains in NS and will be updated in the minutes/hours following the match (this can take up to 48 hours, depending on the competition).
Although the data is updated every 15 seconds, depending on the competition there may be a delay between reality and the availability of data in the API.
Update Frequency : This endpoint is updated every 15 seconds.
Recommended Calls : 1 call per minute for the leagues, teams, fixtures who have at least one fixture in progress otherwise 1 call per day.
query Parameters
idinteger
Value: "id"
The id of the fixture
idsstringMaximum of 20 fixtures ids
Value: "id-id-id"
One or more fixture ids
livestring
Enum: "all" "id-id"
All or several leagues ids
datestringYYYY-MM-DD
A valid date
leagueinteger
The id of the league
seasoninteger = 4 characters YYYY
The season of the league
teaminteger
The id of the team
lastinteger <= 2 characters
For the X last fixtures
nextinteger <= 2 characters
For the X next fixtures
fromstringYYYY-MM-DD
A valid date
tostringYYYY-MM-DD
A valid date
roundstring
The round of the fixture
statusstring
Enum: "NS" "NS-PST-FT"
One or more fixture status short
venueinteger
The venue id of the fixture
timezonestring
A valid timezone from the endpoint Timezone
header Parameters
x-apisports-key
required
string
Your Api-Key

// Get fixture from one fixture {id}
// In this request events, lineups, statistics fixture and players fixture are returned in the response
get("https://v3.football.api-sports.io/fixtures?id=215662");

// Get fixture from severals fixtures {ids}
// In this request events, lineups, statistics fixture and players fixture are returned in the response
get("https://v3.football.api-sports.io/fixtures?ids=215662-215663-215664-215665-215666-215667");

// Get all available fixtures in play
// In this request events are returned in the response
get("https://v3.football.api-sports.io/fixtures?live=all");

// Get all available fixtures in play filter by several {league}
// In this request events are returned in the response
get("https://v3.football.api-sports.io/fixtures?live=39-61-48");

// Get all available fixtures from one {league} & {season}
get("https://v3.football.api-sports.io/fixtures?league=39&season=2019");

// Get all available fixtures from one {date}
get("https://v3.football.api-sports.io/fixtures?date=2019-10-22");

// Get next X available fixtures
get("https://v3.football.api-sports.io/fixtures?next=15");

// Get last X available fixtures
get("https://v3.football.api-sports.io/fixtures?last=15");

// It’s possible to make requests by mixing the available parameters
get("https://v3.football.api-sports.io/fixtures?date=2020-01-30&league=61&season=2019");
get("https://v3.football.api-sports.io/fixtures?league=61&next=10");
get("https://v3.football.api-sports.io/fixtures?venue=358&next=10");
get("https://v3.football.api-sports.io/fixtures?league=61&last=10&status=ft");
get("https://v3.football.api-sports.io/fixtures?team=85&last=10&timezone=Europe/london");
get("https://v3.football.api-sports.io/fixtures?team=85&season=2019&from=2019-07-01&to=2020-10-31");
get("https://v3.football.api-sports.io/fixtures?league=61&season=2019&from=2019-07-01&to=2020-10-31&timezone=Europe/london");
get("https://v3.football.api-sports.io/fixtures?league=61&season=2019&round=Regular Season - 1");
voici une première partie