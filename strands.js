const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-api-key': 'txTEkXYw5waU0nGYj96ZgafEMDor0jA4ErqB7m74',
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InhMQVRvOWM2T3VQci1jWEdqMEc3UiJ9.eyJpc3MiOiJodHRwczovL3N0cmFuZHMtZGVtby1iYW5rLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHx1c2VyUEZNMSIsImF1ZCI6Imh0dHA6Ly9zYW5kYm94LnN0cmFuZHNjbG91ZC5jb20vIiwiaWF0IjoxNjgzNzk2NzkwLCJleHAiOjE2ODQyMjg3OTAsImF6cCI6Im1EblhqMHRMM1lYRU5WV21DY05DbEpQbmVXaWh6eUhsIiwiZ3R5IjoicGFzc3dvcmQifQ.lZLGGKzSH52i1niIWOwHsXHOJK1VR5Z9lqBzykleosmqYix4CKXuKmxDFw-Z_X1gj6al5XB1FhUtrL2jY3TQ3_nBD1BiqDX7pefVA3JBTUkxg6iVfOcX60G4CEt5igfjptFcmu_Nvfv-lS1CRBxHcNzUCHtIKf5otxOjUCzZKxh6XkaOza7aT31xZmtlkzzBU1j6c2ichyS3PT6S0vMeHBwjE_pzo9xQ8xIIBa6pZJsDIMWI27c2mRpg5AE3O-gQMbDA-P3pN2aqkPF81Ms3B_TrNCwUZG3o7Z86wbltP50GG004EX4EL2DGPCM3kWVVU86mGEcYvJcnUjzYO5QqXw'
  }
};



const categories = new Map();

fetch('https://int.strandscloud.com/fs-api/transactions?recoverHeatLevel=false&page=0&size=50&sort=DATE_DESC&applyToSplits=false', options)
  .then(response => response.json())
  .then(response => {
    for (let transaction of response.transactions) {
        let idCategoria = transaction.category.id;
        if (typeof categories.get(idCategoria) !== undefined) {
            categories.set(idCategoria, 1);
        } else {
            categories.set(idCategoria, 1 + categories.get(idCategoria));
        }
    }
    let unsortedArray = [...categories];
    s
  })
  .catch(err => console.error(err));
