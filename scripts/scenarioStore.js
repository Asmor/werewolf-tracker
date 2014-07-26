/* global Global */
/* global Scenario */
"use strict";

Global.scenarioStore = {
	scenarios: {},
	getKey: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		return "scenario:" + name;		
	},
	load: function (name) {
		var key = Global.scenarioStore.getKey(name);

		Global.dataStore.get(key, function (data) {
			var scenario = new Scenario(data);
			Global.scenarioStore.scenarios[scenario.pathname] = scenario;
		});
	},
	remove: function (name) {
		if ( typeof name !== "string" ) {
			name = name.name;
		}

		var key = Global.scenarioStore.getKey(name);

		delete Global.scenarioStore.scenarios[name];

		Global.dataStore.remove(key);
		Global.dataStore.store("scenarios", Global.scenarioStore.scenarioKeys);
	},
	save: function (scenario, oldName) {
		if (oldName) {
			Global.scenarioStore.remove(oldName);
		}

		Global.scenarioStore.scenarios[scenario.pathname] = scenario;

		var key = Global.scenarioStore.getKey(scenario.pathname);

		Global.dataStore.store(key, scenario.export);
		Global.dataStore.store("scenarios", Global.scenarioStore.scenarioKeys);
	},
};

Object.defineProperty(Global.scenarioStore, "scenarioKeys", {
	get: function () {
		return Object.keys(Global.scenarioStore.scenarios).sort(function (a,b) {
			return a.toLowerCase() > b.toLowerCase();
		});
	}
});

Global.dataStore.get("scenarios", function (a) {
	if (a) {
		for ( var i = 0; i < a.length; i++ ) {
			Global.scenarioStore.load(a[i]);
		}
	}
});
