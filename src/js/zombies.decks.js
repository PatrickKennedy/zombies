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

  ZombiesTileDrawCtrl.$inject = ['GameManager'];
  function ZombiesTileDrawCtrl(game) {
    var ctrl = this;
    ctrl.draw = function (){
      console.log('drawing card');
      game.hand = ctrl.deck.draw();
    };
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

  ZombiesDevDrawCtrl.$inject = ['GameManager'];
  function ZombiesDevDrawCtrl(game) {
    var ctrl = this;
    ctrl.draw = function (){
      console.log('drawing card');
      game.hand = ctrl.deck.draw();
    };
  }
}(angular));
