import React, { useState, useRef } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Backdrop,
  IconButton,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import useUploadStore from '../../store/uploadStore';

interface Preset {
  id: string;
  name: string;
  key: string;
}

export interface UploadItemProps {
  preset: Preset;
  imageUrl: string | null;
  isLoading: boolean;
  onImageUpload: (key: string, file: File) => void;
  onImageRemove: (key: string) => void;
}

function UploadItem({
  preset,
  imageUrl,
  isLoading,
  onImageUpload,
  onImageRemove,
}: UploadItemProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setHoveredUploadKey = useUploadStore(
    (state) => state.setHoveredUploadKey,
  );

  const handleFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(preset.key, file);
    }
  };

  const handleClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onImageRemove(preset.key);
  };

  return (
    <Paper
      variant="outlined"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setHoveredUploadKey(preset.key)}
      onMouseLeave={() => setHoveredUploadKey(null)}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 100,
        cursor: isLoading ? 'progress' : 'pointer',
        borderColor: isDragging ? 'primary.main' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: isDragging ? '2px' : '1px',
        borderRadius: 2.5,
        backgroundColor: imageUrl ? 'grey.200' : 'rgba(255, 255, 255, 0.6)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: imageUrl ? 'grey.300' : 'rgba(255, 255, 255, 1)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
        accept="image/*"
        style={{ display: 'none' }}
      />
      {imageUrl && !isLoading && (
        <IconButton
          aria-label="delete"
          onClick={handleRemoveClick}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            padding: '2px',
            '&:hover': {
              backgroundColor: 'rgba(27, 17, 17, 0.5)',
            },
          }}
        >
          <CloseIcon fontSize="small" sx={{ fontSize: '12px' }} />
        </IconButton>
      )}
      {isLoading && (
        <Backdrop
          open
          sx={{
            position: 'absolute',
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <CircularProgress color="inherit" size={30} />
        </Backdrop>
      )}
      {imageUrl && !isLoading ? (
        <img
          src={imageUrl}
          alt={preset.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'absolute',
          }}
        />
      ) : (
        !isLoading && (
          <>
            <ImageIcon sx={{ fontSize: 40, color: 'rgb(0, 167, 111)' }} />
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {preset.name}
            </Typography>
          </>
        )
      )}
    </Paper>
  );
}

export default UploadItem;
