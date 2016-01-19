(function(angular){
  /*
   * Plugin module
   * Manages all plugin related overhead functionality
   *
   * Mounts are singletons created on-demand which store references to and
   * manage all actions and action-specific interactions.
   *
   * Plugins define actions which are assigned to different mounts, these
   * actions are hot-swappable and can be disabled when unneeded.
   *
   * There is no specified way mounts must return values, each mount should
   * document the arguments sent and expected return values.
   */
  angular
    .module('game.plugins', [])
    .service('PluginManager', PluginManager)
    .factory('PluginMount', PluginMount)
  ;


  PluginManager.$inject = [];
  function PluginManager() {
    var self = this;
    self.mounts = {};

    self.disable = function(plugin_name) {
      for (var mount in self.mounts) { mount.disable(plugin_name); }
    };

    self.enable = function(plugin_name) {
      for (var mount in self.mounts) { mount.enable(plugin_name); }
    };
  }

  PluginMount.$inject = ['PluginManager'];
  function PluginMount(manager) {
    var Mount = function(name) {
      var self = this;
      self.name = name;
      self.actions = {};
      self.disabled = {};
      manager.mounts[name] = self;
      manager.__defineGetter__(name, function(){ return self; });
    };

    Mount.get = function(mount_name) {
      return manager.mounts[mount_name] || new Mount(mount_name);
    };

    Mount.prototype.use = function(plugin_name, action) {
      var self = this;
      self.actions[plugin_name] = action;

      return {
        disable: function() { self.disable(plugin_name); },
        enable:  function() { self.enable(plugin_name); },
      };
    };

    Mount.prototype.enable = function(plugin_name) {
      if (typeof this.disabled[plugin_name] === "undefined")
        return false;

      this.actions[plugin_name] = this.disabled[plugin_name];
      delete this.disabled[plugin_name];

      return true;
    };

    Mount.prototype.disable = function(plugin_name) {
      if (typeof this.actions[plugin_name] === "undefined")
        return false;

      this.disabled[plugin_name] = this.actions[plugin_name];
      delete this.actions[plugin_name];

      return true;
    };

    Mount.prototype.run = function(context) {
      var self = this
          , args = Array.prototype.slice.call(arguments, 1)
          , result = null, prev_result = null
          ;

      // pad for future splices
      args.unshift(null);

      for (var plugin_name in self.actions) {
        prev_result = args.splice(0, 1, [result, prev_result])[0];
        result = self.actions[plugin_name].apply(context, args);
      }

      return result;
    };

    return Mount;
  }
}(angular));
