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

Patients qui ont signés le general consent (5% sur 150K), réponse limité à 10 records
* http://46.101.116.183:8088/view/patient?limit=10&general_consent=yes

```sql
select *
from patient
where general_consent = 'yes'
limit 10
```

Patients avec 18 ans qui ont signés le general consent
* http://46.101.116.183:8088/view/patient?age=18&general_consent=yes

```sql
select *
from patient
where general_consent = 'yes'
and age = 18
```

Patients adulte > 18 ans qui ont signés le general consent 
* http://46.101.116.183:8088/view/patient?age_gte=18&general_consent=yes

```sql
select *
from patient
where general_consent = 'yes'
and age > 18
```

Patients identifiés par leurs ID
* http://46.101.116.183:8088/view/patient?id_in=pat_1,pat_2,pat_3,pat_4

```sql
select *
from patient
where id in ('pat_1', 'pat_2', 'pat_3', 'pat_4')
```

#### TENSIONS ARTERIELS

Valeurs de tension arteriel elevée (limité a 10 résultats)
* http://46.101.116.183:8088/view/arterial_pressure?systolic_value_gte=140&limit=10

```sql
select *
from arterial_pressure
where systolic_value >= 140
limit 10
```

Valeurs de tensions arteriels pour 4 patients
* http://46.101.116.183:8088/view/arterial_pressure?patient_id_in=pat_1,pat_2,pat_3,pat_4,pat_5

```sql
select *
from arterial_pressure
where patient_id in ('pat_1', 'pat_2', 'pat_3', 'pat_4', 'pat_5') 
```


Valeurs de tensions arteriels pour 4 patients avec une tension arteriel normal
* http://46.101.116.183:8088/view/arterial_pressure?patient_id_in=pat_1,pat_2,pat_3,pat_4,pat_5&systolic_value_gte=100

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