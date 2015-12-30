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
    .module('game.core', ['game.config', 'game.board', 'game.deck'])
    .service('GameManager', GameManager)
  ;

  GameManager.$inject = ['GameConfig', 'BoardManager', ];
  function GameManager(config, board) {
    var ctrl = this;

    ctrl.defaults = {
      env: {
        time: 9,
      },
      player: {
        position: "0:0",
        health: 6,
        attack: 1,
        items: [],
        weapons: [],
        totem: false,
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

    ctrl.move = function () {

    };

    ctrl.move_player = function () {

    };

    ctrl.draw_tile = function (point, tile) {

    };

    ctrl.place_tile = function (point, tile) {

    };

    ctrl.draw_card = function() {

    };

    ctrl.resolve_card = function() {

    };
  }

}(angular));
