### Installing

To install the python required dependencies, run:
pip install -r requirements.txt

Install the mongosh binary in your path

## Getting Started
```
uvicorn main:app --host 0.0.0.0 --port 8000  
```

### Executing the scripts throught the API

* http://localhost:8000/execute-query?script=get_5_reviews
* http://localhost:8000/execute-query?script=get_reviews_moderate_policy
