(function(angular){
  /*
   * Config module
   * Contains server-side configuration variables
   */
  angular.module('game.config', [])
    .provider('GameConfig', GameConfig)
  ;

  function GameConfig() {
    var config = Object.extended({
      user: null,
      cards: {},
      rules: {
        max_items: 2,
        max_weapons: 2,
      },
    });
    return {
      set: function (diff) {
        config = config.merge(diff);
      },
      $get: function () {
        return config;
      }
    };
  }

  /*
   * Core module
   * Contains core website logic
   */
  angular
    .module('game.core', [
      'game.config', 'game.board', 'game.deck', 'game.plugins'
    ])
    .service('GameManager', GameManager)
  ;

  GameManager.$inject = ['GameConfig', 'BoardManager', 'PluginMount'];
  function GameManager(config, board, Mount) {
    var ctrl = this;

    ctrl.defaults = {
      env: {
        time: 9,
        zombies: 0,
        resolve_for_item: false,
      },
      player: {
        position: "0:0",
        health: 6,
        attack: 1,
        items: [],
        weapons: [],
        totem: false,
        can_move: true,
      },
      hand: null,
      initalized: true,
      running: true,
    };

    ctrl.state = {};
    ctrl.decks = {};

    ctrl.board = board;

    ctrl.initalize = function () {
      ctrl.state = angular.copy(ctrl.defaults);
      ctrl.board.initalize();
    };

    ctrl.move_player = function (to_coord) {
      return Mount.get('game.core.move_player').run(ctrl, to_coord);
    };

    ctrl.draw_tile = function (deck) {
      return Mount.get('game.core.draw_tile').run(ctrl, deck);
    };

    ctrl.place_tile = function (point, tile) {
      return Mount.get('game.core.place_tile').run(ctrl, point, tile);
    };

    ctrl.draw_card = function(deck) {
      return Mount.get('game.core.draw_card').run(ctrl, deck);
    };

    ctrl.resolve_card = function(card) {
      return Mount.get('game.core.resolve_card').run(ctrl, card);
    };
  }

}(angular));
