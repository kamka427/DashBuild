FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
EXPOSE 8000
ENTRYPOINT [ "uvicorn", "main:app" ]
CMD ["--host", "0.0.0.0", "--port", "8000"]
