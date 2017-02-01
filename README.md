#Building Brains -- Hub


##Environment Setup

##openHab:
version: 1.8+

##Raspberry pi:
```
1. wget -qO - 'https://bintray.com/user/downloadSubjectPublicKey?username=openhab' | sudo apt-key add -
2. echo "deb http://dl.bintray.com/openhab/apt-repo stable main" | sudo tee /etc/apt/sources.list.d/openhab.list
3. sudo apt-get update
4. sudo apt-get install openhab-runtime
5. sudo update-rc.d openhab defaults
6. sudo chown -hR openhab:openhab /etc/openhab
7. sudo chown -hR openhab:openhab /usr/share/openhab
```



