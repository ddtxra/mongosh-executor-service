### Mongo API 

Using docker
```
docker-compose up -d
```

Using python (make sure you have a mongo instance running and change your connection in mongo.py accordingly)
```
uvicorn main:app --host 0.0.0.0 --port 8000  
```

### Executing the scripts throught the API

#### PATIENTS

Patients qui ont signés le general consent (5% sur 150K), réponse limité à 10 records
* http://localhost:8088/view/patient?limit=10&general_consent=yes

```
curl -X POST -H "Content-Type: application/json" -d '{"limit": 10, "general_consent": "yes"}' "http://localhost:8088/view/patient"
```

```sql
select *
from patient
where general_consent = 'yes'
limit 10
```

Patients avec 18 ans qui ont signés le general consent
* http://localhost:8088/view/patient?age=18&general_consent=yes

```
curl -X POST -H "Content-Type: application/json" -d '{"age": 18, "general_consent": "yes"}' "http://localhost:8088/view/patient"
```

```sql
select *
from patient
where general_consent = 'yes'
and age = 18
```

Patients adulte > 18 ans qui ont signés le general consent 
* http://localhost:8088/view/patient?age_gte=18&general_consent=yes

```
curl -X POST -H "Content-Type: application/json" -d '{"age_gte": 18, "general_consent": "yes"}' "http://localhost:8088/view/patient"
```

```sql
select *
from patient
where general_consent = 'yes'
and age > 18
```

Patients identifiés par leurs ID
* http://localhost:8088/view/patient?id_in=pat_1,pat_2,pat_3,pat_4

```
curl -X POST -H "Content-Type: application/json" -d '{"id_in": ["pat_1", "pat_2", "pat_3", "pat_4"]}' "http://localhost:8088/view/patient"
```

```sql
select *
from patient
where id in ('pat_1', 'pat_2', 'pat_3', 'pat_4')
```

#### TENSIONS ARTERIELS

Valeurs de tension arteriel elevée (limité a 10 résultats)
* http://localhost:8088/view/arterial_pressure?systolic_value_gte=140&limit=10


```
curl -X POST -H "Content-Type: application/json" -d '{"systolic_value_gte": 140, "limit": 10}' "http://localhost:8088/view/arterial_pressure"
```

```sql
select *
from arterial_pressure
where systolic_value >= 140
limit 10
```

Valeurs de tensions arteriels pour 4 patients
* http://localhost:8088/view/arterial_pressure?patient_id_in=pat_1,pat_2,pat_3,pat_4,pat_5

```
curl -X POST -H "Content-Type: application/json" -d '{"patient_id_in": ["pat_1", "pat_2", "pat_3", "pat_4"]}' "http://localhost:8088/view/arterial_pressure"
```

```sql
select *
from arterial_pressure
where patient_id in ('pat_1', 'pat_2', 'pat_3', 'pat_4', 'pat_5') 
```


Valeurs de tensions arteriels pour 4 patients avec une tension arteriel normal
* http://localhost:8088/view/arterial_pressure?patient_id_in=pat_1,pat_2,pat_3,pat_4,pat_5&systolic_value_gte=100

```
curl -X POST -H "Content-Type: application/json" -d '{"patient_id_in": ["pat_1", "pat_2", "pat_3", "pat_4"], "systolic_value_gte": 100}' "http://localhost:8088/view/arterial_pressure"
```


```sql
select *
from arterial_pressure
where systolic_value >= 100
```

Et puis bien sure le but c'est de faire du SELF-BI, donc voici un example
de comment faire une requête en faisant des jointures entres N vues.

Par e.g. patients avec plus de 18 ans avec le consentement général qui ont une valeur systolic elevée?

```sql
select *
from patients p
inner join arterial_pressure a on (p.id = a.patient_id)
where p.general_consent = 'yes'
and p.age > 18
and a.systolic_value >= 140
```


