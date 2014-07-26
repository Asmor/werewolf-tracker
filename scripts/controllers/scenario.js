/* global Controllers */
/* global Global */
/* global Scenario */
"use strict";

Controllers.scenario = {};

Controllers.scenario.base = {
	url: "/scenario",
	templateUrl: "pages/scenario.html",
};

Controllers.scenario.list = {
	url: "/list",
	templateUrl: "pages/scenario.list.html",
	controller: function ($scope) {
		$scope.scenarios = Global.scenarioStore.scenarios;
	},
};

Controllers.scenario.manage = {
	url: "/manage/:scenarioName",
	templateUrl: "pages/scenario.manage.html",
	controller: function ($scope, $state) {
		var scenario = Global.scenarioStore.scenarios[$state.params.scenarioName] || new Scenario(),
			oldScenarioName = scenario.pathname;

		$scope.roles = Global.roles;
		$scope.scenario = scenario;

		$scope.saveScenario = function () {
			if (scenario.name.trim()) {
				Global.scenarioStore.save(scenario, oldScenarioName);
				scenario = false;
				$state.go("^.list_scenarios");
			} else {
				alert("Enter a name for the scenario");
			}
		};

		$scope.removeScenario = function () {
			Global.scenarioStore.remove(oldScenarioName);
				$state.go("^.list_scenarios");
		};

		$scope.getRoleVal = function (role) {
			return Global.getRoleValue(role, scenario);
		};
	}
};
