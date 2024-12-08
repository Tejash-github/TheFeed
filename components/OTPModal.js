import React, { useState } from 'react';

const OTPModal = ({ onClose, onVerify }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onVerify(otp);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter your OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default OTPModal;