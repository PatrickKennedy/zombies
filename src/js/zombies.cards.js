(function(angular){
  angular.module('game.config')
    .config(function (GameConfigProvider) {
      GameConfigProvider.set({
        cards: {
          indoor: [
            {
              id: 'foyer',
              name: 'Foyer',
              exits: [0],
            },
            {
              id: 'bathroom',
              name: 'Bathroom',
              exits: [0],
            },
            {
              id: 'bedroom',
              name: 'Bedroom',
              exits: [0, 3],
            },
            {
              id: 'family-room',
              name: 'Family Room',
              exits: [0, 1, 3],
            },
            {
              id: 'dining-room',
              name: 'Dining Room',
              exits: [0, 1, 2, 3],
            },
            {
              id: 'storage',
              name: 'Storage',
              exits: ctrl.EXITS.north,
              text: 'May draw a new card to find an item.',
              on_resolve: function(){ }
            },
            {
              id: 'kitchen',
              name: 'Kitchen',
              exits: [0, 1, 3],
              text: '+1 Health if end turn here.',
              on_turn_end: function(){ if (ctrl.state.player) ctrl.state.player.health += 1; }
            },
            {
              id: 'evil-temple',
              name: 'Evil Temple',
              exits: [1, 3],
              text: 'Resolve a new card to find totem.',
              on_resolve: function(){ if(ctrl.state.player) ctrl.state.player.totem = true; }
            },
          ],
          outdoor: [
            {
              id: 'patio',
              name: 'Patio',
              exits: [0],
            },
            {
              id: 'garage',
              name: 'Garage',
              exits: [2, 3],
            },
            {
              id: 'yard-1',
              name: 'Yard',
              exits: [1, 2, 3],
            },
            {
              id: 'yard-2',
              name: 'Yard',
              exits: [1, 2, 3],
            },
            {
              id: 'yard-3',
              name: 'Yard',
              exits: [1, 2, 3],
            },
            {
              id: 'sitting-area',
              name: 'Sitting Area',
              exits: [1, 2, 3],
            },
            {
              id: 'garden',
              name: 'Garden',
              exits: [1, 2, 3],
              text: '+1 Health if end turn here.',
              on_turn_end: function(){ if (ctrl.state.player) ctrl.state.player.health += 1; }
            },
            {
              id: 'graveyard',
              name: 'Graveyard',
              exits: [1, 2],
              text: 'Resolve a new card to bury totem.',
              on_resolve: function(){ }
            },
          ],
          dev: [],
        },
      });
    })

}(angular));
