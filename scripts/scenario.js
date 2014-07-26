/* global Global */
/* exported Scenario */
"use strict";

function Scenario(load) {
	var scenario = this,
		_rolesByTeam;
	scenario.roles = {};
	scenario.playerCount = 0;
	scenario.minimumPlayers = 0;
	scenario.teams = {};
	scenario.teams[Global.teams.werewolf] = 0;
	scenario.teams[Global.teams.villager] = 0;
	scenario.name = "";

	Object.defineProperty(scenario, "balance", {
		get: function () {
			var total = 0;

			Object.keys(scenario.roles).forEach(function (roleName) {
				var role = Global.rolesByName[roleName],
					ct = scenario.roles[roleName];
				total += Global.getRoleValue(role, scenario) * ct;
			});

			return total;
		}
	});

	Object.defineProperty(scenario, "deck", {
		get: function () {
			var deck = [];

			Object.keys(scenario.roles).forEach(function (roleName) {
				var role = Global.rolesByName[roleName],
					i;
				for ( i = 0; i < scenario.roles[roleName]; i++) {
					deck.push(role);
				}
			});

			return deck;
		},
	});

	Object.defineProperty(scenario, "export", {
		get: function () {
			var clone = {};

			Object.keys(scenario.roles).forEach(function (roleName) {
				clone[roleName] = scenario.roles[roleName];
			});

			return {
				name: scenario.name,
				roles: clone,
			};
		},
	});

	Object.defineProperty(scenario, "rolesByTeam", {
		get: function () {
			if ( ! _rolesByTeam ) {
				_rolesByTeam = {};

				Object.keys(scenario.roles).forEach(function (roleName) {
					// Nobody cares about plain old villagers!
					if ( roleName === "Villager" ) {
						return;
					}

					var role = Global.rolesByName[roleName];

					if ( ! _rolesByTeam[role.team] ) {
						_rolesByTeam[role.team] = {};
					}

					_rolesByTeam[role.team][roleName] = scenario.roles[roleName];
				});
			}

			return _rolesByTeam;
		}
	});

	scenario.add = function (role, qty) {
		scenario.dirty();
		qty = qty || 1;

		if ( ! scenario.roles[role.name] ) {
			scenario.roles[role.name] = 0;
		}

		var oldQty = scenario.roles[role.name];

		qty = normalizeQty(oldQty + qty, role);

		scenario.roles[role.name] = qty;
		adjustTotals(role, qty - oldQty);

		return qty;
	};

	scenario.dirty = function () {
		_rolesByTeam = null;
	};

	scenario.getQty = function (role) {
		return scenario.roles[role.name] || 0;
	};

	scenario.remove = function (role, qty) {
		scenario.dirty();
		qty = qty || 1;

		if ( ! scenario.roles[role.name] ) {
			return 0;
		}

		var oldQty = scenario.roles[role.name];

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

		if ( role !== Global.rolesByName.Villager ) {
			scenario.minimumPlayers += diff;
		}

		if ( ! scenario.teams[role.team] ) {
			scenario.teams[role.team] = 0;
		}

		scenario.teams[role.team] += diff;

		if (
			scenario.teams[role.team] <= 0 &&
			role.team !== Global.teams.werewolf &&
			role.team !== Global.teams.villager
		) {
			delete scenario.teams[role.team];
		}
	}

	if (load) {
		scenario.name = load.name;
		Object.keys(load.roles).forEach(function (roleName) {
			var role = Global.rolesByName[roleName];
			scenario.add(role, load.roles[roleName]);
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