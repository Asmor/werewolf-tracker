/* jshint globalstrict: true */
/* global rolesByName */
"use strict";

function Scenario(load) {
	var scenario = this;
	scenario.roles = {};
	scenario.playerCount = 0;
	scenario.minimumPlayers = 0;
	scenario.teams = {};
	scenario.teams[teams.werewolf] = 0;
	scenario.teams[teams.villager] = 0;
	scenario.name = "";

	Object.defineProperty(scenario, "deck", {
		get: function () {
			var deck = [];

			Object.keys(scenario.roles).forEach(function (key) {
				var role = rolesByName[key],
					i;
				for ( i = 0; i < scenario.roles[key]; i++) {
					deck.push(role);
				}
			});

			return deck;
		},
	});

	Object.defineProperty(scenario, "export", {
		get: function () {
			var clone = {};

			Object.keys(scenario.roles).forEach(function (key) {
				clone[key] = scenario.roles[key];
			});

			return {
				name: scenario.name,
				roles: clone,
			};
		},
	});

	Object.defineProperty(scenario, "balance", {
		get: function () {
			var total = 0;

			Object.keys(scenario.roles).forEach(function (key) {
				var role = rolesByName[key],
					ct = scenario.roles[key];
				total += getRoleValue(role, scenario) * ct;
			});

			return total;
		}
	});

	scenario.add = function (role, qty) {
		qty = qty || 1;

		if ( ! scenario.roles[role.name] ) {
			scenario.roles[role.name] = 0;
		}

		var oldQty = scenario.roles[role.name]

		qty = normalizeQty(oldQty + qty, role);

		scenario.roles[role.name] = qty;
		adjustTotals(role, qty - oldQty);

		return qty;
	};

	scenario.getQty = function (role) {
		return scenario.roles[role.name] || 0;
	};

	scenario.remove = function (role, qty) {
		qty = qty || 1;

		if ( ! scenario.roles[role.name] ) {
			return 0;
		}

		var oldQty = scenario.roles[role.name]

		qty = normalizeQty(oldQty - qty, role, true);

		adjustTotals(role, qty - oldQty);

		if ( qty === 0 ) {
			delete scenario.roles[role.name];
			return 0;
		}

		scenario.roles[role.name] = qty;

		return qty;
	};

	function adjustTotals(role, diff) {
		scenario.playerCount += diff;

		if ( role !== rolesByName["Villager"] ) {
			scenario.minimumPlayers += diff;
		}

		if ( ! scenario.teams[role.team] ) {
			scenario.teams[role.team] = 0;
		}

		scenario.teams[role.team] += diff;

		if (
			scenario.teams[role.team] <= 0
			&& role.team !== teams.werewolf
			&& role.team !== teams.villager
		) {
			delete scenario.teams[role.team];
		}
	}

	if (load) {
		scenario.name = load.name;
		Object.keys(load.roles).forEach(function (key) {
			var role = rolesByName[key];
			scenario.add(role, load.roles[key]);
		});
	}
}

function normalizeQty(qty, role, removing) {
		if ( qty < role.min ) {
			if (removing) {
				return 0;
			} else {
				return role.min;
			}
		} else if ( qty > role.max ) {
			return role.max;
		}
		return qty;
}