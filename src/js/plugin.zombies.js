(function(angular){
  /*
   * Zombies Plugin
   * Contains all game logic related to the Zombies game mod
   */

  var plugin_name = 'plugin.zombies';
  angular
    .module(plugin_name, ['game.plugins'])
    .service('PluginZombies', PluginZombies)
  ;

  PluginZombies.$inject = ['PluginMount'];
  function PluginZombies(Mount) {
    var connect_check = Mount.get('game.board.placable.connects');
    connect_check.use(plugin_name, function(history, point, tile) {
      var ctrl = this;
      // TODO: for future safety something like history[0] && ... should be used
      return tile.exits.some(function(exit) {
        var vector = tile.vectors[exit]
            , exit_point = [
              point[0] + vector[0],
              point[1] + vector[1],
            ]
            ;
        exit_coord = ctrl.coord(exit_point);
        exit_tile = ctrl.tiles[exit_coord];
        if (exit_tile && exit_tile.has_exit)
          return exit_tile.has_exit((exit + 2) % 4);

        return false;
      }, this);
    });

    var move_player = Mount.get('game.core.move_player');
    move_player.use(plugin_name, function(history, to_coord) {
      var game = this
          , to_point = game.board.point(to_coord)
          , player_point = game.board.point(game.state.player.position)
          ;

      console.log("attempting to move player to ", to_point, " from ", player_point);
      console.log("can move?", game.board.walkable(player_point, to_point));
      if (!game.board.walkable(player_point, to_point))
        return false;

      game.state.player.position = to_coord;
      return true;
    });
  }
}(angular));
