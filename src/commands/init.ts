import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { copyTemplate } from 'src/utils/copy-templates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function initCommand(
    dirArg: string | undefined,
    opts: { name?: string }
) {    
    const targetDir = dirArg
        ? path.resolve(process.cwd(), dirArg)
        : path.resolve(process.cwd(), opts.name ?? 'my-nest-app');

    const projectName = opts.name ?? path.basename(targetDir);

    // Cria a pasta
    await fs.ensureDir(targetDir);

    // Copiando o template
    await copyTemplate(
        path.join(__dirname, '../../templates/base-project'),
        targetDir,
        { projectName }
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