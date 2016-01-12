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
      // TODO: Implement player feedback
      if (!ctrl.interactable)
        return;
      console.log('drawing card');
      game.draw_tile(ctrl.deck);
    };

    Object.defineProperty(ctrl, "interactable", {
      get: function () { return game.state.player.can_move; },
      enumerable: true,
    });
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
      // TODO: Implement player feedback
      if (!ctrl.interactable)
        return;
      console.log('drawing card');
      game.draw_card(ctrl.deck);
      game.resolve_card(game.state.hand, ctrl.deck);
      game.state.player.can_move = true;
    };

    Object.defineProperty(ctrl, "interactable", {
      get: function () { return !game.state.player.can_move; },
      enumerable: true,
    });
  }
}(angular));
