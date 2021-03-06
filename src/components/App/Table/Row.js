import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverRounded';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    INVALID_INPUTS,
} from '../../../util/const';
const MAX_MEAN_LEN = 70;

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        top: '50px',
    },
    row: {
        width: '100%',
        overflow: 'hidden',
        borderBottom: '1px solid #ebeced',
        textAlign: 'left',
        margin: '5px 0',
        alignItems: 'center',
        '&:hover $expand': {
            visibility: 'visible',
        },
        '&:hover $expandOpen': {
            visibility: 'visible',
        },
        '&:hover $viewEye': {
            visibility: 'visible',
        },
        whiteSpace: 'nowrap',
    },
    word: {
        display: 'inline-block',
        position: 'relative',
        width: '30%',
        left: '1%'
    },
    editWord: {
        display: 'inline-block',
        position: 'relative',
        width: '30%',
        left: '1%',
        top: '4px',
    },
    meaning: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
        whiteSpace: 'pre-wrap',
        padding: '10px',
    },
    editMeaning: {
        display: 'inline-block',
        position: 'relative',
        width: '40%',
        top: '-4px',
        maxHeight: '100px'
    },
    views: {
        display: 'inline-block',
        width: '15%'
    },
    viewEye: {
        verticalAlign: 'middle',
        paddingLeft: '5px',
        visibility: 'hidden',
    },
    expand: {
        verticalAlign: 'middle',
        position: 'relative',
        right: '5%',
        transform: 'rotate(0deg)',
        // marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        visibility: 'hidden',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        visibility: 'hidden',
    },
    blurry: {
        filter: 'blur(8px)',
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
    },
    synonyms: {
        position: 'relative',
        left: '30%',
    },
    synonymsEdit: {
        position: 'relative',
        left: '30%',
        width: '41%',
    },
}));

