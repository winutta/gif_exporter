import React from 'react';

import { useState,useEffect,useRef, useLayoutEffect, useCallback } from 'react';

import {setup} from "./setup"
// import other modules

import TextBox from './text_box';


var {scene,camera,renderer,renderers,addRenderer} = setup;

let obj = {
  value: 22,
}

document.obj = obj;

function MyButton() {

  const [val, setVal] = useState(22);

  // setVal(obj.value)
  

  useEffect(()=>{
    // sort of like a setup function for each instance of this button. 
    // would need to add set_val to a list of functions to run when the global manager is run... 

    obj.set_val = setVal;
    // obj.val = val;
  },[])

  return (
    <button>
      I'm a button{val}
    </button>
  );
}

function getRelativeCoords(e){
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left; //x position within the element.
  // var y = e.clientY - rect.top; 

  return x;
}


function SliderInteractives({default_value}) {

  const [val, setVal] = useState(0);
  const [valueBar,setValueBar] = useState(default_value); // need default value on creation.. 
  const [moveable,setMoveable] = useState(false);

  let handleMouseDown = (e) => {
    setMoveable(true);
    let coord = getRelativeCoords(e);
    setValueBar(coord)
  }
  let handleMouseMove = (e) => {
    if(moveable){
      let coord = getRelativeCoords(e);
      setValueBar(coord)
    }
  }
  let handleMouseUp = (e) => {
    setMoveable(false);
  }

  useEffect(()=>{
    obj.set_val = setVal;
  },[])

  return (
    <div className='sliderInteractives'>
      <div className='sliderBackground' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        background
        <div className='sliderForeground' style={{width:valueBar}}>Foreground</div>
      </div>
      <div className='numbers'>Numbers</div>
    </div>
  );
}

function Segment({default_value, color, name}) {
  return (
    <div className={`segment ${color}`}>
      <div className ="propertyTitle">{name}</div>
      <SliderInteractives default_value = {50}></SliderInteractives>
    </div>
  );
}

function ThreeCanvas({id,width, height,renderer_ref}){

  const initCanvas = useRef();
  
  useEffect(()=>{

    let canvas_obj = initCanvas.current;
    // canvas_obj.style.width = "50px";

    console.log(canvas_obj);

    renderer_ref.current = addRenderer(canvas_obj,width,height)

  },[])

  return (
    <canvas ref = {initCanvas} id = {id}></canvas>
  )
}

function CanvasSettings({id,width_val,height_val,children}){
  const [width,setWidth] = useState(width_val);
  const [height,setHeight] = useState(height_val);

  const [numWidth,setNumWidth] = useState(width_val);
  const [numHeight,setNumHeight] = useState(height_val);

  const renderer_ref = useRef();
  const viewer = false;

  useEffect(()=>{
    renderer_ref.current.resizeCanvas(numWidth,numWidth)

    if(setup.viewer){
      //get limits of container.

      var parent_container = setup.viewer.domElement.parentNode.parentNode;
      console.log(parent_container);
      console.log(parent_container.scrollWidth,parent_container.scrollHeight,setup.viewer.domElement.offsetWidth)

      var p_width = parent_container.offsetWidth;
      var p_height = parent_container.offsetHeight;

      if(Math.min(p_width,p_height)<1){
        //invalid
        // console.log("invalid");
        // p_width = 1;
        // p_height = 1;
      } else {
        var p_aspect = p_width/p_height;
        var aspect = width/height;
  
        console.log(aspect);
  
  
        if(p_aspect>aspect){
          // height is the limiter. 
          setup.viewer.resizeCanvas( p_height*aspect, p_height );
        } else {
          setup.viewer.resizeCanvas( p_width, p_width/aspect );
        }
        console.log(width,height);

        // setup.viewer.resizeCanvas( numWidth, numWidth );
      }

      
    }


  },[width,height])

  function onWidthChange(e){
    // console.log(e.target.value);
    
    var use_val = e.target.value;
    setWidth(use_val);
    if(use_val == ""){
      use_val = 1;
    }
    use_val = parseInt(use_val);
    use_val = Math.min(Math.max(use_val,1),1024);

    if(use_val == 1024){
      e.target.value = 1024;
    }
    // setWidth(use_val);
    setNumWidth(use_val);
  }

  function onHeightChange(e){
    var use_val = e.target.value;
    setHeight(use_val);
    if(use_val == ""){
      use_val = 1;
    }

    use_val = parseInt(use_val);
    use_val = Math.min(Math.max(use_val,1),1024);
    if(use_val == 1024){
      e.target.value = 1024;
    }
    // setHeight(use_val);
    setNumHeight(use_val);
  }


  return (
    <div id = {id}>
      <div id = "canvas_settings_desc">Dimensions, Width x Height (Max 1024)</div>
      <input id = "width" type = "text" value = {width} onChange={onWidthChange}></input>
      <input id = "height" type = "text" value = {height} onChange={onHeightChange}></input>
      <ThreeCanvas id = "canv2" width = {width}  height = {height} renderer_ref = {renderer_ref}></ThreeCanvas>
    </div>
  )
}

