/* jshint globalstrict: true */
"use strict";

var teams = {
		werewolf: "Werewolves",
		villager: "Villagers",
	}, roles = [], rolesByName = {};


function Role(opts) {
	// Need to give a name to "this" so we can reference it inside other functions
	var role = this,
		defaults = {
			name: opts.name,
			team: opts.team,
			value: opts.value,
			min: opts.min || 1,
			max: opts.max || 1,
			looksLikeWerewolf: function () {
				return role.team === teams.werewolf;
			},
			teamClass: function () {
				return "role__team-" + role.team.toLowerCase();
			},
			sortOrder: function () {
				if ( role.team === teams.villager ) {
					return 4;
				} else if ( role.team === teams.werewolf ) {
					return 5;
				} else {
					return 6;
				}
			}
		};

	Object.keys(defaults).forEach(function (key) {
		makeProperty(role, key, opts, defaults[key]);
	});
}

function makeProperty(obj, propname, opts, defaultHandler) {
	/* jshint validthis: true */
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
	roles.push(role);
	rolesByName[role.name] = role;
}

addRole(new Role({ name: "Villager",
	team: teams.villager,
	value: 1,
	max: 15,
	sortOrder: 1,
}));
addRole(new Role({ name: "Seer",
	team: teams.villager,
	value: 7,
	sortOrder: 2,
}));
addRole(new Role({ name: "Werewolf",
	team: teams.werewolf,
	value: -6,
	max: 12,
	sortOrder: 3,
}));
addRole(new Role({ name: "Lycan",
	team: teams.villager,
	value: -1,
	looksLikeWerewolf: true,
}));
addRole(new Role({ name: "Mason",
	team: teams.villager,
	value: 2,
	min: 2,
	max: 3,
	looksLikeWerewolf: true,
}));

roles.sort(function (a, b) {
	if ( a.sortOrder === b.sortOrder ) {
		return a.name.toLowerCase() > b.name.toLowerCase();
	} else {
		return a.sortOrder - b.sortOrder;
	}
});