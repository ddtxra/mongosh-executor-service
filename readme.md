### Using docker

```
curl http://localhost:8088/execute-query?script=get_patients
```

### Installing


To install the python required dependencies, run:
pip install -r requirements.txt

Install the mongosh binary in your path

## Getting Started
```
uvicorn main:app --host 0.0.0.0 --port 8000  
```

### Executing the scripts throught the API

#### PATIENTS

Patients qui ont signés le general consent (5% sur 1.5 Millions), réponse limité à 10 records
* http://localhost:8000/view/patients?limit=10&general_consent=yes

Patients avec 18 ans qui ont signés le general consent
* http://localhost:8000/view/patients?age=18&general_consent=yes

Patients adulte > 18 ans qui ont signés le general consent 
* http://localhost:8000/view/patients?age_gte=18&general_consent=yes

Patients identifiés par leurs ID
* http://localhost:8000/view/patient?id_in=pat_1,pat_2,pat_3,pat_4

------- TENSION ARTERIEL --------------------------------------------------

Valeurs de tension arteriel elevée (limité a 10 résultats)
* http://localhost:8000/view/arterial_pressure?systolic_value_gt=140&limit=10

Valeurs de tensions arteriels pour 4 patients
* http://localhost:8000/view/arterial_pressure?patient_id_in=pat_1,pat_2,pat_3,pat_4,pat_5


Valeurs de tensions arteriels pour 4 patients avec une tension arteriel normal
* http://localhost:8000/view/arterial_pressure?patient_id_in=pat_999