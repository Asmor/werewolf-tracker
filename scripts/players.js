/* jshint globalstrict: true */
"use strict";

var playerStore = {
	playerList: [],
	addPlayers: function (list, skipSave) {
		var toAdd = list.split("\n"),
			added = [],
			i, name;

		for (i = 0; i < toAdd.length; i++) {
			name = toAdd[i].trim();
			if ( name && (playerStore.playerList.indexOf(name) === -1) ) {
				playerStore.playerList.push(name);
				added.push(name);
			}
		}

		playerStore.playerList.sort(function (a, b) {
			return a.toLowerCase() > b.toLowerCase();
		});

		if ( !skipSave ) { playerStore.save(); }

		return added;
	},
	removePlayer: function (name, skipSave) {
		var i = playerStore.playerList.indexOf(name);

		if ( i !== -1 ) {
			playerStore.playerList.splice(i, 1);
		}

		if ( !skipSave ) { playerStore.save(); }
	},
	save: function () {
		dataStore.store("players", playerStore.playerList.join("\n"));	
	}
};

Object.defineProperty(playerStore, "players", {
	get: function () {
		// Clone list of players, so that the original isn't touched
		return playerStore.playerList.slice(0);
	}
});

dataStore.get("players", function (list) {
	if (list) {
		playerStore.addPlayers(list, true);
	}
});