// draw Praat diagram
async function drawPraat(){
    let pitchData;
    let praatData;
    try {
        const [pitchResponse, praatResponse] = await Promise.all([
            axios.get("./data/WCW_The_Red_Wheelbarrow_1945_Loc.json"),
            axios.get("./data/WCW_The_Red_Wheelbarrow_1945_LocTextgrid.json")
        ]);
        pitchData = pitchResponse.data;
        praatData = praatResponse.data;
    } catch (err) {
        console.log(err);
    }


// filter the praatData for text tier
let poemSpan = document.querySelector('#annotations');
let poem = praatData.filter(d => d.tier_name === 'text');

// add an id to each segment
let i = 0;
poem.forEach(item => {
    item.id = 'text' + i;
    i += 1;
})


// display the text of the poem using span
poem.forEach((d, i) => {
    // console.log(d, i)
    const text = d.text.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    // console.log(text)
    const lines = text.split('\n')
    // console.log(lines)
    lines.forEach(line => {
        poemSpan.innerHTML += `<span id="text${i}">${line} </span>`
        i += 1
    })
})

/** When the audio has been decoded */
/** On audio position change, fires continuously during playback */
wavesurfer.on('timeupdate', (currentTime) => {
    // console.log('Time', currentTime + 's')
    // let time = parseFloat(currentTime);
    highlightText(currentTime);

})


function highlightText(currentTime) {
    poem.forEach((segment) => {
        // console.log(segment.id)
        const element = document.getElementById(segment.id);
        // console.log(element)
        if (currentTime >= segment.start_time && currentTime <= segment.end_time) {
        element.classList.add("highlight");
        } else {
        element.classList.remove("highlight");
        }
    });
}

poem.forEach((segment) => {
    const element = document.getElementById(segment.id);
    element.addEventListener('click', () => {
        console.log(segment.start_time)
        const duration = wavesurfer.getDuration();
        const startTimePercentage = segment.start_time / duration;
        wavesurfer.seekTo(startTimePercentage);
        wavesurfer.play();
    });
  });


// set the dimensions and margins of the graph
// let audioTime = 8.2;
let audioTime = 15.5;

let margin = {top: 10, right: 0, bottom: 30, left: 30},
    width = (audioTime * 100) - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;


const host = document.querySelectorAll('#waveform div')[0];
// console.log(host)
const shadow = host.shadowRoot.querySelectorAll('.wrapper')[0];
host.id = 'wave'
// console.log(shadow)

// d3 praat
let svgPraat = d3.select(shadow)
                  .attr('class', "waveBox")
                  .append('svg')
                  .attr("class", "praat")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);
// console.log(svgPraat)
let praatBox = svgPraat.append('g')
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);
               

// add xAxis
let xAxisScale = d3.scaleLinear()
                   .domain([0, audioTime])
                   .range([0, width + margin.left + margin.right]); //

let xAxis = d3.axisBottom(xAxisScale);
let xAxisG = praatBox.append('g')
               .attr('class', 'x-axis')
               .attr('transform', `translate(${0 - margin.left}, ${height + margin.top})`)
               .style('font-size', '10px')
               .style('font-weight', '500');

xAxis.ticks(audioTime);
xAxis(xAxisG);

// add yAxis
let yAxisScale = d3.scaleLinear()
                   .domain([50, 250])
                   .range([height, 0]);

let yAxis = d3.axisLeft(yAxisScale);

let svgY = d3.select('#y-axis')
            .append('svg') //separate svg element to create a Y axis outside
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", 100)
            .attr('transform', `translate(0, ${margin.top})`);

let yAxisG = svgY.append('g')
        .attr("class", "y-axis")
        .attr('transform', `translate(70, ${margin.top})`)
        .style('font-size', '10px')
        .style('font-weight', '500');

yAxis.ticks(5);
yAxis(yAxisG);

// add y-label             
let yLabel = svgY.append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    .append("text") //add y-label
                    .attr("class", "y-label")
                    .attr("text-anchor", "middle")
                    .attr("x", "-75")
                    .attr("y", "0")
                    .attr("transform", "rotate(269)")
                    .style('font-size', '12px')
                    .text("Pitch (Hz)");


// Add praat labels
let svgLabels = d3.select('#praat-labels')
                    .append('svg')
                    .attr('height', '130')
                    .attr('width', '100')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);

let praatLabels = svgLabels.append('g')
                            .attr('class', 'praat-labels')
                            .attr('transform', `translate(${margin.left}, ${-10 - margin.top})`);



