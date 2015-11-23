(function(angular){
  /*
   * Deck module
   * Contains the display logic for various decks used
   */
  angular
    .module('zombies.decks', [])
    .directive('zombiesDevDraw', zombiesDevDraw)
    .controller('ZombiesDevDrawCtrl', ZombiesDevDrawCtrl)
    .directive('zombiesTileDraw', zombiesTileDraw)
    .controller('ZombiesTileDrawCtrl', ZombiesTileDrawCtrl)
  ;

  function zombiesTileDraw() {
    return {
      scope: {},
      bindToController: {
        deck: '=ngModel',
      },
      templateUrl: 'tiledraw.jade',
      controller: 'ZombiesTileDrawCtrl',
      controllerAs: 'ctrl',
    };
  }

  ZombiesTileDrawCtrl.$inject = ['$scope'];
  function ZombiesTileDrawCtrl($scope) {
    var ctrl = this;
  }


  function zombiesDevDraw() {
    return {
      scope: {},
      bindToController: {
        deck: '=ngModel',
      },
      templateUrl: 'devdraw.jade',
      controller: 'ZombiesDevDrawCtrl',
      controllerAs: 'ctrl',
    };
  }

  ZombiesDevDrawCtrl.$inject = ['$scope'];
  function ZombiesDevDrawCtrl($scope) {
    var ctrl = this;
  }
}(angular));
