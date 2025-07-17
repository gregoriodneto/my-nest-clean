import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { camelCase, constantCase, kebabCase, pascalCase } from 'change-case';
import { copyTemplate } from 'src/utils/copy-templates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initGatewayCommand(
    opts?: { path?: string }
) {    
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'path',
            message: 'Caminho da aplicação Nest:',
            default: opts.path || process.cwd(),
        }
    ]);

    const root = path.resolve(process.cwd(), answers.path);
        
    console.log('> Root:', root);
    console.log('> Caminho recebido:', root);

    const projectName = "gateway";
    const targetDir = path.resolve(root, projectName);

    // Cria a pasta
    await fs.ensureDir(targetDir);

    const naming = {
        kebabName: kebabCase(projectName), // user-profile
        pascalName: pascalCase(projectName), // UserProfile
        camelName: camelCase(projectName),  // userProfie
        constantName: constantCase(projectName) // USER_PROFILE
    }

    // Copiando o template
    await copyTemplate(
        path.join(__dirname, '../../templates/gateway'),
        targetDir,
        naming
    );

    // Instalando as dependências
    try {
        console.log('Instalando dependências...');
        execSync('npm i', { cwd: targetDir, stdio: 'inherit' });
    } catch (error) {
        console.warn('⚠️ Falha ao instalar dependências. Você pode instalar manualmente com:');
        console.warn(`cd ${targetDir} && npm install`);
    }

    console.log(`✅ Projeto criado em ${targetDir}`);
}