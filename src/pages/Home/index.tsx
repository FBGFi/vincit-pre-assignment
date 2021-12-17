import React, { createRef, useState } from 'react';
import './Home.scss';

import Form from 'components/Form';
import Page from 'pages/Page';
import DateInput from 'components/Form/DateInput';
import { CoinGeckoApiCalls } from 'constants/classes/CoinGeckoApiCalls';
import { routes } from 'constants/routes';
import { dateToTimeStamp, timeStampToDate, timeStampToDateInputFormat } from 'constants/functions/conversions';
import Modal from 'components/Modal';
import DataChart from 'components/DataChart';
import { TCoinGeckoResponse } from 'constants/classes/CoinGeckoApiCalls/types';
import LoadingIndicator from 'components/LoadingIndicator';


type THighestVolume = {
    date: string,
    volume: number
}

type TDownWardDays = {
    start: string,
    end: string,
    length: number
}

type TBestProfitDates = {
    buy: { date: string, price: number },
    sell: { date: string, price: number }
}

const Home: React.FC = () => {
    const [loading, isLoading] = useState(false);
    const [modalHidden, hideModal] = useState(true);
    const [dataChart, setDataChart] = useState<JSX.Element | null>(null);
    const [highestVolume, setHighestVolume] = useState<THighestVolume | null>(null);
    const [downWardDays, setDownWardDays] = useState<TDownWardDays | null>(null);
    const [bestProfitDates, setBestProfitDates] = useState<TBestProfitDates | null>(null);
    const [startDateMax, setStartDateMax] = useState<string>(timeStampToDateInputFormat(new Date(Date.now())));
    const [endDateMin, setEndDateMin] = useState<string | undefined>(undefined);
    
    const bitCoinRangeFormRef = createRef<HTMLFormElement>();
    const apiCalls = new CoinGeckoApiCalls(routes.coinGecko);

    const formatResponseArray = (arr: Array<number[]>): { [key: string]: number } => {
        const formatted: { [key: string]: number } = {};
        let date: string;
        for (let obj of arr) {           
            date = timeStampToDate(new Date(obj[0]));
            // this will set the last value (closest to midnight)
            formatted[date] = obj[1];

            // this would return highest value for the date
            // if (!formatted[date] || formatted[date] < obj[1]) {
            //     formatted[date] = obj[1];
            // }
        }
        
        return formatted;
    }

    const getHighestVolume = (total_volumes: Array<number[]>): THighestVolume | null => {
        const volumes = formatResponseArray(total_volumes);
        let highestVolume = 0;
        let highestDate = "";
        
        for (let date in volumes) {
            if (highestVolume < volumes[date]) {
                highestVolume = volumes[date];
                highestDate = date;
            }
        }
        if (highestDate === "") return null;
        return { date: highestDate, volume: highestVolume }
    }

    const getDownWardTrendDays = (total_prices: Array<number[]>): TDownWardDays | null => {
        const prices = formatResponseArray(total_prices);
        
        let highestDownWardDays = 0;
        let currentDownWardDays = 0;
        let downWardEnd = "";
        let previousDate = "";
        for (let date in prices) {
            if (prices[previousDate] && prices[previousDate] > prices[date]) {
                currentDownWardDays++;
            }
            if (highestDownWardDays < currentDownWardDays) {
                highestDownWardDays = currentDownWardDays;
                downWardEnd = date;
            }
            if (prices[previousDate] < prices[date]) {
                currentDownWardDays = 0;
            }
            previousDate = date;
        }
        let dates = Object.keys(prices);
        let downWardStart = dates[dates.findIndex(date => date === downWardEnd) - highestDownWardDays + 1];
        if (highestDownWardDays === 0) return null;

        return {
            start: downWardStart,
            end: downWardEnd,
            length: highestDownWardDays
        };

    }

    const getBestProfitDates = (total_prices: Array<number[]>): TBestProfitDates | null => {
        let downWardTrendDays = getDownWardTrendDays(total_prices);
        const prices = formatResponseArray(total_prices);

        if (!downWardTrendDays || downWardTrendDays.length === Object.keys(prices).length) return null;

        let bestBuyDate = "";
        let bestSellDate = "";

        for (let date in prices) {
            if (!prices[bestBuyDate] || prices[bestBuyDate] > prices[date]) {
                bestBuyDate = date;
            }
            if (!prices[bestSellDate] || prices[bestSellDate] < prices[date]) {
                bestSellDate = date;
            }
        }

        return {
            buy: {
                date: bestBuyDate,
                price: prices[bestBuyDate]
            },
            sell: {
                date: bestSellDate,
                price: prices[bestSellDate]
            }
        }

    }

    const handleResponse = (response: TCoinGeckoResponse) => {
        if(response.prices.length === 0) {
            window.alert("No results for given date range!");
            isLoading(false);
            return;
        }
        
        setHighestVolume(getHighestVolume(response.total_volumes));
        setDownWardDays(getDownWardTrendDays(response.prices));
        setBestProfitDates(getBestProfitDates(response.prices));
        setDataChart(<DataChart finishedDrawing={() => {
            isLoading(false);
        }} data={response} />);
        hideModal(false);
    }

    const submitBitCoinRangeForm = (e: React.FormEvent<HTMLFormElement>) => {      
        isLoading(true);
        const { start_date, end_date } = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as { start_date: string, end_date: string };
        const queryParameters = {
            vs_currency: "eur",
            from: dateToTimeStamp(start_date),
            to: dateToTimeStamp(end_date) + 86399 // midnight - 1s of the given date
        }
        apiCalls.getMarketChartRange('bitcoin', handleResponse, queryParameters);
    }

    const changeEndDateMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDateMin(e.target.value);   
        setStartDateMax(e.target.value);    
    }

    return (
        <Page className={loading ? "Home loading-modal" : "Home"}>
            {!modalHidden ? <Modal close={hideModal}>
                <h2>BitCoin market values</h2>
                <span>{downWardDays ? `Longest downward trend was ${downWardDays?.length}, from ${downWardDays?.start} to ${downWardDays?.end}` : "No downward trend"}</span>
                <span>{highestVolume?.date} had the highest trading volume, total of {highestVolume?.volume.toFixed(2)}€</span>
                <span>{bestProfitDates ? `Best day to buy BitCoins was ${bestProfitDates?.buy.date} for ${bestProfitDates?.buy.price.toFixed(2)}€, and the best day to sell was ${bestProfitDates?.sell.date} for ${bestProfitDates?.sell.price.toFixed(2)}€`: "No profit for given date range"}</span>
                {dataChart}
            </Modal> : null}
            {loading ? <LoadingIndicator /> : null}
            <Form
                className="BitCoinRangeForm"
                onSubmit={submitBitCoinRangeForm}
                ref={bitCoinRangeFormRef}>

                <DateInput
                    formRef={bitCoinRangeFormRef}
                    required={true}
                    id="start_date"
                    name="start_date"
                    title="Start date"
                    max={startDateMax}
                    onChange={changeEndDateMin} />

                <DateInput
                    formRef={bitCoinRangeFormRef}
                    required={true}
                    id="end_date"
                    name="end_date"
                    title="End date"
                    min={endDateMin}
                    onChange={changeEndDateMin} />
            </Form>
        </Page>
    );
}

export default Home;