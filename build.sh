#!/bin/bash

echo "Combine CSS"
cat css/fonts.css css/bootstrap.css css/landing-page.css > ./bundle.css

echo "Critical CSS"
purgecss --css ./bundle.css --content _includes/*.html _layouts/default.html --out css
rm bundle.css

echo "Minify CSS"
postcss css/bundle.css > css/bundle.min.css
rm css/bundle.css

echo "Build Complete"
