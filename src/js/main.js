(function(angular){
  /*
   * Config module
   * Contains server-side configuration variables
   */
  angular.module('zombies.config', [])
    .provider('ZombiesConfig', ZombiesConfig)
  ;

  function ZombiesConfig() {
    var config = Object.extended({
      user: null,
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
    .module('zombies', [
      'zombies.templates', 'zombies.config', 'game.core', 'zombies.cribsheet', 'zombies.view',
    ])
    .controller('ZombiesController', ZombiesController)
  ;

  ZombiesController.$inject = [
    '$scope', 'ZombiesConfig',
    'GameConfig', 'GameManager',
    'DeckManager', 'BoardTile',
  ];
  function ZombiesController($scope, config, game_config, game, Deck, Tile) {
    var ctrl = this;
    $scope.config = config;
    $scope.game_config = game_config;
    $scope.initalize_game = function(){
      console.log('initalizing game');
      ctrl.initalize_decks();
      game.initalize();
      game.board.place_tile([0,0], game.decks.indoor.draw());
    };

    ctrl.game = game;

    ctrl.initalize_decks = function() {
      var hold;
      game.decks = {
        indoor:   new Deck(game_config.cards.indoor.slice().map(function(t){ return new Tile(t); })),
        outdoor:  new Deck(game_config.cards.outdoor.slice().map(function(t){ return new Tile(t); })),
        dev:      new Deck(game_config.cards.dev.slice().map(function(t){ return new Tile(t); })),
      };

      // the top of the card definitions (foyer) is always the first card we want to draw
      hold = game.decks.indoor.draw(1, true);
      game.decks.indoor.shuffle().discard(hold).combine();
      // the same is true for the patio
      hold = game.decks.outdoor.draw(1, true);
      game.decks.outdoor.shuffle().discard(hold).combine();
      game.decks.dev.shuffle();
    };
  }
}(angular));
