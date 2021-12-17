type TCoinGeckoResponse = {
    market_caps: Array<number[]>;
    prices: Array<number[]>;
    total_volumes: Array<number[]>;
};

type TMarketChartRangeQueryParams = {
    vs_currency: string;
    from: number;
    to: number;
}

export type { TCoinGeckoResponse, TMarketChartRangeQueryParams }