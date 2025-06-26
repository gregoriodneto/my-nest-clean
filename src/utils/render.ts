import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';

export async function render(
    originPath: string, 
    destPath: string,
    data: Record<string, any>
) {
    const destinationPath = destPath.replace(/\.ejs$/, '');
    const template = await fs.readFile(originPath, 'utf-8');
    const rendered = ejs.render(template, data);
    await fs.writeFile(destinationPath, rendered, 'utf-8');
}