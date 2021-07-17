import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverRounded';
import clsx from 'clsx';
import PropTypes from 'prop-types';


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
    },
    word: {
        display: 'inline-block',
        position: 'relative',
        width: '30%',
        left: '1%'
    },
    meaning: {
        display: 'inline-block',
        position: 'relative',
        width: '50%',
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
        // marginTop: '0px',
    }
}));

export default function Row({
    index,
    style,
    data,
    rowKey,
    isExpanded,
    handleExpandClick,
    exposed,
    getWordByKey,
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
                                        onClick={() => { }}
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
};
