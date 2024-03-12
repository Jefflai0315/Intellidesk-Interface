import React, { useState, useEffect } from 'react';
import database from '../firebase';
import { ref, set , query, limitToLast, onValue, startAt, endAt, orderByKey} from 'firebase/database';


/**
 * Fetches posture nudge data from the database and returns it as an integer.
 * 
 * @param {firebase.database.Database} database - The Firebase Realtime Database instance.
 * @returns {Promise<number>} A promise that resolves with the fetched integer data.
 */
const fetchPostureNudgeDataAsInt = (database) => {
    return new Promise((resolve, reject) => {
      const postureRef = query(ref(database, `/Controls/PostureNudge`));
      onValue(postureRef, (snapshot) => {
        const data = snapshot.val();
        // Assuming the data is already an integer or can be safely converted to one.
        resolve(parseInt(data, 10)); // Convert to integer and resolve the promise with this value.
      }, (error) => {
        reject(error); // Reject the promise in case of an error.
      });
    });
  };
  

const Modal = ({ closeModal }) => {
    const [postureScore, setPostureScore] = useState(null);
    
    // Define your close button style here
    const closeButtonStyle = {
        backgroundColor: 'rgb(68, 68, 68)', // Red background color for the button
        color: '#fff', // White text color
        fontSize: '20px', // Font size
        padding: '10px 20px', // Padding around the text
        border: 'none', // No border
        borderRadius: '5px', // Rounded corners
        cursor: 'pointer', // Change cursor on hover
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: shadow effect
    };

    useEffect(() => {
        const fetchScore = async () => {
          try {
            const score = await fetchPostureNudgeDataAsInt(database);
            setPostureScore(score);
          } catch (error) {
            console.error('Failed to fetch posture score:', error);
          }
        };
    
        fetchScore();
      }, []);

      const getPostureMessage = (score) => {
        // Define logic to return a message based on the score
        if (score === 1) return 'You have been sitting for a while. Consider standing, stretching or taking a short break.';
        if (score === 2) return "You're in bad posture! Please adjust your seating position.";
        if (score === 3) return 'You are too close to your monitor screen! Please move back a little bit.';
        return ;
      };

      // Define your message style here
      const messageStyle = {
        color: '#fff', // Example: Green text color
        fontSize: '20px', // Example: Font size
        margin: '30px 15px', // Example: Margin for top & bottom
        textAlign: 'center', // Example: Center-align text
        fontSize: '30px', // Example: Font size
        fontWeight: 'bold', // Example: Bold font
      };

    const modalStyle = {
        position: 'fixed', // Use fixed to position relative to the viewport
        top: '15%', // Center vertically
        left: '43%', // Center horizontally
        transform: 'translate(-50%, -50%)', // Adjust position to truly center the element
        backgroundColor: '#7B7B7B', // Background color for the modal
        padding: '20px', // Padding inside the modal
        borderRadius: '10px', // Optional: rounded corners
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', // Optional: shadow effect
        zIndex: 1000, // Ensure modal is above other content
        width: '50%', // Set a width for the modal
        maxWidth: '600px', // Max width to ensure it doesn't get too large on wide screens
        minHeight: '200px', // Minimum height
        display: 'flex', // Use Flexbox for internal layout
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center items horizontally
      };
  
    return (
        <>
            {/* <div onClick={closeModal} /> */}
            <div style={modalStyle}>
                <h2 style={messageStyle}>{getPostureMessage(postureScore)}</h2>
                <button onClick ={ () =>{
                    closeModal();
                    const postureRef = query(ref(database, `/Controls/PostureNudge`));
                    set(postureRef, '0');
                }
                    } style={closeButtonStyle}>Close</button>
            </div>
        </>
    );
  };
  
  export default Modal;
  