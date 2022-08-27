# -*- coding:utf-8 -*-
"""
cron: 50 * * * *
new Env('禁用重复任务青龙，貌似适合任何版本');
"""

import json
import logging
import os
import sys
import time
import traceback

import requests

logger = logging.getLogger(name=None)  # 创建一个日志对象
logging.Formatter("%(message)s")  # 日志内容格式化
logger.setLevel(logging.INFO)  # 设置日志等级
logger.addHandler(logging.StreamHandler())  # 添加控制台日志
# logger.addHandler(logging.FileHandler(filename="text.log", mode="w"))  # 添加文件日志


ipport = os.getenv("IPPORT")
if not ipport:
    logger.info(
        "如果报错请在环境变量中添加你的真实 IP:端口\n名称：IPPORT\t值：127.0.0.1:5700\n或在 config.sh 中添加 export IPPORT='127.0.0.1:5700'"
    )
    ipport = "localhost:5700"
else:
    ipport = ipport.lstrip("http://").rstrip("/")
sub_str = os.getenv("disable_prefix", "")
sub_list = sub_str.split("&")
res_only = os.getenv("RES_ONLY", True)
# 默认不删除重复的任务
delete_task = os.getenv("delete_task", False)
headers = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
}


def load_send() -> None:
    logger.info("加载推送功能中...")
    global send
    send = None
    cur_path = os.path.abspath(os.path.dirname(__file__))
    sys.path.append(cur_path)
    if os.path.exists(cur_path + "/notify.py"):
        try:
            from notify import send
        except Exception:
            send = None
            logger.info(f"❌加载通知服务失败!!!\n{traceback.format_exc()}")


def get_tasklist() -> list:
    tasklist = []
    t = round(time.time() * 1000)
    url = f"http://{ipport}/api/crons?searchValue=&t={t}"
    response = requests.get(url=url, headers=headers)
    datas = json.loads(response.content.decode("utf-8"))
    if datas.get("code") == 200:
        tasklist = datas.get("data")
    return tasklist


def filter_res_sub(tasklist: list) -> tuple:
    filter_list = []
    res_list = []
    # sub_list 为空，表示所有任务都参与过滤
    if len(sub_list) == 0:
        res_list = tasklist
        return filter_list, res_list
    for task in tasklist:
        for sub in sub_list:
            if task.get("command").find(sub) == -1:
                flag = False
            else:
                flag = True
                break
        if flag:
            res_list.append(task)
        else:
            filter_list.append(task)
    return filter_list, res_list


def filter_disable_list(tasklist: list) -> list:
    res_list = []
    for task in tasklist:
        if task.get("isDisabled") == 0:
            res_list.append(task)
    return res_list


def get_index(lst: list, item: str) -> list:
    return [index for (index, value) in enumerate(lst) if value == item]


def get_index_list(lst: list, item: str) -> int:
    index = 0
    for i, value in enumerate(lst):
        if value.get("id") == item:
            index = i
            break
    return index


def get_duplicate_list(tasklist: list) -> tuple:
    logger.info("\n=== 初筛开始 ===")
    ids = []
    flag = False
    for task in tasklist:
        if task.get("isDisabled") == 0:
            flag = True
        # task在tasklist中的位置
        task_index = get_index_list(tasklist, task.get("id")) + 1
        # 用来比较的list
        compare_list = tasklist[task_index:]
        for compare_task in compare_list:
            # 任务字段相同就认为是相同的任务，不比较名字是否相同
            if task.get("command") == compare_task.get("command"):
                if flag:
                    ids.append(compare_task.get("id"))
                    logger.info(f"【🚫禁用】{compare_task.get('name')}，{compare_task.get('command')}\n")
                else:
                    # task和compare_task保留执行的那一个
                    if compare_task.get("isDisabled") == 0:
                        ids.append(task.get("id"))
                        logger.info(f"【🚫禁用】{compare_task.get('name')}，{task.get('command')}\n")
                    else:
                        ids.append(compare_task.get("id"))
                        logger.info(f"【🚫禁用】{compare_task.get('name')}，{compare_task.get('command')}\n")
    logger.info("=== 初筛结束 ===")
    return list(set(ids))


def reserve_task_only(temids: list, tem_tasks: list, dupids: list, res_list: list) -> list:
    if len(temids) == 0:
        return temids

    logger.info("\n=== 最终筛选开始 ===")
    task3 = None
    for task1 in tem_tasks:
        for task2 in res_list:
            if task1.get("name") == task2.get("name"):
                dupids.append(task1.get("id"))
                logger.info(f"【✅保留】{task2.get('command')}")
                task3 = task1
        if task3:
            logger.info(f"【🚫禁用】{task3.get('command')}\n")
            task3 = None
    logger.info("=== 最终筛选结束 ===")
    return dupids


def disable_duplicate_tasks(ids: list) -> None:
    t = round(time.time() * 1000)
    url = f"http://{ipport}/api/crons/disable?t={t}"
    data = json.dumps(ids)
    headers["Content-Type"] = "application/json;charset=UTF-8"
    response = requests.put(url=url, headers=headers, data=data)
    datas = json.loads(response.content.decode("utf-8"))
    if datas.get("code") != 200:
        logger.info(f"❌出错!!!错误信息为：{datas}")
    else:
        logger.info("🎉成功禁用重复任务~")


def get_token() -> str or None:
    try:
        with open("/ql/data/config/auth.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        logger.info(f"❌无法获取 token!!!\n{traceback.format_exc()}")
        send("💔禁用重复任务失败", "无法获取 token!!!")
        exit(1)
    return data.get("token")


if __name__ == "__main__":
    logger.info("===> 禁用重复任务开始 <===")
    load_send()
    token = get_token()
    headers["Authorization"] = f"Bearer {token}"

    # 获取参与过滤的任务列表所含字段
    sub_str = "\n".join(sub_list)
    if sub_str == None or sub_str == '':
        logger.info(f"\n=== 你没有选择过滤的任务前缀，所有的任务都会参与过滤")
    else:
        logger.info(f"\n=== 你选择过滤的任务前缀为：{sub_str}；任务名中有此字段才会参与过滤")
    # 获取所有的任务列表
    tasklist = get_tasklist()
    if len(tasklist) == 0:
        logger.info("❌获取到的任务列表为空，或无法获取任务列表!!!")
        exit(1)
    # filter_list 为不参与过滤的任务列表，没什么用处了，res_list 为参与本次任务过滤的列表
    filter_list, res_list = filter_res_sub(tasklist)
    # 再把已经禁用的任务去掉
    res_list = filter_disable_list(res_list)
    # 获取需要禁用或删除的任务ID
    removeIds = get_duplicate_list(res_list)
    # TODO 是否在重复任务中只保留设置的前缀

    sum = f"自建脚本-所有任务数量为：{len(tasklist)}"
    filter = f"参与此次过滤的任务数量为：{len(res_list)}"
    disable = f"此次禁用或删除的任务数量为：{len(removeIds)}"
    logging.info("\n=== 禁用数量统计 ===\n" + sum + "\n" + filter + "\n" + disable)

    if len(removeIds) == 0:
        logger.info("😁没有重复任务~")
    else:
        disable_duplicate_tasks(removeIds)
    if send:
        send("禁用重复任务成功", f"\n{sum}\n{filter}\n{disable}")
