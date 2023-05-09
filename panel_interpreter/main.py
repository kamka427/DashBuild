import os
import importlib
import inspect
import json
import sys
from fastapi import FastAPI

PANEL_PATH = os.path.join(os.getcwd(), "panels/")
sys.path.append(PANEL_PATH)
os.chdir(PANEL_PATH)

app = FastAPI()


def parse_grafanalib_panels():
    panels = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".py"):
            module_name = file[:-3]
            module = importlib.import_module(module_name)
            for name, obj in inspect.getmembers(module):
                if "Panel" in name:
                    if hasattr(obj, "to_json_data"):
                        file_name = file[:-3]
                        json_data = obj.to_json_data()
                        panels.append({"file_name": file_name, "json_data": json_data})

    return panels


def parse_json_panels():
    panels = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".json"):
            if "Panel" in file and "config" not in file:
                with open(file) as json_file:
                    file_name = file[:-5]
                    json_data = json.load(json_file)
                    panels.append({"file_name": file_name, "json_data": json_data})

    return panels


def parse_panel_configs():
    configs = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".json"):
            if "config" in file:
                with open(file) as json_file:
                    file_name = file[:-12]
                    json_data = json.load(json_file)
                    configs.append({"file_name": file_name, "json_data": json_data})

    return configs


def combine_panels_and_configs():
    panels = []
    panels.extend(parse_grafanalib_panels())
    panels.extend(parse_json_panels())
    configs = parse_panel_configs()
    for panel in panels:
        for config in configs:
            if panel["file_name"] == config["file_name"]:
                panel["config"] = config["json_data"]
    return panels


@app.get("/")
async def root():
    resp = combine_panels_and_configs()

    return resp
