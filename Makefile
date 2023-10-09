.PHONY: all frontend backend clean

all: frontend backend

frontend:
	cd frontend && npm install && npm run build

backend:
	cd backend && npm install

run-backend:
	cd backend && npm start

run-frontend:
	cd frontend && npm start

clean:
	rm -rf frontend/node_modules backend/node_modules frontend/build
