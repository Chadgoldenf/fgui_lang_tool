# fgui_lang_tool

**fairy GUI語言文件轉換(xml和xlsx互換)**

文件產生:fairyGUI->Tool->Strings Export And Import...


node v14.16.1

* 使用範例

1.只帶一個參數(輪入檔名)

node ./src/main.js lang401_zh.xml

產生lang401_zh.xlsx

node ./src/main.js lang401_zh.xlsx

產生lang401_zh.xml

2.帶二個參數(第2個為輸出檔名，不可帶副檔名)

node ./src/main.js lang401_zh.xml lang401_en

產生lang401_en.xlsx

node ./src/main.js lang401_en.xlsx lang401_en

產生lang401_en.xml


* 編釋成js方法

npm run-script build