import { expect } from 'chai';

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
    it('null/empty word/meaning checks', function () {
        expect(isValidEntry(null, null, tableData)).to.be.false;
        expect(isValidEntry('', '')).to.be.false;
        expect(isValidEntry('', '', [...tableData, { word: '' }])).to.be.false;
        expect(isValidEntry()).to.be.false;
    });

    it('valid NEW inputs', function () {
        expect(isValidEntry('word', 'meaning')).to.be.true;
        expect(isValidEntry('word', 'meaning')).to.be.true;
        expect(isValidEntry('not existing', 'meaning', tableData)).to.be.true;
    });

    it('invalid existing inputs', function () {
        expect(isValidEntry('word1', 'meaning', tableData)).to.be.false;
    });

    it('invalid existing different case inputs', function () {
        expect(isValidEntry('Word1', 'meaning', tableData)).to.be.false;
    });

    it('valid input with invalid tableData', function () {
        expect(isValidEntry('Word1', 'meaning', invalidTableData)).to.be.true;
        expect(isValidEntry('Word1', 'meaning', [...invalidTableData, { word: 'word1' }])).to.be.false;
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
