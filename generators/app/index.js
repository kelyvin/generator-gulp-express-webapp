'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the awesome ' + chalk.red('GulpExpressWeb') + ' generator!'
        ));

        this.log(chalk.magenta('Out of the box I include HTML5 Boilerplate, sass, an express server, and a gulpfile to build your app.'));

        var prompts = [{
            type: 'checkbox',
            name: 'features',
            message: 'What else would you like?',
            choices: [{
                name: 'Bootstrap',
                value: 'includeBootstrap',
                checked: true
            }, {
                name: 'FontAwesome',
                value: 'includeFontAwesome',
                checked: true
            }],
            default: true
        }, {
            type: 'confirm',
            name: 'includeJQuery',
            message: 'Would you like to include jQuery?',
            default: true,
            when: function(promptAnswers) {
                return promptAnswers.features.indexOf('includeBootstrap') === -1;
            }
        }];

        this.prompt(prompts, function(promptAnswers) {
            var features = promptAnswers.features;
            this.props = promptAnswers;

            function hasFeature(feat) {
                return features && features.indexOf(feat) !== -1;
            }

            this.includeBootstrap = hasFeature('includeBootstrap');
            this.includeFontAwesome = hasFeature('includeFontAwesome');
            this.includeJQuery = promptAnswers.includeJQuery;

            done();
        }.bind(this));

    },

    writing: {
        packageJson: function() {
            this.fs.copy(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
        },

        settings: function() {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );

            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },

        projectfiles: function() {
            this.fs.copy(
                this.templatePath('README.md'),
                this.destinationPath('README.md')
            );

            this.fs.copy(
                this.templatePath('favicon.ico'),
                this.destinationPath('app/favicon.ico')
            );
        },

        git: function() {
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );

            this.fs.copy(
                this.templatePath('gitattributes'),
                this.destinationPath('.gitattributes')
            );
        },

        gulp: function() {
            this.fs.copy(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );

            this.fs.copyTpl(
                this.templatePath('gulp/**/*'),
                this.destinationPath('gulp'), {
                    includeFontAwesome: this.includeFontAwesome
                }
            );
        },

        bower: function() {
            var bowerJson = {
                name: _s.slugify(this.appname),
                private: true,
                dependencies: {}
            };

            if (this.includeBootstrap) {
                bowerJson.dependencies['bootstrap-sass'] = '~3.3.5';
                bowerJson.overrides = {
                    'bootstrap-sass': {
                        'main': [
                            'assets/stylesheets/_bootstrap.scss',
                            'assets/fonts/bootstrap/*',
                            'assets/javascripts/bootstrap.js'
                        ]
                    }
                };
            } else if (this.includeJQuery) {
                bowerJson.dependencies.jquery = '~2.1.1';
            }

            if (this.includeFontAwesome) {
                bowerJson.dependencies['font-awesome'] = '~4.4.0';
            }


            this.fs.writeJSON('bower.json', bowerJson);
            this.fs.copy(
                this.templatePath('bowerrc'),
                this.destinationPath('.bowerrc')
            );
        },

        server: function() {
            this.fs.copy(
                this.templatePath('server/**/*'),
                this.destinationPath('server')
            );
        },

        app: function() {
            this.fs.copy(
                this.templatePath('app.js'),
                this.destinationPath('app.js')
            );
        },

        styles: function() {
            this.fs.copyTpl(
                this.templatePath('styles/**/*'),
                this.destinationPath('app/styles/'), {
                    includeBootstrap: this.includeBootstrap,
                    includeFontAwesome: this.includeFontAwesome
                }
            );
        },

        javascript: function() {
            this.fs.copy(
                this.templatePath('js/main.js'),
                this.destinationPath('app/js/main.js')
            );
        },

        html: function() {
            var bootstrapPath;

            // path prefix for Bootstrap JS files
            if (this.includeBootstrap) {
                bootstrapPath = '/bower_components/bootstrap-sass/assets/javascripts/bootstrap/';
            }

            this.fs.copyTpl(
                this.templatePath('index.html'),
                this.destinationPath('app/index.html'),
                {
                    appname: this.appname,
                    includeBootstrap: this.includeBootstrap,
                    includeFontAwesome: this.includeFontAwesome,
                    bootstrapPath: bootstrapPath,
                    bootstrapPlugins: [
                        'affix',
                        'alert',
                        'dropdown',
                        'tooltip',
                        'modal',
                        'transition',
                        'button',
                        'popover',
                        'carousel',
                        'scrollspy',
                        'collapse',
                        'tab'
                    ]
                }
            );
        },

        misc: function() {
            mkdirp('app/images');
            mkdirp('app/fonts');
        }

    },

    install: function() {
        this.installDependencies({
            skipInstall: this.options.skipInstall
        });
    },

    end: function() {
        var bowerJson = this.fs.readJSON(this.destinationPath('bower.json')),
            howToInstall = '\nAfter running ' +
                chalk.yellow.bold('npm install & bower install') + ', inject your' +
                '\nfront end dependencies by running ' +
                chalk.yellow.bold('gulp wiredep') +'.';

        if (this.options.skipInstall) {
            this.log(howToInstall);
            return;
        }

        // wire Bower packages to .html
        wiredep({
            bowerJson: bowerJson,
            directory: 'bower_components',
            exclude: ['bootstrap-sass', 'bootstrap.js'],
            ignorePath: /^(\.\.\/)*\.\./,
            src: 'app/index.html'
        });

        // wire Bower packages to .scss
        wiredep({
            bowerJson: bowerJson,
            directory: 'bower_components',
            src: 'app/styles/*.scss'
        });
    }
});
