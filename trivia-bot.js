const TwitchBot = require('node-twitchbot')
var unirest = require('unirest')
var jsonfile = require('jsonfile')
var cache = require('memory-cache')

const Bot = new TwitchBot({
  username : 'yamoshoto', // Username of Bot goes here
  oauth    : 'oauth:KEY GOES HERE', // Generate an OAUTH With your Twitch Account
  channel  : 'yamoshoto' // Put selected channel name here
})

/* Connect bot to Twitch IRC */

var Answer = [false]

Bot.connect()
.then(() => {

  /* Listen for all messages in channel */
  Bot.listen((err, chatter) => {
    if(err) {
      console.log(err)
    } else {
      console.log(chatter.msg) // 'Hello World!'
    }
  })

  /* Listen for an exact messages match */
  //Bot.listenFor('Test', (err, chatter) => {
  //  
  //})

  Bot.listenFor('!update', (err, chatter) => {
    console.log(chatter)
      //console.dir(obj)
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards")
      .header("X-Mashape-Key", "KEY GOES IN HERE")
      .end((result) => {
        //console.log(result.status, result.headers, result.body);
          if(err){console.log(err)}
          else{
            var obj = result.body

            for(var k in obj){
              if (k == 'Debug'){
                delete obj[k]
              }
              if (k == 'Missions'){
                delete obj[k]
              }
              if (k == 'Credits'){
                delete obj[k]
              }
              if (k == 'System'){
                delete obj[k]
              }
              if (k == 'Tavern Brawl'){
                delete obj[k]
              }
              if (k == 'Hero Skins'){
                delete obj[k]
              }
            }
            jsonfile.writeFile('cards.json', obj, {spaces: 2}, (err) => {
              if(err){console.log(err)}
              else{
                console.log('Completed Card Update!')
                Bot.msg('Cards Updated!')
              }
            })
          }
      })
    })

  Bot.listenFor('!start', (err, chatter) => {
    jsonfile.readFile('cards.json', (err, obj)=>{
      if(err){console.log(err)}
      else{
        Bot.msg('Finding a card...')

        let len = Object.keys(obj).length
        let keys = Object.keys(obj)
        let key = keys[Math.floor(Math.random()*len)]
        //console.log(key)

        if(key){
          let length = obj[key].length
          let card = obj[key][Math.floor(Math.random()*length)]
          var done = false
          var trivia_card
          //console.log(card)
          while(!done){
            if(card){
            if(card.hasOwnProperty('collectible') && card.type==="Minion"){
                trivia_card = card
                done = true
                let mechanics = []
                if(trivia_card.hasOwnProperty('mechanics')){
                  mechanics = trivia_card.mechanics
                }

                if(trivia_card.text){
                  if (trivia_card.text.includes('<b>')){
                    trivia_card.text = trivia_card.text.replace('<b>', '')
                    trivia_card.text = trivia_card.text.replace('</b>', '')
                  }
                  if (trivia_card.text.includes('<i>')){
                    trivia_card.text = trivia_card.text.replace('<i>', '')
                    trivia_card.text = trivia_card.text.replace('</i>', '')
                  }
                  if (trivia_card.text.includes('[x]')){
                    trivia_card.text = trivia_card.text.replace('[x]', '')
                  }
                }
                console.log(trivia_card.name)
                let memObj = {
                  name: trivia_card.name,
                  series: trivia_card.cardSet,
                  power: trivia_card.attack,
                  cost: trivia_card.cost,
                  toughness: trivia_card.health,
                  rarity: trivia_card.rarity,
                  class: trivia_card.playerClass,
                  description: trivia_card.text,
                  mechanics: trivia_card.mechanics,
                  answered: false,
                  winner: ''
                }
                cache.put('card', memObj)
              }
              else{
                card = obj[key][Math.floor(Math.random()*length)]
              }
          }
        }
          if(trivia_card){
            let msg = "This card's mana cost is "+cache.get('card').cost
            Bot.msg(msg);

            (function theLoop(i, sName) {
              setTimeout(function(){
                //console.log('Working?', i)
                var cake = false
                if (cache.get('card').answered){
                  i = 1
                  cake = true
                  let msg = 'Winner! ' + cache.get('card').winner + ' guessed the right card - ' + cache.get('card').name
                  Bot.msg(msg)
                  console.log('just for the sake ', cache.get('card'))
                }

                if (i == 8){
                  if (cache.get('card').text){
                    let msg = "This card's description is "+cache.get('card').text
                    Bot.msg(msg)
                  }
                  else{--i}
                }
                if (i == 7){
                  let msg = "This card's power is "+cache.get('card').power
                  Bot.msg(msg)
                }
                if (i == 6){
                  let msg = "This is a "+cache.get('card').class+' Class card'
                  Bot.msg(msg)
                }
                if (i == 5){
                  let msg = "This card has a toughness of "+cache.get('card').toughness
                  Bot.msg(msg)
                }
                if (i == 4){
                  if(cache.get('card').mechanics.length > 0){
                    let mech = ''
                    for (var j = 0; j < cache.get('card').mechanics.length; j++){
                      if(cache.get('card').mechanics.length > 1){
                        mech = mech + ' '+ cache.get('card').mechanics[j].name
                      }
                      else{
                        mech = cache.get('card').mechanics[j].name
                      }

                    }
                    let msg = "This card is equipped with "+mech
                    Bot.msg(msg)
                  }else{--i}
                }
                if (i == 3){
                  let msg = "This card is part of the "+cache.get('card').series + ' expansion'
                  Bot.msg(msg)
                }
                if (i == 2){
                  let msg = "This card's rarity is "+cache.get('card').rarity
                  Bot.msg(msg)
                }
                if(i == 1){
                  if(!cake){
                    let msg = "TIME IS UP! The card is "+cache.get('card').name
                    Bot.msg(msg)
                  }

                }
                if(--i){
                  theLoop(i, 'new_name');
                }
              }, 10000);
            })(10, '');
          }

          }
        }
      })
    })

  Bot.listen((err, chatter) => {
    if(chatter){
      if(chatter.msg.includes('!answer')){
        let temp_answer = chatter.msg.split(' ', 2)
        if (temp_answer.length > 1){
          let answer = chatter.msg.replace(temp_answer[0], '')
          console.log(cache.get('card').name.toUpperCase(), 'and ', answer.toUpperCase())
          if(answer.toUpperCase().includes(cache.get('card').name.toUpperCase())){
            console.log('MATCH')
            let name = cache.get('card').name
            cache.put('card', {winner: chatter.user, answered: true, name: name})
          }
        }
      }
    }
  })

  /* Listen for raw IRC events */
  //Bot.raw((err, event) => {
  //  console.log(event)
  //})
})
.catch(err => {
  console.log('Connection error!')
  console.log(err)
})
