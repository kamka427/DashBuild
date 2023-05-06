import os
import importlib
import inspect
import json
from fastapi import FastAPI

PANEL_PATH = os.getcwd()
print(PANEL_PATH)

app = FastAPI()

# read fields of the object also
def parse_grafanalib_panels():
    panels = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".py"):
            module_name = file[:-3]
            module = importlib.import_module(module_name)
            for name, obj in inspect.getmembers(module):
                if 'Panel' in name:
                    if hasattr(obj, 'to_json_data'):
                        panels.append(obj.to_json_data())
    return panels



def parse_json_panels():
    json_data = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".json"):
            with open(file) as json_file:
                data = json.load(json_file)
                json_data.append(data)
    return json_data

@app.get("/")
async def root():
    resp = []
    json_panels = parse_json_panels()
    grafanalib_panels = parse_grafanalib_panels()

    resp.extend(json_panels)
    resp.extend(grafanalib_panels)

    return resp
