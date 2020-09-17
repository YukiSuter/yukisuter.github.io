#!/bin/bash

echo Please wait. Uploading to Git

git add .

echo Description of changes:
read mes

echo Will commit with message $mes 

git commit -m " $mes "

echo "Pushing..."
git push -u origin $bran