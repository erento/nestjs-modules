module.exports = {
    'src/**/*.ts': (filenames) => {
        if (filenames.length === 0) {
            return [];
        }
        const filenamesParams = filenames.map((filename) => `${filename.replace(`${process.cwd()}/`, '')}`);

        const args = filenamesParams.join(' ');
        return filenamesParams.length ? [`npm run lint:fix ${args}`, `git add ${args}`] : [];
    },
}
