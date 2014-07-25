/* global Controllers */
/* global Global */
/* global Scenario */
"use strict";

Controllers.scenario = {};

Controllers.scenario.base = {
	url: "/scenario",
	templateUrl: "pages/scenario.html",
	controller: function ($scope, $state) {
		$scope.editScenario = function (name) {
			$scope.scenario = Global.scenarioStore.scenarios[name];
			$state.go("^.manage");
		};
	}
};

Controllers.scenario.list = {
	url: "/list",
	templateUrl: "pages/scenario.list.html",
	controller: function ($scope) {
		$scope.scenarioKeys = Global.scenarioStore.scenarioKeys;
	},
};

Controllers.scenario.manage = {
	url: "/manage",
	templateUrl: "pages/scenario.manage.html",
	controller: function ($scope, $state) {
		$scope.roles = Global.roles;
		if ( ! $scope.scenario ) {
			$scope.scenario = new Scenario();
		}

		$scope.oldScenarioName = $scope.scenario.name;

		$scope.saveScenario = function () {
			if ($scope.scenario.name.trim()) {
				Global.scenarioStore.save($scope.scenario, $scope.oldScenarioName);
				$scope.scenario = false;
				$state.go("^.list_scenarios");
			} else {
				alert("Enter a name for the scenario");
			}
		};

		$scope.removeScenario = function () {
			Global.scenarioStore.remove($scope.oldScenarioName);
				$state.go("^.list_scenarios");
		};

		$scope.getRoleVal = function (role) {
			return Global.getRoleValue(role, $scope.scenario);
		};
	}
};
