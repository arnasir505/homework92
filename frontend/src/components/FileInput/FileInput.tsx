import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { ValidationError } from '../../types';
import { UnknownAction } from '@reduxjs/toolkit';
import { Button, Grid, TextField } from '@mui/material';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  selectFilename: (state: RootState) => string;
  selectError: (state: RootState) => ValidationError | null;
  updateFilename: (filename: string) => UnknownAction;
  clearImage: () => UnknownAction;
}

const FileInput: React.FC<Props> = ({
  onChange,
  name,
  label,
  selectFilename,
  selectError,
  updateFilename,
  clearImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const filename = useAppSelector(selectFilename);
  const error = useAppSelector(selectError);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      dispatch(updateFilename(e.target.files[0].name));
    } else {
      dispatch(updateFilename(''));
      dispatch(clearImage());
    }

    onChange(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type='file'
        accept='.jpg, .jpeg, .png, .webp'
        name={name}
        onChange={onFileChange}
        ref={inputRef}
      />

      <Grid container direction='row' spacing={2} alignItems='center'>
        <Grid item xs>
          <TextField
            fullWidth
            inputProps={{ readOnly: true }}
            label={label}
            value={filename}
            onClick={activateInput}
            error={Boolean(getFieldError('image'))}
            helperText={getFieldError('image')}
          />
        </Grid>

        <Grid item>
          <Button variant='contained' onClick={activateInput}>
            Browse
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
