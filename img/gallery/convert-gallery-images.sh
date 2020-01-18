#! /bin/sh
for file in "$@"; do
  name=`basename $file .jpg`
  convert -strip -resize 300x300^ -interlace Plane -quality 85% $name.jpg $name-small.jpg
  convert -strip -resize 150x150^ -interlace Plane -quality 85% $name.jpg $name-thumb.jpg
  cwebp -q 80 $name-small.jpg -o $name-small.webp
done
