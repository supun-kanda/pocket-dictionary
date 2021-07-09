import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    box: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        display: 'flex',
        alignItems: 'baseline',
        marginTop: 10,
        marginBottom: 10,
        height: '70px',
        'max-height': '150px',
        justifyContent: 'space-around',
        borderRadius: '10px',
        position: 'absolute',
        bottom: 0,
        width: '50%',

    },
    element: {
        height: '50%',
        padding: 10,
        borderRadius: '20px',
        borderStyle: 'outset',

    },
    button: {
        padding: 10,
        background: 'linear-gradient(45deg, #35F321 30%, #75ED89 90%)',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        color: 'white',
        fontSize: 16,
    }
});

export default function Adder({
    onAdd,
    isValid,
    setWord,
    setMeaning,
    word,
    meaning,
    setValidity,
}) {
    const classes = useStyles();

    return (
        <Box className={classes.box}>
            <TextField
                id="outlined-basic"
                label="Add a Word"
                variant="outlined"
                type="search"
                error={!isValid}
                className={classes.element}
                onChange={e => {
                    setWord(e.target.value);
                    setValidity(true);
                }}
                value={word}
            />
            <TextField
                fullWidth
                id="outlined-basic"
                label="Meaning"
                variant="outlined"
                type="search"
                className={classes.element}
                onChange={e => setMeaning(e.target.value)}
                value={meaning}
            />
            <Button
                variant="contained"
                className={classes.button}
                onClick={onAdd}
            >
                ADD
            </Button>
        </Box>
    );
}

Adder.propTypes = {
    isValid: PropTypes.bool,
    word: PropTypes.string,
    meaning: PropTypes.string,
    onAdd: PropTypes.func,
    setWord: PropTypes.func,
    setMeaning: PropTypes.func,
    setValidity: PropTypes.func,
    
}