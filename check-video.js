
const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('child_process');
const path = require('path');

const files = [
    'public/templates/videos/event-fancy.mp4',
    'public/templates/videos/wedding-fancy.mp4'
];

files.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    execFile(ffmpegPath, ['-i', filePath], (error, stdout, stderr) => {
        // ffmpeg writes file info to stderr
        const output = stderr || stdout;
        console.log(`--- File: ${file} ---`);

        const resolutionMatch = output.match(/Stream #.+Video:.+, (\d+x\d+)/);
        const bitrateMatch = output.match(/bitrate: (\d+) kb\/s/);
        const fpsMatch = output.match(/(\d+(?:\.\d+)?) fps/);

        if (resolutionMatch) console.log(`Resolution: ${resolutionMatch[1]}`);
        else console.log('Resolution: Not found');

        if (bitrateMatch) console.log(`Bitrate: ${bitrateMatch[1]} kb/s`);
        else console.log('Bitrate: Not found');

        if (fpsMatch) console.log(`FPS: ${fpsMatch[1]}`);
        else console.log('FPS: Not found');

        console.log('---');
    });
});
