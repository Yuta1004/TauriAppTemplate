MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

SRCS :=\
	$(wildcard src/components/*.tsx) \
	$(wildcard src/pages/*.tsx) \
	src/style.css \
	package.json \
	next.config.js

run:
	npm run dev

build: $(SRCS)
	npm run build

setup: node_modules

node_modules:
	npm install

.PHONY: run setup
