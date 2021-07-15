
import { AXIOS_INSTANCE } from './../config/Axios/index';
export const callData = (stock, feature, model) => {
    let featureParse = "";

    featureParse += "close";
    if (feature.includes("poc")) {
        featureParse += "_poc";
    }
    if (feature.includes("rsi")) {
        featureParse += "_rsi";
    }
    if (feature.includes("bb")) {
        featureParse += "_bb";
    }
    return AXIOS_INSTANCE.get(`/api/predict?stock=${stock}&model=${model}_${featureParse}&start=2009-10-02`)
    return new Promise( (resolve, reject) => {
        AXIOS_INSTANCE.get('/api/predict?stock=aapl&model=lstm_close_rsi&start=2020-01-01')
        .then(res => resolve(() => {
            res.data.csv.map(data => ({
                ...data,
                date: new Date(data.date)
            }));
            return res;
        }))
        .catch(reject)
    });
}

