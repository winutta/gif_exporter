import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



export class Setup {
    constructor(){

        
        // DISABLE RIGHT CLICK

        document.addEventListener('contextmenu', event => event.preventDefault(), false);

        // SCENE SETUP

        var scene = new THREE.Scene({ antialias: true });
        scene.background = new THREE.Color(0xDAD3FF);

        // CAMERA SETUP

        var camera = new THREE.PerspectiveCamera(39, 1, 0.25, 2000);
        camera.position.set(0,0,8);
        camera.lookAt(new THREE.Vector3(0,0,0))

        // RENDERER SETUP

        
        // var targetCanvas = document.querySelector(".webgl");
        // var renderer = new THREE.WebGLRenderer({canvas: targetCanvas,antialias: true});

        // var renderer = new THREE.WebGLRenderer({antialias: true});

        // renderer.setPixelRatio( window.devicePixelRatio );
        // renderer.setSize( window.innerWidth, window.innerHeight );

        let renderers = []

        // do i really want multiple renderers? or just multiple canvases??

        //actual size or aspect ratio mode.. 

        //how to resize canvas with the AR in mind. need to think about the containing div.

        // if AR of canvas is > than AR on containing div then limited by width, and if > then limited by height

        // use limiting value and scale the other to get the fitting dimensions. 



        function addRendererfromCanvas(canvas,width,height){
            var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});


            // console.log(width,height);
            // renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( width, height );
            renderers.push(renderer);

            function resizeRenderer_Canvas(width_arg,height_arg){
                camera.aspect = width_arg / height_arg;
                camera.updateProjectionMatrix();
                // renderer.setPixelRatio( window.devicePixelRatio );
                
                renderer.setSize( width_arg, height_arg );
                
            }

            renderer.resizeCanvas = resizeRenderer_Canvas;

            function resizeAllCanvases(width_arg,height_arg){
                renderers.forEach((rend)=>{
                    rend.resizeCanvas(width_arg,height_arg)
                })
            }

            // const controls = new OrbitControls(camera, canvas);
            // controls.update();

            return renderer;
            

        }

        // MOUSE SETUP

        var mouse = new THREE.Vector2();

        //ORBIT CONTROL SETUP

        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.update();

        // Add to instance

        this.export_config = {range_val : [0,1]};

        this.scene = scene;
        this.camera = camera;
        this.renderers = renderers;
        this.addRenderer = addRendererfromCanvas;
        // this.renderer = renderer;
        this.mouse = mouse;

        this.viewer;

        // object to hold the other renderers for the canvases.. 

        // RESIZE

        // window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {

            let base_size;
            //going to have fixed aspect?? or customizable..

            // max width or height??
            // try with just fixed height .. no resize needed..

            // var width = ;
            // var height = ;

            var width = window.innerWidth;
            var height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderers.forEach((e)=>{
                e.setSize(width, height);
            })
            // renderer.setSize(width, height);
        }
    }
    
}

var setup = new Setup();

function getWorldDimensions(depth = 8){
    var vFOVC = setup.camera.fov * Math.PI / 180;
    var h = 2 * Math.tan(vFOVC / 2) * (depth);
    var w = h * setup.camera.aspect;
    return {w:w,h:h};
}

export {setup, getWorldDimensions}











