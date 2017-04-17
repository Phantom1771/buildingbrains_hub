#! /bin/bash

EXPECTED_DIR='/etc/openhab2/'
ROOT_PATH=$PWD

if [ "$EUID" -ne 0 ];	then
	echo "Please run as root"
	exit
fi

echo "Start setup"

if [ ! -d "$EXPECTED_DIR" ]; then
  echo "Please ensure openhab 2 is installed with apt"
	exit
fi

echo "Install npm packages"
cd "connector"
echo "change to pwd[$PWD]"
$(npm install --product) || (echo "Failed to install npm packages" && exit)

echo "Start moving files"

cd $ROOT_PATH
echo "change to pwd[$ROOT_PATH]"
$(cp -R ./connector $EXPECTED_DIR) || (echo "Failed to move connector" && exit)
echo "Moved connector"
EXPECTED_DIR="${EXPECTED_DIR}rules/"
$(cp -R ./openhab2/conf/rules/* $EXPECTED_DIR) || (echo "Failed to move openhab2 rules" && exit)
echo "Moved rules"

#echo "Change ower of files"
echo "Done"

