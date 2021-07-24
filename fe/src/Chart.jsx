
import React from "react";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    CandlestickSeries,
    LineSeries,
    RSISeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
    OHLCTooltip,
    MovingAverageTooltip,
    RSITooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, rsi, sma, atr } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import BollingerSeries from "react-stockcharts/lib/series/BollingerSeries";
import bollingerBand from "react-stockcharts/lib/indicator/bollingerBand";
import HoverTooltip from "react-stockcharts/lib/tooltip/HoverTooltip";

const bbStroke = {
    top: "#964B00",
    middle: "#000000",
    bottom: "#964B00",
};

const bbFill = "#4682B4";
const numberFormat = format(".2f");
function tooltipContent(ys) {
    return ({ currentItem, xAccessor }) => {
        return {
            x: null,
            y: [
                {
                    label: "Predict",
                    value: currentItem.predict && numberFormat(currentItem.predict),
                    stroke: "green"
                },
                {
                    label: "Price",
                    value: currentItem.close && numberFormat(currentItem.close),
                    stroke: "blue"
                },
            ]
                .concat(
                    ys.map(each => ({
                        label: each.label,
                        value: each.value(currentItem),
                        stroke: each.stroke
                    }))
                )
                .filter(line => line.value)
        };
    };
}

class CandleStickChartWithRSIIndicator extends React.Component {

    render() {
        const ema50 = ema()
            .id(0)
            .options({ windowSize: 50 })
            .merge((d, c) => { if (d.close) d.ema50 = c; })
            .accessor(d => d.ema50);

        const ema200 = ema()
            .id(1)
            .options({ windowSize: 200 })
            .merge((d, c) => { if (d.close) { d.ema200 = c; } })
            .accessor(d => d.ema200);

        const smaVolume50 = sma()
            .id(3)
            .options({ windowSize: 50, sourcePath: "volume" })
            .merge((d, c) => { if (d.close) d.smaVolume50 = c; })
            .accessor(d => d.smaVolume50);

        const rsiCalculator = rsi()
            .options({ windowSize: 14 })
            .merge((d, c) => { if (d.close) d.rsi = c; })
            .accessor(d => d.rsi);

        const atr14 = atr()
            .options({ windowSize: 14 })
            .merge((d, c) => { if (d.close) d.atr14 = c; })
            .accessor(d => d.atr14);

        const { type, data: initialData, width, ratio, line, BBand, RSI, EMA50, EMA200,tooltip } = this.props;
        const bb = bollingerBand()
            .merge((d, c) => { if (d.close) d.bb = c; })
            .accessor(d => d.bb);
        const calculatedData = ema200(ema50(smaVolume50(rsiCalculator(atr14(bb(initialData))))));
        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor(d => d.date);
        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(calculatedData);

        const start = xAccessor(last(data));
        const end = xAccessor(data[Math.max(0, data.length - 150)]);
        const xExtents = [start, end];
        const option = [];
        const optionHover = []
        if (EMA200) {
            option.push({
                yAccessor: ema200.accessor(),
                type: "EMA",
                stroke: ema200.stroke(),
                windowSize: ema200.options().windowSize,
            });
            optionHover.push({
                label: `${ema200.type()}(${ema200.options()
                    .windowSize})`,
                value: d => numberFormat(ema200.accessor()(d)),
                stroke: ema200.stroke()
            })
        }
        if (EMA50) {
            option.push({
                yAccessor: ema50.accessor(),
                type: "EMA",
                stroke: ema50.stroke(),
                windowSize: ema50.options().windowSize,
            });
            optionHover.push({
                label: `${ema50.type()}(${ema50.options()
                    .windowSize})`,
                value: d => numberFormat(ema50.accessor()(d)),
                stroke: ema50.stroke()
            })
        }
        return (
            <ChartCanvas height={680}
                width={width}
                ratio={ratio}
                margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
                type={type}
                seriesName="MSFT"
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                displayXAccessor={displayXAccessor}
                xExtents={xExtents}
            >
                <Chart id={1} height={350}
                    yExtents={[d => [d.high, d.low], ema200.accessor(), ema50.accessor(), bb.accessor()]}
                    padding={{ top: 10, bottom: 20 }}
                >
                    <XAxis axisAt="bottom" orient="bottom" showTicks={true} outerTickSize={0} />
                    <YAxis axisAt="right" orient="right" ticks={5} />
                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={timeFormat("%Y-%m-%d")} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    {line ? <LineSeries yAccessor={(d) => {
                        if (d.close === null) {
                            return;
                        }
                        return d.close;
                    }} fill="none" highlightOnHover={true} connectNulls={false} /> : <CandlestickSeries />}
                    {/* predict */}
                    <LineSeries yAccessor={(d) => {
                        return d.predict;
                    }} fill="none" stroke={"green"} highlightOnHover={true} connectNulls={false} />
                    <CurrentCoordinate yAccessor={(d) => {
                        return d.predict;
                    }} fill="green" />
                    {
                        tooltip?<HoverTooltip
                        yAccessor={ema50.accessor()}
                        tooltipContent={tooltipContent(optionHover)}
                        fontSize={15}
                    />:<></>
                    }

                    {
                        BBand ? <BollingerSeries yAccessor={d => {
                            if (d.close === null) {
                                return;
                            }
                            return d.bb
                        }}
                            stroke={bbStroke}
                            fill={bbFill} /> : <></>
                    }
                    {
                        EMA50 ? (<> <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
                            <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} /></>)
                            : <></>
                    }
                    {
                        EMA200 ? (<> <LineSeries yAccessor={ema200.accessor()} stroke={ema200.stroke()} />
                            <CurrentCoordinate yAccessor={ema200.accessor()} fill={ema200.stroke()} /></>)
                            : <></>
                    }

                    <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />

                    <OHLCTooltip origin={[-40, 0]} />

                    {EMA200 || EMA50 ? <MovingAverageTooltip
                        onClick={e => console.log(e)}
                        origin={[-38, 15]}
                        options={option}
                    /> : <></>}

                    <CrossHairCursor />
                </Chart>
                {RSI ? <Chart id={3}
                    yExtents={[0, 100]}
                    height={125} origin={(w, h) => [0, h - 250]}
                >
                    <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
                    <YAxis axisAt="right"
                        orient="right"
                        tickValues={[30, 50, 70]} />
                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                    <RSISeries yAccessor={d => d.rsi} />

                    <RSITooltip origin={[-38, 15]}
                        yAccessor={d => d.rsi}
                        options={rsiCalculator.options()} />
                </Chart> : <></>}

            </ChartCanvas>
        );
    }
}

CandleStickChartWithRSIIndicator.defaultProps = {
    type: "svg",
};
CandleStickChartWithRSIIndicator = fitWidth(CandleStickChartWithRSIIndicator);

export default CandleStickChartWithRSIIndicator;
