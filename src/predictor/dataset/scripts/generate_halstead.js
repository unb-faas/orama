const path = require('path');
const fs = require('fs');
const escomplex = require('escomplex');

// Function to calculate Halstead metrics
const analyzeHalstead = (code) => {
  const report = escomplex.analyse(code);
  return report.aggregate.halstead;
};

// Function to read files from the directory and calculate Halstead metrics
const analyzeFiles = (files) => {
  const results = [];

  files.forEach(file => {
    const filePath = file;
    if (path.extname(filePath) === '.js') {
      const code = fs.readFileSync(filePath, 'utf-8');
      const halsteadMetrics = analyzeHalstead(code);
      results.push(halsteadMetrics);
    }
  });

  // Calculate the average metrics for all files
  const consolidatedResult = results.reduce((acc, cur) => {
    for (const key in cur) {
      if (key != "operators" && key != "operands") {
        if (acc.hasOwnProperty(key)) {
          acc[key] += cur[key];
        } else {
          acc[key] = cur[key];
        }
      }
    }

    if (acc["distinct_operators"]) {
      acc["distinct_operators"] += cur["operators"]["distinct"]
    } else {
      acc["distinct_operators"] = cur["operators"]["distinct"]
    }

    if (acc["total_operators"]) {
      acc["total_operators"] += cur["operators"]["total"]
    } else {
      acc["total_operators"] = cur["operators"]["total"]
    }

    if (acc["distinct_operands"]) {
      acc["distinct_operands"] += cur["operands"]["distinct"]
    } else {
      acc["distinct_operands"] = cur["operands"]["distinct"]
    }

    if (acc["total_operands"]) {
      acc["total_operands"] += cur["operands"]["total"]
    } else {
      acc["total_operands"] = cur["operands"]["total"]
    }

    return acc;
  }, {});

  const numFiles = results.length;
  for (const key in consolidatedResult) {
    consolidatedResult[key] /= numFiles;
  }

  return consolidatedResult;
};

// Function to recursively traverse a directory
function listFilesRecursively(directoryPath, fileList) {
  const files = fs.readdirSync(directoryPath);

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // If the path is a directory, call the function recursively
      listFilesRecursively(filePath, fileList);
    } else {
      // If the path is a file, add it to the list if it's a JS file
      if (path.extname(filePath) === '.js') {
        fileList.push(filePath);
      }
    }
  });
}

// Function to get a list of JS files in a directory
function getJSFilesInDirectory(directoryPath) {
  const jsFiles = [];
  listFilesRecursively(directoryPath, jsFiles);
  return jsFiles;
}

// Directory to be analyzed (can be replaced by the desired directory)
// const directoryPath = '../inputs/usecases/api4dbaas/azf/code';
const directoryPath = process.argv[2]
if (!directoryPath) {
  console.error('Please provide the path to the directory containing the JavaScript files.');
  process.exit(1);
}
// Get the list of JS files in the directory
const jsFiles = getJSFilesInDirectory(directoryPath);

// Display the found JS files
console.log('Found JS files:');
console.log(jsFiles);

const halsteadResults = analyzeFiles(jsFiles);
halsteadResults["path"] = directoryPath;
halsteadResults["files"] = jsFiles;
console.log('Consolidated Halstead metrics for all files in the directory:');
console.log(JSON.stringify(halsteadResults, null, 2));
