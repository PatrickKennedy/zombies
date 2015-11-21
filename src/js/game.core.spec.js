describe('Game', function() {
  describe('GameManager', function() {
    beforeEach(module('game.core'));

    var game;
    beforeEach(inject(function(GameManager) {
      game = GameManager;
    }));

  });
});
