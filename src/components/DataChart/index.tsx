import { TCoinGeckoResponse } from 'constants/classes/CoinGeckoApiCalls/types';
import { timeStampToDate } from 'constants/functions/conversions';
import React, { useRef, useEffect } from 'react';
import './DataChart.scss';

type DataChartProps = {
    data: TCoinGeckoResponse;
    finishedDrawing: () => void;
}

const DataChart: React.FC<DataChartProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasScale = 5;

    function getMinMaxOf2DIndex(arr: Array<number[]>, idx: number) {
        return {
            min: Math.min.apply(null, arr.map(function (e) { return e[idx] })),
            max: Math.max.apply(null, arr.map(function (e) { return e[idx] }))
        }
    }

    // Note that the chart draws each datapoint, not just ones closest to midnight
    const drawChartToCanvas = (
        canvas: HTMLCanvasElement,
        color: string,
        data: Array<number[]>) => {
        let firstX = data[0][0];
        let lastX = data[data.length - 1][0];
        let padding = 50;
        let xDivider = (lastX - firstX) / (canvas.width);
        let { min: firstY, max: lastY } = getMinMaxOf2DIndex(data, 1);
        let yDivider = (lastY - firstY) / (canvas.height - padding);
        const ctx = canvas.getContext("2d");
        let from: number[];
        let to: number[];
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2 / canvasScale;
            for (let i = 1; i < data.length; i++) {
                from = [
                    ((data[i - 1][0] - firstX) / xDivider) / canvasScale,
                    (canvas.height - ((data[i - 1][1] - firstY) / yDivider + padding / 2)) / canvasScale
                ];
                to = [
                    ((data[i][0] - firstX) / xDivider) / canvasScale,
                    (canvas.height - ((data[i][1] - firstY) / yDivider + padding / 2)) / canvasScale
                ];                
                ctx.beginPath();                
                ctx.moveTo(from[0], from[1]);
                ctx.lineTo(to[0], to[1]);
                ctx.stroke();
            }
        }
    }

    const setCanvasResolution = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            canvas.width = canvas.width * canvasScale;
            canvas.height = canvas.height * canvasScale;
            ctx.scale(canvasScale, canvasScale);
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            setCanvasResolution(canvasRef.current);
            drawChartToCanvas(canvasRef.current, "hsl(30, 100%, 47%)", props.data.total_volumes);
            drawChartToCanvas(canvasRef.current, "red", props.data.prices);
        }
        props.finishedDrawing();
    }, []);

    return (
        <div className="DataChart">
            <div className="volumes-range">
                <span className="volumes-label high">{(getMinMaxOf2DIndex(props.data.total_volumes, 1).max / 1000000000).toFixed(2)}B €</span>
                <span className="volumes-label low">{(getMinMaxOf2DIndex(props.data.total_volumes, 1).min / 1000000000).toFixed(2)}B €</span>
            </div>
            <div className="chart-container">
                <span className="volumes-label first">{timeStampToDate(new Date(props.data.total_volumes[0][0]))}</span>
                <span className="volumes-label">Trading Volumes</span>
                <span className="volumes-label last">{timeStampToDate(new Date(props.data.total_volumes[props.data.total_volumes.length - 1][0]))}</span>
                <canvas ref={canvasRef} />
                <span className="prices-label first">{timeStampToDate(new Date(props.data.prices[0][0]))}</span>
                <span className="prices-label">Price</span>
                <span className="prices-label last">{timeStampToDate(new Date(props.data.prices[props.data.total_volumes.length - 1][0]))}</span>
            </div>
            <div className="price-range">
                <span className="prices-label high">{(getMinMaxOf2DIndex(props.data.prices, 1).max / 1000).toFixed(2)}K €</span>
                <span className="prices-label low">{(getMinMaxOf2DIndex(props.data.prices, 1).min / 1000).toFixed(2)}K €</span>
            </div>
        </div>
    );
}

export default DataChart;