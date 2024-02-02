import { OrbitControls , shaderMaterial, Center, Text, Float, Point, Points} from '@react-three/drei'
import React, { useRef, useState, useMemo} from 'react'
import {  useFrame, extend } from '@react-three/fiber'
import vertexShader from './shaders/vertex.js'
import fragmentShader from './shaders/fragment.js'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'



let plane = new THREE.BoxGeometry( 20, 20, 20, 5, 5, 5 );





export default function Experience(){
 
    const picture = useLoader(TextureLoader,  `mondrian.jpeg`)

    const PointMaterial = shaderMaterial(

        {
            uTime: 0,
            uResolution: {x: screen.width, y: screen.height},
            uMouse: {x:0, y:0},
            pic: picture,

            
           
        },
        vertexShader,
        fragmentShader,
    
        
    )
    extend({PointMaterial})

    console.log(PointMaterial)

const ref = useRef()
// Hold state for hovered and clicked events
const [hovered, hover] = useState(false)
const [clicked, click] = useState(false)




const pointMaterial = useRef()
useFrame((state, delta) => {
   pointMaterial.current.uTime += delta

  //  ref.current.rotation.z += (delta * .2)

    if (
     pointMaterial.current.uResolution.x === 0 &&
     pointMaterial.current.uResolution.y === 0
    ) {
     pointMaterial.current.uResolution.x = screen.width;
     pointMaterial.current.uResolution.y = screen.height;
     
    }
})

let particlesCount =50000

const particles = useMemo(() => {
  const positions = [];
  const velocities = [];

  for (let i = 0; i < particlesCount; i++) {
    positions.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    velocities.push(Math.random() *2 , Math.random() *2 , Math.random() *2 );
  }

  return { positions, velocities };
}, [particlesCount]);

useFrame(() => {
  const positions = ref.current.geometry.attributes.position.array;
    let averageA = [0,0,0]
  for (let i = 0; i < positions.length /3; i++) {
    const i3 = i * 3;

   

    positions[i3] += particles.velocities[i3] * 0.01;
    positions[i3 + 1] += particles.velocities[i3 + 1] * 0.01;
    positions[i3 + 2] += particles.velocities[i3 + 2] * 0.01;
    averageA[0] += positions[i3]
    averageA[1] += positions[i3+1]
    averageA[2] += positions[i3+2]


  //   for (let j = 0; j < positions.length/3; j++) {
  //     const j3 = j * 3;

  //     if(Math.abs(positions[i3] - positions[j3]) < .01 && Math.abs(positions[i3+1] - positions[j3+1]) < .01 && Math.abs(positions[i3+2] - positions[j3+2]) < .01){
  //         particles.velocities[i3] *= -1;
          

  //     }


  // }


  if(Math.abs(averageA[0] - positions[i3]) < .1 && Math.abs(averageA[1] - positions[i3+1]) < .1 && Math.abs(averageA[2] - positions[i3+2]) < .1){
    particles.velocities[i3] *= -1;
    

}
   

    // Add your flocking logic here

    // Example: Bounce back when hitting the boundaries
    if (positions[i3] > 10 || positions[i3] < -10){
      particles.velocities[i3] *= -1;
      // particles.velocities[i3 + 1] *= -1;
      // particles.velocities[i3 + 2] *= -1;
    } 
    if (positions[i3 + 1] > 10 || positions[i3 + 1] < -10) {
      // particles.velocities[i3] *= -1;
      particles.velocities[i3 + 1] *= -1;
      // particles.velocities[i3 + 2] *= -1;
    }
    
    if (positions[i3 + 2] > 10 || positions[i3 + 2] < -10){
      // particles.velocities[i3] *= -1;
      // particles.velocities[i3 + 1] *= -1;
      particles.velocities[i3 + 2] *= -1;
    } 


    // if (positions[i3] <averageA[0] ){
    //   particles.velocities[i3] *= -1;
      
    // } 
  //   if (positions[i3+1] <averageA[1] ){
  //     // particles.velocities[i3] *= -1;
  //     particles.velocities[i3 + 1] *= -1;
  //     // particles.velocities[i3 + 2] *= -1;
  //   }
    
  //  if (positions[i3+2] <averageA[2] ){
  //     // particles.velocities[i3] *= -1;
  //     // particles.velocities[i3 + 1] *= -1;
  //     particles.velocities[i3 + 2] *= -1;
  //   } 



   
    

    

    // if (positions[i3] >  positions[i3-3] ){
    //     particles.velocities[i3] *= -1;
    //     particles.velocities[i3 + 1] *= -1;
    //     particles.velocities[i3 + 2] *= -1;
    //   } 
  }

     averageA[0] /= positions.length/3
    averageA[1] /= positions.length/3
    averageA[2] /= positions.length/3
    console.log(averageA)

 

  ref.current.geometry.attributes.position.needsUpdate = true;
});


// Subscribe this component to the render-loop, rotate the mesh every frame
// useFrame((state, delta) => (ref.current.rotation.x += delta *.05))
    return(

<>
<OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI * .5}/>

         <Text
        
        font="FerriteCoreDX-Regular.otf"
        scale={1 }
       
        position={ [ .0, -2.250, 1 ] }
        fontSize={1.25}
        
        
        >
          {'Flock off'.toUpperCase()}
          <meshBasicMaterial color="#4AF626" toneMapped={false}
          side={THREE.DoubleSide}
          />
        </Text>



        <Points positions={plane.attributes.position.array} stride={3} ref={ref} rotation-x={Math.PI *  1.}onPointerMove={(e)=>  pointMaterial.current.uMouse = e.pointer} >
        <pointMaterial ref={pointMaterial} depthWrite={false} transparent />
    </Points>

     
      </>
    )
}