# EMSpredictApp
# どんなサービスか
- 神戸市内の救急搬送件数を過去の実績と人口予測に基づき予測する
- 過去の救急搬送件数を可視化し分析に役立てる

## Technologies
- Backend + Analyze
  - Python(FastApi)
- Frontend
  - HTML
  - CSS
  - javascript
- Database
  - 神戸市消防局救急ビッグデータを使用




## Pages
- 月別分析
  - 予測年と行政区を指定すると該当行政区、予測年の1年間の救急搬送件数の詳細を得られます
  - 予測結果は最大、最小予測搬送件数で表現しています
![月別分析](https://github.com/KanedaMasaki/EMSpredictApp/assets/133667748/90e4bc70-8340-4cc5-8ec6-ee0eda887f45)

<br>

- 年別分析
  - 行政区を指定すると該当行政区の2065年までの年間搬送件数予測を得られます
  - 予測結果は最大、最小予測搬送件数で表現しています
![年別分析](https://github.com/KanedaMasaki/EMSpredictApp/assets/133667748/e2c4adac-d074-4d77-b51d-1f15e672b087)

<br>

- 実績分析
  - チェックボックス方式で複数の行政区を選択するとそれぞれの行政区の2013年からの年間搬送件数推移が得られ比較が行えます
![実績分析](https://github.com/KanedaMasaki/EMSpredictApp/assets/133667748/b8bd0a00-a444-43cf-995c-955ab7df5803)

<br>

