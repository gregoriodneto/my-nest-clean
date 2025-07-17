# 🧰 my-nest-clean

CLI para gerar um projeto NestJS com estrutura base utilizando Clean Architecture e criar novos módulos automaticamente.

## 📦 Instalação

### Opção 1: Global (modo desenvolvimento)

Dentro da pasta do projeto:

```bash
npm install
npm run build
npm link
```


### Opção 2: Instalação global por caminho
```bash
npm i -g /caminho/para/my-nest-clean
```

### Opção 2: Instalação global por caminho
```bash
npm i -g my-nest-clean
```

## 🚀 Comandos disponíveis
```init```
Cria um novo projeto NestJS com Clean Architecture.
```bash
my-nest-clean init [diretorio] --name nome-do-projeto
```
- ```diretorio```: (opcional) Caminho onde o projeto será criado. Se omitido, será criado na pasta atual com um nome já fixo ```my-nest-app```.
- ```--name```: (opcional) Nome do projeto.

Exemplo:
```bash
# Usando a flag para nomear o projeto
my-nest-clean init /home/usuario/Projetos --name minha-api

# Criando o projeto e colocando no caminho do diretório o nome do projeto separado por /
my-nest-clean init /home/usuario/Projetos/minha-api
```

```module```
Cria um novo módulo com estrutura base (```application```, ```domain```, ```infrastructure```, ```interface```).
Lembrando que o módulo é criado dentro da pasta SRC como padrão.
```bash
my-nest-clean module <nome-do-modulo> --path <caminho-do-projeto>
```

- ```<nome-do-modulo>```: Nome do módulo (ex: user, produto, auth)
- ```--path```: (opcional) Caminho da raiz do projeto Nest (default: pasta atual)

Exemplo:
```bash
# Dentro do projeto Nest
my-nest-clean module user

# De qualquer lugar
my-nest-clean module produto --path /home/usuario/Projetos/minha-api
```

## 🛠️ Scripts úteis
Se for usar o comando dentro DESTE projeto:
```bash
# Cria um projeto com o my-api como nome
npm run dev -- init /home/usuario/Projetos/my-api

# Cria um módulo dentro do my-api (Ele vai direto para dentro de SRC)
npm run dev -- module -p /home/usuario/Projetos/my-api user
```