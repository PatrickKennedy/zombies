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
              exits: [0],
              text: 'May draw a new card to find an item.',
              on_resolve: function(){ }
            },
            {
              id: 'kitchen',
              name: 'Kitchen',
              exits: [0, 1, 3],
              text: '+1 Health if end turn here.',
              on_turn_end: function(game){ if (game.state.player) game.state.player.health += 1; }
            },
            {
              id: 'evil-temple',
              name: 'Evil Temple',
              exits: [1, 3],
              text: 'Resolve a new card to find totem.',
              on_resolve: function(game){ if(game.state.player) game.state.player.totem = true; }
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
              on_turn_end: function(game){ if (game.state.player) game.state.player.health += 1; }
            },
            {
              id: 'graveyard',
              name: 'Graveyard',
              exits: [1, 2],
              text: 'Resolve a new card to bury totem.',
              on_resolve: function(){ }
            },
          ],

          dev: [
          {
            item: {
              desc: 'Grisly Femur',
              result: function(game) { game.state.player.weapon = 'femur'; },
            },
            9: {
              desc: 'ITEM',
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
            10: {
              desc: '5 Zombies',
              result: function(game) { game.state.env.zombies = 5; },
            },
            11: {
              desc: "Your soul isn't wanted here. -1 HEALTH",
              result: function(game) { game.state.player.health -= 1; },
            },
          },
          {
            item: {
              desc: 'Gasoline',
              result: function(game) { game.state.player.item = 'gas'; },
            },
            9: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
            10: {
              desc: 'You sense your impending doom. -1 HEALTH',
              result: function(game) { game.state.player.health -= 1; },
            },
            11: {
              desc: "ITEM",
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
          },
          {
            item: {
              desc: 'Chainsaw',
              result: function(game) { game.state.player.item = 'saw'; },
            },
            9: {
                desc: '3 Zombies',
                result: function(game) { game.state.env.zombies = 3; },
            },
            10: {
                desc: 'You hear terrible screams',
                result: function(game) { },
            },
            11: {
                desc: '5 Zombies',
                result: function(game) { game.state.env.zombies = 5; },
            },
          },
          {
            item: {
              desc: 'Board with Nails',
              result: function(game) { game.state.player.item = 'board'; },
            },
            9: {
              desc: "ITEM",
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
            10: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
            11: {
              desc: 'Something icky in your mouth. -1 HEALTH',
              result: function(game) { game.state.player.health -= 1; },
            },
          },
          {
            item: {
              desc: 'Board with Nails',
              result: function(game) { game.state.player.item = 'board'; },
            },
            9: {
              desc: 'Slip on nasty goo. -1 HEALTH',
              result: function(game) { game.state.player.health -= 1; },
            },
            10: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
            11: {
              desc: 'The smell of blood is in the air.',
              result: function(game) { },
            },
          },
          {
            item: {
              desc: 'Machete',
              result: function(game) { game.state.player.item = 'machete'; },
            },
            9: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
            10: {
              desc: 'The smell of blood is in the air.',
              result: function(game) { },
            },
            11: {
              desc: '6 Zombies',
              result: function(game) { game.state.env.zombies = 6; },
            },
          },
          {
            item: {
              desc: 'Can of Soda',
              result: function(game) { game.state.player.item = 'soda'; },
            },
            9: {
              desc: 'Candybar in your pocket. +1 HEALTH',
              result: function(game) { game.state.player.health += 1; },
            },
            10: {
              desc: "ITEM",
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
            11: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
          },
          {
            item: {
              desc: 'Candle',
              result: function(game) { game.state.player.item = 'candle'; },
            },
            9: {
              desc: 'Candybar in your pocket. +1 HEALTH',
              result: function(game) { game.state.player.health += 1; },
            },
            10: {
              desc: "ITEM",
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
            11: {
              desc: '4 Zombies',
              result: function(game) { game.state.env.zombies = 4; },
            },
          },
          {
            item: {
              desc: 'Oil',
              result: function(game) { game.state.player.item = 'oil'; },
            },
            9: {
              desc: 'You try hard not to wet yourself.',
              result: function(game) { },
            },
            10: {
              desc: "ITEM",
              result: function(game) { game.state.env.resolve_for_item = true; },
            },
            11: {
              desc: '6 Zombies',
              result: function(game) { game.state.env.zombies = 6; },
            },
          },
          ],
        },
      });
    });

}(angular));
