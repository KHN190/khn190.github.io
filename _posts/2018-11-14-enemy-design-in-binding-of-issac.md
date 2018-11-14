---
layout: post
title:  "Enemy Design In The Binding of Isaac: Rebirth"
cover: null.png
date:   2018-11-14 10:57:00 +0800
categories: game-design
---

> **This is a series of writings on game design. I will review some of my favorites: [The Binding of Isaac](), [Hollow Knight]() and [Donut County]() to explore different mechanics used in these games.**

I'm currently working on my project for Github-hosted [Game Off 2018](https://itch.io/jam/game-off-2018).

My final work should be a minimal roguelike game with proof of fun. It's minimal since I work alone this time. 
I don't have much resource to create abundant assets like a ready-to-release roguelike game. 
But it's good to have a review of the classic roguelike game [The Binding of Isaac: Rebirth](https://store.steampowered.com/app/250900/The_Binding_of_Isaac_Rebirth/) about how they designed enemies.

When you carefully look at the enemies in Isaac Rebirth, they behave pretty simple.

## 1. Pathfinding

This was the first thing I considered in my own game. To make enemies smart, they should be able to target their opponent, or companion in a clean way. A shortest path can be achieved using A* path finding algorithm. I tried.

The result doesn't feel so good - enemies are either too aggressive or kind of too straightforward, or even both. When they are in an empty space, they'll approach the player in a direct line - too straight. That's one reason that Isaac Rebirth - or Hollow Knight - did not use a shortest pathfinding.

<img src="/images/isaac/1.jpg" alt="" width="640px"/>

Enemies are able to find the player but they do not approach in a shortest path, they usually move slowly, and stumble on stones, thus giving the player a chance to attack. Some enemies don't have ability to move. Also easy to find a boss moving in a predictable pattern, but do not aggressively hunt the player. 

<img src="/images/isaac/2.jpg" alt="" width="640px"/>

**Conclusion**. The key is to give players time to observe, learn and attack. Thus a shortest path is not necessary, and sometimes harmful.

## 2. Attack

Several attacks exist in Isaac Rebirth:

1. [move / dash](https://bindingofisaacrebirth.gamepedia.com/Gurglings), common
2. [trail](https://bindingofisaacrebirth.gamepedia.com/Peep), found with ordinary enemies & bosses
3. [explode / fart](https://bindingofisaacrebirth.gamepedia.com/Mega_Fatty), common
4. [bullet / laser](https://bindingofisaacrebirth.gamepedia.com/Gemini), common
5. [jump](https://bindingofisaacrebirth.gamepedia.com/Gurdy), found with bosses
6. [spawn monsters / poop](https://bindingofisaacrebirth.gamepedia.com/The_Duke_of_Flies), found with bosses

As we can see, there are not many actions that the monsters in Isaac Rebirth capable of. Especially ordinary enemies are pretty dumb, regarding some actions can only be found with bosses. Poisonous trail / laser can be found in deeper basements only, too, and it doesn't change the fact that attack patterns are quite too similar. 

Attacks are based on pathfinding behaviours so generally there're 2 distinguishable types of enemies: no bullet / with bullet. Otherwise they are only different on movement pattern & art sprite. But this also simplifies the behaviours to be observed & learned. Hollow Knight is much more difficult to play since enemies behave in very various ways.

**Conclusion**. I strongly believe designers of Isaac Rebirth didn't put their full energy in designing enemy behaviours. This makes the game easier to play, but on the other hand it reduced "depth" of gameplay strategy. However, adding abundant of items to this game makes it "wide" - the depth of strategy comes when different items collected. I realised Isaac Rebirth is really not good at enemy design when I thought about the next point. (But in Hollow Knight, enemy design is much better.)

## 3. Cooperation

This rarely happens in action games (including roguelike). But it exists in any one of the RTS & MOBA games. In Starcraft when Terran marines join in troops with tanks / medics may gain high combat ability, turning them from an early stage army into a main combat force.

In roguelike games enemies should be able to reinforce each other than fighting alone. But I didn't see this in Isaac Rebirth, and the only close-up "operations" are [Gemini](https://bindingofisaacrebirth.gamepedia.com/Gemini) and [Peep](https://bindingofisaacrebirth.gamepedia.com/Peep), where Peep's eyeball will float around and try to disturb the player's attack.

<img src="/images/isaac/3.jpg" alt="" width="640px"/>

Ideally a cooperation happens when two different enemies are aware of each other and thier abilities may crash together causing "[Emergency](https://en.wikipedia.org/wiki/Emergence)". In this case, 1 + 1 is greater than 2, two enemies behave more complex than a single one. This can be achieved using [Swarm](https://en.wikipedia.org/wiki/Swarm_intelligence), or a centralized AI.

However, in Isaac Rebirth the enemies are usually not aware of each other. There's no centralized coordinator, nor swarm of ants. Peep's eyeballs also move in a pre-program pattern, I didn't notice their awareness of each other. I believe adding enemy cooperation will make this great game even more fun.

**Conclusion**. Cooperation needs awareness of a companion. Enemies that are able to cooperate increase depth of gameplay. While cooperation is not a common design in action games.

