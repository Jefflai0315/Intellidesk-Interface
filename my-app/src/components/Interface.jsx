import React, { useState , useEffect} from 'react';
import "../App.css";
import database from '../firebase'; // Adjust the path as needed
import { ref, set , query, limitToLast, onValue, startAt, endAt, orderByKey} from 'firebase/database';
import { IoIosBody } from "react-icons/io";
import chargeBlue from '../imgs/charge_blue.png';
import camBlue from '../imgs/cam_blue.png';
import lockBlue from '../imgs/lock_blue.png';
import unlockWhite from '../imgs/unlock_white.png';
import logoImg from '../imgs/logo@720x.png';
import { useSwipeable } from 'react-swipeable';

const Interface = () => {

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#000',
      color: '#fff',
      padding: '20px',
      fontFamily: 'Open Sans, sans-serif',
      gap: '2%',
      // width: '1280px', // Set the width of the container
      // height: '400px', // Set the height of the container
      // overflow: 'auto', // Optional: add scrolling to the container
      // margin: '0 auto'
    },
    label:{
      flexGrow: 1, // Allows the child to grow and fill the available space
      margin: '0 1%', // Optional: Adds margin to each side of the child element
  
    },
    heightDisplay: {
      fontSize: '48px',
      letterSpacing: '5px', // to simulate the XXX.X appearance
    },
    button: {
      width: '60px', // Adjusted size to match image
      height: '60px',
      margin: '15px',
      fontSize: '24px', // Larger font size if necessary
      backgroundColor: '#333', // Match the dark theme in the image
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
    },
    boldButton: {
      width: '60px', // Adjusted size to match image
      height: '80px',
      fontSize: '30px', // Larger font size if necessary
      backgroundColor: '#9FDD94', // Match the dark theme in the image
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 'bold', // Make the text bold
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
      height:'100%',
      display: 'flex',
      flexDirection: 'column', // Align children in a column
      flexGrow: 1, // Allows the child to grow and fill the available space
      margin: '0 1%', // Optional: Adds margin to each side of the child element
  
    },
    buttonGroup: {
      height:'100%',
      display: 'flex',
      flexDirection: 'row', // Align children in a column
    },
    activeButton: {
      backgroundColor: '#9FDD94', 
    },
    icon: {
      width: '60px',
      height: '60px',
    },
    verticalLine: {
      borderLeft: '2px solid #A9FF9B', // Solid line, white color, 2 pixels thick
      minHeight: '100px', // Minimum height for the line
      alignSelf: 'stretch', // Stretch line to fill the height of the parent div if it's larger
      marginLeft: '20px', // Space from the left container
      marginRight: '20px', // Space from the right container
      opacity: '0.5', // Optional: Adjust the opacity of the line
    },
    horizontalLine: {
      borderTop: '1px solid #A9FF9B', // Adjust color as needed
      minWidth: '100%', // Line height to fill the parent div
      alignSelf: 'stretch', // Stretch line to fill the height of the parent div
      marginRight: '20px', // Space from the right container
    },
    score: {
      fontSize: '48px',
      margin: '10px 0',
    },
    progressBar: {
      height: '20px',
      borderRadius: '10px',
      backgroundColor: '#555', // Make sure this is visible against the container background
      margin: '10px 0',
      width: '100%', // Set the width of the progress bar container to full width
      overflow: 'hidden', // Ensures the inner progress doesn't overflow
    },
    progress: {
      minHeight: '100%',
      borderRadius: '10px',
      transition: 'width 0.5s ease-in-out',
      backgroundColor: '#0f0', // Set the default color of the progress bar
    },
    slider: {
      // Slider styling will depend on the library or method you're using
    }
  };

  // Handler functions for swipe actions
  // const handleSwipedLeft = () => setScreenIndex((prev) => prev + 1);
  // const handleSwipedRight = () => setScreenIndex((prev) => (prev > 0 ? prev - 1 : 0));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setScreenIndex(1),
    onSwipedRight: () => setScreenIndex(0),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // const [height, setHeight] = useState('180.0');
  // const [averageDistance, setAverageDistance] = useState(0);
  // const [sitStandProgress, setSitStandProgress] = useState(100)
 
  // const [isStanding, setIsStanding] = useState(true); // Start with standing
  // const [data, setData] = useState([]); // for posture
  // const [gradient, setGradient] = useState('');

  const [screenIndex, setScreenIndex] = useState(0);
  const [height, setHeight] = useState('180.0');
  const [averageDistance, setAverageDistance] = useState(0);
  const [sitStandProgress, setSitStandProgress] = useState(100);
  const [isStanding, setIsStanding] = useState(true);
  const [PostureGradient, setPostureGradient] = useState('');
  const [EyeScreenGradient, setEyeScreenGradient] = useState('');
  const [SitStandGradient, setSitStandGradient] = useState('');
  const [averageScore, setAverageScore] = useState('');
  const [postureNudge,setPostureNudge] = useState(false);

  useEffect(() => {
    const postureRef = query(ref(database, 'Controls/PostureNudge'));
    onValue(postureRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      if (data===1) {
        setPostureNudge(true);
      }
      else {
        setPostureNudge(false);
      }
    });
  }, []);
  // Firebase data fetching and processing for posture
  useEffect(() => {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - 60 * 60 * 1000; 
    const postureRef = query(ref(database, 'Posture') ,orderByKey(), // Assuming 'unixtimestamp' is your key
    startAt(oneHourAgo.toString()) // Convert the startTime to string if it's a number
      );
    onValue(postureRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      if (data) {
        const processedData = processPostureData(data);
        setPostureGradient(createGradient(processedData));
      }
    });
  }, []);

  // Function to process data and generate gradient
  const processPostureData = (data) => {
    let totalDuration = Object.keys(data).length;
    let gradientArray = [];
    let totalScore = 0;
    const postureScores = {
      perfect: 100,
      good: 70,
      bad: 0,
    };
    const postureRecords = Object.values(data);

    postureRecords.forEach(postureRecord => {
      totalScore += postureScores[postureRecord.PostureQuality];
    });

    const averageScore = totalScore / totalDuration;
    setAverageScore(Math.round(averageScore))

    Object.entries(data).forEach(([time, { PostureQuality }], index) => {
      const color = PostureQuality === 'good' ? 'green' : PostureQuality === 'perfect' ? 'blue' : 'red';
      const start = (index / totalDuration) * 100;
      const end = ((index + 1) / totalDuration) * 100;
  
      gradientArray.push({ color, start, end });
    });

    Object.entries(data).forEach(([time, { PostureQuality }], index) => {
      const color = PostureQuality === 'good' ? 'green' : PostureQuality === 'perfect' ? 'blue' : 'red';
      const start = (index / totalDuration) * 100;
      const end = ((index + 1) / totalDuration) * 100;
  
      gradientArray.push({ color, start, end });
    });
  return gradientArray;
    
  };

  useEffect(() => {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - 600* 60 * 60 * 1000; 
    const postureRef = query(ref(database, 'Posture'), orderByKey(), // Assuming 'unixtimestamp' is your key
startAt(oneHourAgo.toString()) // Convert the startTime to string if it's a number
  );
    onValue(postureRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const processedData = processSitStandData(data);
        setSitStandGradient(createGradient(processedData));
      }
    });
  }, []);

  // Function to process data and generate gradient
  const processSitStandData = (data) => {
    let totalDuration = Object.keys(data).length;
    let gradientArray = [];

    Object.entries(data).forEach(([time, { PostureMode }], index) => {
      const color = PostureMode === 'sitting' ? 'red' : 'blue';
      const start = (index / totalDuration) * 100;
      const end = ((index + 1) / totalDuration) * 100;
  
      gradientArray.push({ color, start, end });
    });
  return gradientArray;
    
  };

  useEffect(() => {
    const currentTime = Date.now();
    const oneHourAgo = currentTime - 60 * 60 * 1000; 
    const eyeScreenDistanceRef = query(ref(database, 'EyeScreenDistance'), orderByKey(), // Assuming 'unixtimestamp' is your key
    startAt(oneHourAgo.toString()) // Convert the startTime to string if it's a number
      );
    onValue(eyeScreenDistanceRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      if (data) {
        const processedData = processEyeScreenDistanceData(data);
        setEyeScreenGradient(createGradient(processedData));
      }
    });
  }, []);

  // Function to process data and generate gradient
  const processEyeScreenDistanceData = (data) => {
    let totalDuration = Object.keys(data).length;
    let gradientArray = [];

    Object.entries(data).forEach(([time, { Distance }], index) => {
      // console.log(Distance)
      const color = Distance <  '90' ? 'red' : Distance > '180' ? 'yellow' : 'green';
      const start = (index / totalDuration) * 100;
      const end = ((index + 1) / totalDuration) * 100;
  
      gradientArray.push({ color, start, end });
    });
  return gradientArray;
  
  };

  const createGradient = (gradientArray) => {
    const colorStops = gradientArray.map(({ color, start, end }) =>
      `${color} ${start.toFixed(2)}%, ${color} ${end.toFixed(2)}%`
    );
    return `linear-gradient(to right, ${colorStops.join(', ')})`;
  };
  
  const presets = {
    sitting: 120.0,
    standing: 150.0,
    elevated: 200.0
  };

  const applyPreset = (presetHeight) => {
    setHeight(presetHeight.toFixed(1));
    updateHeightInFirebase(presetHeight);
  };

  const updateHeightInFirebase = (newHeight) => {
    const heightRef = ref(database, 'Controls/HeightValue');
    set(heightRef, newHeight).catch((error) => {
      console.error("Error updating height in Firebase", error);});
  };
  
  const handleIncrease = () => {
    setHeight(prevHeight => {
      const newHeight = (parseFloat(prevHeight) + 0.1).toFixed(1);
      updateHeightInFirebase(newHeight);
      return newHeight;
    });
  };
  
  const handleDecrease = () => {
    setHeight(prevHeight => {
      const newHeight = (parseFloat(prevHeight) - 0.1).toFixed(1);
      updateHeightInFirebase(newHeight);
      return newHeight;
    });
  };

  return (
    <div {...swipeHandlers} >
      {/* Render the screen based on the current index */}
      {screenIndex === 0 && (
        <div style={styles.container}>
          <div>
            <img src={logoImg} alt="Intellidesk Logo" style={{ width: '200px', height: 'auto' }} />
            <div >{postureNudge && <IoIosBody style={{ color: 'red' }}/>}</div>
            <div style={styles.horizontalLine}></div>
            <div>User 1</div>
            <div>Eye-Screen Distance: {averageDistance.toFixed(1)}</div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>{height} CM</div>
          </div>
          <div style={styles.buttonGroup}>
            <div style={styles.buttonContainer}>
              <button onClick={handleIncrease} style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '60px',height: '80px', fontSize: '30px', borderRadius: '10px'}}>▲</button>
              <button onClick={handleDecrease} style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '60px',height: '80px', fontSize: '30px', borderRadius: '10px'}}>▼</button>
            </div>
            <div style={styles.verticalLine}></div>
            <div style={styles.buttonContainer}>
              <button style={styles.boldButton}>M</button>
              <button style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '60px',height: '80px', fontSize: '30px', borderRadius: '10px'}}>
                <img src={unlockWhite} alt="Lock" style={{ width: '24px', height: '32px' }} />
              </button>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <div style={styles.buttonGroup}>
              <button style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '80%',height: '100%', borderRadius: '10px'}}>
                <img src={chargeBlue} alt="Charge Icon" style={{ width: '60px', height: '60px' }} />
              </button>
              <button style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '80%',height: '80px', borderRadius: '10px'}}>
                <img src={camBlue} alt="Cam Icon" style={{ width: '60px', height: '50px' }} />  
              </button> 
            </div>
            <div className="controls">
              <button onClick={() => applyPreset(presets.sitting)} style={{ fontSize: '30px',fontWeight:'bold',justifyContent: 'center',alignItems: 'center',width: '22%',height: '80px' }}>1
              </button>
              <button onClick={() => applyPreset(presets.standing)} style={{ fontSize: '30px',fontWeight:'bold',justifyContent: 'center',alignItems: 'center',width: '22%',height: '80px' }}>2
              </button>
              <button onClick={() => applyPreset(presets.elevated)} style={{ fontSize: '30px',fontWeight:'bold',justifyContent: 'center',alignItems: 'center',width: '22%',height: '80px' }}>3
              </button>
              <button onClick={() => applyPreset(presets.elevated)} style={{ fontSize: '30px',fontWeight:'bold',justifyContent: 'center',alignItems: 'center',width: '22%',height: '80px' }}>4
              </button>
            </div>
          </div>
          </div>
      )}
      {screenIndex === 1 && (
        // Your second screen JSX
      <div style={styles.container}>
        <div >
          <div >Intellidesk</div>
          <div style={styles.label}>Posture Score</div>
          <div style={styles.score}>{averageScore}/100</div>
        </div>
    
        {/* <div style={styles.buttonContainer}>
          
        <div style={styles.label}>{isStanding ? 'Stand Time' : 'Sit Time'}</div>
        <div style={styles.progressBar}>
              <div style={{ ...styles.progress, width: `${sitStandProgress}%`, backgroundColor: isStanding ? 'orange' : 'blue' }}></div>
            </div>
          
        </div> */}
        <div style={styles.buttonContainer}>
          <div style={styles.label}>Posture</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progress,width: '100%', background: PostureGradient }}></div>
          </div>
          {/* This would be an interactive slider component */}
          <div style={styles.slider}> {/* You will need to replace this with an actual slider component */}
            {/* The slider thumb position would represent the screenEyeDistance */}
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <div style={styles.label}>Sit/Stand</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progress,width: '100%', background: SitStandGradient }}></div>
          </div>
          {/* This would be an interactive slider component */}
          <div style={styles.slider}> {/* You will need to replace this with an actual slider component */}
            {/* The slider thumb position would represent the screenEyeDistance */}
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <div style={styles.label}>Eye-Screen Distance</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progress,width: '100%', background: EyeScreenGradient }}></div>
          </div>
          {/* This would be an interactive slider component */}
          <div style={styles.slider}> {/* You will need to replace this with an actual slider component */}
            {/* The slider thumb position would represent the screenEyeDistance */}
          </div>
        </div>
      </div>
      )}

    </div>
  );
}

export default Interface;

// posture status 
// reminders ( drinking, stand)
// warning correction (nudging)
