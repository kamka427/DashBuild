import os
import importlib
import inspect
from fastapi import FastAPI

app = FastAPI()

# read fields of the object also
def parse_objects():
    objects = []
    for file in os.listdir(os.getcwd()):
        if file.endswith(".py"):
            module_name = file[:-3]
            module = importlib.import_module(module_name)
            for name, obj in inspect.getmembers(module):
                print(name)
                if 'Panel' in name:
                    objects.append(obj)
    return objects

def get_json_data(objects):
    json_data = []
    for obj in objects:
        if hasattr(obj, 'to_json_data'):
            json_data.append(obj.to_json_data())

    return json_data



@app.get("/")
async def root():
    objects = parse_objects()
    json_data = get_json_data(objects)
    return json_data
