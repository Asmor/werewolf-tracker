/* global Controllers */
/* global Game */
/* global Global */
/* global Scenario */
"use strict";

var wwApp = angular.module("wwApp", ["ui.router"]);

wwApp.config(function ($stateProvider, $urlRouterProvider) {
	// Default
	$urlRouterProvider.otherwise("/main");

	// Main menu page
	$stateProvider.state("main", {
		url: "/main",
		templateUrl: "pages/main.html",
	});

	// Scenario
	$urlRouterProvider.when("/scenario", "/scenario/list");
	$stateProvider.state("scenario", {
		url: "/scenario",
		templateUrl: "pages/scenario.html",
		controller: function ($scope, $state) {
			$scope.editScenario = function (name) {
				Global.scenarioStore.load(name, function (scenario) {
					$scope.scenario = scenario;
					$state.go("^.manage");
				});
			};
		}
	});
	$stateProvider.state("scenario.list_scenarios", {
		url: "/list",
		templateUrl: "pages/scenario.list.html",
		controller: function ($scope) {
			$scope.scenarios = Global.scenarioStore.scenarios.slice(0);
		},
	});
	$stateProvider.state("scenario.manage", {
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
	});

	// People
	$urlRouterProvider.when("/people", "/people/list");
	$stateProvider.state("people", Controllers.people.base);
	$stateProvider.state("people.list_people", Controllers.people.list);
	$stateProvider.state("people.add_people", Controllers.people.add);

	// Game
	$urlRouterProvider.when("/game", "/game/list_people");
	$stateProvider.state("game", {
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
		},
	});
	$stateProvider.state("game.list_people", {
		url: "/list_people",
		templateUrl: "pages/people.list.html",
		controller: function ($scope) {
			$scope.people = Global.peopleStore.people;
		},
	});
	$stateProvider.state("game.add_people", {
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
	});
	$stateProvider.state("game.list_scenarios", {
		url: "/choose_scenario",
		templateUrl: "pages/scenario.list.html",
		controller: function ($scope) {
			$scope.scenarios = Global.scenarioStore.scenarios.slice(0);
		},
	});
	// $stateProvider.state("scenario.manage", {
	// 	url: "/manage",
	// 	templateUrl: "pages/scenario.manage.html",
	// 	controller: function ($scope, $state) {
	// 		$scope.roles = roles;
	// 		if ( ! $scope.scenario ) {
	// 			$scope.scenario = new Scenario();
	// 		}

	// 		$scope.oldScenarioName = $scope.scenario.name;

	// 		$scope.saveScenario = function () {
	// 			if ($scope.scenario.name.trim()) {
	// 				Global.scenarioStore.save($scope.scenario, $scope.oldScenarioName);
	// 				$scope.scenario = false;
	// 				$state.go("^.list_scenarios");
	// 			} else {
	// 				alert("Enter a name for the scenario");
	// 			}
	// 		};

	// 		$scope.removeScenario = function () {
	// 			Global.scenarioStore.remove($scope.oldScenarioName);
	// 				$state.go("^.list_scenarios");
	// 		};
	// 	}
	// });

});

