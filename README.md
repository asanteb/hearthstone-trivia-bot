# hearthstone-trivia-bot
Small TwitchBot that plays a trivia game with Hearthstone cards
#### How it Works
The game only selects playable Minions from Hearthstones current decks and expansions. The bot then selects a random expansion series to draw cards from and then a random card from that series. The bot will give hints about that card till the timer for answering the question expires. The first user to answer the question will be deemed winner. If any user fails to answer the question in time the game will end. *Note:* Although capitalization is not required, punctuation such as apostrophes are required. 
#### Commands
!update - updates current list of cards and saves a new local json file of the newly created decks
!start - starts a new game of trivia
!answer - command that a user would use to answer the current trivia question. Ex. "!answer Acidmaw"
#### Installation
Edit line 5 and 6(optional) to put your Twitch OAUTH key and a Mashape API Key - *Note: The Mashape hey is optional and only used for updating the decks*
##### Twitch OAUTH
You can generate a new Twitch OAUTH key for your bot here: https://twitchapps.com/tmi/
Now you can edit:
```javascript
const OAUTH = 'oauth:KEY GOES HERE'
```
##### Mashape Key
Signup for a Mashape Market account then generate an API key here: https://market.mashape.com/
Now you can edit:
```javascript
const mashapeKey = 'KEY GOES IN HERE'
```
##### NPM
```$npm install``` 
```$npm node trivia-bot``` 

#### Custom Commands
Custom commands can be implemented with the callback function:
```javascript
Bot.listenFor('!command', (err, msg) => {
})
```
#### Features
If you would like to see a new feature implemented, such as scoring, please feel free to open up a new issue!
