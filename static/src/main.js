var myChart;


//月別描画
function drowChartmonth(){
    //ロード画面を非表示にする
    document.getElementById('loading').style.display = 'none';
    // ここでキャンバスリセットする
    if (myChart) {
      myChart.destroy();
    }

    const urlYear = document.getElementById("text_year").value;
    const urlWard = document.getElementById("text_mward").value;

    // 予測年が入力されていないときalertをする
    if(urlYear==""){
        alert("予測年が入力されていません");
    //エラーの場合もう一度ロード画面を表示
    document.getElementById('loading').style.display = 'block';
    }

    var url = new URL('https://es4.eedept.kobe-u.ac.jp/predictapp/month/'+'?year='+urlYear+'&ward='+urlWard, window.location.href);
    var params = new URLSearchParams(window.location.search);
    // まず上記で設定した/monthにアクセスしてresponseに全データを格納
    getRestJson(url)
    .then(data => {
        // xValuesの中のd.～は、JSONデータ内で～がkeyのデータのみを抽出して取得（x軸に設定）
        // 今回は/dataで得られるJSON内のyearとmaxを抽出
            const xmonthValues = data.map(d => d.month);
            const maxValues = data.map(d => d.max);
            const minValues = data.map(d => d.min);
            // 確認用
            console.log(xmonthValues);
            console.log(maxValues);
            console.log(minValues);
            const canvas = document.getElementById('myChart');
            const ctx = canvas.getContext('2d');
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
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'X軸のラベル'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Y軸のラベル'
                            }
                        }]
                    }
                }  
            });  
        })
        .catch();
}

//年別描画
function drowChartyear(){
    //ロード画面を非表示にする
    document.getElementById('loading').style.display = 'none';
    // ここでキャンバスリセットする
    if (myChart) {
      myChart.destroy();
    }
    const urlWard = document.getElementById("text_ward").value;

    var url = new URL('/predictapp/year'+'?ward='+urlWard, window.location.href);
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
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'X軸のラベル'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Y軸のラベル'
                }
            }]
        }
    }
});
        })
        .catch();
}

function drowChartresult() {
    //ロード画面を非表示にする
    document.getElementById('loading').style.display = 'none';
    // ここでキャンバスリセットする
    if (myChart) {
      myChart.destroy();
    }
    const checkboxes = document.querySelectorAll('input[name="ward"]:checked');
    const checkedIds = Array.from(checkboxes, checkbox => checkbox.id);
    const urllist = checkedIds.map(id => new URL('/predictapp/resultdata' + '?ward=' + id, window.location.href));
  
    Promise.all(urllist.map(url => getRestJson(url)))
      .then(results => {
        const datasets = results.map((data, index) => {
            const xValues = data.map(d => d.year);
            const conValues = data.map(d => d.conveyanceNumber);
            return {
              label: checkedIds[index],
              data: conValues,
              labelTension: 1,
              fill: true,
              borderColor: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)`,
              backgroundColor: `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.2)`,
              borderWidth: 1
            };
          });
        const canvas = document.getElementById('myChart');
        const ctx = canvas.getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: results[0].map(d => d.year),
              datasets: datasets
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'X軸のラベル'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Y軸のラベル'
                        }
                    }]
                }
            }
          });
      })
      .catch();
  }
  



/**
 * URLのJSONデータを取得するPromiseを返す
 */
function getRestJsonPromise(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
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


function predictmonthPage() {
    window.location.href = "https://es4.eedept.kobe-u.ac.jp/predictapp/predictapp/";
}

function resultPage() {
    window.location.href = "https://es4.eedept.kobe-u.ac.jp/predictapp/result/";
}

function predictyearPage() {
    window.location.href = "https://es4.eedept.kobe-u.ac.jp/predictapp/predictbyyear/";
}
        

