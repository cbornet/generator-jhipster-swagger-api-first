const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);

module.exports = JhipsterGenerator.extend({
    initializing: {
        readConfig() {
            this.jhipsterAppConfig = this.getJhipsterAppConfig();
            if (!this.jhipsterAppConfig) {
                this.error('Can\'t read .yo-rc.json');
            }
        },
        displayLogo() {
            // it's here to show that you can use functions from generator-jhipster
            // this function is in: generator-jhipster/generators/generator-base.js
            this.printJHipsterLogo();

            // Have Yeoman greet the user.
            this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster swagger-api-first')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        },
        checkJhipster() {
            const jhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
            const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
            if (!semver.satisfies(jhipsterVersion, minimumJhipsterVersion)) {
                this.warning(`\nYour generated project used an old JHipster version (${jhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
            }
        }
    },

    /*prompting() {
        const prompts = [
            {
                type: 'input',
                name: 'message',
                message: 'Please put something',
                default: 'hello world!'
            }
        ];

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    },*/

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;
        const dockerDir = jhipsterConstants.DOCKER_DIR;

        // custom variables
        this.DOCKER_SWAGGER_EDITOR = "swaggerapi/swagger-editor:latest"

        // variable from questions
        //this.message = this.props.message;

        if (this.buildTool === 'maven') {
            let executions = '                ' +
                '<executions>' + '\n                ' +
                '    <execution>' + '\n                ' +
                '        <goals>' + '\n                ' +
                '            <goal>generate</goal>' + '\n                ' +
                '        </goals>' + '\n                ' +
                '        <configuration>' + '\n                ' +
                '            <inputSpec>src/main/resources/swagger/api.yml</inputSpec>' + '\n                ' +
                '            <language>spring</language>' + '\n                ' +
                `            <apiPackage>${this.packageName}.web.api.controller</apiPackage>` + '\n                ' +
                `            <modelPackage>${this.packageName}.web.api.model</modelPackage>` + '\n                ' +
                '            <generateSupportingFiles>false</generateSupportingFiles>' + '\n                ' +
                '            <configOptions>' + '\n                ' +
                '                <interfaceOnly>true</interfaceOnly>' + '\n                ' +
                '                <java8>true</java8>' + '\n                ' +
                '            </configOptions>' + '\n                ' +
                '        </configuration>' + '\n                ' +
                '    </execution>' + '\n                ' +
                '</executions>'
            

            this.addMavenPlugin('io.swagger', 'swagger-codegen-maven-plugin', '2.2.3', executions)
            this.template('_api.yml', resourceDir + 'swagger/api.yml');
            this.template('_swagger-editor.yml', dockerDir + '/swagger-editor.yml');
        }


        /*try {
            this.registerModule('generator-jhipster-swagger-api-first', 'entity', 'post', 'entity', 'JHipster module to support API first development using swagger');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }*/
    },

    /*install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    },*/

    end() {
        this.log('End of swagger-api-first generator');
    }
});
