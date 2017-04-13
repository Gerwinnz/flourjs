
/*
|
|
| REQURE TASK
|
| Load and set the gulp modules we need for our stack
|
|
*/
var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var wrap = require('gulp-wrap'); 
var template = require('gulp-template');




/*
|
| BUILD
|
*/
var randomString = function(length)
{
  var result = '';
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i){
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
};





















/*
|
|
| COMPILE TASK
|
| Compile the flour.js src
|
|
*/
gulp.task('compile', function()
{
  var fileName = 'flour.js';
  del(['dist/' + fileName]);

  return gulp.src([
      'src/flour/*.js'
    ])
    .pipe(concat(fileName))
    .pipe(gulp.dest('dist'));
});



gulp.task('minify', function()
{
  var fileName = 'flour.min.js';
  del(['dist/' + fileName]);

  return gulp.src([
      'dist/flour.js'
    ])
    .pipe(concat(fileName))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});


























/*
|
|
| COMPILE FLOUR LOG TASK
|
| Add the views, templates, css and log init code together
|
|
*/
var logTemplateVars = {
  'css': ''
};



gulp.task('compile_log', function() 
{
  var fileName = 'flour.log.js';
  del(['dist/' + fileName]);  

  return gulp.src([
      'src/log/views/*.js',
      'src/log/templates.js',
      'src/log/init.js',
    ])
    .pipe(concat(fileName))
    .pipe(template(logTemplateVars))
    .pipe(gulp.dest('dist'));
});


gulp.task('minify_log', function()
{
  var fileName = 'flour.log.min.js';
  del(['dist/' + fileName]);

  return gulp.src([
      'dist/flour.log.js'
    ])
    .pipe(concat(fileName))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});




/*
|
|
| Create templates.js file containing all flour log templates
|
|
*/
gulp.task('compile_log_templates', function()
{
  return gulp.src('src/log/templates/**/*.html')
    .pipe(wrap('flour.addTemplate(\'flour_<%= parseName(file.relative) %>\', \'<%= parseContents(contents) %>\');', {}, {
      imports: {
        parseName: function(name){
          name = name.replace(/\\/g, '/');
          name = name.replace('.html', '');

          return name;
        },
        parseContents: function(contents){
          contents = contents.toString();
          contents = contents.replace(/\\/g,'\\\\');
          contents = contents.replace(/\'/g,'\\\'');
          contents = contents.replace(/\"/g,'\\"');
          contents = contents.replace(/\0/g,'\\0');
          contents = contents.replace(/(\r\n|\n|\r|\t)/g, '');
          
          return contents;
        }
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('src/log/'));
});



/*
|
|
| Compile log css
|
|
*/
gulp.task('compile_log_css', function()
{
  logTemplateVars.css = '';

  return gulp.src('src/log/css/**/*.css')
    .pipe(wrap('<%= parseContents(contents) %>', {}, {
      imports: {
        parseContents: function(contents){
          contents = contents.toString();
          contents = contents.replace(/\\/g,'\\\\');
          contents = contents.replace(/\'/g,'\\\'');
          contents = contents.replace(/\"/g,'\\"');
          contents = contents.replace(/\0/g,'\\0');
          contents = contents.replace(/(\r\n|\n|\r|\t)/g, '');
          
          logTemplateVars.css += contents;
        }
      }
    }));
});














































/*
|
|
| CLEANUP TASK
|
| Remove all our files from dist
|
|
*/
gulp.task('clean', function(cb) 
{  
  del(['dist/*.js'], cb);
});






/*
|
|
| BUILD TASK
|
| Builds all the required files by running the tasks once
|
|
*/
gulp.task('build', function()
{
  gulp.start(['minify', 'minify_log']);
});





/*
|
|
| WATCH TASK
|
| This watches our src files and re-compiles on changes
|
|
*/
gulp.task('watch', ['clean', 'compile', 'compile_log_css', 'compile_log_templates', 'compile_log'], function()
{
  // Watch flour src
  gulp.watch('src/flour/**/*.js', ['compile']);

  // Watch log code
  gulp.watch('src/log/*.js', ['compile_log']);
  gulp.watch('src/log/views/*.js', ['compile_log']);
  gulp.watch('src/log/css/*.css', ['compile_log_css', 'compile_log']);
  gulp.watch('src/log/templates/*.html', ['compile_log_templates']);
});






