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

export default async function initCommand(
    dirArg: string | undefined,
    opts: { name?: string, type?: string }
) {    
    const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Digite o nome do projeto:',
          default: opts.name || 'meu-projeto-nest',
        },
        {
          type: 'input',
          name: 'directory',
          message: 'Diretório de destino:',
          default: dirArg || './',
        },
        {
          type: 'input',
          name: 'typeInit',
          message: 'Nome do tipo de projeto inicial:',
          default: opts.type || 'base',
        },
    ]);
    
    const targetDir = 
        path.resolve(process.cwd(), answers.directory, answers.projectName ?? 'my-nest-app');

    const projectName = answers.projectName ?? path.basename(targetDir);

    // Cria a pasta
    await fs.ensureDir(targetDir);

    const typeProject = answers.typeInit === 'ambient'
        ? '../../templates/base-ambient'
        : '../../templates/base-project';

    const naming = {
        kebabName: kebabCase(projectName), // user-profile
        pascalName: pascalCase(projectName), // UserProfile
        camelName: camelCase(projectName),  // userProfie
        constantName: constantCase(projectName) // USER_PROFILE
    }
    
    // Copiando o template
    await copyTemplate(
        path.join(__dirname, typeProject),
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