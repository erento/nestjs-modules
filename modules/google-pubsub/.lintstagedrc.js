module.exports = {
    'src/**/*.ts': (filenames) => {
        if (filenames.length === 0) {
            return [];
        }
        const filenamesParams = filenames.map((filename) => `--lint-file-patterns=${filename.replace(`${process.cwd()}/`, '')}`);

        return `npm run lint:fix ${filenamesParams.join(' ')}`;
    },
}
