import React, { useState , useEffect} from 'react';
import "../App.css";
import database from '../firebase'; // Adjust the path as needed
import { ref, set , query, limitToLast, onValue, startAt, endAt, orderByKey} from 'firebase/database';
import { IoIosBody } from "react-icons/io";
import chargeGreen from '../imgs/charge_green.png';
import camGreen from '../imgs/cam_green.png';
import lockWhite from '../imgs/lock_white.png';
import chargeGreenOff from '../imgs/charge_white.png';
import camGreenOff from '../imgs/cam_white.png';
import unlockWhite from '../imgs/unlock_white.png';
import logoImg from '../imgs/logo@720x.png';
import { useSwipeable } from 'react-swipeable';

// Right before the Interface component function
const totalPages = 3; // Set this to the total number of pages you have

// Clock component
const Clock = ({ style }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const clockStyle = {
    fontSize: '60px',
    color: '#9FDD94', // Choose a color that fits your UI's theme
    fontFamily: 'Open Sans, bold, sans-serif',
    ...style 
  };

  return (
    <div style={clockStyle}>
      {time.toLocaleTimeString('en-GB', { hour12: false })}
    </div>
  );
};

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
      width: '1280px', // Set the width of the container
      height: '400px', // Set the height of the container
      overflow: 'auto', // Optional: add scrolling to the container
      margin: '0 auto'
    },
    label:{
      flexGrow: 1, // Allows the child to grow and fill the available space
      margin: '0 1%', // Optional: Adds margin to each side of the child element
      fontSize: '40px', // Optional: Adjust the font size of the label
    },
    heightDisplay: {
      fontSize: '106px',
      letterSpacing: '5px', // to simulate the XXX.X appearance
    },
    button: {
      width: '130px', // Adjusted size to match image
      height: '120px',
      margin: '15px',
      fontSize: '24px', // Larger font size if necessary
      backgroundColor: '#333', // Match the dark theme in the image
      color: '#fff',
      border: 'none',
      borderRadius: '25px',
    },
    boldButton: {
      width: '130px', // Adjusted size to match image
      height: '180px',
      fontSize: '50px', // Larger font size if necessary
      backgroundColor: '#9FDD94', // Match the dark theme in the image
      color: '#fff',
      border: 'none',
      borderRadius: '25px',
      fontWeight: 'bold', // Make the text bold
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
      height:'100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-evenly', // Align children with equal space between them
      flexDirection: 'column', // Align children in a column
      flexGrow: 1,
      borderRadius: '25px', // Allows the child to grow and fill the available space
      // padding: '20px', // Optional: Add padding to the container
    },
    buttonContainerPg2: {
      height:'100%',
      width: '95%',
      display: 'flex',
      justifyContent: 'space-evenly', // Align children with equal space between them
      flexDirection: 'column', // Align children in a column
      flexGrow: 1,
      borderRadius: '25px', // Allows the child to grow and fill the available space
      // padding: '20px', // Optional: Add padding to the container
    },
    buttonGroup: {
      height:'100%',
      display: 'flex',
      justifyContent: 'space-evenly',
      // flexDirection: 'row', // Align children in a column
      flexGrow: 1,
      alignItems: 'center',
      borderRadius: '25px', // Allows the child to grow and fill the available space
    },
    activeButton: {
      backgroundColor: '#9FDD94', 
      borderRadius: '25px',
    },
    icon: {
      width: '100px',
      height: '100px',
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
      width: '310px', // Line height to fill the parent div
      alignSelf: 'stretch', // Stretch line to fill the height of the parent div
      marginRight: '20px', // Space from the right container
    },
    score: {
      fontSize: '106px',
      margin: '10px 0',
    },

    //Pg 2 styles
    groupContainer: {
      
      // Other styles for the container
    },
    stackContainer: {
      display: 'flex',
      // flexDirection: 'row', // Stack children vertically
      alignItems: 'center', // Align children in the center
      justifyContent: 'space-between',
      width: '100%'
    },
    progressBarS: {
      height: '20px',
      borderRadius: '25px',
      backgroundColor: '#555', // Make sure this is visible against the container background
      margin: '10px 0',
      width: '400px', // Set the width of the progress bar container to full width
      overflow: 'hidden', // Ensures the inner progress doesn't overflow
    },
    progressBarL: {
      height: '20px',
      borderRadius: '25px',
      backgroundColor: '#555', // Make sure this is visible against the container background
      margin: '10px 0',
      width: '845px', // Set the width of the progress bar container to full width
      overflow: 'hidden', // Ensures the inner progress doesn't overflow
    },
    progress: {
      minHeight: '100%',
      borderRadius: '25px',
      transition: 'width 0.5s ease-in-out',
      backgroundColor: '#0f0', // Set the default color of the progress bar
    },
    slider: {
      // Slider styling will depend on the library or method you're using
    },
    // Define your gradients for the progress bars here
    SitStandGradient: 'linear-gradient(to right, red, yellow, green)',
    EyeScreenGradient: 'linear-gradient(to right, green, yellow, red)',
  };

  const handlePageSelect = (pageIndex) => {
    setScreenIndex(pageIndex);
  };

  // Handler functions for swipe actions
  // const handleSwipedLeft = () => setScreenIndex((prev) => prev + 1);
  // const handleSwipedRight = () => setScreenIndex((prev) => (prev > 0 ? prev - 1 : 0));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setScreenIndex((prevIndex) => (prevIndex + 1) % totalPages),
    onSwipedRight: () => setScreenIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages),
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

  const [activeStates, setActiveStates] = useState({});

  // functions to handle the preset states
  const [activeButtons, setActiveButtons] = useState({});

  // Function to handle button click
  const handleButtonClick = (buttonKey) => {
    // Toggle the button's active state
    setActiveButtons(prevState => ({
        ...prevState,
        [buttonKey]: !prevState[buttonKey]
    }));
      
    setActiveStates(prevActiveStates => ({
      ...prevActiveStates,
      [buttonKey]: !prevActiveStates[buttonKey]
    }));

    // Call handlePreset only for specific buttons and if they are being activated
    if (buttonKey !== 'offCam' && buttonKey !== 'offCharge' && !activeButtons[buttonKey] && buttonKey !== 'lockButton' && buttonKey !== 'modeButton') {
        handlePreset(presets[buttonKey]);
    }
};

  // const updateButtonAppearance = (buttonNumber) => {
  //   setActiveButtons(buttonNumber); // Set the clicked button as active
  // };

  // // Function to handle preset application
  // const handlePresetApplication = (buttonNumber) => {
  //   if (buttonNumber !== 'offCam' && buttonNumber !== 'offCharge') {
  //     handlePreset(presets[buttonNumber]);
  //   }
  // };

  const [activePreset, setActivePreset] = useState(null);
  const handlePreset = (preset) => {
    applyPreset(preset);
    setActivePreset(preset);
  };

  // Base style for preset buttons
  const baseButtonStyleP = {
    fontSize: '50px',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '180px',
    borderRadius: '25px'
  };

  // Base style for charge/cam buttons
  const baseButtonStyleC = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%',
    height: '180px', 
    borderRadius: '25px'
  };

  const getButtonStyleP = (preset) => ({
    ...baseButtonStyleP,
    backgroundColor: activePreset === preset ? '#9FDD94' : '#444444', // Change background color if active
  });

  const getButtonStyleC = (buttonKey) => ({
    ...baseButtonStyleC,
    backgroundColor: activeButtons[buttonKey] ? '#9FDD94' : '#444444', // Change background color if active
  });

  const getButtonStyleBold = (buttonKey) => ({
    ...styles.boldButton,
    backgroundColor: activeStates[buttonKey] ? '#9FDD94' : '#444444', // Change background color if active
  });

  // Dot component
  const Dot = ({ isActive, onClick }) => (
    <span
      style={{
        padding: '5px',
        marginRight: '5px',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: isActive ? '#FFFFFF' : '#BBBBBB',
      }}
      onClick={onClick}
    />
  );

  // PageIndicator component
  const PageIndicator = ({ totalPages, currentPage, onPageSelect }) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {Array.from({ length: totalPages }, (_, index) => (
        <Dot
          key={index}
          isActive={index === currentPage}
          onClick={() => onPageSelect(index)}
        />
      ))}
    </div>
  );

  // Define the container for the page indicator
  const pageIndicatorContainerStyle = {
    position: 'absolute', // Position it relative to the Interface component
    // Place it at the bottom with a margin of 10px
    top: '430px',
    left: '50%', // Center align the container
    transform: 'translateX(-50%)', // This ensures it's centered regardless of the width
    display: 'flex',
    justifyContent: 'center',
    width: '100%', // Take the full width to center the content properly
  };

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
      const color = PostureQuality === 'good' ? '#F4B54C' : PostureQuality === 'perfect' ? '#78D06A' : '#EE5757';
      const start = (index / totalDuration) * 100;
      const end = ((index + 1) / totalDuration) * 100;
  
      gradientArray.push({ color, start, end });
    });

    Object.entries(data).forEach(([time, { PostureQuality }], index) => {
      const color = PostureQuality === 'good' ? '#F4B54C' : PostureQuality === 'perfect' ? '#78D06A' : '#EE5757';
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
      const color = PostureMode === 'sitting' ? '#EE5757' : '#78D06A';
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
      const color = Distance <  '90' ? '#EE5757' : Distance > '180' ? '#F4B54C' : '#78D06A';
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
    elevated1: 180.0,
    elevated2: 200.0,
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
      <div style={pageIndicatorContainerStyle}>
        <PageIndicator totalPages={totalPages} currentPage={screenIndex} onPageSelect={handlePageSelect} />
      </div>
      {screenIndex === 0 && (
        <div style={styles.container}>
          <div style={{ position: 'relative', height: '100%', width: '55%', top: '10px', left: '10px' }}>
            <img src={logoImg} alt="Intellidesk Logo" style={{ width: '286px', height: 'auto' }} />
            <div >{postureNudge && <IoIosBody style={{ color: '#EE5757', top: '10px', left: '10px' }}/>}</div>
            <div style={styles.horizontalLine}></div>
            <div style={{ fontSize: '50px', color: '#9FDD94'}}> User 1 </div>
            <div style={{ fontSize: '40px', color: '#FFFFFF', paddingTop: '15px'}}>Table Height:</div>
            <div style={{ textAlign: 'right', position: 'relative', left: '-10px' }}>
              <div style={{ color: '#9FDD94', fontSize: '110px' }}>{height}</div>
              <div style={{ fontSize: '45px' }}>CM</div>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <div style={styles.buttonContainer}>
              <button onClick={handleIncrease} style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '110px',height: '180px', fontSize: '50px', borderRadius: '25px'}}>▲</button>
              <button onClick={handleDecrease} style={{display: 'flex',justifyContent: 'center',alignItems: 'center',width: '110px',height: '180px', fontSize: '50px', borderRadius: '25px'}}>▼</button>
            </div>
            <div style={styles.verticalLine}></div>
            <div style={styles.buttonContainer}>
              <button 
                onClick={() => handleButtonClick('modeButton')}
                style={getButtonStyleBold('modeButton')}>
                M
              </button>
              <button onClick={() => handleButtonClick('lockButton')}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '130px',
                  height: '180px',
                  fontSize: '50px',
                  borderRadius: '25px',
                  backgroundColor: activeStates['lockButton'] ? '#9FDD94' : '#444444', // Change to your default color
                }}
              >
                <img
                  src={activeStates['lockButton'] ? lockWhite : unlockWhite} // Change 'unlockActive' to the active state icon
                  alt="Lock"
                  style={{ width: '36px', height: '50px' }}
                />
              </button>
            </div>
          </div>
          <div style={styles.buttonContainer}>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleButtonClick('offCharge')} style={getButtonStyleC('offCharge')}>
                {
                  activeButtons['offCharge']
                  ? <img src={chargeGreenOff} alt="Charge Icon Off" style={styles.icon} />
                  : <img src={chargeGreen} alt="Charge Icon" style={styles.icon} />
                }
              </button>
              <button onClick={() => handleButtonClick('offCam')} style={getButtonStyleC('offCam')}>
                {
                  activeButtons['offCam']
                  ? <img src={camGreenOff} alt="Cam Icon Off" style={{ width: '120px', height: '100px' }} />
                  : <img src={camGreen} alt="Cam Icon" style={{ width: '120px', height: '100px' }} />
                }
              </button>
            </div>
            <div style={styles.buttonContainer}>
            <div className="controls" style={styles.buttonGroup} >
              <button onClick={() => handleButtonClick('sitting')} style={getButtonStyleP(presets.sitting)}>1</button>
              <button onClick={() => handleButtonClick('standing')} style={getButtonStyleP(presets.standing)}>2</button>
              <button onClick={() => handleButtonClick('elevated1')} style={getButtonStyleP(presets.elevated1)}>3</button>
              <button onClick={() => handleButtonClick('elevated2')} style={getButtonStyleP(presets.elevated2)}>4</button>
            </div>
          </div>
          </div>
          </div>
      )}
      {screenIndex === 1 && (
        // Your second screen JSX
      <div style={styles.container}>
        <div style={{ position: 'relative', height: '100%', width: '24%', top: '10px', left: '10px' }}>
          <img src={logoImg} alt="Intellidesk Logo" style={{ width: '286px', height: 'auto' }} />
          <div >{postureNudge && <IoIosBody style={{ color: '#EE5757', top: '10px', left: '10px' }}/>}</div>
          <div style={styles.horizontalLine}></div>
          <div style={{ fontSize: '50px', color: '#9FDD94'}}> User 1 </div>
        </div>
        {/* <div style={styles.buttonContainer}>
        <div style={styles.label}>{isStanding ? 'Stand Time' : 'Sit Time'}</div>
        <div style={styles.progressBar}>
              <div style={{ ...styles.progress, width: `${sitStandProgress}%`, backgroundColor: isStanding ? 'orange' : 'blue' }}></div>
            </div>
        </div> */}
        <div style={styles.verticalLine}></div>
        <div style={styles.groupContainer}>
          <div style={{ ...styles.buttonContainerPg2, padding: '15px', marginBottom: '0' }}>
              <div style={styles.label}>Sit/Stand</div>
              <div style={styles.progressBarL}>
                <div style={{ ...styles.progress, width: '100%', background: SitStandGradient }}></div>
              </div>
              <div style={styles.slider}> {/* Replace with actual slider component */}</div>
            </div>        
        <div style={{...styles.stackContainer, marginTop: '15px'}}>
          <div style={{ ...styles.buttonContainer, padding: '20px', marginTop: '0', paddingBottom: '20px' }}>
          <div style={styles.label}>Posture</div>
          <div style={{fontSize: '70px', textAlign: 'right', paddingRight: '40px'}}>
            <span style={{color: '#9FDD94'}}>{93}</span>
            <span style={{fontSize: '40px'}}>/100</span>
          </div>
          <div style={styles.progressBarS}>
            <div style={{ ...styles.progress, width: '100%', background: PostureGradient }}></div>
          </div>
          <div style={styles.slider}> {/* Replace with actual slider component */}</div>
        </div>
          <div style={{ ...styles.buttonContainer, padding: '15px', marginTop: '0'  }}>
            <div style={styles.label}>Screen-Eye Distance</div>
            <div style={{ fontSize: '70px', color: '#FFFFFF', textAlign: 'right', paddingRight: '30px'}}> 
              <span style={{color: '#9FDD94'}}>{averageDistance.toFixed(1)}</span>
              <span style={{fontSize: '40px'}}>cm</span>
            </div>
            <div style={styles.progressBarS}>
              <div style={{ ...styles.progress, width: '100%', background: EyeScreenGradient }}></div>
            </div>
            <div style={styles.slider}> {/* Replace with actual slider component */}</div>
          </div>
        </div>
        {/* </div> */}
        </div>
      </div>
      )}
      {screenIndex === 2 && (
        // Your second screen JSX
        <div style={styles.container}>
        <div style={{ position: 'relative', height: '100%', width: '54.5%', top: '10px', left: '10px' }}>
          <img src={logoImg} alt="Intellidesk Logo" style={{ width: '286px', height: 'auto' }} />
          <div >{postureNudge && <IoIosBody style={{ color: '#EE5757', top: '10px', left: '10px' }}/>}</div>
          <div style={styles.horizontalLine}></div>
          <div style={{ fontSize: '50px', color: '#9FDD94'}}> User 1 </div>
          <Clock style={{ position: 'absolute', top: '150px', left: '40px', fontSize: '130px', fontFamily: 'Open Sans, sans-serif' }}/>
        </div>
        <div style={styles.verticalLine}></div>
        <div style={{ position: 'relative', height: '100%', width: '55%', top: '10px', left: '10px' }}>
          {/* <Clock style={{ position: 'absolute', top: '0', left: '0' }}/> */}
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
