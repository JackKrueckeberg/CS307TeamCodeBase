import React, { useState, useRef, useEffect } from "react";
import styles from "../Stylings/twoFactorStyle.module.css";
import { useNavigate } from "react-router-dom";
import PageAnimation from "../animations/pageAnimation";

const TwoFactor = () => {
  const [codes, setCodes] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const navigate = useNavigate();

  const getUserId = () => {
    const storedUser = sessionStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser)._id : null;
  };

  // References to each of the input boxes
  const refs = Array.from({ length: 6 }).map(() => React.createRef());

  const handleInputChange = (index, e) => {
    const values = [...codes];
    values[index] = e.target.value;
    setCodes(values);

    // If the current box has a value, shift focus to the next box (if it exists)
    if (e.target.value && refs[index + 1]) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // If backspace is pressed and the current box is empty, shift focus to the previous box (if it exists)
    if (e.key === "Backspace" && !codes[index] && refs[index - 1]) {
      refs[index - 1].current.focus();
    }
  };

  const handleTwoFactorAuth = async () => {
    const token = codes.join("");
    const userId = getUserId();
    console.log(userId);
    fetch("http://localhost:5050/two-factor/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, _id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.verified) {
          setMessage("Two-factor authentication successful.");
          setMessageType("success");
          navigate("/view-city");
        } else {
          setMessage("Invalid authentication code. Please try again.");
          setMessageType("error");
        }
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
      });
  };

  useEffect(() => {
    const userId = getUserId();

    fetch("http://localhost:5050/two-factor/generate-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.qrCode) {
          setQrCode(data.qrCode);
        }
        setSecret(data.secret);
      })
      .catch((error) => {
        console.error("Error fetching QR code:", error);
      });
  }, []);

  return (
    <PageAnimation>
      <div className={styles.twoFactorAuth}>
        <h1>Two-Factor Authentication</h1>
        <div>{qrCode && <img src={qrCode} alt="QR Code" />}</div>
        <p>Please enter the authentication code sent to your device:</p>
        <div className={styles.codeInputs}>
          {codes.map((code, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={code}
              ref={refs[index]}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.singleInputBox}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.verifyButton}
          onClick={handleTwoFactorAuth}
        >
          Verify Code
        </button>
        {message && (
          <div
            className={`${styles.message} ${
              messageType === "error"
                ? styles.errorMessage
                : styles.successMessage
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </PageAnimation>
  );
};

export default TwoFactor;