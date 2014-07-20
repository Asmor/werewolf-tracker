/* jshint globalstrict: true */
/* global dataStore */
/* global Scenario */
"use strict";

var scenarioStore = {
	scenarios: [],
	getKey: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		return "scenario:" + name;		
	},
	load: function (name, callback) {
		var key = scenarioStore.getKey(name);

			dataStore.get(key, function (data) {
				var scenario = new Scenario(data);
				callback(scenario);
			});
	},
	remove: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		var key = scenarioStore.getKey(name),
			i = scenarioStore.scenarios.indexOf(name);

		if ( i !== -1 ) {
			scenarioStore.scenarios.splice(i, 1);
		}

		dataStore.remove(key);
		dataStore.store("scenarios", scenarioStore.scenarios);
	},
	save: function (scenario, oldName) {
		if (oldName) {
			scenarioStore.remove(oldName);
		}

		if (scenarioStore.scenarios.indexOf(scenario.name) === -1) {
			scenarioStore.scenarios.push(scenario.name);
		}

		var key = scenarioStore.getKey(scenario.name);

		dataStore.store(key, scenario.export);
		dataStore.store("scenarios", scenarioStore.scenarios);
	},
};

dataStore.get("scenarios", function (a) {
	if (a) {
		scenarioStore.scenarios = a;
	}
});