export function EditableRow({
    rowKey,
    word,
    meaning,
    synonyms,
    style,
    isExpanded,
    handleExpandClick,
    index,
    onWordCange,
    onMeaningChange,
    onSynonymChange,
    setAbort,
    source,
    map,
    isValid,
    errCodes,
    onSubmit,
}) {
    const classes = useStyles();

    const renderButtons = () => {
        return (
            <div className={classes.views}>
                <div style={{
                    verticalAlign: 'middle',
                    display: 'inline-block',
                }}>
                    <Tooltip title='Reset view count'>
                        <IconButton
                            style={{ display: 'inline-block', }}
                            color='primary'
                            disabled
                        >
                            <ArrowUpwardIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <Tooltip title='Save'>
                    <IconButton
                        style={{ display: 'inline-block', color: isValid ? '#35F321' : 'grey' }}
                        disabled={!isValid}
                        onClick={onSubmit}
                    >
                        <CheckCircleIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Cancel'>
                    <IconButton
                        color='secondary'
                        style={{ display: 'inline-block', }}
                        onClick={setAbort}
                    >
                        <CancelIcon />
                    </IconButton>
                </Tooltip>
            </div >);
    }
    const synonymWords = synonyms.map(s => map[s]);

    return (
        <div key={rowKey} style={style} className={classes.row}>
            <div>
                <TextField
                    className={classes.editWord}
                    label="Word"
                    variant="outlined"
                    value={word || ''}
                    onChange={onWordCange}
                    size='small'
                    error={errCodes.includes(INVALID_INPUTS.WORD)}
                    type='search'
                />
                <TextField
                    label="Meaning"
                    className={classes.editMeaning}
                    style={{ margin: 8 }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={meaning || ''}
                    onChange={onMeaningChange}
                    size='small'
                    error={errCodes.includes(INVALID_INPUTS.MEANING)}
                    type='search'
                    multiline
                    row={2}
                />
                <div style={{
                    width: '9%',
                    display: 'inline-block',
                }} />
                {renderButtons()}
                <div style={{ display: 'inline-block' }}>
                    <Tooltip title={isExpanded ? 'Collapse' : 'View word'}>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: isExpanded,
                            })}
                            aria-expanded={isExpanded}
                            aria-label="show more"
                            onClick={() => { if (isExpanded) { handleExpandClick(index) } }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.synonymsEdit}>
                    <Autocomplete
                        multiple
                        limitTags={3}
                        id="multiple-limit-tags"
                        options={source || []}
                        getOptionLabel={(option) => option.word}
                        getOptionSelected={(option, value) => option.key === value.key}
                        defaultValue={synonymWords || []}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Synonyms"
                                size="small"
                                maxRows={0}
                                error={errCodes.includes(INVALID_INPUTS.SYNONYM)}
                            />
                        )}
                        onChange={(_, value) => value ? onSynonymChange(value.map(e => e.key)) : null}
                    />
                </div></div>
        </div >
    );
}
export default function Row({
    index,
    style,
    data,
    rowKey,
    isExpanded,
    handleExpandClick,
    exposed,
    getWordByKey,
    onEdit,
    onDeleteWord,
    onViewReset,
}) {
    const classes = useStyles();
    const dataPoint = data[index];
    const shouldAppear = isExpanded || exposed.includes(dataPoint.key);

    const renderSynonyms = () => {
        const showSynonyms = Array.isArray(dataPoint.synonyms) && !!dataPoint.synonyms.length;
        return (
            <div className={classes.synonyms}>
                {showSynonyms ?
                    <div>
                        {dataPoint.synonyms.map(id => {
                            const sData = getWordByKey(id);
                            const sWord = sData.word;
                            return sWord ? (
                                <div key={id} style={{ display: 'inline-block', paddingRight: '1px' }}>
                                    <Chip
                                        avatar={<Avatar>{sWord[0]}</Avatar>}
                                        label={sWord}
                                        color='primary'
                                    />
                                </div>
                            ) : null;
                        })}
                    </div> :
                    <div style={{ opacity: 0.3 }}>
                        No Synonyms added. Edit to add synonyms
                    </div>}
            </div>
        );
    }

    const renderButtons = () => {
        return isExpanded ?
            (<div className={classes.views}>
                <Tooltip title='Reset view count'>
                    <IconButton
                        style={{ display: 'inline-block', }}
                        color='primary'
                        onClick={() => onViewReset(dataPoint.key)}
                        disabled={dataPoint.views <= 1}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Edit'>
                    <IconButton
                        color='primary'
                        style={{ display: 'inline-block', }}
                        onClick={() => onEdit(dataPoint.key)}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                    <IconButton
                        color='secondary'
                        style={{ display: 'inline-block', }}
                        onClick={() => onDeleteWord(dataPoint.key)}
                    >
                        <DeleteForeverIcon />
                    </IconButton>
                </Tooltip>
            </div >) :
            (<div className={classes.views}>
                <Tooltip title='Total views'>
                    <div style={{
                        verticalAlign: 'middle',
                        opacity: '0.2',
                        display: 'inline-block',
                    }}>
                        {dataPoint.views}
                        <IconButton className={classes.viewEye}>
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                </Tooltip>
            </div >);
    }

    const renderMeaning = () => {
        const meaning = dataPoint.meaning;
        const formattedMeaning = !isExpanded && meaning && meaning.length > MAX_MEAN_LEN ?
            `${meaning.slice(0, MAX_MEAN_LEN)}...` :
            meaning;

        return (
            <div
                className={clsx(classes.meaning, {
                    [classes.blurry]: !shouldAppear,
                })}>
                {formattedMeaning}
            </div>
        )
    }

    return (
        <div key={rowKey} style={style} className={classes.row} onClick={() => { if (!isExpanded) { handleExpandClick(index) } }}>
            <div>
                <div className={classes.word}>
                    <h3>{dataPoint.word}</h3>
                </div>
                {renderMeaning()}
                {renderButtons()}
                <div style={{ display: 'inline-block' }}>
                    <Tooltip title={isExpanded ? 'Collapse' : 'View word'}>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: isExpanded,
                            })}
                            aria-expanded={isExpanded}
                            aria-label="show more"
                            onClick={() => { if (isExpanded) { handleExpandClick(index) } }}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                {isExpanded ? renderSynonyms() : null}
            </div>
        </div >
    );

}

Row.propTypes = {
    data: PropTypes.array.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    handleExpandClick: PropTypes.func.isRequired,
    rowKey: PropTypes.string,
    exposed: PropTypes.array,
    getWordByKey: PropTypes.func,
    onEdit: PropTypes.func.isRequired,
    onDeleteWord: PropTypes.func.isRequired,
    onViewReset: PropTypes.func.isRequired,
};

EditableRow.propTypes = {
    data: PropTypes.array,
    handleExpandClick: PropTypes.func.isRequired,
    rowKey: PropTypes.string,
    exposed: PropTypes.array,
    getWordByKey: PropTypes.func,
    word: PropTypes.string,
    onWordCange: PropTypes.func,
    onMeaningChange: PropTypes.func,
    onSynonymChange: PropTypes.func,
    meaning: PropTypes.string,
    synonyms: PropTypes.array.isRequired,
    setAbort: PropTypes.func,
    source: PropTypes.array,
    map: PropTypes.object,
    isValid: PropTypes.bool.isRequired,
    errCodes: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
};
