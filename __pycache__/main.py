from fastapi import FastAPI, Query, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from typing import List
import pymysql

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")
# phpmyadminのconfig情報
conn = pymysql.connect(
    host='192.168.0.21',
    user='cs27',
    password='lifelog',
    db='ambulance',
    )

# /でindex.htmlを呼び出す
@app.get("/PredictApp")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# /でindex.htmlを呼び出す
@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("title.html", {"request": request})

# /dataでphpmyadminにアクセスし、指定のデータを取得（月別）
@app.get("/month")
# yearとward(行政区)で検索
def get_data(year: int = None, ward: str = None) ->  JSONResponse:
    cursor = conn.cursor()
    # year monthが空の場合、それぞれ全検索かける
    if year and ward:
        cursor.execute("SELECT * FROM predictMaxMin WHERE year = %s AND ward = %s", (year, ward))
    elif year:
        cursor.execute("SELECT * FROM predictMaxMin WHERE year = %s", (year,))
    elif ward:
        cursor.execute("SELECT * FROM predictMaxMin WHERE ward = %s", (ward,))
    else:
        cursor.execute("SELECT * FROM predictMaxMin")

    # すべてのデータをrowsにいったん格納
    rows = cursor.fetchall()
    data = []
    # data内にJSON形式に整理して格納、その後出力
    for row in rows:
        # 抽出するデータを年:year, 月:month, 行政区:ward, 予測最高:max, 予測最低:minに設定
        data.append({'year': row[1], 'month': row[2],'ward': row[3],'max': row[4], 'min': row[5]})
    return JSONResponse(content=data)

# /dataでphpmyadminにアクセスし、指定のデータを取得（年別）
@app.get("/year")
# ward(行政区)で検索
def get_data(ward: str = None) ->  JSONResponse:
    cursor = conn.cursor()
    # year monthが空の場合、それぞれ全検索かける
    if ward:
        cursor.execute("SELECT year, ward,SUM(maxpredictNumber),SUM(minpredictNumber) FROM predictMaxMin GROUP BY year,ward HAVING ward = %s", (ward,))
    else:
        cursor.execute("SELECT year,ward,SUM(maxPredictNumber),SUM(minpredictNumber) FROM predictMaxMin GROUP BY year,ward")

    # すべてのデータをrowsにいったん格納
    rows = cursor.fetchall()
    data = []
    # data内にJSON形式に整理して格納、その後出力
    for row in rows:
        # 抽出するデータを年:year,行政区:ward, 予測最高:maxsum, 予測最低:minsumに設定
        data.append({'year': row[0],'ward': row[1],'maxsum': row[2], 'minsum': row[3]})
    return JSONResponse(content=data)

