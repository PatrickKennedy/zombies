describe('Game', function() {
  describe('GameController', function() {
    beforeEach(module('game.core'));

    var game;
    beforeEach(inject(function(GameController) {
      game = GameController;
    }));

  });
});
