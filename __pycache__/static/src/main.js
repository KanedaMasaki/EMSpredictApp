var myChart;

window.onload = function() {
    toggleVisibility();
};

function drowChartmonth(){
    //ロード画面を非表示にする
    document.getElementById('loading').style.display = 'none';
    // ここでキャンバスリセットする
    if (myChart) {
      myChart.destroy();
    }

    const urlYear = document.getElementById("text_year").value;
    const urlWard = document.getElementById("text_ward").value;

    // 予測年が入力されていないときalertをする
    if(urlYear==""){
        alert("予測年が入力されていません");
    }

    var url = new URL('/month'+'?year='+urlYear+'&ward='+urlWard, window.location.href);
    var params = new URLSearchParams(window.location.search);
    // まず上記で設定した/monthにアクセスしてresponseに全データを格納
    getRestJson(url)
    .then(data => {
        // xValuesの中のd.～は、JSONデータ内で～がkeyのデータのみを抽出して取得（x軸に設定）
        // 今回は/dataで得られるJSON内のyearとmaxを抽出
            const xmonthValues = data.map(d => d.month);
            const xyearValues = data.map(d => d.year);
            const maxValues = data.map(d => d.max);
            const minValues = data.map(d => d.min);
            // 確認用
            console.log(xmonthValues);
            console.log(xyearValues);
            console.log(maxValues);
            console.log(minValues);
            const canvas = document.getElementById('myChart');
            const canvas2 = document.getElementById('myChart2');
            const ctx = canvas.getContext('2d');
            const ctx2 = canvas.getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xmonthValues,
                    datasets: [{
                        label: '予測最大搬送件数',
                        data: maxValues,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1
                    },
                    {
                        label: '予測最低搬送件数',
                        data: minValues,
                        borderColor: 'rgba(99, 121, 255, 1)',
                        backgroundColor: 'rgba(99, 121, 255, 0.2)',
                        borderWidth: 1
                    }]
                },
                
            });
            
        })
        .catch();
}

function drowChartyear(){
    //ロード画面を非表示にする
    document.getElementById('loading').style.display = 'none';
    // ここでキャンバスリセットする
    if (myChart) {
      myChart.destroy();
    }
    const urlWard = document.getElementById("text_ward").value;

    var url = new URL('/year'+'?ward='+urlWard, window.location.href);
    var params = new URLSearchParams(window.location.search);
    // まず上記で設定した/monthにアクセスしてresponseに全データを格納
    getRestJson(url)
    .then(data => {
        // xValuesの中のd.～は、JSONデータ内で～がkeyのデータのみを抽出して取得（x軸に設定）
        // 今回は/dataで得られるJSON内のyearとmaxを抽出
            const xValues = data.map(d => d.year);
            const maxValues = data.map(d => d.maxsum);
            const minValues = data.map(d => d.minsum);
            // 確認用
            console.log(xValues);
            console.log(maxValues);
            console.log(minValues);
            const canvas = document.getElementById('myChart');
            const ctx = canvas.getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [{
                        label: '予測最大搬送件数',
                        data: maxValues,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1
                    },
                    {
                        label: '予測最低搬送件数',
                        data: minValues,
                        borderColor: 'rgba(99, 121, 255, 1)',
                        backgroundColor: 'rgba(99, 121, 255, 0.2)',
                        borderWidth: 1
                    }]
                },
                
            });
            
        })
        .catch();
}

/**
 * 指定されたREST-APIをGETしJSONオブジェクトとして返す
 * @param {} url 
 */
function getRestJson(url) {
    return fetch(url)
        .then(
            response => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new HttpError(response);
                }
            })
        .catch(
            err => console.log("Failed to fetch " + url, err)
        );
}

// チェックボックスにチェックがあるとテキストボックス(予測年)非表示
function toggleVisibility() {
    var checkBox = document.getElementById("checkbox");
    var monthdiv = document.getElementById("monthan");
    var yeardiv = document.getElementById("yearan");
    if (checkBox.checked == true){
        yeardiv.style.display = "block";
        monthdiv.style.display = "none";
    } else {
        yeardiv.style.display = "none";
        monthdiv.style.display = "block";
    }
}

/**
 * HTTP エラークラス
 */
class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}


        