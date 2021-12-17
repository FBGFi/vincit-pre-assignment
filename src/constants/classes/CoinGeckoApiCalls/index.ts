import { ApiCalls } from "constants/interfaces/ApiCalls";
import { TCoinGeckoResponse, TMarketChartRangeQueryParams } from "./types";

export class CoinGeckoApiCalls extends ApiCalls {
    /**
     * @author Aleksi
     * @description Returns list of all supported coins, however the list contains around 11k results, so no real use for this
     * @param callback - callback function to handle the response
     */
    public getSupportedCoins(callback: (response: Object) => void): void {
        this.fetch("/coins/list", callback);
    }
    public getMarketChartRange(
        id: string,
        callback: (response: TCoinGeckoResponse) => void,
        queryParams: TMarketChartRangeQueryParams): void {
        this.fetch(`/coins/${id}/market_chart/range`, callback, queryParams);
    }
}