const fs = require('fs');
const path = require('path');

const projectPath = 'C:/Users/korik/OneDrive/Desktop/doctor bangaram';

const ignoreDirs = ['node_modules', '.git', 'dist', 'build', 'assets', '.gemini', 'uploads', 'brain'];
const includeExts = ['.js', '.jsx', '.css', '.html', '.json', '.md'];

let totalLines = 0;
let fileCount = 0;

function countLinesInDir(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                countLinesInDir(fullPath);
            }
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (includeExts.includes(ext) && file !== 'package-lock.json') {
                const content = fs.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n').length;
                totalLines += lines;
                fileCount++;
            }
        }
    });
}

countLinesInDir(projectPath);
console.log(`Total Lines of Code: ${totalLines}`);
console.log(`Total Files: ${fileCount}`);
