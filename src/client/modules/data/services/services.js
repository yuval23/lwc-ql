const graphEndpoint = '/graphql';

export async function getData(query) {
    console.log('query ' + query.query);
    try {
        const response = await fetch(graphEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(query)
        });
        return response.json();
    } catch (e) {
        return e;
    }
}