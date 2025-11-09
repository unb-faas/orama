const path = require('path');
const fs = require('fs')
const apis = require('../utils/apis');

let allFilesContent = '';

const readFilesRecursively = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isFile()) {
            if (!item.endsWith('.pyc')) {
                const content = fs.readFileSync(itemPath, 'utf8');
                allFilesContent += content + '\n';
            }
        } else if (stats.isDirectory()) {
            readFilesRecursively(itemPath);
        }
    });
}

const getUseCaseSourceCode = async (usecase_acronym) => {
    const directoryPath = path.join(__dirname, `../../../use-cases/${usecase_acronym}/faas`);
    allFilesContent = '';
    readFilesRecursively(directoryPath);
    return allFilesContent;
}

const getMetrics = async (source_code) => {
    const metrics_response =  await apis.post("analyze", { code:source_code }, "halsteader");
    return metrics_response ? metrics_response.data : {};
}

module.exports = {
  async getMetricsFromSourceCode(usecase_acronym) {
    const source_code = await getUseCaseSourceCode(usecase_acronym);
    return await getMetrics(source_code);
  },
};