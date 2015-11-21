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
      'zombies.templates', 'zombies.config', 'game.config', 'game.core', 'zombies.view',
    ])
    .controller('ZombiesController', ZombiesController)
  ;

  ZombiesController.$inject = ['$scope', 'ZombiesConfig', 'GameConfig', 'GameController'];
  function ZombiesController($scope, config, game_config, game_ctrl) {
    $scope.config = config;
    $scope.game_config = game_config;
    game = game_ctrl;

  }
}(angular));
