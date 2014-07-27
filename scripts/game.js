/* global Global */
/* global Player */
/* global Scenario */
/* exported Game */
"use strict";

function Game(scenario, people) {
	var game = this,
		villager = Global.rolesByName.Villager,
		night = 0,
		nightActions,
		diff,
		i;
	game.players = {};
	game.scenario = new Scenario(scenario.export);

	diff = people.length - game.scenario.playerCount;

	// Adjust scenario to player count by adding or removing villagers
	if (diff > 0) {
		game.scenario.add(villager, diff);
	} else if (diff < 0) {
		game.scenario.remove(villager, diff);
	}

	for ( i = 0; i < people.length; i++ ) {
		game.players[people[i]] = new Player(people[i]);
	}

	game.getNextAction = function () {
		if ( ! nightActions.length ) {
			return;
		}

		var action = nightActions.shift();

		game.currentAction = {
			type: action.type,
			min: action.min,
			max: action.max,
			text: action.text,
			instructions: "Please select" + action.min + "-" + action.max + "players",
			execute: action.execute,
			state: "select_players",
		};
	};

	game.getNightActions = function () {
		night++;
		nightActions = [];

		Object.keys(game.scenario.roles).forEach(function (roleName) {
			var role = Global.rolesByName[roleName],
				qty = game.scenario.roles[roleName];

			if ( role.needsId && (night === 1) ) {
				nightActions.push(Game.getId(game, role, qty));
			}

			// TODO: Get other night actions
		});

		nightActions.sort(function (a, b) {
			// TODO: Probably need to make sorting more robust, but should do for now
			return a.priority > b.priority;
		});

		return nightActions;
	};

	// TODO: Debugging
	window.game = game;
	console.log(game.players);
}

Game.getId = function (game, role, qty) {
	var text = "Who is the " + role.name + "?";
	if ( qty > 1 ) {
		text = "Who are the " + role.namePlural + "?";
	}

	return {
		priority: role.priority,
		type: "selectPlayers",
		min: qty,
		max: qty,
		text: text,
		requiredPlayers: qty,
		execute: function (args) {
			var i;
			for ( i = 0; i < args.players.length; i++ ) {
				game.players[args.players[i]].role = role;
			}
		},
	};
};

// TODO: Implement "init" functionality, and pub/sub for game events. See Frankenstein role for example
/*

Get list of roles that need to be identified and/or acted on in first night
Sort those roles by priority 

*/