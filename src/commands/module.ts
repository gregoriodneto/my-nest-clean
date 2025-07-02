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
    opts?: { name?: string ,path?: string, json?: string }
) {
    const root = path.resolve(process.cwd(), opts.path);
    
    console.log('> Root:', opts.path);
    console.log('> moduleDir:', opts.name);
    console.log('> Nome:', opts.name);
    console.log('> Caminho recebido:', opts.path);
    console.log('> Json recebido:', opts.json);

    if (opts.json) {
        const jsonPath = path.resolve(opts.json);
        if (!fs.readFileSync(jsonPath)) {
            console.error('Arquivo JSON não encontrado', jsonPath);
            process.exit(1);
        }

        let jsonData: any;
        try {
            jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
            const modules = await convertInTypesModules(jsonData);

            for (const mod of modules) {
                const moduleDir = path.join(root, 'src', mod.kebabName);
                await copyTemplate(
                    path.join(__dirname, '../../templates/module'),
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

    
    const moduleDir = path.join(root, 'src', opts.name);

    const naming = {
        kebabName: kebabCase(opts.name), // user-profile
        pascalName: pascalCase(opts.name), // UserProfile
        camelName: camelCase(opts.name),  // userProfie
        constantName: constantCase(opts.name) // USER_PROFILE
    }

    await copyTemplate(
        path.join(__dirname, '../../templates/module'),
        moduleDir,
        naming
    );

    console.log(`✅ Módulo ${naming.pascalName} criado em ${moduleDir}.`);
    
}