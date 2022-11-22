FOLDER_NAME=$1

if [ -d $FOLDER_NAME ]
then
  echo "$FOLDER_NAME already exists."
  return 1
fi

mkdir $FOLDER_NAME
cp -R ./DayTemplate ./$FOLDER_NAME/pt1
git add .
git commit -m "Init $FOLDER_NAME - pt1"
cd $FOLDER_NAME/pt1
