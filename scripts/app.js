/* jshint globalstrict: true */
/* global angular */
/* global roles */
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
				scenarioStore.load(name, function (scenario) {
					$scope.scenario = scenario;
					$state.go("^.manage");
				});
			}
		}
	});
	$stateProvider.state("scenario.list_scenarios", {
		url: "/list",
		templateUrl: "pages/scenario.list.html",
		controller: function ($scope) {
			$scope.scenarios = scenarioStore.scenarios.slice(0);
		},
	});
	$stateProvider.state("scenario.manage", {
		url: "/manage",
		templateUrl: "pages/scenario.manage.html",
		controller: function ($scope, $state) {
			$scope.roles = roles;
			if ( ! $scope.scenario ) {
				$scope.scenario = new Scenario();
			}

			$scope.oldScenarioName = $scope.scenario.name;

			$scope.saveScenario = function () {
				if ($scope.scenario.name.trim()) {
					scenarioStore.save($scope.scenario, $scope.oldScenarioName);
					$scope.scenario = false;
					$state.go("^.list_scenarios");
				} else {
					alert("Enter a name for the scenario");
				}
			};

			$scope.removeScenario = function () {
				scenarioStore.remove($scope.oldScenarioName);
					$state.go("^.list_scenarios");
			};

			$scope.getRoleVal = function (role) {
				return getRoleValue(role, $scope.scenario);
			}
		}
	});

	// Players
	$urlRouterProvider.when("/players", "/players/list");
	$stateProvider.state("players", {
		url: "/players",
		templateUrl: "pages/players.html",
	});
	$stateProvider.state("players.list_players", {
		url: "/list",
		templateUrl: "pages/players.list.html",
		controller: function ($scope, $state) {
			$scope.players = playerStore.players;
			$scope.removePlayer = function (name) {
				playerStore.removePlayer(name);
				reload($scope, $state);
			};
		},
	});
	$stateProvider.state("players.add_players", {
		url: "/add",
		templateUrl: "pages/players.add.html",
		controller: function ($scope, $state) {
			$scope.playersToAdd = "";
			$scope.addPlayers = function () {
				playerStore.addPlayers($scope.playersToAdd);
				$state.go("^.list_players");
			};
		},
	});

	// Game
	$urlRouterProvider.when("/game", "/game/list_players");
	$stateProvider.state("game", {
		url: "/game",
		templateUrl: "pages/game.html",
		controller: function ($scope, $state) {
			$scope.selectedPlayers = [];
			$scope.selectedScenario = "";
			$scope.playerSelected = function (player) {
				if ( $scope.selectedPlayers.indexOf(player) === -1 ) {
					return "";
				} else {
					return "player__selected";
				}
			};
			$scope.togglePlayer = function (player) {
				var i = $scope.selectedPlayers.indexOf(player)
				if ( i === -1 ) {
					$scope.selectedPlayers.push(player);
				} else {
					$scope.selectedPlayers.splice(i, 1);
				}
			};
			$scope.confirmPlayerSelection = function () {
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
				scenarioStore.load($scope.scenario, function (scenario) {
					var game = new Game(scenario, $scope.selectedPlayers);
				});
			};
		},
	});
	$stateProvider.state("game.list_players", {
		url: "/list_players",
		templateUrl: "pages/players.list.html",
		controller: function ($scope) {
			$scope.players = playerStore.players;
		},
	});
	$stateProvider.state("game.add_players", {
		url: "/add_players",
		templateUrl: "pages/players.add.html",
		controller: function ($scope, $state) {
			$scope.playersToAdd = "";
			$scope.addPlayers = function () {
				var added = playerStore.addPlayers($scope.playersToAdd),
					i;

				for ( i = 0; i < added.length; i++ ) {
					$scope.selectedPlayers.push(added[i]);
				}

				$state.go("^.list_players");
			};
		},
	});
	$stateProvider.state("game.list_scenarios", {
		url: "/choose_scenario",
		templateUrl: "pages/scenario.list.html",
		controller: function ($scope) {
			$scope.scenarios = scenarioStore.scenarios.slice(0);
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
	// 				scenarioStore.save($scope.scenario, $scope.oldScenarioName);
	// 				$scope.scenario = false;
	// 				$state.go("^.list_scenarios");
	// 			} else {
	// 				alert("Enter a name for the scenario");
	// 			}
	// 		};

	// 		$scope.removeScenario = function () {
	// 			scenarioStore.remove($scope.oldScenarioName);
	// 				$state.go("^.list_scenarios");
	// 		};
	// 	}
	// });

});

function reload($scope, $state) {
	$state.transitionTo($state.current, $scope, {
		reload: true,
		// Todo: figure out what inherit and notify do
		inherit: false,
		notify: true,
	});
}