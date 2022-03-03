module.exports = {
    'src/**/*.ts': (filenames) => {
        if (filenames.length === 0) {
            return [];
        }

        return filenames.length ? [`npm run lint:fix ${filenames.join(' ')}`] : [];
    },
}
