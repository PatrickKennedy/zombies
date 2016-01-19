module.exports = function(grunt) {
  var config = require('./build.config.js')
      , plugins = require('matchdep').filterDev('grunt-*')
      , tasks
      ;

  plugins.forEach(grunt.loadNpmTasks);

  // Project configuration.
  tasks = {
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.license.type %> <<%= pkg.license.url %>>\n' +
        ' */\n'
    },

    clean: [
      '<%= build_dir %>',
   ],

    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
       ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.templates.dest %>',
       ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    concurrent: {
      serve_delta: {
        tasks: ['connect', 'delta'],
        options: {
          logConcurrentOutput: true,
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true,
        }
      }
    },

    copy: {
      build_app_assets: {
        files: [
          {
            src: ['**'],
            dest: '<%= build_dir %>/assets/',
            cwd: 'src/assets',
            expand: true
          }
      ]
      },
      build_vendor_assets: {
        files: [
          {
            src: ['<%= vendor_files.assets %>'],
            dest: '<%= build_dir %>/assets/',
            cwd: '.',
            expand: true,
            flatten: true
          }
      ]
      },
      build_appjs: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      },
      build_vendorjs: {
        files: [
          {
            src: ['<%= vendor_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      },
      build_appcss: {
        files: [
          {
            src: ['<%= app_files.css %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      },
      build_vendorcss: {
        files: [
          {
            src: ['<%= vendor_files.css %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      },
      compile_assets: {
        files: [
          {
            src: ['**'],
            dest: '<%= compile_dir %>/assets',
            cwd: '<%= build_dir %>/assets',
            expand: true
          },
          {
            src: ['<%= vendor_files.css %>'],
            dest: '<%= compile_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      }
    },

    delta: {
      options: {
        livereload: false
      },

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      jssrc: {
        files: [
          '<%= app_files.js %>'
       ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs']
      },

      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karma:unit:run' ],
        options: {
          livereload: false
        }
      },

      assets: {
        files: [
          'src/assets/**/*'
       ],
        tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
      },

      html: {
        files: ['<%= app_files.index %>'],
        tasks: ['index:build']
      },

      sass: {
        files: ['<%= app_files.sass %>'],
        tasks: ['sass:build']
      },

      templates: {
        files: ['<%= app_files.templates %>', '<%= app_files.includes %>'],
        tasks: ['html2js'],
        options: {
          spawn: false,
        }
      },

      index: {
        files: ['<%= app_files.index %>'],
        tasks: ['jade', 'index:build'],
        options: {
          spawn: false,
        }
      },

      css: {
        files: ['<%= app_files.css %>'],
        tasks: ['concat:build_css']
      },

      less: {
        files: ['src/**/*.less'],
        tasks: ['less:build']
      },
    },

    html2js: {
      options: {
        jade: {
          //this prevents auto expansion of empty arguments
          //e.g. "div(ui-view)" becomes "<div ui-view></div>"
          //     instead of "<div ui-view="ui-view"></div>"
          doctype: "html"
        },
        // remove the .tpl identifier from the compiled module address for cleanliness
        rename: function (moduleName) {
          return moduleName.replace('.tpl', '');
        }
      },
      templates: {
        options: {
          base: 'src/jade/',
          module: '<%= pkg.name %>.templates'
        },
        src: ['<%= app_files.templates %>'],
        dest: '<%= build_dir %>/<%= pkg.name %>.templates.js'
      }
    },

    index: {
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.templates.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
       ]
      },

      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
       ]
      }
    },

    jade: {
      debug: {
        options: {
          data: {
            debug: true
          }
        },
        files: {
          "<%= build_dir %>/debug.html": ["<%= app_files.index %>"]
        }
      },

      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          "<%= build_dir %>/index.tpl.html": ["<%= app_files.index %>"]
        }
      }
    },

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        laxcomma: true,
        "-W070": false, // Trailing Semicolon
        "-W116": false, // Bracketless If-statements
      },
      globals: {}
    },

    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.templates.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    sass: {
      build: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.sass %>',
        }
      },
      compile: {
        options: {
          style: 'compressed'
        },
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.sass %>',
        }
      }
    },

    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },
  };

  grunt.initConfig(grunt.util._.extend(tasks, config));


  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'karma:unit', 'concurrent:serve_delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build', 'karma:continuous', 'compile']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('build', [
    'clean',
    'html2js',
    'jade',
    'jshint',
    'sass:build',
    'concat:build_css',
    'copy:build_app_assets',
    'copy:build_vendor_assets',
    'copy:build_appjs',
    'copy:build_vendorjs',
    'copy:build_vendorcss',
    'index:build',
    'karmaconfig',
 ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('compile', [
    'copy:compile_assets',
    'concat:compile_js',
    //'uglify',
    'index:compile'
 ]);


  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS (files) {
    return files.filter(function (file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS (files) {
    return files.filter(function (file) {
      return file.match(/\.css$/);
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function () {
    var dirRE = new RegExp('^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g');
    var dest = this.data.dir + '/index.html';
    var data = {
      version: grunt.config('pkg.version'),
      scripts: filterForJS(this.filesSrc).map(function (file) {
        return file.replace(dirRE, '');
      }),
      styles: filterForCSS(this.filesSrc).map(function (file) {
        return file.replace(dirRE, '');
      }),
      script_include: null,
      style_include: null,
    };

    if (this.target == "compile") {
      data.script_include = grunt.file.read(grunt.config('compile_dir')+"/"+data.scripts[0]);
      data.style_include = grunt.file.read(grunt.config('build_dir')+"/"+data.styles[0]);
      data.scripts = null;
      data.styles = null;
      dest = grunt.config('compiled_name');
    }

    grunt.file.copy(grunt.config('build_dir')+'/index.tpl.html', dest, {
      process: function (contents, path) {
        return grunt.template.process(contents, { data: data });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy( 'karma/karma-unit.tpl.js', grunt.config( 'build_dir' ) + '/karma-unit.js', {
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
          }
        });
      }
    });
  });
};
