let mix = require('laravel-mix');

mix.js(['src/alpine.min.js','src/app.js'], 'dist/app.js');
mix.sass('src/app.scss', 'dist/app.css');