let tonesLabel = praatLabels.append("text") //add y-label
                            .attr("class", "tones-label")
                            .attr("text-anchor", "end")
                            .attr("x", "30")
                            .attr("y", "34")
                            // .attr("transform", `translate(0, 0)`)
                            .style('font-size', '12px')
                            .text("tones");

let wordsLabel = praatLabels.append("text") //add y-label
                            .attr("class", "words-label")
                            .attr("text-anchor", "end")
                            .attr("x", "30")
                            .attr("y", "68")
                            // .attr("transform", `translate(0, 0)`)
                            .style('font-size', '12px')
                            .text("words");

let beatsLabel = praatLabels.append("text") //add y-label
                            .attr("class", "wbeats-label")
                            .attr("text-anchor", "end")
                            .attr("x", "30")
                            .attr("y", "103")
                            // .attr("transform", `translate(0, 0)`)
                            .style('font-size', '12px')
                            .text("beats");

let breaksLabel = praatLabels.append("text") //add y-label
                            .attr("class", "breaks-label")
                            .attr("text-anchor", "end")
                            .attr("x", "30")
                            .attr("y", "138")
                            // .attr("transform", `translate(0, 0)`)
                            .style('font-size', '12px')
                            .text("breaks");

// add pitch
let pitch = praatBox.append('g')
                    .attr('class', 'pitch')
                    .selectAll('dot')
                    .data(pitchData)
                    .enter().append('circle')
                    // .join('circle')
                    .attr('class', 'pitchpoint')
                    .attr('cx', d => xAxisScale(d.Time))
                    .attr('cy', d => yAxisScale(d.Frequency))
                    .attr('r', '1.25')
                    .attr('transform', `translate(${0 - margin.left}, ${margin.top})`)
                    // .attr('transform', `translate(50, 10)`)
                    .style('fill', 'black');


// Tones tier
const tierHeight = 30

let svgTones = d3.select(shadow)
                  .append('svg')
                  .attr("class", "svgtones")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", tierHeight)
                  .style("background-color", "pink");
                  
let tonesTier = svgTones.append('g')
                  .attr('transform', `translate(${margin.left}, 0)`);
                    //    .attr('height', '100');

let tonesBar = tonesTier.append('g')
                         .attr('class', 'tonesbar')
                         .selectAll('line .toneslines')
                         .data(praatData)
                         .enter().append('line')
                         .attr('class', 'toneslines')
                        //  .join('line')
                         .attr('x1', function (d) {
                             if (d.tier_name === 'tones') {
                                 return (xAxisScale(d.start_time));
                              } else {
                                  return null;
                              }
                           })
                       //    .attr('x1', '5')
                         .attr('y1', '0')
                         .attr('x2', function (d) {
                           if (d.tier_name === 'tones') {
                               return (xAxisScale(d.start_time));
                            } else {
                                return null;
                            }
                           })
                       // .attr('x2', '5')
                         .attr('y2', tierHeight)
                         .attr('transform', `translate(${0 - margin.left}, 0)`)
                         .style('stroke', 'white')
                         .style('stroke-width', '2')
                         .style('stroke-dasharray', '14')
                         .style('stroke-dashoffset', '6');

// let tonesFrame1 = tonesTier.append('g')
//                            .attr('class', 'tonesframe1')
//                            .selectAll('line .toneslines1' )
//                            .data(praatData)
//                            .enter().append('line')
//                            .attr('class', 'toneslines1')
//                            .attr('x1', '0')
//                            .attr('y1', '0')
//                            .attr('x2', width + margin.left + margin.right)
//                            .attr('y2', '0')
//                            .attr('transform', `translate(${0 - margin.left}, 0)`)
//                            .style('stroke', 'white')
//                            .style('stroke-width', '2');

// let tonesFrame2 = tonesTier.append('g')
//                         .attr('class', 'tonesframe2')
//                         .selectAll('line .toneslines1' )
//                         .data(praatData)
//                         .enter().append('line')
//                         .attr('class', 'toneslines1')
//                         .attr('x1', '0')
//                         .attr('y1', tierHeight)
//                         .attr('x2', width + margin.left + margin.right)
//                         .attr('y2', tierHeight)
//                         .attr('transform', `translate(${0 - margin.left}, 0)`)
//                         .style('stroke', 'white')
//                         .style('stroke-width', '2');

