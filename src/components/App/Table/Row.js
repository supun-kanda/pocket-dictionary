import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverRounded';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    ROW_MODS,
    INVALID_INPUTS,
} from '../../../util/const';


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
    },
    editMeaning: {
        display: 'inline-block',
        position: 'relative',
        width: '40%',
        top: '-4px',
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
    editMode,
    resetViews,
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
    const isWrite = editMode === ROW_MODS.WRITE;

    const renderButtons = () => {
        return (
            <div className={classes.views}>
                <div style={{
                    verticalAlign: 'middle',
                    display: 'inline-block',
                }}>
                    <IconButton
                        style={{ display: 'inline-block', }}
                        color='primary'
                        disabled={isWrite}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </div>
                <IconButton
                    // color='green'
                    style={{ display: 'inline-block', color: '#35F321' }}
                    disabled={!isValid}
                    onClick={onSubmit}
                >
                    <CheckCircleIcon />
                </IconButton>
                <IconButton
                    color='secondary'
                    style={{ display: 'inline-block', }}
                    onClick={setAbort}
                >
                    <CancelIcon />
                </IconButton>
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
                />
                <div style={{
                    width: '9%',
                    display: 'inline-block',
                }} />
                {renderButtons()}
                <div style={{ display: 'inline-block' }}>
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
                            return (
                                <div style={{ display: 'inline-block', paddingRight: '1px' }}>
                                    <Chip
                                        avatar={<Avatar>{sWord[0]}</Avatar>}
                                        label={sWord}
                                        color='primary'
                                    />
                                </div>
                            );
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
                <div style={{
                    verticalAlign: 'middle',
                    display: 'inline-block',
                }}>
                    <IconButton
                        style={{ display: 'inline-block', }}
                        color='primary'
                    >
                        <VisibilityIcon />
                    </IconButton>
                </div>
                <IconButton
                    color='primary'
                    style={{ display: 'inline-block', }}
                    onClick={() => onEdit(dataPoint.key)}
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    color='secondary'
                    style={{ display: 'inline-block', }}
                >
                    <DeleteForeverIcon />
                </IconButton>
            </div >) :
            (<div className={classes.views}>
                <div style={{
                    verticalAlign: 'middle',
                    opacity: '0.2',
                    display: 'inline-block',
                }}>
                    123
                    <IconButton className={classes.viewEye}>
                        <VisibilityIcon />
                    </IconButton>
                </div>
            </div >);
    }

    return (
        <div key={rowKey} style={style} className={classes.row} onClick={() => { if (!isExpanded) { handleExpandClick(index) } }}>
            <div>
                <div className={classes.word}>
                    <h3>{dataPoint.word}</h3>
                </div>
                <div className={clsx(classes.meaning, {
                    [classes.blurry]: !shouldAppear,
                })}>{dataPoint.meaning}</div>
                {renderButtons()}
                <div style={{ display: 'inline-block' }}>
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
    onEdit: PropTypes.func,
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
