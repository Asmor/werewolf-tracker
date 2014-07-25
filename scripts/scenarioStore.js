/* global Global */
/* global Scenario */
"use strict";

Global.scenarioStore = {
	scenarios: [],
	getKey: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		return "scenario:" + name;		
	},
	load: function (name, callback) {
		var key = Global.scenarioStore.getKey(name);

			Global.dataStore.get(key, function (data) {
				var scenario = new Scenario(data);
				callback(scenario);
			});
	},
	remove: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		var key = Global.scenarioStore.getKey(name),
			i = Global.scenarioStore.scenarios.indexOf(name);

		if ( i !== -1 ) {
			Global.scenarioStore.scenarios.splice(i, 1);
		}

		Global.dataStore.remove(key);
		Global.dataStore.store("scenarios", Global.scenarioStore.scenarios);
	},
	save: function (scenario, oldName) {
		if (oldName) {
			Global.scenarioStore.remove(oldName);
		}

		if (Global.scenarioStore.scenarios.indexOf(scenario.name) === -1) {
			Global.scenarioStore.scenarios.push(scenario.name);
		}

		var key = Global.scenarioStore.getKey(scenario.name);

		Global.dataStore.store(key, scenario.export);
		Global.dataStore.store("scenarios", Global.scenarioStore.scenarios);
	},
};

Global.dataStore.get("scenarios", function (a) {
	if (a) {
		Global.scenarioStore.scenarios = a;
	}
});