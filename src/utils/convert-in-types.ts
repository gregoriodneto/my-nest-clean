import { camelCase, constantCase, kebabCase, pascalCase } from "change-case";

type Field = { name: string; tsType: string };

type ModuleInfo = {
    rawName: string;
    kebabName: string;
    pascalName: string;
    camelName: string;
    constantName: string;
    fields: Field[];
}

const PRIMITIVE_MAP: Record<string, string> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    object: 'Record<string, any>',
    array: 'any[]'
};

export async function convertInTypesModules(data: object) {
    const modules: ModuleInfo[] = [];
    
    for (const [rawName, value] of Object.entries(data)) {
        if (typeof value !== 'object' || Array.isArray(value)) {
            console.log(`Ignorando a chave do topo ${rawName}, pois não é um objeto`);
            continue;
        }

        const fields: Field[] = Object.entries(value).map(([fieldName, fieldType]) => {
            let tsType = 'any';

            if (typeof fieldType === 'string') {
                tsType = PRIMITIVE_MAP[fieldType.toLowerCase()] ?? 'any';
            } else if (Array.isArray(fieldType)) {
                const inner = (fieldType[0] ?? 'any').toString();
                tsType = `${PRIMITIVE_MAP[inner] ?? 'any'}[]`;
            } else {
                tsType = `Record<string, any>`;
            }

            return { name: fieldName, tsType };
        });

        modules.push({
            rawName,
            kebabName: kebabCase(rawName),
            pascalName: pascalCase(rawName),
            camelName: camelCase(rawName),
            constantName: constantCase(rawName),
            fields
        });
    }

    return modules;
}