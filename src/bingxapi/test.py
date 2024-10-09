def switchLeverage(self,leverage:int,symbol:str):
        """
            change leverage for both long/short position in one-way mode
            https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Set%20Leverage
        """
        payload={}
        path="/openApi/swap/v2/trade/leverage"
        method="POST"
        paramsMap={
            "leverage":leverage,
            "side":"BOTH",
            "symbol":symbol,
            "timestamp":int(time.time()*1000),
        }
        paramsStr=self.parseParam(paramsMap)
        return self.send_request(method,path,paramsStr,payload)

    def tradeOrder(self, symbol, type:Literal["LIMIT", "TRIGGER_LIMIT", "MARKET"], direction, risk, bal, limitPrice=None, slPrice=None, tpPrice=None):
        """
            place future order
            https://bingx-api.github.io/docs/#/en-us/swapV2/trade-api.html#Place%20order
        """

        direction=direction.upper()
        risk=float(risk)
        bal=float(bal)

        limitPrice=float(limitPrice)
        slPrice=float(slPrice)
        tpPrice=float(tpPrice)

        if direction=="LONG":
            side="BUY"
        if direction=="SHORT":
            side="SELL"

        diff=np.abs((limitPrice-slPrice)/slPrice)
            marginLimit=int(risk)
            riskPercent=50


    
        if direction=="LONG":
            res=(bal*marginLimit)/100
            diffPercent=diff*100
            leverage=riskPercent/diffPercent
            size=(res/limitPrice)*leverage
            leverage=self.switchLeverage(leverage=int(leverage),symbol=symbol)
            
            # print(f"long leverage {leverage}")

        if direction=="SHORT":
            res=(bal*marginLimit)/100
            diffPercent=diff*100
            leverage=riskPercent/diffPercent
            size=(res/limitPrice)*leverage
            leverage=self.switchLeverage(leverage=int(leverage),symbol=symbol)
            # print(f"short leverage {leverage}")

        payload={}
        path="/openApi/swap/v2/trade/order"
        method="POST"

        if type=="LIMIT":
            paramsMap={
                "symbol":symbol,
                "positionSide":"BOTH",
                "side":side,
                "type":type,
                "quantity":size,
                "price":limitPrice,
                "timestamp":int(time.time()*1000),
            }
        elif type=="TRIGGER_LIMIT":
            paramsMap={
                "symbol":symbol,
                "positionSide":"BOTH",
                "side":side,
                "type":type,
                "quantity":size,
                "stopPrice":limitPrice,
                "price":limitPrice,
                "timestamp":int(time.time()*1000),
            }
        elif type=="MARKET":
            self.switchLeverage(leverage, symbol)
            paramsMap={
                "symbol":symbol,
                "positionSide":"BOTH",
                "side":side,
                "type":type,
                "quantity":size,
                # "stopPrice":limitPrice,
                # "price":limitPrice,
                "timestamp":int(time.time()*1000),
            }

        paramsStr=self.parseParam(paramsMap)
        return self.send_request(method,path,paramsStr,payload)
