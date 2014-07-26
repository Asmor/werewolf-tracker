/* global Controllers */
/* global Global */
/* global Game */
"use strict";

Controllers.game = {
	people: {},
	scenarios: {},
};

Controllers.game.base = {
	url: "/game",
	templateUrl: "pages/game.html",
	controller: function ($scope, $state) {
		$scope.selectedPeople = [];
		$scope.selectedScenario = "";
		$scope.personSelected = function (person) {
			if ( $scope.selectedPeople.indexOf(person) === -1 ) {
				return "";
			} else {
				return "person__selected";
			}
		};
		$scope.togglePerson = function (person) {
			var i = $scope.selectedPeople.indexOf(person);
			if ( i === -1 ) {
				$scope.selectedPeople.push(person);
			} else {
				$scope.selectedPeople.splice(i, 1);
			}
		};
		$scope.confirmPeopleSelection = function () {
			$state.go("^.list_scenarios");
		};
		$scope.scenarioSelected = function (scenario) {
			if ( $scope.scenario === scenario ) {
				return "scenario__selected";
			} else {
				return "";
			}
		};
		$scope.selectScenario = function (scenario) {
			if ($scope.scenario === scenario) {
				$scope.scenario = "";
			} else {
				$scope.scenario = scenario;
			}
		};
		$scope.confirmScenarioSelection = function () {
			Global.scenarioStore.load($scope.scenario, function (scenario) {
				/* jshint unused: false */
				var game = new Game(scenario, $scope.selectedPeople);
			});
		};
		$scope.editScenario = function (arg) {
			console.log(arg);
		};
	},
};

Controllers.game.people.list = {
	url: "/list_people",
	templateUrl: "pages/people.list.html",
	controller: function ($scope) {
		$scope.people = Global.peopleStore.people;
	},
};

Controllers.game.people.add = {
	url: "/add_people",
	templateUrl: "pages/people.add.html",
	controller: function ($scope, $state) {
		$scope.peopleToAdd = "";
		$scope.addPeople = function () {
			var added = Global.peopleStore.addPeople($scope.peopleToAdd),
				i;

			for ( i = 0; i < added.length; i++ ) {
				$scope.selectedPeople.push(added[i]);
			}

			$state.go("^.list_people");
		};
	},
};

Controllers.game.scenarios.list = {
	url: "/choose_scenario",
	templateUrl: "pages/scenario.list.html",
	controller: function ($scope) {
		$scope.scenarios = Global.scenarioStore.scenarios;
	},
};

Controllers.game.scenarios.manage = Controllers.scenario.manage;
