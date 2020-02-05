const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const readFile = (file)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(file, (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve(data.toString());
      }
    });
  });
};

const writeFile = (file, data)=> {
  return new Promise((resolve, reject)=> {
    fs.writeFile(file, data, (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

const addGuest = (guest)=> {
  return readFile('./guests.json')
    .then(data => {
      const guests = JSON.parse(data);
      let max = guests.reduce((acc, guest)=> {
        if(guest.id > acc){
          acc = guest.id;
        }
        return acc;
      }, 0);
      guest.id = max + 1;
      guests.push(guest);
      return writeFile('./guests.json', JSON.stringify(guests, null, 2));
    })
    .then(()=> {
      return guest;
    });
};

const server = http.createServer((request, response) => {
	if(request.url === '/'){
		readFile('./index.html')
		.then( html => {
			response.write(html);
			response.end();
		});
	}else if(request.url === '/api/guests'){
		if(request.method === 'GET'){
			readFile('./guests.json')
			.then(html => {
				response.write(html);
				response.end();
			});
		}else if(request.method === 'POST'){
			let buffer = '';
			request.on('data', (chunk) => {
				buffer += chunk;
			});
			request.on('end', () => {
				const guest = JSON.parse(buffer);
				addGuests(guest)
				.then( g => {
					response.write(JSON.stringify(g));
					response.end();
				});
			});
		}
	}else{
		response.statusCode = 404;
		response.write('');
		response.end();
	}
});

server.listen(port, () => {
	console.log('listening on port', port);
})