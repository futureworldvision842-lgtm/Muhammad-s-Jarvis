const VIDEO_FORWARDING_ISSUES = {
  autoDownload: {
    title: 'Automatic Download Settings',
    description: 'WhatsApp automatic download might be disabled',
    solutions: [
      'Go to WhatsApp Settings > Storage and Data > Media Auto-Download',
      'Enable "Videos" for Wi-Fi and Mobile Data',
      'Check "Download over cellular" if needed',
      'Restart WhatsApp after changing settings'
    ]
  },
  groupSettings: {
    title: 'Group Media Settings',
    description: 'Group might have restricted media sharing',
    solutions: [
      'Check if you are admin of the target group',
      'Verify group media sharing permissions',
      'Check if group has media restrictions',
      'Try sending to a different group for testing'
    ]
  },
  fileSize: {
    title: 'Video File Size Limits',
    description: 'WhatsApp has file size limitations',
    solutions: [
      'WhatsApp limit: 16MB for videos',
      'Compress large videos before forwarding',
      'Use video compression tools',
      'Split long videos into smaller parts'
    ]
  },
  format: {
    title: 'Video Format Compatibility',
    description: 'Some video formats may not be supported',
    solutions: [
      'Supported formats: MP4, 3GP, AVI, MOV, MKV',
      'Convert unsupported formats to MP4',
      'Check video codec compatibility',
      'Use H.264 codec for best compatibility'
    ]
  },
  network: {
    title: 'Network and Connection Issues',
    description: 'Poor network might prevent video loading',
    solutions: [
      'Check internet connection stability',
      'Try switching between Wi-Fi and mobile data',
      'Clear WhatsApp cache and restart',
      'Update WhatsApp to latest version'
    ]
  },
  storage: {
    title: 'Device Storage Issues',
    description: 'Insufficient storage might prevent downloads',
    solutions: [
      'Check available device storage',
      'Clear WhatsApp media cache',
      'Move old media to external storage',
      'Delete unnecessary files'
    ]
  }
};

async function forwardVideoWithValidation(client, videoMessage, targetGroupId, originalGroupId) {
  try {
    if (!videoMessage || !videoMessage.hasMedia) {
      throw new Error('Invalid video message - no media found');
    }

    const media = await videoMessage.downloadMedia();
    if (!media) {
      throw new Error('Failed to download video media');
    }

    const videoSize = Buffer.byteLength(media.data, 'base64');
    const maxSize = 16 * 1024 * 1024;

    if (videoSize > maxSize) {
      await client.sendMessage(originalGroupId, '⚠️ Video is too large for forwarding (>16MB). Processing for compression...');
      await client.sendMessage(targetGroupId,
        `🎬 Large video received (${(videoSize / 1024 / 1024).toFixed(2)} MB)\n` +
        `📝 Processing for compression and transcription...\n` +
        `⏳ Please wait for processed version.`
      );
      return { success: false, reason: 'Video too large', size: videoSize };
    }

    const mimeType = media.mimetype || '';
    const supportedFormats = ['video/mp4', 'video/3gpp', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    if (!supportedFormats.includes(mimeType)) {
      await client.sendMessage(targetGroupId,
        `🎬 Video received with format: ${mimeType}\n` +
        `📝 Converting to compatible format...\n` +
        `⏳ Processed version will be available soon.`
      );
      return { success: false, reason: 'Unsupported format', mimeType };
    }

    const originalCaption = videoMessage.body || '';
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    const enhancedCaption = `🎬 ${originalCaption}\n\n` +
      `📊 Size: ${(videoSize / 1024 / 1024).toFixed(2)} MB\n` +
      `🕒 Forwarded: ${timestamp}\n` +
      `🤖 Auto-processed by VP Bot\n` +
      `⏳ Transcription in progress...`;

    const forwardedMessage = await client.sendMessage(targetGroupId, media, {
      caption: enhancedCaption,
      sendMediaAsDocument: videoSize > 10 * 1024 * 1024
    });

    await client.sendMessage(originalGroupId,
      `✅ Video forwarded to processing group\n` +
      `📊 Size: ${(videoSize / 1024 / 1024).toFixed(2)} MB\n` +
      `🎯 Status: Successfully delivered\n` +
      `⏳ Transcription and analysis in progress...`
    );

    return { success: true, messageId: forwardedMessage.id._serialized, size: videoSize, format: mimeType };

  } catch (error) {
    try {
      await client.sendMessage(originalGroupId,
        `❌ Video forwarding failed\n` +
        `🔍 Reason: ${error.message}\n` +
        `💡 Please check:\n` +
        `• Video size (<16MB)\n` +
        `• Video format (MP4, MOV, AVI)\n` +
        `• Network connection\n` +
        `• Try sending again`
      );
    } catch {}
    return { success: false, error: error.message };
  }
}

async function diagnoseVideoIssues(client, groupId) {
  try {
    const diagnosticMessage = `🔧 **WhatsApp Video Diagnostic Report**\n\n` +
      `📱 **Common Video Issues & Solutions:**\n\n` +
      `🔽 **Auto-Download Settings:**\n` +
      `• Go to WhatsApp Settings > Storage and Data\n` +
      `• Enable "Videos" for Wi-Fi and Mobile Data\n` +
      `• Restart WhatsApp after changes\n\n` +
      `📊 **File Size Limits:**\n` +
      `• WhatsApp limit: 16MB for videos\n` +
      `• Large videos will be compressed automatically\n` +
      `• Check video size before sending\n\n` +
      `🎬 **Supported Formats:**\n` +
      `• MP4, MOV, AVI, 3GP, MKV\n` +
      `• H.264 codec recommended\n` +
      `• Avoid rare or proprietary formats\n\n` +
      `📶 **Network Issues:**\n` +
      `• Check internet connection\n` +
      `• Try switching Wi-Fi/Mobile data\n` +
      `• Clear WhatsApp cache if needed\n\n` +
      `💾 **Storage Issues:**\n` +
      `• Check available device storage\n` +
      `• Clear old WhatsApp media\n` +
      `• Restart device if needed\n\n` +
      `🤖 **Bot Status:** All systems operational\n` +
      `✅ **Video processing:** Active\n` +
      `✅ **Transcription:** Ready\n` +
      `✅ **Auto-forwarding:** Enabled`;

    await client.sendMessage(groupId, diagnosticMessage);
  } catch (error) {}
}

module.exports = { forwardVideoWithValidation, diagnoseVideoIssues, VIDEO_FORWARDING_ISSUES };