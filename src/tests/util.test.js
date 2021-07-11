import { strictEqual } from 'assert';
import { formatText } from '../util/util';

describe('formatText tests', () => {
    it('null/empty checks', function () {
        strictEqual(formatText(null), '');
        strictEqual(formatText(''), '');
        strictEqual(formatText('       '), '');
        strictEqual(formatText(' '), '');
    });

    it('valid text checks', function () {
        strictEqual(formatText('test'), 'Test');
        strictEqual(formatText('two words'), 'Two words');
    });

    it('valid text trim checks', function () {
        strictEqual(formatText(' test '), 'Test');
        strictEqual(formatText('    two words    '), 'Two words');
    });

    it('valid text extra space between checks', function () {
        strictEqual(formatText('    test words   '), 'Test words');
        strictEqual(formatText('    two      words    '), 'Two words');
    });
});