function ExportSettings({id,start_val,end_val,children}){
  const [start,setStart] = useState(start_val);
  const [end,setEnd] = useState(end_val);

  // const export_config_ref = useRef();

  // useEffect(()=>{
  //   export_config_ref.current = setup.export_config;
  // },[])

  useEffect(()=>{
    var new_range = [Math.max(0,parseFloat(start)),parseFloat(end)];
    console.log(new_range);
    setup.export_config.range_val = new_range;

  },[start,end])

  function onStartChange(e){
    setStart(e.target.value);

  }

  function onEndChange(e){
    setEnd(e.target.value);
  }


  return (
    <div id = {id}>
      <div id = "export_settings_desc">Export Times, Start x End</div>
      <input id = "start" type = "text" value = {start} onChange={onStartChange}></input>
      <input id = "end" type = "text" value = {end} onChange={onEndChange}></input>
    </div>
  )
}

function ViewerCanvas({id,width_val,height_val,children}){
  const renderer_ref = useRef();
  const viewer = true;

  useEffect(()=>{
    setup.viewer = renderer_ref.current;

  },[])


  return (
    <div id = {id}>
      <ThreeCanvas id = "canv" width = {width_val}  height = {height_val} renderer_ref = {renderer_ref}></ThreeCanvas>
    </div>
  )
}

function ExportButton({id,width,height,children}){

  useEffect(()=>{
  },[])


  function onDivClick(){
    if(window.export_animation){
      window.export_animation();
    }
  }


  return (
    <div id = {id} width = {width} height = {height} onClick = {onDivClick}>
      Export
    </div>
  )
}

let sliders = [<SliderInteractives key={0}></SliderInteractives>,<SliderInteractives key = {1}></SliderInteractives>]

// use as 
// {sliders}


//component that includes the canvas width and height inputs. 
// or just get reference to them and use values with an event listener.. 

//container component so i can share state between section 1 and section 2.


export default function MyApp() {

  const html_obj = useRef();
  const renderer_ref = useRef();

  useLayoutEffect(()=>{

    //run setup from here?
    console.log(html_obj);
  },[])


  return (
    <>
      <div className = 'container' >
        <div className = 'section1' id = "section1">
          <ViewerCanvas id = "viewer_canvas" ></ViewerCanvas>
        </div>
        <div className='section2'>
          <ExportButton id = "export" width = "20" height = "20"></ExportButton>
          <CanvasSettings width_val = "400" height_val = "300"></CanvasSettings>
          <ExportSettings id = "export_settings" start_val = {0} end_val = {3}></ExportSettings>
        </div>
      </div>
    </>
  );
}
