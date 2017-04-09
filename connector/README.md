#Hub Connector  

## Install modules and Run  
1. npm install  
2. npm start  

### app.js  
`registerHub`    
Register the hub. On success,The app starts to check updates    
from backend server and check new device from openhab.    
On failure, register again after an time interval.    

`registerNewDevices`    
Start the routine to register new devices    
1. request data from openhab,		GET 	/rest/inbox    
2. approve thing.UID to openhab, 	POST 	/rest/inbox/*thing.UID*/approve    
3. request thing from openhab, 		GET 	/rest/*thing.UID*    
4. request state of item, 			GET 	/rest/*thing.linkeditem[0]*  H  
5. register device   

`prepareDeviceInfo`    
prepare the device info as Backend required  
by retrieving the thing with devInfo.thingUID  
**Don't guurantee the state is initialized  

`registerDevice`    
register the device with the request [GET, /devices/register]  
param:    
    device: {deviceLink, type, category, state}  

`checkupdates`    
Send request to request POST, /hubs/checkUpdates  
and handle the response from Back-end server  

`startCheckNewDevices`    
start the procedures to check new device from openhab  
in the time interval  

`startCheckupdates`    
start the procedures to check updates from backend server  
in the time interval  
 
### src/hub.js  

`getbaseUrl`    
return base rest api url  

`getInboxUrl`    
return url for /rest/inbox  

`getThingUrl`    
return url for /rest/thing/*thingUID*  

`getItemUrl`    
return url for /rest/items/*itemname*  

`getApproveDevOptions`    
construct options for approving thingUID  
param:   
    device = {label:string, thingUID:string}  
return: object  

`getSendCmdOptions`    
construct options for send command to a device  
param:   
    update = {deviceLink:string, setting:stringnumber}  
return: object  

### src/server.js  

`getUrl`    
construct options with type  
getCheckupdateOptions	  
construct options for checking updates  
param:    
    cxt = {hardware:{hubcode:string, secreteCode:string}  
return: object  

`getRegisterhubOptions`    
construct options for registering hub  
param:    
    cxt = {hardware:{hubcode:string, secreteCode:string}  
return: object  

`getRegisterdeviceOptions`    
construct options for registering device  
param:    
    cxt: {hardware:{hubcode:string, secreteCode:string}  
device: {deviceLink:string, type:string, category:string, state:stringnumber}  
return: object
