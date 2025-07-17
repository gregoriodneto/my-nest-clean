import path from 'path';
import fs from 'fs-extra';
import { render } from './render';

export async function copyTemplate(
    srcDir: string,
    desDir: string,
    data: Record<string, any>
) {
    await fs.ensureDir(desDir);

    const files = await fs.readdir(srcDir);
    for (const file of files) {
        const originPath = path.join(srcDir, file);
        const stats = await fs.stat(originPath);

        // substitui __name__ por moduleName nos NOME dos arquivos.
        const renderedName = file.replace(/__name__/g, data.kebabName);
        const destPath = path.join(desDir, renderedName);

        if (stats.isDirectory()) {            
            await copyTemplate(originPath, destPath, data);
        } else {
            await render(originPath, destPath, data);
        }
    }
}