let tonesText = tonesTier.append('g')
                            .attr('class', 'tonestext')
                            .selectAll('text .tones')
                            .data(praatData)
                            .enter().append('text')
                            .attr('class', 'tones')
                            .attr('x', function (d) {
                                if (d.tier_name === 'tones') {
                                    return(xAxisScale(d.start_time + d.end_time) / 2);
                                } else {
                                    return null;
                                }
                            })
                            .attr('y', '20')
                            .text(function (d) {
                                if (d.tier_name === 'tones') {
                                    return d.text;
                                } else {
                                    return null;
                                }
                            })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)
                            .style('text-anchor', 'middle')
                            .style('font-size', '12')
                            .style('font-weight', '400');

// Word tier

let svgWords = d3.select(shadow)
                    .append('svg')
                    .attr("class", "svgwords")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", tierHeight)
                    .style('background-color', 'pink');

let wordsTier = svgWords.append('g')
                        .attr('transform', `translate(${margin.left}, 0)`);
                            //    .attr('height', '100');



let wordsBar = wordsTier.append('g')
                            .attr('class', 'wordsBar')
                            .selectAll('line .wordslines')
                            .data(praatData)
                            .enter().append('line')
                            .attr('class', 'wordslines')
                            .attr('x1', function (d) {
                                if (d.tier_name === 'words') {
                                    return xAxisScale(d.end_time);
                                 } else {
                                     return null;
                                 }
                              })
                          //    .attr('x1', '5')
                            .attr('y1', '0')
                            .attr('x2', function (d) {
                              if (d.tier_name === 'words') {
                                  return xAxisScale(d.end_time);
                               } else {
                                   return null;
                               }
                              })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)                 
                            .attr('y2', tierHeight)
                            .style('stroke', 'white')
                            .style('stroke-width', '2');

let wordsBar0 = wordsTier.append('g')
                            .attr('class', 'wordsBar0')
                            .selectAll('line .wordslines0')
                            .data(praatData)
                            .enter().append('line')
                            .attr('class', 'wordslines0')
                            .attr('x1', function (d) {
                                if (d.tier_name === 'words') {
                                    return xAxisScale(d.start_time);
                                 } else {
                                     return null;
                                 }
                              })
                          //    .attr('x1', '5')
                            .attr('y1', '0')
                            .attr('x2', function (d) {
                              if (d.tier_name === 'words') {
                                  return xAxisScale(d.start_time);
                               } else {
                                   return null;
                               }
                              })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)                 
                            .attr('y2', tierHeight)
                            .style('stroke', 'white')
                            .style('stroke-width', '2');



// let wordsFrame1 = wordsTier.append('g')
//                             .attr('class', 'wordsframe1')
//                             .selectAll('line .wordslines1' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'wordslines1')
//                             .attr('x1', '0')
//                             .attr('y1', '0')
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', '0')
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');
 
// let wordsFrame2 = wordsTier.append('g')
//                             .attr('class', 'wordsframe2')
//                             .selectAll('line .wordslines2' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'wordslines2')
//                             .attr('x1', '0')
//                             .attr('y1', tierHeight)
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', tierHeight)
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');

let wordsText = wordsTier.append('g')
                            .attr('class', 'wordstext')
                            .selectAll('text .words')
                            .data(praatData)
                            .enter().append('text')
                            .attr('class', 'words')
                            .attr('x', function (d) {
                                if (d.tier_name === 'words') {
                                    return(xAxisScale(d.start_time + d.end_time) / 2);
                                } else {
                                    return null;
                                }
                            })
                            .attr('y', '20')
                            .text(function (d) {
                                if (d.tier_name === 'words') {
                                    return d.text;
                                } else {
                                    return null;
                                }
                            })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)
                            .style('text-anchor', 'middle')
                            .style('text-align', 'justify')
                            .style('font-size', '12')
                            .style('font-weight', '400');


// Beats tier

let svgBeats = d3.select(shadow)
                    .append('svg')
                    .attr("class", "svgbeats")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", tierHeight)
                    .style('background-color', 'pink');

let beatsTier = svgBeats.append('g')
                        .attr('transform', `translate(${margin.left}, 0)`);
                            //    .attr('height', '100');



let beatsBar = beatsTier.append('g')
                            .attr('class', 'beatsBar')
                            .selectAll('line .beatslines')
                            .data(praatData)
                            .enter().append('line')
                            .attr('class', 'beatslines')
                            .attr('x1', function (d) {
                                if (d.tier_name === 'beats') {
                                    return xAxisScale(d.start_time);
                                 } else {
                                     return null;
                                 }
                              })
                          //    .attr('x1', '5')
                            .attr('y1', '0')
                            .attr('x2', function (d) {
                              if (d.tier_name === 'beats') {
                                  return xAxisScale(d.start_time);
                               } else {
                                   return null;
                               }
                              })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)                 
                            .attr('y2', tierHeight)
                            .style('stroke', 'white')
                            .style('stroke-width', '2')
                            .style('stroke-dasharray', '14')
                            .style('stroke-dashoffset', '6');;

