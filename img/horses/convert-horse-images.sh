#! /bin/sh
for file in "$@"; do
  name=`basename $file .jpg`
  convert $name.jpg -resize 640x640^ $name-small.jpg
  cwebp -q 80 $name.jpg -o $name.webp
  cwebp -q 80 $name-small.jpg -o $name-small.webp
done
