import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ClipLoader } from 'react-spinners'
import PropTypes from 'prop-types';

export default function Loader({ isLoading }) {
    return (
        <div>
            <Dialog
                open={isLoading}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <ClipLoader color={'blue'} loading={isLoading} css='override' size={100} />
                </div>

            </Dialog>
        </div>
    );
}

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};