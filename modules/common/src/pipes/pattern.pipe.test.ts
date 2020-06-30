import {PatternPipe} from './pattern.pipe';

describe('Pattern Pipe', (): void => {
    test.each([
        ['^\\d+$', '123123'],
        ['^a$', 'a'],
        ['^(pattern|pipe)$', 'pattern'],
        ['^(pattern|pipe)$', 'pipe'],
    ])('value "%s" matches pattern "%s"', (pattern: string, value: string): void => {
        expect(new PatternPipe(pattern).transform(value)).toBe(value);
    });

    test.each([
        ['^\\d+$', 'asdasd'],
        ['^a$', 'b'],
        ['^(pattern|pipe)$', 'matter'],
        ['^(pattern|pipe)$', 'type'],
    ])('it throws if "%s" doesnt match pattern "%s"', (pattern: string, value: string): void => {
        expect((): string => new PatternPipe(pattern).transform(value)).toThrow();
    });
});
