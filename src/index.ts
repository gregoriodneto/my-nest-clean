#!/usr/bin/env node
import { Command } from 'commander';
import initCommand from './commands/init.ts';
import moduleCommand from './commands/module.ts';
import initServiceCommand from './commands/initService.ts';
import initGatewayCommand from './commands/initGateway.ts';

const program = new Command();
program.name('my-nest-clean')
    .description('CLI para gerar estrutura Clean Architecture no NestJS')
    .version('1.0.0');

program
    .command('init [dir]')
    .description('Cria um novo projeto NestJS com arquitetura base')
    .option('-n, --name <projectName>', 'Nome da pasta do projeto')
    .option('-y, --type <typeInit>', 'Nome do tipo de projeto inicial')
    .action(initCommand);

program
    .command('service')
    .description('Cria um Microserviço NestJS com arquitetura Mongo, Elasticsearch, Kafka, Docker')
    .option('-n, --name <name>', 'Nome do Microserviço')
    .option('-p, --path <dir>', 'Raiz da aplicação Nest', process.cwd())
    .option('-j, --json <file>', 'JSON com valores para implementar o microserviço', process.cwd())
    .action(initServiceCommand);

program
    .command('gateway')
    .description('Cria um Gateway NestJS com arquitetura Mongo, Elasticsearch, Kafka, Docker')
    .option('-p, --path <dir>', 'Raiz da aplicação Nest', process.cwd())
    .action(initGatewayCommand);

program
    .command('module')
    .description('Adiciona um módulo com Clean Architecture')
    .option('-n, --name <name>', 'Nome do Módulo')
    .option('-p, --path <dir>', 'Raiz da aplicação Nest', process.cwd())
    .option('-j, --json <file>', 'JSON com valores para implementar o módulo', process.cwd())
    .action(moduleCommand);

program.parse();
program.allowUnknownOption().enablePositionalOptions();