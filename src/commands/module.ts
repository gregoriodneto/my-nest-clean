import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { camelCase, constantCase, kebabCase, pascalCase } from 'change-case';
import { copyTemplate } from 'src/utils/copy-templates';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function moduleCommand(name: string, opts: { path: string }) {
    console.log('> Nome:', name);
    console.log('> Caminho recebido:', opts.path);

    const root = path.resolve(process.cwd(), opts.path);
    const moduleDir = path.join(root, 'src', name);
    const naming = {
        kebabName: kebabCase(name), // user-profile
        pascalName: pascalCase(name), // UserProfile
        camelName: camelCase(name),  // userProfie
        constantName: constantCase(name) // USER_PROFILE
    }

    await copyTemplate(
        path.join(__dirname, '../../templates/module'),
        moduleDir,
        naming
    );

    console.log(`✅ Módulo ${naming.pascalName} criado em ${moduleDir}.`);
}