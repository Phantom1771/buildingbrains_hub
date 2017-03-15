#Hub Connector

## Install modules
1. `cd /<path>/<to>
2. `npm install`
3. `npm start`

## Documentation
###Json Format on requesting
>{ <br/>
>  secretekey: string,<br/>
>  hubCode:string,<br/>
>  reqId: integer,<br/>
>  optional(`response: json(string)`)<br/>
>} <br/>
> secretekey: not used<br/>
> hubCode: id of hub<br/>
> reqId: 0, regular request; >0, response is valid<br/>


###Json Format on responding (basic fields expected)
>{ <br/>
>  reqId: integer<br/>
>  method: {GET|POSt}<br/>
>  itemname: {string|""}<br/>
>  command: string {ON,OFF,INCREASE,DECREASE}<br/>
>}<br/>
> reqId: 0, regular request; >0, response is valid<br/>
> method: method used on hub<br/>
> itemname: query all items when itemsname is empty stirng<br/>
> command: command of openhab<br/>
