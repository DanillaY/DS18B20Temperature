//const server = require('./server');
const env = require('./env');

function setMockData(data) {
	global.fetch = jest.fn(() =>
		Promise.resolve({
			json: () => Promise.resolve(data),
	}));
}

test('[REAL DATA] tempCountSetMonth data test ', async () => {
	const apiResponse = await fetch(`http://${env.apiPath}/tempCountSetMonth?month=0`).then(data => data.json());
	expect(apiResponse).toHaveProperty('rowsCount');
});

test('[MOCK DATA] tempCountSetMonth data test', async () => {
	setMockData([{'rowsCount':10}]);
	const apiResponse = await fetch(`http://${env.apiPath}/tempCountSetMonth?month=10`).then(data => data.json());
	
	expect(apiResponse).toEqual([{'rowsCount': 10}]);
});