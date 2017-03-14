#Hub Connector

## Install modules
1. `cd /<path>/<to>/connector`
2. `npm install`
3. `npm start`

## Documentation
###Json Format on requesting
{ <br/>
  secretekey: string, 			// Not used so far <br/>
  hubCode:string, 			// id of hub <br/>
  reqId: integer, 			// request id used by server <br/>
					// 0: 	initial state and end current connection <br/>
					// >0: 	has incomming command from backend <br/>
  optional(`response: json(string)`)	// respond of the last command<br/>
} <br/>


###Json Format on responding 
{ <br/>
  reqId: integer          			// request id used by server <br/>
						// 0: 	No incomming command <br/>
						// >0: 	having incomming command <br/>
  method: {GET|POSt}				// method used for <br/>
  itemname: {string|""}     			// empty string to query all items <br/>
  command: string {ON,OFF,INCREASE,DECREASE}	// defined in openhab document <br/>
}<br/>

