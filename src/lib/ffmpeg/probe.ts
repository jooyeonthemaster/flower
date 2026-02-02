import { spawnAsync, getFFmpegPath } from './index';

export interface VideoMetadata {
    fps: number;
    codec: string;
    width: number;
    height: number;
    duration: number;
}

/**
 * FFmpeg를 사용하여 비디오 메타데이터 추출 (-i 옵션 출력 파싱)
 * ffprobe 바이너리 의존성 없이 ffmpeg만으로 처리하여 가볍게 구현
 */
export async function probeVideo(filePath: string): Promise<VideoMetadata> {
    const ffmpegPath = await getFFmpegPath();

    try {
        // ffmpeg -i 명령은 입력 파일 정보만 보여주고 에러(exit code 1)를 반환할 수 있음 (출력 파일이 없으므로)
        // 따라서 catch 블록에서 stderr를 분석해야 할 수도 있음
        const { stderr } = await spawnAsync(ffmpegPath, ['-i', filePath], { timeout: 10000 }).catch(err => {
            // spawnAsync는 exit code가 0이 아니면 에러를 던짐.
            // ffmpeg -i는 보통 1을 반환하므로 여기서 stderr를 잡아서 처리
            if (err.stderr) {
                return { stderr: err.stderr, stdout: '' };
            }
            throw err;
        });

        const metadata: VideoMetadata = {
            fps: 0,
            codec: '',
            width: 0,
            height: 0,
            duration: 0
        };

        // Parse FPS
        // Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 1280x720 [SAR 1:1 DAR 16:9], 1996 kb/s, 30 fps, 30 tbr, 15360 tbn, 60 tbc
        const fpsMatch = stderr.match(/, (\d+(\.\d+)?) fps/);
        if (fpsMatch) {
            metadata.fps = parseFloat(fpsMatch[1]);
        }

        // Parse Codec
        const codecMatch = stderr.match(/Video: (\w+)/);
        if (codecMatch) {
            metadata.codec = codecMatch[1];
        }

        // Parse Resolution
        const resMatch = stderr.match(/, (\d+)x(\d+)/);
        if (resMatch) {
            metadata.width = parseInt(resMatch[1]);
            metadata.height = parseInt(resMatch[2]);
        }

        // Parse Duration
        // Duration: 00:00:15.02, start: 0.000000, bitrate: 2005 kb/s
        const durationMatch = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
        if (durationMatch) {
            const hours = parseFloat(durationMatch[1]);
            const minutes = parseFloat(durationMatch[2]);
            const seconds = parseFloat(durationMatch[3]);
            metadata.duration = hours * 3600 + minutes * 60 + seconds;
        }

        console.log('[FFmpeg Probe]', metadata);
        return metadata;

    } catch (error) {
        console.warn('[FFmpeg Probe] Failed to probe video:', error);
        // 실패 시 기본값 반환하여 변환 로직이 안전하게 돌도록 함 (변환 수행)
        return { fps: 0, codec: '', width: 0, height: 0, duration: 0 };
    }
}
