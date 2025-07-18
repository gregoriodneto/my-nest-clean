import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { copyTemplate } from 'src/utils/copy-templates.ts';
import { convertInTypesModules } from 'src/utils/convert-in-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initServiceCommand(
    opts?: { name?: string, path?: string, json?: string, typeService?: string }
) {    
    const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Nome do serviço:',
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
            message: 'Arquivo JSON para carregar os atributos (opcional):',
            default: opts.json || '',
        },
        {
          type: 'input',
          name: 'typeService',
          message: 'Tipo do serviço:',
          default: opts.typeService || 'microservice',
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

            const serviceType = answers.typeService === 'auth'
                ? '../../templates/base-auth-project'
                : '../../templates/base-project-microservice';

            for (const mod of modules) {
                const moduleDir = path.join(root, mod.kebabName);
                
                await copyTemplate(
                    path.join(__dirname, serviceType),
                    moduleDir,
                    mod
                );
                
                console.log(`Microserviço ${mod.kebabName} gerando em ${moduleDir}`);
                // Instalando as dependências
                try {                    
                    console.log('Instalando dependências...');
                    execSync('npm i', { cwd: moduleDir ,stdio: 'inherit' });
                } catch (error) {
                    console.warn('⚠️ Falha ao instalar dependências. Você pode instalar manualmente com:');
                    console.warn(`cd ${moduleDir} && npm install`);
                }

                console.log(`✅ Microserviço criado em ${moduleDir}`);
            }
        } catch (error) {
            console.error('Erro ao ler ou parsear o JSON:', error);
            process.exit(1);
        }
        process.exit(1);
    }
}