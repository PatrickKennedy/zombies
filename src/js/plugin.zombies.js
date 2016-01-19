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
      if (!game.state.player.can_move || !game.board.walkable(player_point, to_point))
        return false;

      game.state.player.position = to_coord;
      game.state.player.can_move = false;
      return true;
    });


    var draw_tile = Mount.get('game.core.draw_tile');
    draw_tile.use(plugin_name, function(history, deck) {
      var game = this;
      game.state.hand = deck.draw();
    });


    var place_tile = Mount.get('game.core.place_tile');
    place_tile.use(plugin_name, function(history, point, tile) {
      var game = this;
      console.log("attempting to place tile at ", point);
      try {
        game.board.place_tile(point, game.state.hand);
      } catch(e) {
        console.log(e);
        return false;
      }

      game.state.hand = null;
      game.board.events += 1;
      game.move_player(game.board.coord(point));
      return true;
    });


    var draw_card = Mount.get('game.core.draw_card');
    draw_card.use(plugin_name, function(history, deck) {
      var game = this;
      if (deck.stock.length === 0) {
        deck.combine().shuffle().burn(2);
      }
      game.state.hand = deck.draw();
    });


    var resolve_card = Mount.get('game.core.resolve_card');
    var resolve_combat = Mount.get('game.core.resolve_combat');
    resolve_card.use(plugin_name, function(history, card) {
      var game = this;
      console.log("resolving dev card: ", card);
      if (game.state.env.resolve_for_item) {
        card.item.result(game);
        game.state.env.resolve_for_item = false;
      } else {
        card[game.state.env.time].result(game);
      }

      if (game.state.env.zombies)
        resolve_combat.run(game);

      game.state.player.can_move = true;

      // TODO: Move to a post-mount after that system is implemented
      game.state.hand = null;
      card.discard();
      if (card.deck.stock.length === 0) {
        game.state.env.time += 1;
        card.deck.combine().shuffle().burn(2);
      }
    });

    resolve_combat.use(plugin_name, function(history) {
      var game = this;
      game.state.player.health -= game.state.env.zombies - game.state.player.attack;
      game.state.env.zombies = 0;
    });
  }
}(angular));
