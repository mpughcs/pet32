import { useRef } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { useEffect } from 'react';
import HealthBar from './HealthBar';
import HungerBar from './HealthBar';

function App() {
    const phaserRef = useRef();


    useEffect(() => {
        return () => {
            console.log('App component unmounted');
        };
    }, []);
    
    const addSprite = () => {
        const gameInstance = phaserRef.current.game; // Access the Phaser game instance
        const scene = gameInstance.scene.keys['Game']; // Access the specific 'Game' scene

        if (scene && scene.addRandomSprite) {
            // Call the method from the scene to add a random sprite
            scene.addRandomSprite();
        }
    };

    return (
        <div className='mx-auto flex flex-col'>

            <div className=" text-white p-5 w-['100%']">
                <h1 className="text-3xl font-bold text-center">Life gives</h1>
            </div>
            {/* pet details */}
            {/* <div className='absolute left-[200px]  bottom-[25%] flex flex-col gap-3 '>
                <h2 className="text-3xl  text-white">❤️ Ducky </h2>
                <h2 className="text-3xl  text-white">🏥 Health: 100%</h2>
                <h2 className="text-3xl font-bold text-white">🍔 Hunger: 100%</h2>

            </div> */}

            <div id="app" className='mx-auto'>
                <PhaserGame ref={phaserRef} />
                <div className='flex align-middle items-center'>
                    <button onClick={addSprite} className='bg-green-500 text-white p-2 rounded-lg m-5 text-3xl'>Feed</button>
                    
                    {/* <HungerBar /> */}

                </div>
            </div>
        </div>
    );
}

export default App;
