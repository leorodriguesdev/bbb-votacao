.PHONY: all frontend backend clean

run: run-backend run-frontend

OS := $(shell uname -s)

run-backend:
ifeq ($(OS),Linux)
	gnome-terminal -- bash -c "cd backend && npm start"
endif
ifeq ($(OS),Darwin) # Darwin indica macOS
	osascript -e 'tell app "Terminal" to do script "cd leonardo-rodrigues/backend && npm start"'
endif

run-frontend:
ifeq ($(OS),Linux)
	gnome-terminal -- bash -c "cd frontend && npm start"
endif
ifeq ($(OS),Darwin) # Darwin indica macOS
	osascript -e 'tell app "Terminal" to do script "cd leonardo-rodrigues/frontend && npm start"'
endif


clean:
	rm -rf frontend/node_modules backend/node_modules frontend/build
