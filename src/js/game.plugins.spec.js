describe('Game', function() {
  describe('Plugins', function() {
    var manager
        , Mount
        ;

    beforeEach(module('game.plugins'));

    beforeEach(inject(function(PluginManager, PluginMount) {
      manager = PluginManager;
      Mount = PluginMount;

      this.generate_default_state = function () {
        for (var mount in manager.mounts) { delete manager.mounts[mount]; }
        var initializers = new Mount('initializers');
        var filters = new Mount('filters');

        initializers.use('plugin_1', function(last, arg) { return arg; });
        initializers.use('plugin_3', function(last, arg) { return arg; });
        filters.use('plugin_1', function(last, arg) { return arg; });

        initializers.disabled['plugin_2'] = function(arg) { return arg; };
      };
    }));

    it('should have a PluginManager', function() {
      expect(manager).toBeDefined();
    });

    it('should have a PluginMount', function() {
      expect(Mount).toBeDefined();
    });


    xdescribe('Manager', function() {});

    describe('Mount', function() {
      beforeEach(function() {});

      describe('constructor', function() {
        it('should add new mounts to the manager', function(){
          var initializers = new Mount('initializers');

          expect(manager.mounts.initializers).toBe(initializers);
        });

        it('should get or add new mounts to the manager', function(){
          var initializers = Mount.get('initializers');

          expect(manager.mounts.initializers).toBe(initializers);
        });

        it('should add new plugin action to the mount', function(){
          var initializers = new Mount('initializers');
          var test_plugin = initializers.use('test_plugin', function(){});

          expect(initializers.actions.test_plugin).toBeDefined();
        });
      });

      describe('.disable', function() {
        beforeEach(function() {
          this.generate_default_state();
        });

        it('should disable the created plugin action', function(){
          var initializers = Mount.get('initializers');

          expect(initializers.disable('plugin_1')).toBe(true);

          expect(initializers.actions.plugin_1).not.toBeDefined();
          expect(initializers.disabled.plugin_1).toBeDefined();
        });
      });

      describe('.enable', function() {
        beforeEach(function() {
          this.generate_default_state();
        });

        it('should enable the disabled plugin action', function(){
          var initializers = Mount.get('initializers');
          expect(initializers.disabled.plugin_2).toBeDefined();

          expect(initializers.enable('plugin_2')).toBe(true);

          expect(initializers.actions.plugin_2).toBeDefined();
          expect(initializers.disabled.plugin_2).not.toBeDefined();
        });
      });

      describe('.run', function() {
        beforeEach(function() {
          this.generate_default_state();
        });

        it('should run enabled actions', function(){
          var initializers = Mount.get('initializers');

          spyOn(initializers.actions, 'plugin_1').and.callThrough();
          spyOn(initializers.actions, 'plugin_3').and.callThrough();
          spyOn(initializers.disabled, 'plugin_2');

          initializers.run(null, 'bacon and eggs');

          expect(initializers.actions.plugin_1)
            .toHaveBeenCalledWith([null, null], 'bacon and eggs');
          expect(initializers.actions.plugin_3)
            .toHaveBeenCalledWith(['bacon and eggs', null], 'bacon and eggs');
          expect(initializers.disabled.plugin_2).not.toHaveBeenCalled();
        });
      });
    });
  });
});
