import { Radio, Select, Spin, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import Icon from "./icon.jpg";
import { callData } from './functions/index';

const { Option } = Select;
const ChartComponent = () => {
	const [chart, setChart] = useState('line');
	const [data, setData] = useState(null);
	const [size, setSize] = useState([]);
	const [method, setMethod] = useState(['close']);
	const [model, setModel] = useState('lstm');
	const [tooltip, setTooltip] = useState(false);
	const [loading, setLoading] = useState(true);
	const [stock, setStock] = useState("aapl");
	useEffect(() => {

		const callDataStock = async () => {
			setLoading(true);
			const res = await callData(stock,method,model).catch(err => {
				setLoading(false);
			});
			const data = res?.data
			if (data) {
				let tomorrowDate = new Date();
				tomorrowDate.setDate(tomorrowDate.getDate() + 1);
				const tomorrow = {
					close: null,
					predict: data.tomorrow,
					date: tomorrowDate
				}
				const newData = await new Promise((resolve, reject) => resolve(data.csv.map(value =>
				({
					...value,
					date: new Date(value.date)
				}))));
				newData.push(tomorrow);
				if (newData) {
					setData(newData);
					setLoading(false);
				}
			}

		}
		callDataStock();
	}, [stock, method,model])



	const handleChange = (value) => {
		setSize(value)
	}

	const handleChangeMethod = (value) => {
		if (value.length === 1) {
			return;
		}
		setMethod(value);
	}

	const handleChangeStock = (value) => {
		setStock(value);
	}

	const handleSizeChange = e => {
		setChart(e.target.value);
	};

	return (
		<>
			<Spin size="large" spinning={loading}>
				<div className="body">
					<div className="header">
						<h3 style={{
							display: "flex", marginLeft: 30, borderBottom: "1px solid #ccc",
							padding: "5px", color: "#9b59b6", alignItems: "center",
							justifyContent: "space-between"
						}}>
							<span>
								<img src={Icon} style={{ marginRight: 5 }} alt="icon" width="25" height="25" /> CÔNG NGHỆ MỚI - MACHINE LEARNING
							</span>

							<span>
								<span>Tooltip: </span>
								<Switch onChange={() => setTooltip(!tooltip)} />
							</span>
						</h3>

					</div>
					<div className="option">
						<div>
							<Radio.Group value={chart} onChange={handleSizeChange}>
								<Radio.Button value="line">Line</Radio.Button>
								<Radio.Button value="candles">Candles</Radio.Button>
							</Radio.Group>
						</div>
						<div>
							<Select
								mode="multiple"
								size={size}
								placeholder="Indicator"
								onChange={handleChange}
								style={{ width: '100%' }}
							>
								<Option key="EMA50">EMA50</Option>
								<Option key="EMA200">EMA200</Option>
								<Option key="RSI">RSI</Option>
								<Option key="BBand">Bollinger Bands</Option>
							</Select>
						</div>
						<div className="hori"> </div>
						<div className="label">
							STOCK
						</div>
						<div className="stock">
							<Select
								showSearch
								style={{ width: 95 }}
								defaultValue="AAPL"
								optionFilterProp="children"
								onChange={handleChangeStock}
								filterOption={(input, option) =>
									option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
							>
								<Option value="CSGP">CSGP</Option>
								<Option value="AAPL">AAPL</Option>
								<Option value="MSFT">MSFT</Option>
								<Option value="AMZN">AMZN</Option>
								<Option value="GOOG">GOOG</Option>
								<Option value="GOOGL">GOOGL</Option>
								<Option value="FB">FB</Option>
								<Option value="TSLA">TSLA</Option>
								<Option value="TSM">TSM</Option>
								<Option value="BABA">BABA</Option>
								<Option value="V">V</Option>
								<Option value="NVDA">NVDA</Option>
								<Option value="JPM">JPM</Option>
								<Option value="JNJ">JNJ</Option>
								<Option value="WMT">WMT</Option>
								<Option value="UNH">UNH</Option>
								<Option value="MA">MA</Option>
								<Option value="PYPL">PYPL</Option>
								<Option value="BAC">BAC</Option>
								<Option value="HD">HD</Option>
								<Option value="PG">PG</Option>
								<Option value="DIS">DIS</Option>
								<Option value="ADBE">ADBE</Option>
								<Option value="ASML">ASML</Option>
								<Option value="CMCSA">CMCSA</Option>
							</Select>
						</div>
						<div className="hori"> </div>
						<div className="label">
							MODEL
						</div>
						<div>
							<Select
								showSearch
								style={{ width: 150 }}
								defaultValue="LSTM"
								optionFilterProp="children"
								onChange= {(value)=>setModel(value)}
								filterOption={(input, option) =>
									option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
							>
								<Option value="lstm">LSTM</Option>
								<Option value="xgb">XGBoost</Option>
								<Option value="rnn">RNN</Option>
							</Select>
						</div>
						<div className="hori"> </div>
						<div className="label">
							FEATURE
						</div>
						<div>
							<Select
								mode="multiple"
								placeholder="Indicator"
								onChange={(value) => {
									if (value.length < 1) {
										value.push("close")
									}
									setMethod(value);
								}}
								defaultValue={["close"]}
								style={{ width: '100%', minWidth: "120" }}
							>
								<Option key="close">Close</Option>
								<Option key="poc">Price Of Change</Option>
								<Option key="rsi">RSI</Option>
								<Option key="bb">Bollinger Bands</Option>
							</Select>
						</div>
					</div>
					{
						data ? <Chart
							line={chart === "line"}
							EMA50={size.includes("EMA50")}
							EMA200={size.includes("EMA200")}
							RSI={size.includes("RSI")}
							BBand={size.includes("BBand")}
							tooltip={tooltip}
							data={data} /> : <></>
					}
				</div>
			</Spin>
		</>
	)
}

export default ChartComponent;