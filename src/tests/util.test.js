import { expect } from 'chai';
import { INVALID_INPUTS, ROW_MODS } from '../util/const';

// test data
import {
    tableData,
    invalidTableData,
} from './data';

// testable
import {
    formatText,
    isValidEntry,
    filterData,
    resetValidity,
} from '../util/util';

describe('formatText tests', () => {
    it('null/empty checks', function () {
        expect(formatText(null)).to.be.equal('');
        expect(formatText('')).to.be.equal('');
        expect(formatText('   ')).to.be.equal('');
        expect(formatText(' ')).to.be.equal('');
    });

    it('valid text checks', function () {
        expect(formatText('test')).to.be.equal('Test');
        expect(formatText('two words')).to.be.equal('Two words');
    });

    it('valid text trim checks', function () {
        expect(formatText(' test ')).to.be.equal('Test');
        expect(formatText('    two words    ')).to.be.equal('Two words');
    });

    it('valid text extra space between checks', function () {
        expect(formatText('    test words   ')).to.be.equal('Test words');
        expect(formatText('    two      words    ')).to.be.equal('Two words');
    });
});

describe('isValidEntry tests', () => {
    const resp = { isValid: true, code: [] };
    const errResp = { isValid: false, code: [INVALID_INPUTS.WORD] };
    it('null/empty word/meaning checks', function () {
        expect(isValidEntry(null, null)).to.be.eql(errResp);
        expect(isValidEntry('hasValue', null, null)).to.be.eql({ ...errResp, code: [INVALID_INPUTS.MEANING, INVALID_INPUTS.SYNONYM] });
    });

    it('word already exists error', function () {
        expect(isValidEntry('alreadyvalue', 'hasMeaning', null, [{ word: 'alreadyValue' }])).to.be.eql(errResp);
    });
    it('valid inputs', function () {
        expect(isValidEntry('word', 'meaning', null, tableData)).to.be.eql(resp);
        expect(isValidEntry('word', null, [123], tableData)).to.be.eql(resp);
        expect(isValidEntry('word', 'meaning', [123], tableData)).to.be.eql(resp);
    });

    it('invalid existing different case inputs', function () {
        expect(isValidEntry('word1', 'meaning', [], tableData)).to.be.eql(errResp);
    });

    it('valid input with invalid tableData', function () {
        expect(isValidEntry('word1', 'meaning', [], invalidTableData)).to.be.eql(resp);
        expect(isValidEntry('word1', 'meaning', [], [...invalidTableData, { word: 'word1' }])).to.be.eql(errResp);
    });

    it('valid input with update mode', function () {
        expect(isValidEntry('word1', 'meaning', [], tableData, ROW_MODS.UPDATE)).to.be.eql(resp);
    });

    it('existing table input of word entry', function () {
        expect(isValidEntry('word1', 'meaning', [], [{ word: 'word1', key: -1 }], ROW_MODS.WRITE)).to.be.eql(resp);
    });
});


describe('filterData tests', () => {
    const data = [{ word: 'aaa', key: 1 }, { word: 'bab' }, { word: 'aac' }];

    it('null checks', function () {
        expect(filterData(null, null)).to.be.eql({ filteredData: null, exactId: null });
        expect(filterData(null, [])).to.be.eql({ filteredData: [], exactId: null });
        expect(filterData(null, data)).to.be.eql({ filteredData: data, exactId: null });

        expect(filterData('aa', null)).to.be.eql({ filteredData: [], exactId: null });
        expect(filterData('aa', {})).to.be.eql({ filteredData: [], exactId: null });
    });

    it('valid checks', function () {
        expect(filterData('aa', data)).to.be.eql({ filteredData: [data[0], data[2]], exactId: null });
        expect(filterData('a', data)).to.be.eql({ filteredData: data, exactId: null });
        expect(filterData('aaa', data)).to.be.eql({ filteredData: [data[0]], exactId: 1 });
        expect(filterData('aaad', data)).to.be.eql({ filteredData: [], exactId: null });
        expect(filterData('aaa', [...data, { ...data[0], word: 'aaad', key: 2 }])).to.be.eql({ filteredData: [data[0], { word: 'aaad', key: 2 }], exactId: 1 });
        expect(filterData('AaA', data)).to.be.eql({ filteredData: [data[0]], exactId: 1 });
    });


    it('invalid data checks', function () {
        expect(filterData('aa', ['test1', 'test2'])).to.be.eql({ filteredData: [], exactId: null });
        expect(filterData('aa', [{ word: null }])).to.be.eql({ filteredData: [], exactId: null });
    });
});

describe('filterData tests', () => {
    const sample = [INVALID_INPUTS.WORD, INVALID_INPUTS.MEANING, INVALID_INPUTS.SYNONYM];

    it('errCode removal check', function () {
        expect(resetValidity(INVALID_INPUTS.WORD, sample)).to.be.eql({
            isValid: false,
            errCodes: [INVALID_INPUTS.MEANING, INVALID_INPUTS.SYNONYM]
        });
    });

    it('errCode empty being valid check', function () {
        expect(resetValidity(INVALID_INPUTS.SYNONYM, [INVALID_INPUTS.SYNONYM])).to.be.eql({
            isValid: true,
            errCodes: []
        });
    });


    it('optional group removal check', function () {
        expect(resetValidity(INVALID_INPUTS.SYNONYM, sample)).to.be.eql({
            isValid: false,
            errCodes: [INVALID_INPUTS.WORD],
        });
        expect(resetValidity(INVALID_INPUTS.MEANING, sample)).to.be.eql({
            isValid: false,
            errCodes: [INVALID_INPUTS.WORD],
        });
    });
});