#!/usr/bin/env node
import { Command } from 'commander';
import initCommand from './commands/init.ts';
import moduleCommand from './commands/module.ts';

const program = new Command();
program.name('my-nest-clean')
    .description('CLI para gerar estrutura Clean Architecture no NestJS')
    .version('1.0.0');

program
    .command('init [dir]')
    .description('Cria um novo projeto NestJS com arquitetura base')
    .option('-n, --name <projectName>', 'Nome da pasta do projeto')
    .action(initCommand);

program
    .command('module <name>')
    .description('Adiciona um módulo com Clean Architecture')
    .option('-p, --path <dir>', 'Raiz da aplicação Nest', process.cwd())
    .action(moduleCommand);

program.parse();
program.allowUnknownOption().enablePositionalOptions();