# FlowPay - Makefile

.PHONY: help install build dev start test lint audit clean setup-env analysis

# Parâmetros
PORT ?= 3000
NODE_ENV ?= development

help: ## Exibe esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instala as dependências do projeto
	npm install --cache .npm-cache

build: ## Compila o projeto (TypeScript -> JavaScript)
	npm run build

dev: ## Inicia o ambiente de desenvolvimento com hot-reload
	npm run dev

start: ## Inicia o servidor em modo de produção (requer build)
	npm run start

test: ## Executa os testes (placeholder)
	npm test

lint: ## Executa a verificação estática de tipos e estilos
	npx tsc --noEmit

audit: ## Verifica vulnerabilidades em dependências
	npm audit --cache .npm-cache

clean: ## Limpa os artefatos de build e caches
	rm -rf dist
	rm -rf .npm-cache

setup-env: ## Cria o arquivo .env a partir do .env.example se não existir
	test -f .env || cp .env.example .env

analysis: ## Executa a análise completa de saúde do código
	@echo "\033[1;34m[FlowPay Analysis] Starting full code health check...\033[0m"
	@echo "\033[1;32m1. Running Security Audit...\033[0m"
	@npm audit || (echo "\033[1;31mSecurity audit failed!\033[0m" && exit 1)
	@echo "\033[1;32m2. Running Type Check (TSC)...\033[0m"
	@npx tsc --noEmit || (echo "\033[1;31mType check failed!\033[0m" && exit 1)
	@echo "\033[1;32m3. Running Build Validation...\033[0m"
	@npm run build || (echo "\033[1;31mBuild failed!\033[0m" && exit 1)
	@echo "\033[1;32m4. Checking Directory Structure...\033[0m"
	@ls -R src/core src/rails src/http src/products src/utils > /dev/null
	@echo "\033[1;34m[FlowPay Analysis] All checks passed successfully! 🚀\033[0m"

full-check: analysis ## Atalho para análise completa
