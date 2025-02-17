
// create visual with wavesurfer.js
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'gray',
    progressColor: 'black',
    url: './data/WCW_The_Red_Wheelbarrow_1945_LoC.wav',
    // url: '1.wav',
    // width: 100,
    // scrollParent: true,
    barHeight: 1,
    // width: 900,
    minPxPerSec: 100, // 100 = 817.5px so audiotime * (100 / 817.5)
    // minPxPerSec: 90,
    height: 64,
    // sampleRate: 22050,
    fillParent: true,
    cursorWidth: 1,
    // dragToSeek: true,
    autoCenter: true,
    // splitChannels: true,
    normalize: true,
})
// initialize the spectrogram plugin
// wavesurfer.registerPlugin(
//     Spectrogram.create({
//         labels: true,
//         height: 200,
//         splitChannels: true,
//     }),
// )

wavesurfer.on('interaction', () => {
    wavesurfer.play()
})

