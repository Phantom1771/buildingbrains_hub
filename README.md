#Building Brains -- Hub


##Environment Setup
##openHab:
version: 1.8+

##Raspberry pi:
| wget -qO - 'https://bintray.com/user/downloadSubjectPublicKey?
 username=openhab' \| sudo apt-key add -

| echo "deb http://dl.bintray.com/openhab/apt-repo stable main" \| sudo
 tee /etc/apt/sources.list.d/openhab.list

| sudo apt-get update
| sudo apt-get install openhab-runtime
| sudo update-rc.d openhab defaults

| sudo chown -hR openhab:openhab /etc/openhab
| sudo chown -hR openhab:openhab /usr/share/openhab



