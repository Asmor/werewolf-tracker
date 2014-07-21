/* jshint globalstrict: true */
"use strict";

function Game(scenario, players) {
	var game = this,
		villager = rolesByName["Villager"],
		diff, deck, i;
	game.players = {};
	game.scenario = new Scenario(scenario.export);

	diff = players.length - game.scenario.playerCount;

	// Adjust scenario to player count by adding or removing villagers
	if (diff > 0) {
		console.log("Adding villagers:", diff);
		game.scenario.add(villager, diff);
	} else if (diff < 0) {
		console.log("Removing villagers:", diff);
		game.scenario.remove(villager, diff);
	}

	deck = shuffle(scenario.deck);

	for ( i = 0; i < players.length; i++ ) {
		game.players[players[i]] = {
			name: players[i],
			role: deck[i]
		}
	}
	window.game = game;
	console.log(game.players);
}