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
    .directive('zombiesCardPreview', zombiesCardPreview)
    .controller('ZombiesCardPreviewCtrl', ZombiesCardPreviewCtrl)
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
    };

    Object.defineProperty(ctrl, "interactable", {
      get: function () {
        return !game.state.player.can_move || game.state.env.resolve_for_item;
      },
      enumerable: true,
    });
  }

  function zombiesCardPreview() {
    return {
      scope: {},
      bindToController: {
        card: '=ngModel',
      },
      templateUrl: 'cardpreview.jade',
      controller: 'ZombiesCardPreviewCtrl',
      controllerAs: 'ctrl',
    };
  }

  ZombiesCardPreviewCtrl.$inject = ['GameManager'];
  function ZombiesCardPreviewCtrl(game) {
    var ctrl = this;
    ctrl.resolve = function (){
      // TODO: Implement player feedback
      if (!ctrl.interactable)
        return;
      console.log('resolving card');
      game.resolve_card(game.state.hand, ctrl.deck);
      game.state.player.can_move = true;
    };

    ctrl.update_action_preview = function (){};

    Object.defineProperty(ctrl, "interactable", {
      get: function () { return game.state.hand.item; },
      enumerable: true,
    });
  }
}(angular));
