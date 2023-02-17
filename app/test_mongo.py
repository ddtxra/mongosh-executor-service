import unittest
from app.mongo import execute_mongo_query


class TestExecuteMongoQuery(unittest.IsolatedAsyncioTestCase):
    async def test_execute_mongo_query(self):
        # Test a simple query that should return a single document
        query = 'db.test.find({}, {_id: 0}).toArray()'
        expected_output = '[{"hello":"world"}]'

        # Execute the query and capture the results
        output = ""
        async for line in execute_mongo_query(query):
            output += line

        print(hex(output))
        print(hex(expected_output))

        # Compare the output to the expected value
        self.assertEqual(str(output), str(expected_output))