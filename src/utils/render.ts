import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';

export async function render(
    originPath: string, 
    destPath: string,
    data: Record<string, any>
) {
    if (originPath.endsWith('.ejs')) {
        const destinationPath = destPath.replace(/\.ejs$/, '');

        await fs.ensureDir(path.dirname(destinationPath));

        const template = await fs.readFile(originPath, 'utf-8');
        const rendered = ejs.render(template, data);
        await fs.writeFile(destinationPath, rendered, 'utf-8');
    } else {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(originPath, destPath);
    }
}