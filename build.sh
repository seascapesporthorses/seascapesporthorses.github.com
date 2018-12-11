#!/bin/bash

echo "Combine CSS"
cat css/fonts.css css/bootstrap.css css/landing-page.css > css/bundle.css

echo "Critical CSS"
purgecss --css css/bundle.css --content _includes/*.html _layouts/default.html --out .
mv bundle.css css/critical.css

echo "Minify CSS"
postcss css/critical.css > css/bundle.min.css

echo "Build Complete"
