module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      dist: {                            // Target
        files: {                         // Dictionary of files
          'public/index.html': 'src/index.jade'
        }
      },
    },
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: 'src/styles',
          cssDir: 'public/styles'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'public',
          keepalive: true,
          hostname: "*",
          open: {
            target: '127.0.0.1:9001', // target url to open
          },
          livereload: 9000
        }
      }
    },
    copy: {
      js: {
        expand: true,
        cwd: 'src/javascripts',
        src: '**',
        dest: 'public/javascripts',
        flatten: false,
        filter: 'isFile'
      },
      img: {
        expand: true,
        cwd: 'src/img',
        src: '**',
        dest: 'public/img',
        flatten: false,
        filter: 'isFile'
      },
      fonts: {
        expand: true,
        cwd: 'src/webfonts',
        src: '**',
        dest: 'public/webfonts',
        flatten: false,
        filter: 'isFile'
      }
    },
    clean: {
      public: ["public/"]
    },
    uglify: {
      js: {
        files: {
          'public/javascripts/app.min.js': ['public/javascripts/app.js']
        }
      },
    },
    watch: {
      options: {
        livereload: {
          port: 9000
        }
      },
      scripts: {
        files: ['src/javascripts/**/*.js'],
        tasks: ['copy']
      },
      scss: {
        files: ['src/styles/**/*.scss'],
        tasks: ['compass']
      },
      jade: {
        files: ["src/index.jade"],
        tasks: ['jade']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['clean:public', 'jade', 'compass', 'copy', 'watch']);

};
