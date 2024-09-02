import { css } from "lit";

const globalSemanticCSS = css`
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, #1b2a49, #0f1a2e);
    color: #e0e0e0;
    font-family: "Orbitron", sans-serif;
    padding: 1rem;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    box-shadow: 0 0 2rem rgba(0, 200, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
  }

  span {
    margin-top: 3px;
    margin-bottom: 3px;
  }

  h1 {
    font-size: 1.5rem; /* Base font size */
    margin-bottom: 1rem;
    color: #9ffa68; /* Light green to match button */
    text-shadow: 0 0 0.6rem rgba(0, 200, 255, 0.6);
    text-align: center;
    transition: font-size 0.3s ease; /* Smooth transition */
  }

  @media (min-width: 300px) {
    h1 {
      font-size: 1.2rem; /* Smaller screens */
    }
  }

  @media (min-width: 600px) {
    h1 {
      font-size: 1.5rem; /* Medium screens */
    }
  }

  @media (min-width: 900px) {
    h1 {
      font-size: 2rem; /* Larger screens */
    }
  }

  @media (min-width: 1200px) {
    h1 {
      font-size: 2.5rem; /* Extra large screens */
    }
  }

  .search {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 1rem;
    color: #e0e0e0;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 200, 255, 0.5);
    outline: none;
    transition: box-shadow 0.3s, border-color 0.3s;
    box-sizing: border-box;
  }

  .search:focus {
    border-color: #9ffa68; /* Match button color */
    box-shadow: 0 0 1rem rgba(0, 200, 255, 0.8);
  }

  .coin {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    background-color: rgba(0, 0, 0, 0.6); /* Slightly darker for contrast */
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 200, 255, 0.5);
    color: #e0e0e0;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    box-sizing: border-box;
  }

  .coin:hover {
    background-color: rgba(0, 0, 0, 0.7); /* Slightly darker for hover */
  }

  .coin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .coin-header img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50%;
  }

  .coin-details {
    margin-top: 8px;
    font-size: 0.8em;
    color: #c0c0c0;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
  }

  .coin-details.show {
    max-height: 1000px;
    opacity: 1;
  }

  .coin-analytics {
    margin-top: 8px;
    font-size: 0.9em;
    display: flex;
    justify-content: space-between;
  }

  .coin-analytics .span {
    margin-right: 8px;
  }

  @media (min-width: 600px) {
    .container {
      max-width: 500px;
    }
  }

  .load-more {
    background-color: #9ffa68; /* Light green */
    color: #1b2a49; /* Dark blue */
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    margin-top: 1rem;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 0 0.5rem rgba(0, 200, 255, 0.5);
    transition: background-color 0.3s, box-shadow 0.3s;
  }

  .load-more:hover {
    background-color: #7adf43; /* Darker light green for hover */
    box-shadow: 0 0 1rem rgba(0, 200, 255, 0.8);
  }

  .flex-div {
    display: flex;
    align-items: center;
  }
`;

export default globalSemanticCSS;
