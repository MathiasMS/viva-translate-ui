import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { Box, IconButton } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IModalComponent {
    open: boolean;
    setOpen: (open: boolean) => any;
    title: string;
    content: React.ReactNode;
}

// Generic Modal component to inject the content of every custom Modal
const Modal = ({ open, setOpen, title, content }: IModalComponent) => {
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {title}
                </DialogTitle>
                <DialogContent>{content}</DialogContent>
            </Dialog>
        </Box>
    );
};

export default Modal;
