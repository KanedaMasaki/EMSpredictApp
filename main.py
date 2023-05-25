from fastapi import FastAPI, Query, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from typing import List
import pymysql
import json
from decimal import Decimal
# Decimal型のオブジェクトをfloatに変換する関数
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


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

# /result.htmlを呼び出す
@app.get("/result/")
async def root(request: Request):
    return templates.TemplateResponse("index3.html", {"request": request})

# /predictbyyearでindex2.htmlを呼び出す
@app.get("/predictbyyear/")
async def root(request: Request):
    return templates.TemplateResponse("index2.html", {"request": request})

# /でindex.htmlを呼び出す
@app.get("/predictapp/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# /dataでphpmyadminにアクセスし、指定のデータを取得（月別）
@app.get("/month/")
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
@app.get("/year/")
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


@app.get("/resultdata/")
# ward(行政区)で検索
def get_data(ward: str = None) ->  JSONResponse:
    cursor = conn.cursor()
        # wardが空の場合、それぞれ全検索かける
    if ward:
        cursor.execute("SELECT year, ward,SUM(conveyanceNumber) FROM conveyanceNumber WHERE ward = %s GROUP BY year,ward ", (ward,))
    else:            
        cursor.execute("SELECT year, ward,SUM(conveyanceNumber) FROM conveyanceNumber GROUP BY year,ward")

    # すべてのデータをrowsにいったん格納
    rows = cursor.fetchall()
    data = []
    # data内にJSON形式に整理して格納、その後出力
    for row in rows:
        # 抽出するデータを年:year,行政区:ward, 実績:conveyanceNumberに設定
        # Decimal型はJSONシリアライズできないので、float型に変換する
        data.append({'year': row[0], 'ward': row[1], 'conveyanceNumber': float(row[2])})
    return JSONResponse(content=data)


@app.get("/test/", response_class=HTMLResponse)
async def read_form(request: Request):
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT year FROM table")
    data = cursor.fetchall()
    year_list = []
    for i in data:
        year_list.append(i[0])
    return templates.TemplateResponse("index.html", {"request": request, "year_list": year_list})


