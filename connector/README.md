#Hub Connector

## Install modules
1. `cd /<path>/<to>
2. `npm install`
3. `npm start`

## Documentation
###Json Format on requesting
>{ <br/>
>  secretekey: string,
>  hubCode:string,
>  reqId: integer,
>  optional(`response: json(string)`)
>} <br/>
> secretekey: not used
> hubCode: id of hub
> reqId: 0, regular request; >0, response is valid
> 


###Json Format on responding (basic fields expected)
>{ <br/>
>  reqId: integer
>  method: {GET|POSt}
>  itemname: {string|""}
>  command: string {ON,OFF,INCREASE,DECREASE}
>}<br/>
> reqId: 0, regular request; >0, response is valid
> method: method used on hub
> itemname: query all items when itemsname is empty stirng
> command: command of openhab
