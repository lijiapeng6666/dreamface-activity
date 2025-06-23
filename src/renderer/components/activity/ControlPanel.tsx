import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
// import mockData from './mockData.json';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastQueue, setToastQueue] = useState<string[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  useEffect(() => {
    if (toastQueue.length > 0 && !toast.open) {
      const newMessage = toastQueue[0];
      setToast({ open: true, message: newMessage });
      setToastQueue((prev) => prev.slice(1));
    }
  }, [toastQueue, toast.open]);

  const handleToastClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ open: false, message: '' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const {
      titleBanner,
      livePhotoBanner,
      aiVideoBanner,
      aigcBanner,
      instagramIcon,
      twitterIcon,
      tiktokIcon,
    } = uploadedFilePaths;

    const apiPayload = {
      inputs: {
        bg_color: bgColor,
        title_banner: titleBanner,
        banner1_url: livePhotoBanner,
        live_photo_template_id: livePhotoId,
        banner2_url: aiVideoBanner,
        ai_video_template_id: aiVideoId,
        banner3_url: aigcBanner,
        aigc_template_id: aigcId,
        font_color: fontColor,
        instagram_icon: instagramIcon,
        twitter_icon: twitterIcon,
        tiktok_icon: tiktokIcon,
      },
      response_mode: 'blocking',
      user: 'lijiapeng',
    };

    console.log('Submitting Data to Workflow:', apiPayload);

    try {
      const response = await fetch(
        'https://agent-x.myhexin.com/v1/workflows/run',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer app-5sqQbt4CedbJ70MVoKKamYaQ',
          },
          body: JSON.stringify(apiPayload),
        },
      );

      const result = await response.json();
      console.log('Workflow API Response:', result);
      // Handle success/error based on the response here
      // Simulate API call with mock data
      // const result: any = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(mockData.data.outputs);
      //   }, 1000); // 1-second delay to simulate network
      // });

      console.log('Workflow API Response:', result.data);

      if (result.data) {
        if (result.data.outputs) {
          const { outputs } = result.data;
          try {
            const formattedConfig = JSON.stringify(
              JSON.parse(outputs.final_config),
              null,
              2,
            );
            // Call main process to upload the JSON file
            const uploadedPath = await window.electron.ipcRenderer.invoke(
              'upload-json',
              formattedConfig,
            );
            // 切出 server/aigc/main/ba6edcecedf4445a8896a318f81a4139.json 后面的 hash 值
            const hash = uploadedPath.split('/').pop();
            // 去掉 .json
            const hashWithoutJson = hash?.replace('.json', '');

            // 拼接结果地址
            // 海外地址
            const overseasUrl = `https://dreamfaceapp.com/activity/weekly.html?darkMode=true&hideTitleBar=true&hashData=${hashWithoutJson}`;
            // 国内地址
            const domesticUrl = `https://aidreamface.com/activity/weekly.html?darkMode=true&hideTitleBar=true&hashData=${hashWithoutJson}`;
            // 将结果复制到剪贴板
            navigator.clipboard.writeText(
              `海外地址: ${overseasUrl}, 国内地址: ${domesticUrl}`,
            );
            setToastQueue((prev) => [
              ...prev,
              `已生成活动链接，已复制到剪贴板`,
            ]);
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            setToastQueue((prev) => [
              ...prev,
              `配置处理或上传失败: ${errorMessage}`,
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Workflow API call failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 8,
            py: 1,
            fontWeight: 'bold',
          }}
        >
          {isSubmitting ? '提交中...' : '提交'}
        </Button>
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleToastClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default ControlPanel;
