#Hub Connector

## Install modules
1. `cd /<path>/<to>/connector`
2. `npm install`
3. `npm start`

## Documentation
#Json Format on requesting
{
  secretekey: string, 		// Not used so far
	hubCode:string, 				// id of hub
	reqId: integer, 				// request id used by server
													// 0: 	initial state and end current connection
													// >0: 	has incomming command from backend
	optional(`response: json(string)`)	// respond of the last command
}

#Json Format on responding 
{
    reqId: integer          		// request id used by server
																// =0: 	No incomming command
																// >0: 	having incomming command

    method: {GET|POSt}					// method used for 
    itemname: {string|""}     	// empty string to query all items
    command: string {ON,OFF,INCREASE,DECREASE}	// defined in openhab document
  }

