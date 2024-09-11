import sys
import requests
import json
import os
from datetime import datetime
import time

def add_word_to_anki(deck_name, word, meaning,  audio_url, audio_name):
    # AnkiConnect API址
    anki_url = "http://localhost:8765"
        # 创建片
    card = {
        "action": "addNote",
        "version": 6,
        "params": {
            "note": {
                "deckName": deck_name,
                "modelName": "Basic",
                "fields": {
                    "Front": word,
                    "Back": meaning
                },
                "options": {
                    "allowDuplicate": False,
                    # "duplicateScope": "deck",
                    "duplicateScopeOptions": {
                        "deckName": "Default"
                    }
                },
                "tags": [
                    "yomichan"
                ]
            }
        }
    }
    # 当 audio_url 不为空时，增加 audio 属性
    if audio_url:
        card["params"]["note"]["audio"] = [{
            "url": audio_url,
            "filename": audio_name,
            "fields": [
                "Front"
            ]
        }]
    # 发送请求
    response = requests.post(f"{anki_url}", json=card)

    #查应
    if response.status_code == 200:
        print(f"完整内容为：{response.text}")
        print(f"单 '{word}'成功添加到组 '{deck_name}' 中！")
    else:
        print("添加单时出现问题，请确保 Anki启动并 AnkiConnect件已安装。")

def read_json_and_add_words(file_path, last_sync_time):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        for record in data['translateRecordList']:
            try:
                word = record['translateContent']
                meaning = "; ".join(record['translateServiceRecordList'][0]['translateVo']['explains'])
                audio_url =  record['translateServiceRecordList'][0]['translateVo']['usSpeech']
                audio_name = audio_url.split('/')[-1]
                translate_time = record['translateServiceRecordList'][0]['translateVo']['translateTime']
                # 根据 last_sync_time 判断是否需要添加
                if last_sync_time is None or translate_time > last_sync_time:
                    add_word_to_anki("newWordGroup", word, meaning, audio_url, audio_name)
            except Exception as e:
                print(f"Error adding word: {word}. Error: {e}")

def read_last_sync_time(sync_time_file):
    if os.path.exists(sync_time_file):
        with open(sync_time_file, 'r') as file:
            return file.read().strip()
    return None

def write_last_sync_time(sync_time_file):
  with open(sync_time_file, 'w') as file:
      file.write(str(time.time()))

if __name__ == "__main__":
    # JSON 文件路径
    json_file_path = "/Users/liuqingjie/Documents/tt_record/userDataConfig/historyRecord.json"
    # 上次同步时间文件路径
    sync_time_file_path = "/Users/liuqingjie/Documents/tt_record/userDataConfig/last_sync_time.txt"

    # 读取上次同步时间
    last_sync_time = read_last_sync_time(sync_time_file_path)
    # 读取 JSON 并添加单词到 Anki
    read_json_and_add_words(json_file_path, last_sync_time)
    # 记录本次同步时间
    write_last_sync_time(sync_time_file_path)


