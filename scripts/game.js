/* global Global */
/* global Scenario */
/* exported Game */
"use strict";

function Game(scenario, players) {
	var game = this,
		villager = Global.rolesByName.Villager,
		diff;
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

	window.game = game;
	console.log(game.players);
}

// TODO: Implement "init" functionality, and pub/sub for game events. See Frankenstein role for example