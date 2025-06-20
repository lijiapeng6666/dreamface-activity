import React, { useState } from 'react';
import { Stack, TextField, Button, Typography, Box } from '@mui/material';

interface LabeledTextFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

// Helper component for a labeled text field row to keep the code DRY
function LabeledTextField({
  label,
  value,
  onChange,
  placeholder,
}: LabeledTextFieldProps): React.ReactElement {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Typography
        variant="body2"
        sx={{
          width: 100,
          textAlign: 'right',
          color: 'text.secondary',
          fontSize: '14px',
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={value}
        onChange={onChange}
        size="small"
        placeholder={placeholder}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'common.white',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            paddingY: '4px',
          },
          '& .MuiInputBase-input': {
            fontSize: '14px',
          },
        }}
      />
    </Stack>
  );
}

interface ControlPanelProps {
  uploadedFilePaths: Record<string, string>;
}

function ControlPanel({
  uploadedFilePaths,
}: ControlPanelProps): React.ReactElement {
  const [aigcId, setAigcId] = useState('');
  const [livePhotoId, setLivePhotoId] = useState('');
  const [aiVideoId, setAiVideoId] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [fontColor, setFontColor] = useState('');

  const handleSubmit = () => {
    const {
      titleBanner,
      livePhotoBanner,
      aiVideoBanner,
      aigcBanner,
      instagramIcon,
      twitterIcon,
      tiktokIcon,
    } = uploadedFilePaths;
    const submissionData = {
      aigcId,
      livePhotoId,
      aiVideoId,
      bgColor,
      fontColor,
      titleBanner,
      livePhotoBanner,
      aiVideoBanner,
      aigcBanner,
      instagramIcon,
      twitterIcon,
      tiktokIcon,
    };
    console.log('Submitting Data:', submissionData);
  };

  return (
    <Stack spacing={2} sx={{ mt: 2, px: 2 }}>
      <LabeledTextField
        label="背景颜色"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        placeholder="请输入背景颜色"
      />
      <LabeledTextField
        label="文字颜色"
        value={fontColor}
        onChange={(e) => setFontColor(e.target.value)}
        placeholder="请输入文字颜色"
      />
      <LabeledTextField
        label="AIGC"
        value={aigcId}
        onChange={(e) => setAigcId(e.target.value)}
        placeholder="请输入AIGC模板id，多个使用逗号分隔"
      />
      <LabeledTextField
        label="Live Photo"
        value={livePhotoId}
        onChange={(e) => setLivePhotoId(e.target.value)}
        placeholder="请输入Live Photo模板id，多个使用逗号分隔"
      />
      <LabeledTextField
        label="AI Video"
        value={aiVideoId}
        onChange={(e) => setAiVideoId(e.target.value)}
        placeholder="请输入AI Video模板id，多个使用逗号分隔"
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 8,
            py: 1,
            fontWeight: 'bold',
          }}
        >
          提交
        </Button>
      </Box>
    </Stack>
  );
}

export default ControlPanel;
