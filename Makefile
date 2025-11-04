deps:
	npm install vsce

build:
	npx vsce package

publish: build
	npx vsce publish

test:
	npm run test
