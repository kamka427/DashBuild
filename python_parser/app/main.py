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
                        file_name= file[:-3]
                        json_data = obj.to_json_data()
                       
                        panels.append({"file_name": file_name, "json_data": json_data})


    
    return panels



def parse_json_panels():
    panels = []
    for file in os.listdir(PANEL_PATH):
        if file.endswith(".json"):
            with open(file) as json_file:
                file_name= file[:-5]
                json_data = json.load(json_file)
                panels.append({"file_name": file_name, "json_data": json_data})
                
    return panels

@app.get("/")
async def root():
    resp = []
    json_panels = parse_json_panels()
    grafanalib_panels = parse_grafanalib_panels()

    resp.extend(json_panels)
    resp.extend(grafanalib_panels)

    return resp