// let beatsFrame1 = beatsTier.append('g')
//                             .attr('class', 'beatsframe1')
//                             .selectAll('line .beatslines1' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'beatslines1')
//                             .attr('x1', '0')
//                             .attr('y1', '0')
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', '0')
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');
 
// let beatsFrame2 = beatsTier.append('g')
//                             .attr('class', 'beatsframe2')
//                             .selectAll('line .beatslines2' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'beatslines2')
//                             .attr('x1', '0')
//                             .attr('y1', tierHeight)
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', tierHeight)
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');

let beatsText = beatsTier.append('g')
                            .attr('class', 'beatstext')
                            .selectAll('text .words')
                            .data(praatData)
                            .enter().append('text')
                            .attr('class', 'beats')
                            .attr('x', function (d) {
                                if (d.tier_name === 'beats') {
                                    return(xAxisScale(d.start_time + d.end_time) / 2);
                                } else {
                                    return null;
                                }
                            })
                            .attr('y', '20')
                            .text(function (d) {
                                if (d.tier_name === 'beats') {
                                    return d.text;
                                } else {
                                    return null;
                                }
                            })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)
                            .style('text-anchor', 'middle')
                            // .style('text-align', 'justify')
                            .style('font-size', '12')
                            .style('font-weight', '400');


// Breaks tier

let svgBreaks = d3.select(shadow)
                    .append('svg')
                    .attr("class", "svgbreaks")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", tierHeight)
                    .style('background-color', 'pink');

let breaksTier = svgBreaks.append('g')
                        .attr('transform', `translate(${margin.left}, 0)`);
                            //    .attr('height', '100');



let breaksBar = breaksTier.append('g')
                            .attr('class', 'breaksBar')
                            .selectAll('line .breakslines')
                            .data(praatData)
                            .enter().append('line')
                            .attr('class', 'breakslines')
                            .attr('x1', function (d) {
                                if (d.tier_name === 'breaks') {
                                    return xAxisScale(d.start_time);
                                 } else {
                                     return null;
                                 }
                              })
                          //    .attr('x1', '5')
                            .attr('y1', '0')
                            .attr('x2', function (d) {
                              if (d.tier_name === 'breaks') {
                                  return xAxisScale(d.start_time);
                               } else {
                                   return null;
                               }
                              })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)                 
                            .attr('y2', tierHeight)
                            .style('stroke', 'white')
                            .style('stroke-width', '2')
                            .style('stroke-dasharray', '14')
                            .style('stroke-dashoffset', '6');

// let breaksFrame1 = breaksTier.append('g')
//                             .attr('class', 'breaksframe1')
//                             .selectAll('line .breakslines1' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'breakslines1')
//                             .attr('x1', '0')
//                             .attr('y1', '0')
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', '0')
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');
 
// let breaksFrame2 = breaksTier.append('g')
//                             .attr('class', 'breaksframe2')
//                             .selectAll('line .breakslines2' )
//                             .data(praatData)
//                             .enter().append('line')
//                             .attr('class', 'breakslines2')
//                             .attr('x1', '0')
//                             .attr('y1', tierHeight)
//                             .attr('x2', width + margin.left + margin.right)
//                             .attr('y2', tierHeight)
//                             .attr('transform', `translate(${0 - margin.left}, 0)`)
//                             .style('stroke', 'white')
//                             .style('stroke-width', '2');

let breaksText = breaksTier.append('g')
                            .attr('class', 'breakstext')
                            .selectAll('text .breaks')
                            .data(praatData)
                            .enter().append('text')
                            .attr('class', 'breaks')
                            .attr('x', function (d) {
                                if (d.tier_name === 'breaks') {
                                    return(xAxisScale(d.start_time + d.end_time) / 2);
                                } else {
                                    return null;
                                }
                            })
                            .attr('y', '20')
                            .text(function (d) {
                                if (d.tier_name === 'breaks') {
                                    return d.text;
                                } else {
                                    return null;
                                }
                            })
                            .attr('transform', `translate(${0 - margin.left}, 0)`)
                            .style('text-anchor', 'middle')
                            // .style('text-align', 'justify')
                            .style('font-size', '12')
                            .style('font-weight', '400');


}

drawPraat();