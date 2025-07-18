import inquirer from 'inquirer';
import path from 'path';
import fs from "fs-extra";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { camelCase, constantCase, kebabCase, pascalCase } from 'change-case';
import { copyTemplate } from 'src/utils/copy-templates';
import { convertInTypesModules } from 'src/utils/convert-in-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function moduleCommand(
    opts?: { name?: string ,path?: string, json?: string, typeModule?: string }
) {
    const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Nome do módulo:',
          default: opts.name || 'example',
        },
        {
            type: 'input',
            name: 'path',
            message: 'Caminho da aplicação Nest:',
            default: opts.path || process.cwd(),
        },
        {
            type: 'input',
            name: 'json',
            message: 'Arquivo JSON (opcional):',
            default: opts.json || '',
        },{
          type: 'input',
          name: 'typeModule',
          message: 'Tipo do módulo (simple/microservice):',
          default: opts.typeModule || 'simple',
        },
    ]);

    const root = path.resolve(process.cwd(), answers.path);
    
    console.log('> Root:', answers.path);
    console.log('> moduleDir:', answers.name);
    console.log('> Nome:', answers.name);
    console.log('> Caminho recebido:', answers.path);
    console.log('> Json recebido:', answers.json);

    if (answers.json) {
        const jsonPath = path.resolve(answers.json);
        if (!fs.readFileSync(jsonPath)) {
            console.error('Arquivo JSON não encontrado', jsonPath);
            process.exit(1);
        }

        let jsonData: any;
        try {
            jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
            const modules = await convertInTypesModules(jsonData);
            const moduleType = answers.typeModule === 'microservice'
                ? '../../templates/module-microservice'
                : '../../templates/module';
                
            for (const mod of modules) {
                const moduleDir = path.join(root, 'src', mod.kebabName);
                await copyTemplate(
                    path.join(__dirname, moduleType),
                    moduleDir,
                    mod
                );
                console.log(`Módulo ${mod.pascalName} gerando em ${moduleDir}`);
            }
        } catch (error) {
            console.error('Erro ao ler ou parsear o JSON:', error);
            process.exit(1);
        }
        process.exit(1);
    }

    
    const moduleDir = path.join(root, 'src', answers.name);

    const naming = {
        kebabName: kebabCase(answers.name), // user-profile
        pascalName: pascalCase(answers.name), // UserProfile
        camelName: camelCase(answers.name),  // userProfie
        constantName: constantCase(answers.name) // USER_PROFILE
    }

    await copyTemplate(
        path.join(__dirname, '../../templates/module'),
        moduleDir,
        naming
    );

    console.log(`✅ Módulo ${naming.pascalName} criado em ${moduleDir}.`);
    
}