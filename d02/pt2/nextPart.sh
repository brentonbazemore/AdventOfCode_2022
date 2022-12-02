if [ -d ../pt2 ]
then
  echo "pt2 already exists."
  return 1
fi

git add .
git commit -m "Finish $FOLDER_NAME - pt1"

cd ..
cp -R ./pt1 ./pt2
git add .
git commit -m "Init $FOLDER_NAME - pt2"
cd ./pt2
