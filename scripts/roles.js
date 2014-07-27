/* global Global */
"use strict";

Global.teams = {
	werewolf: "Werewolves",
	villager: "Villagers",
};
Global.roles = [];
Global.rolesByName = {};
Global.priorities = (function () {
	var i = 0,
		priorities = {};

	priorities.first = i++;
	priorities.beforeWerewolves = i++;
	priorities.asWerewolf = i++;
	priorities.afterWerewolves = i++;
	priorities.beforeSeer = i++;
	priorities.asSeer = i++;
	priorities.afterSeer = i++;
	priorities.any = i++;
	priorities.last = i++;

	return priorities;
}());

function Role(opts) {
	// Need to give a name to "this" so we can reference it inside other functions
	var role = this,
		defaults = {
			name: "",
			namePlural: opts.name + "s",
			team: Global.teams.villager,
			value: 1,
			min: 1,
			max: 1,
			needsId: true,
			priority: Global.priorities.any,
			init: function () { return []; },
			looksLikeWerewolf: function () {
				return role.team === Global.teams.werewolf;
			},
			teamClass: function () {
				return "role__team-" + role.team.toLowerCase();
			},
			sortOrder: function () {
				if ( role.team === Global.teams.villager ) {
					return 4;
				} else if ( role.team === Global.teams.werewolf ) {
					return 5;
				} else {
					return 6;
				}
			},
		};

	Object.keys(defaults).forEach(function (key) {
		makeProperty(role, key, opts, defaults[key]);
	});
}

function makeProperty(obj, propname, opts, defaultHandler) {
	Object.defineProperty(obj, propname, {
		get: function () {
			var handler = (typeof opts[propname] !== "undefined") ? opts[propname] : defaultHandler;
			if ( typeof handler === "function" ) {
				return handler();
			} else {
				return handler;
			}
		},
	});
}

function addRole(role) {
	Global.roles.push(role);
	Global.rolesByName[role.name] = role;
}

addRole(new Role({ name: "Villager",
	max: 15,
	sortOrder: 1,
	needsId: false,
}));
addRole(new Role({ name: "Seer",
	value: 7,
	sortOrder: 2,
	priority: Global.priorities.afterWerewolves,
}));
addRole(new Role({ name: "Werewolf",
	namePlural: "Werewolves",
	team: Global.teams.werewolf,
	priority: Global.priorities.asWerewolf,
	value: -6,
	max: 12,
	sortOrder: 3,
}));
addRole(new Role({ name: "Frankenstein",
	init: function () {
		return [{
			action: "subscribe",
			subscribeTo: "death",
			notify: function (role, player) {
				/* jshint unused: false */
				// TODO: If the role was a villager, assign his role to Frank
			},
		}];
	},
	value: function () {
		return function (args) {
			if ( ! args.scenario ) {
				return 0;
			}

			var total = 0;

			Object.keys(args.scenario.roles).forEach(function (key) {
				var role = Global.rolesByName[key],
					ct = args.scenario.roles[key];
				if (
					(role.team === Global.teams.villager) &&
					! role.name.match(/^(Frankenstein|Villager)$/)
				) {
					total += 2 * ct;
				}

			});

			return total;
		};
	},
}));
addRole(new Role({ name: "Lycan",
	value: -1,
	looksLikeWerewolf: true,
}));
addRole(new Role({ name: "Mason",
	value: 2,
	min: 2,
	max: 3,
	looksLikeWerewolf: true,
}));

Global.roles.sort(function (a, b) {
	if ( a.sortOrder === b.sortOrder ) {
		return a.name.toLowerCase() > b.name.toLowerCase();
	} else {
		return a.sortOrder - b.sortOrder;
	}
});

Global.getRoleValue = function (role, scenario) {
	if ( typeof role.value === "function" ) {
		return role.value({scenario: scenario});
	} else {
		return role.value;
	}
};