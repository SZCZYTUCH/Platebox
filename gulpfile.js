// Include gulp
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var stripDebug = require('gulp-strip-debug');
var nginclude = require('gulp-nginclude');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var del = require('del');
var dom  = require('gulp-dom');
//var htmlmin = require('gulp-htmlmin');
//var embedTemplates = require('gulp-angular-embed-templates');

var isForReleaseJs = function(file){
    var paramExists = (process.argv.indexOf("--release") > -1);
    var isJs = ( (file.path.slice(-3)) === ".js" ) ;
    return paramExists && isJs;
};

var isForReleaseJson = function(file){
    var paramExists = (process.argv.indexOf("--release") > -1);
    var isJson = ( (file.path.slice(-5)) === ".json" ) ;
    return paramExists && isJson;
};


//copy audio
gulp.task('copy_audio', function () {
    return gulp.src('app/assets/audio/*')
        .pipe(gulp.dest('www/assets/audio'))
        .pipe(gulp.dest('www/assets/audio'))
        .pipe(gulp.dest('www/assets/audio'));
});
//copy fonts
gulp.task('copy_fonts', function () {
    return gulp.src('app/assets/fonts/*')
        .pipe(gulp.dest('www/assets/fonts'))
        .pipe(gulp.dest('www/assets/fonts'))
        .pipe(gulp.dest('www/assets/fonts'));
});
//copy images
gulp.task('copy_imgs', function () {
    return gulp.src('app/assets/images/**/*')
        .pipe(gulp.dest('www/assets/images'))
        .pipe(gulp.dest('www/assets/images'))
        .pipe(gulp.dest('www/assets/images'));
});
//copy config file
gulp.task('copy_config', function () {
    return gulp.src('app/cnf/**/*')
        .pipe(gulp.dest('www/cnf'))
        .pipe(gulp.dest('www/cnf'))
        .pipe(gulp.dest('www/cnf'));
});

gulp.task('copy_templates', function () {
    return gulp.src(['app/templates/*'])
        //.pipe(htmlmin({collapseWhitespace: true, removeComments:true, caseSensitive:true}))
        .pipe(gulp.dest('www/templates'))
        .pipe(gulp.dest('www/templates'))
        .pipe(gulp.dest('www/templates'));
});


var transforDOM = function () {
    var scripts = this.querySelectorAll('script');
    var lastScript = scripts[scripts.length - 1].innerHTML;
    var s = '';

    var list1 = lastScript.split('var framework = ').pop().split('/* FRAMEWORK SCRIPT LIST END */').shift();
    var listArr1 = eval(list1);
    s += '\n<!-- build:js scripts/framework.min.js -->';
    listArr1.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';
    
    var list2 = lastScript.split('var minor_plugins = ').pop().split('/* MINOR_PLUGINS SCRIPT LIST END */').shift();
    var listArr2 = eval(list2);
    s += '\n<!-- build:js scripts/minor_plugins.min.js -->';
    listArr2.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';
    
    var list3 = lastScript.split('var tmsmui = ').pop().split('/* PLATEBOX SCRIPT LIST END */').shift();
    var listArr3 = eval(list3);
    s += '\n<!-- build:js scripts/tmsmui.min.js -->';
    listArr3.forEach(function(item, i, array) {
        s += '\n<script type="text/javascript" src="'+item+'"></script>';
    });
    s += '\n<!-- endbuild -->\n';

    var reg1 = new RegExp(/(\/\* FRAMEWORK SCRIPT LIST START \*\/)[\s\S]*?(\/\* FRAMEWORK SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* FRAMEWORK SCRIPT LIST START */\n\t\tvar framework = ["scripts/framework.min.js"];\n\t\t/* FRAMEWORK SCRIPT LIST END */');
    
    var reg1 = new RegExp(/(\/\* MINOR_PLUGINS SCRIPT LIST START \*\/)[\s\S]*?(\/\* MINOR_PLUGINS SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* MINOR_PLUGINS SCRIPT LIST START */\n\t\tvar minor_plugins = ["scripts/minor_plugins.min.js"];\n\t\t/* MINOR_PLUGINS SCRIPT LIST END */');
    
    var reg1 = new RegExp(/(\/\* PLATEBOX SCRIPT LIST START \*\/)[\s\S]*?(\/\* PLATEBOX SCRIPT LIST END \*\/)/);
    var lastScript = lastScript.replace(reg1, '/* PLATEBOX SCRIPT LIST START */\n\t\tvar tmsmui = ["scripts/tmsmui.min.js"];\n\t\t/* PLATEBOX SCRIPT LIST END */');

    this.getElementById('scri').innerHTML = s;

    scripts[scripts.length - 1].innerHTML = lastScript;
    
    return this;
};

var removeDung = function(){
    this.getElementById("scri").outerHTML = "";
    return this;  
};

// Concatenate & Minify JS,CSS 
gulp.task('conmini', function () {
    return gulp.src('app/index.html')
    
        .pipe(dom(transforDOM, false))

        .pipe(useref())
//        .pipe(gulpIf('*.js', embedTemplates({basePath:'./app'})))
        .pipe(gulpIf(isForReleaseJs, stripDebug()))
        .pipe(gulpIf(isForReleaseJs, uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('index.html', nginclude()))
        .pipe(gulpIf('index.html', dom(removeDung, false)))
//        .pipe(gulp.dest('dist/ios/www'))
        .pipe(gulp.dest('www'))
//        .pipe(gulpIf('index.html', replace('<!-- removeForWeb ', '')))
//        .pipe(gulpIf('index.html', replace(' removeForWeb -->', '')))
//        .pipe(gulp.dest('dist/web/www'));
});


// Watch Files For Changes
//gulp.task('watch', function() {
//    gulp.watch('js/*.js', ['lint', 'scripts']);
//    gulp.watch('scss/*.scss', ['sass']);
//});

// Default Task
gulp.task('compile', function (callback) {
    runSequence('copy_audio', 'copy_fonts', 'copy_imgs', 'copy_config', 'copy_templates', 'conmini',  callback);
});